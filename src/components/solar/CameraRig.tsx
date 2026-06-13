"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export type CameraTarget =
  | { kind: "home" }
  | { kind: "overview" }
  | { kind: "planet"; positionRef: React.MutableRefObject<THREE.Vector3>; offset: number }
  | { kind: "sun" };

type CameraRigProps = {
  target: CameraTarget;
  /** how strongly the pointer pulls the camera at home */
  parallax?: number;
  reducedMotion?: boolean;
  compact?: boolean;
};

const HOME_POS = new THREE.Vector3(0, 8, 32);
const HOME_LOOK = new THREE.Vector3(0, 0, 0);
const OVERVIEW_POS = new THREE.Vector3(0, 24, 40);
const OVERVIEW_LOOK = new THREE.Vector3(0, 0, 0);
const SUN_POS = new THREE.Vector3(6, 3.5, 9);
const SUN_LOOK = new THREE.Vector3(0, 0, 0);
const DEFAULT_RADIAL = new THREE.Vector3(1, 0, 0);

const TWEEN_MS = 1800;
const BASE_FOV = 45;

// ease-in-out cubic — accelerate, cruise, brake: reads as actual travel
// instead of an instant jump that slowly settles.
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const applyFov = (cam: THREE.PerspectiveCamera, fov: number) => {
  cam.fov = fov;
  cam.updateProjectionMatrix();
};

export function CameraRig({
  target,
  parallax = 1.4,
  reducedMotion = false,
  compact = false,
}: CameraRigProps) {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const pointerSmoothed = useRef({ x: 0, y: 0 });

  // Tween state — captured each time `target` changes
  const startTimeRef = useRef<number | null>(null);
  const startPos = useRef(new THREE.Vector3());
  const startLook = useRef(new THREE.Vector3());
  const liveLook = useRef(new THREE.Vector3()); // continuously updated lookAt vector

  // Helper buffers
  const desiredPos = useRef(new THREE.Vector3());
  const desiredLook = useRef(new THREE.Vector3());
  const arcOffset = useRef(new THREE.Vector3());
  const isoLift = useRef(new THREE.Vector3());

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Capture start state whenever the target changes
  useEffect(() => {
    startTimeRef.current = performance.now();
    startPos.current.copy(camera.position);
    startLook.current.copy(liveLook.current);
  }, [target, camera]);

  useFrame(() => {
    // One-pole smoothing on pointer so tilt feels weighty.
    pointerSmoothed.current.x +=
      (pointer.current.x - pointerSmoothed.current.x) * 0.12;
    pointerSmoothed.current.y +=
      (pointer.current.y - pointerSmoothed.current.y) * 0.12;
    const px = pointerSmoothed.current.x;
    const py = pointerSmoothed.current.y;

    // Live desired pos / look from current target
    if (target.kind === "home") {
      desiredPos.current.copy(HOME_POS);
      desiredPos.current.x += px * parallax;
      desiredPos.current.y += -py * parallax * 0.6;
      desiredLook.current.copy(HOME_LOOK);
      // Tilt the look-at toward the cursor so the world cants, not just slides.
      desiredLook.current.x += px * 0.9;
      desiredLook.current.y += -py * 0.5;
    } else if (target.kind === "overview") {
      desiredPos.current.copy(OVERVIEW_POS);
      desiredLook.current.copy(OVERVIEW_LOOK);
    } else if (target.kind === "sun") {
      desiredPos.current.copy(SUN_POS);
      desiredLook.current.copy(SUN_LOOK);
    } else {
      const planetPos = target.positionRef.current;
      // Pull back in the orbital plane, then lift slightly — a low hero angle
      // that keeps the stop readable without the old isometric bird's-eye view.
      const horizLen = Math.hypot(planetPos.x, planetPos.z);
      const radialHoriz =
        horizLen < 0.01
          ? arcOffset.current.copy(DEFAULT_RADIAL)
          : arcOffset.current.set(planetPos.x / horizLen, 0, planetPos.z / horizLen);

      const standoff = target.offset * (compact ? 0.98 : 1.18);
      const elevation = standoff * (compact ? 0.28 : 0.36);

      desiredPos.current
        .copy(planetPos)
        .addScaledVector(radialHoriz, standoff)
        .add(isoLift.current.set(0, elevation, 0));

      desiredLook.current.copy(planetPos);
      desiredLook.current.y += compact ? 0.55 : 0.85;
    }

    const now = performance.now();
    const t0 = startTimeRef.current ?? now;
    const raw = reducedMotion ? 1 : Math.min(1, (now - t0) / TWEEN_MS);
    const k = ease(raw);

    // Position: quadratic-Bezier-like arc — lift the midpoint above the
    // straight line so the camera "cranes up and over" before descending.
    const ax = startPos.current.x + (desiredPos.current.x - startPos.current.x) * k;
    const az = startPos.current.z + (desiredPos.current.z - startPos.current.z) * k;
    const arcLift =
      reducedMotion ? 0 : Math.sin(raw * Math.PI) * (target.kind === "planet" ? 1.8 : 4.5);
    const ay =
      startPos.current.y + (desiredPos.current.y - startPos.current.y) * k + arcLift;
    camera.position.set(ax, ay, az);

    // FOV speed kick: widen mid-flight in proportion to travel distance, then
    // settle back to base — the lens itself communicates acceleration.
    const cam = camera as THREE.PerspectiveCamera;
    if (cam.isPerspectiveCamera) {
      const travelDist = startPos.current.distanceTo(desiredPos.current);
      const kick = reducedMotion ? 0 : Math.sin(raw * Math.PI) * Math.min(9, travelDist * 0.24);
      const fovTarget = BASE_FOV + kick;
      if (Math.abs(cam.fov - fovTarget) > 0.005) {
        applyFov(cam, fovTarget);
      }
    }

    // LookAt smoothly slews from previous look to new desired look
    liveLook.current.lerpVectors(startLook.current, desiredLook.current, k);
    camera.lookAt(liveLook.current);
  });

  return null;
}
