"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type SpacecraftProps = {
  visible: boolean;
  targetKey?: string | null;
  targetRef: React.MutableRefObject<THREE.Vector3> | null;
  targetSize?: number;
  accent?: string;
  reducedMotion: boolean;
  compact?: boolean;
};

const BODY = new THREE.Color("#f7f1ff");
const BODY_SHADOW = new THREE.Color("#9f8cff");
const GLASS = new THREE.Color("#66d9ef");
const DETAIL = new THREE.Color("#21163f");

// Flight duration tuned for "agile but smooth": fast enough to feel responsive,
// long enough that the eye can read the arc and bank.
const FLIGHT_SECONDS = 1.9;
// Time over which orbit angular speed recovers after arrival.
const ORBIT_RECAPTURE_SECONDS = 0.4;

// Quintic ease-in-out — symmetric, no acceleration kinks at endpoints.
const easeInOutQuintic = (t: number) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

// Shortest-path angular difference in (-PI, PI].
const wrapAngle = (a: number) => {
  let x = a;
  while (x > Math.PI) x -= Math.PI * 2;
  while (x < -Math.PI) x += Math.PI * 2;
  return x;
};

// Frame-rate-independent damping toward an angle along the shortest path.
const dampAngle = (current: number, target: number, lambda: number, dt: number) => {
  const diff = wrapAngle(target - current);
  return current + diff * (1 - Math.exp(-lambda * dt));
};

