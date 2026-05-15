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

// ease-out cubic
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

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
      // Ride view: stay high and isometric so the active stop, craft, orbit,
      // and nearby context are readable instead of feeling like a close fly-by.
      const radial = arcOffset.current.copy(planetPos).normalize();
      if (radial.lengthSq() < 0.01) radial.copy(DEFAULT_RADIAL);
      const lateralDistance = target.offset * (compact ? 0.5 : 0.62);
      const height = compact ? Math.max(10, target.offset * 0.62) : Math.max(14.5, target.offset * 0.76);
      const depth = target.offset * (compact ? 1.05 : 0.72);
      desiredPos.current
        .copy(planetPos)
        .addScaledVector(radial, lateralDistance)
        .add(isoLift.current.set(0, height, depth));
      desiredLook.current.copy(planetPos);
      desiredLook.current.y -= compact ? Math.max(2.2, target.offset * 0.16) : Math.max(0.9, target.offset * 0.08);
      desiredLook.current.addScaledVector(radial, compact ? -target.offset * 0.08 : -target.offset * 0.12);
    }

    const now = performance.now();
    const t0 = startTimeRef.current ?? now;
    const raw = reducedMotion ? 1 : Math.min(1, (now - t0) / TWEEN_MS);
    const k = ease(raw);

    // Position: quadratic-Bezier-like arc — lift the midpoint above the
    // straight line so the camera "cranes up and over" before descending.
    const ax = startPos.current.x + (desiredPos.current.x - startPos.current.x) * k;
    const az = startPos.current.z + (desiredPos.current.z - startPos.current.z) * k;
    const arcLift = reducedMotion ? 0 : Math.sin(raw * Math.PI) * 4.5; // rises in middle of tween
    const ay =
      startPos.current.y + (desiredPos.current.y - startPos.current.y) * k + arcLift;
    camera.position.set(ax, ay, az);

    // LookAt smoothly slews from previous look to new desired look
    liveLook.current.lerpVectors(startLook.current, desiredLook.current, k);
    camera.lookAt(liveLook.current);
  });

  return null;
}