export function Spacecraft({
  visible,
  targetKey,
  targetRef,
  targetSize = 1,
  accent = "#66d9ef",
  reducedMotion,
  compact = false,
}: SpacecraftProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const thrustRef = useRef<THREE.Mesh>(null);
  const thrustMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const desired = useRef(new THREE.Vector3());
  const previousPos = useRef(new THREE.Vector3());

  // Bezier endpoints + control point captured per flight.
  const flightFrom = useRef(new THREE.Vector3());
  const flightTo = useRef(new THREE.Vector3());
  const flightCtrl = useRef(new THREE.Vector3());

  const tangent = useRef(new THREE.Vector3(0, 0, 1));
  const orbitOffset = useRef(new THREE.Vector3());
  const orbitTangent = useRef(new THREE.Vector3(0, 0, 1));
  const fallbackTarget = useRef(new THREE.Vector3(0, 0, 0));

  const activeTargetKey = useRef<string | null | undefined>(undefined);
  const flightProgress = useRef(1);
  const recaptureProgress = useRef(1);
  const initialized = useRef(false);
  const orbitAngle = useRef(0.85);

  // Smoothed orientation state.
  const yaw = useRef(0);
  const pitch = useRef(0);
  const bank = useRef(0);
  const prevYawTarget = useRef(0);
  const thrustLevel = useRef(0);
  const bobPhase = useRef(0);

  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);

  useFrame((_state, deltaRaw) => {
    const craft = groupRef.current;
    if (!craft) return;
    craft.visible = visible;
    if (!visible) return;

    // Clamp delta so a stutter/tab-switch doesn't catapult anything.
    const delta = Math.min(0.05, Math.max(0.0001, deltaRaw));

    const target = targetRef?.current ?? fallbackTarget.current;
    const hasTarget = !!targetRef;

    const flying = flightProgress.current < 1 && !reducedMotion;

    // Orbit angular speed ramps down during flight, recovers afterwards.
    const baseOrbitSpeed = compact ? 0.22 : 0.16;
    const flightSpeedFactor = flying ? 0.4 : 1;
    const recaptureFactor = THREE.MathUtils.clamp(recaptureProgress.current, 0, 1);
    if (!reducedMotion) {
      orbitAngle.current +=
        delta * baseOrbitSpeed * flightSpeedFactor * (flying ? 1 : recaptureFactor);
      if (!flying && recaptureProgress.current < 1) {
        recaptureProgress.current = Math.min(
          1,
          recaptureProgress.current + delta / ORBIT_RECAPTURE_SECONDS,
        );
      }
    }

    const orbitRadius = hasTarget
      ? compact
        ? Math.max(2.05, targetSize * 1.85)
        : Math.max(3.15, targetSize * 2.7)
      : 10.5;
    const orbitDepthScale = compact ? 0.68 : 0.82;
    const targetHeight = hasTarget
      ? compact
        ? Math.max(2.25, targetSize + 1.8)
        : Math.max(2.65, targetSize + 2.05)
      : 3.4;
    const a = orbitAngle.current;
    orbitOffset.current.set(
      Math.cos(a) * orbitRadius,
      targetHeight,
      Math.sin(a) * orbitRadius * orbitDepthScale,
    );
    orbitTangent.current
      .set(-Math.sin(a) * orbitRadius, 0, Math.cos(a) * orbitRadius * orbitDepthScale)
      .normalize();
    desired.current.copy(target).add(orbitOffset.current);

    // New target: capture a fresh Bezier arc.
    if (activeTargetKey.current !== targetKey) {
      activeTargetKey.current = targetKey;
      if (!initialized.current || reducedMotion) {
        craft.position.copy(desired.current);
        previousPos.current.copy(craft.position);
        flightProgress.current = 1;
        recaptureProgress.current = 1;
        initialized.current = true;
      } else {
        flightFrom.current.copy(craft.position);
        flightTo.current.copy(desired.current);
        // Control point: above the midpoint and biased slightly toward the
        // orbit tangent so the craft "swings into" its insertion direction.
        const mid = flightFrom.current.clone().add(flightTo.current).multiplyScalar(0.5);
        const dist = flightFrom.current.distanceTo(flightTo.current);
        const lift = Math.min(9, Math.max(4.5, dist * 0.22));
        const swing = Math.min(0.18, 1.2 / Math.max(1, dist)) * dist * 0.35;
        flightCtrl.current
          .copy(mid)
          .add(new THREE.Vector3(0, lift, 0))
          .addScaledVector(orbitTangent.current, swing);
        flightProgress.current = 0;
        recaptureProgress.current = 0;
      }
    }

    if (reducedMotion) {
      craft.position.copy(desired.current);
    } else if (flying) {
      flightProgress.current = Math.min(1, flightProgress.current + delta / FLIGHT_SECONDS);
      const raw = flightProgress.current;
      const t = easeInOutQuintic(raw);
      const omt = 1 - t;
      // Update endpoint each frame to track the moving orbit position.
      flightTo.current.copy(desired.current);
      // B(t) = (1-t)^2 P0 + 2(1-t)t C + t^2 P1
      const x =
        omt * omt * flightFrom.current.x +
        2 * omt * t * flightCtrl.current.x +
        t * t * flightTo.current.x;
      const y =
        omt * omt * flightFrom.current.y +
        2 * omt * t * flightCtrl.current.y +
        t * t * flightTo.current.y;
      const z =
        omt * omt * flightFrom.current.z +
        2 * omt * t * flightCtrl.current.z +
        t * t * flightTo.current.z;
      craft.position.set(x, y, z);
    } else {
      // Frame-rate independent settle toward orbit position.
      craft.position.x = THREE.MathUtils.damp(craft.position.x, desired.current.x, 6, delta);
      craft.position.y = THREE.MathUtils.damp(craft.position.y, desired.current.y, 6, delta);
      craft.position.z = THREE.MathUtils.damp(craft.position.z, desired.current.z, 6, delta);
    }

    // ---- Orientation ----
    // Velocity from position delta (works for both Bezier and damped follow).
    tangent.current.copy(craft.position).sub(previousPos.current);
    const speed = tangent.current.length() / delta;
    const horiz = Math.hypot(tangent.current.x, tangent.current.z);

    const cruiseYaw = Math.atan2(orbitTangent.current.x, orbitTangent.current.z);
    const flightYaw =
      horiz > 1e-4 ? Math.atan2(tangent.current.x, tangent.current.z) : cruiseYaw;
    // Blend smoothly from flight heading to cruise tangent near the end of flight.
    const headingBlend = flying ? THREE.MathUtils.smoothstep(flightProgress.current, 0.78, 1) : 1;
    const yawTarget = wrapAngle(
      flightYaw + wrapAngle(cruiseYaw - flightYaw) * headingBlend,
    );

    // Pitch from vertical velocity component.
    const pitchTarget = THREE.MathUtils.clamp(
      -Math.atan2(tangent.current.y / Math.max(delta, 1e-3), Math.max(horiz / Math.max(delta, 1e-3), 1e-3)),
      -Math.PI / 10,
      Math.PI / 10,
    );

    // Bank from turn rate (delta yaw / dt), scaled and clamped.
    const yawDelta = wrapAngle(yawTarget - prevYawTarget.current);
    const turnRate = yawDelta / delta;
    prevYawTarget.current = yawTarget;
    const bankTarget = THREE.MathUtils.clamp(-turnRate * 0.32, -0.45, 0.45);

    if (reducedMotion) {
      yaw.current = yawTarget;
      pitch.current = 0;
      bank.current = 0;
    } else {
      yaw.current = dampAngle(yaw.current, yawTarget, 8, delta); // ~0.12s
      pitch.current = THREE.MathUtils.damp(pitch.current, pitchTarget, 5.5, delta); // ~0.18s
      bank.current = THREE.MathUtils.damp(bank.current, bankTarget, 4.5, delta); // ~0.22s
    }

    craft.rotation.set(pitch.current, yaw.current, bank.current);

    // ---- Hover bob (applied to inner body so it doesn't fight flight Y) ----
    if (bodyRef.current) {
      if (reducedMotion) {
        bodyRef.current.position.y = 0;
      } else {
        bobPhase.current += delta * 1.6;
        const restFactor = 1 - THREE.MathUtils.clamp(speed / 1.2, 0, 1);
        const bob = Math.sin(bobPhase.current) * 0.06 * restFactor;
        bodyRef.current.position.y = bob;
      }
    }

    // ---- Thrust FX driven by speed ----
    const targetThrust = reducedMotion
      ? 0.22
      : THREE.MathUtils.clamp(speed / 6, 0, 1);
    thrustLevel.current = reducedMotion
      ? targetThrust
      : THREE.MathUtils.damp(thrustLevel.current, targetThrust, 6, delta);

    if (thrustRef.current && thrustMatRef.current) {
      const tl = thrustLevel.current;
      const flicker = reducedMotion ? 1 : 1 + Math.sin(bobPhase.current * 4.2) * 0.08 * tl;
      thrustRef.current.scale.set(0.6 + tl * 0.8, 0.35 + tl * 0.9 * flicker, 0.6 + tl * 0.8);
      thrustMatRef.current.opacity = 0.18 + tl * 0.7;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.25 + thrustLevel.current * 0.9;
    }

    previousPos.current.copy(craft.position);
  });

  return (
    <group ref={groupRef} visible={false} scale={compact ? 1.12 : 0.94}>
      <group ref={bodyRef}>
        <mesh scale={[1.28, 0.18, 1.28]}>
          <sphereGeometry args={[0.78, 40, 14]} />
          <meshStandardMaterial
            color={BODY}
            emissive={BODY}
            emissiveIntensity={0.24}
            metalness={0.58}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0, -0.08, 0]} scale={[1.08, 0.12, 1.08]}>
          <sphereGeometry args={[0.72, 36, 10]} />
          <meshStandardMaterial
            color={BODY_SHADOW}
            emissive={accentColor}
            emissiveIntensity={0.2}
            metalness={0.54}
            roughness={0.24}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.74, 0.055, 10, 56]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.86}
            metalness={0.28}
            roughness={0.18}
          />
        </mesh>

        <mesh position={[0, 0.25, 0]} scale={[0.62, 0.34, 0.62]}>
          <sphereGeometry args={[0.62, 32, 16]} />
          <meshStandardMaterial
            color={GLASS}
            emissive={GLASS}
            emissiveIntensity={0.72}
            metalness={0.16}
            roughness={0.12}
            transparent
            opacity={0.78}
          />
        </mesh>

        {[0, Math.PI / 3, (Math.PI * 2) / 3, Math.PI, (Math.PI * 4) / 3, (Math.PI * 5) / 3].map(
          (angle) => (
            <mesh
              key={angle}
              position={[Math.cos(angle) * 0.7, 0.02, Math.sin(angle) * 0.7]}
              scale={[1, 0.55, 1]}
            >
              <sphereGeometry args={[0.075, 14, 8]} />
              <meshBasicMaterial color={accentColor} toneMapped={false} />
            </mesh>
          ),
        )}

        <mesh position={[0, -0.24, 0]} scale={[0.52, 0.08, 0.52]}>
          <sphereGeometry args={[0.58, 24, 8]} />
          <meshBasicMaterial color={DETAIL} transparent opacity={0.82} />
        </mesh>

        {/* Thrust glow under the saucer — scales/fades with speed. */}
        <mesh ref={thrustRef} position={[0, -0.36, 0]}>
          <sphereGeometry args={[0.42, 20, 12]} />
          <meshBasicMaterial
            ref={thrustMatRef}
            color={accentColor}
            transparent
            opacity={0.2}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      </group>

      <pointLight ref={lightRef} color={accentColor} intensity={0.35} distance={4} />
    </group>
  );
}
