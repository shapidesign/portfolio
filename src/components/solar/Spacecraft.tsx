"use client";

import { useEffect, useMemo, useRef } from "react";
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

const HULL = new THREE.Color("#f7f1ff");
const HULL_DARK = new THREE.Color("#6e5bc4");
const GLASS = new THREE.Color("#66d9ef");

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
  const thrustRef = useRef<THREE.Group>(null);
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

  // Port/starboard nav lights (aviation convention: red left, green right).
  const navMats = useMemo(
    () =>
      [new THREE.Color("#ff5f6e"), new THREE.Color("#5fff9b")].map(
        (color) => new THREE.MeshBasicMaterial({ color, toneMapped: false, transparent: true }),
      ),
    [],
  );

  // Tron-style running-light strips along the fuselage sides.
  const stripMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(accent),
        toneMapped: false,
        transparent: true,
        opacity: 0.85,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Shared exhaust material — both engine plumes flicker and fade together.
  const exhaustMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(accent),
        transparent: true,
        opacity: 0.2,
        toneMapped: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    exhaustMat.color.copy(accentColor);
    stripMat.color.copy(accentColor);
  }, [accentColor, exhaustMat, stripMat]);

  useEffect(
    () => () => {
      exhaustMat.dispose();
      stripMat.dispose();
      navMats.forEach((m) => m.dispose());
    },
    [exhaustMat, stripMat, navMats],
  );

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

    const orbitRadius = 10.5;
    const orbitDepthScale = compact ? 0.68 : 0.82;
    const a = orbitAngle.current;
    orbitOffset.current.set(
      Math.cos(a) * orbitRadius,
      3.4,
      Math.sin(a) * orbitRadius * orbitDepthScale,
    );
    orbitTangent.current
      .set(-Math.sin(a) * orbitRadius, 0, Math.cos(a) * orbitRadius * orbitDepthScale)
      .normalize();

    if (hasTarget) {
      // Landing pad sits on top of the planet; the Bezier flight arrives at a
      // hover point above it, then the settle phase descends vertically.
      // The focused planet's orbit is paused, so the pad holds still.
      const padHeight = targetSize + 0.34;
      const hoverHeight = padHeight + (compact ? 1.8 : 2.6);
      desired.current.copy(target);
      desired.current.y += flying ? hoverHeight : padHeight;
    } else {
      // No station focused: cruise a wide orbit around the sun.
      desired.current.copy(target).add(orbitOffset.current);
    }

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
      // Frame-rate independent settle. With a target this is the vertical
      // touchdown from hover point to pad, so it descends gently.
      const lambda = hasTarget ? 2.4 : 6;
      craft.position.x = THREE.MathUtils.damp(craft.position.x, desired.current.x, lambda, delta);
      craft.position.y = THREE.MathUtils.damp(craft.position.y, desired.current.y, lambda, delta);
      craft.position.z = THREE.MathUtils.damp(craft.position.z, desired.current.z, lambda, delta);
    }

    // ---- Orientation ----
    // Velocity from position delta (works for both Bezier and damped follow).
    tangent.current.copy(craft.position).sub(previousPos.current);
    const speed = tangent.current.length() / delta;
    const horiz = Math.hypot(tangent.current.x, tangent.current.z);

    const cruiseYaw = Math.atan2(orbitTangent.current.x, orbitTangent.current.z);
    const flightYaw =
      horiz > 1e-4 ? Math.atan2(tangent.current.x, tangent.current.z) : cruiseYaw;
    let yawTarget: number;
    let pitchTarget: number;
    if (hasTarget && !flying) {
      // Descending / landed: hold heading and sit level like a lander.
      yawTarget = yaw.current;
      pitchTarget = 0;
    } else {
      // Blend smoothly from flight heading to cruise tangent near the end of
      // flight — but only when returning to the sun cruise; a landing flight
      // keeps its approach heading all the way in.
      const headingBlend =
        flying && !hasTarget
          ? THREE.MathUtils.smoothstep(flightProgress.current, 0.78, 1)
          : flying
            ? 0
            : 1;
      yawTarget = wrapAngle(flightYaw + wrapAngle(cruiseYaw - flightYaw) * headingBlend);

      // Pitch from vertical velocity component.
      pitchTarget = THREE.MathUtils.clamp(
        -Math.atan2(tangent.current.y / Math.max(delta, 1e-3), Math.max(horiz / Math.max(delta, 1e-3), 1e-3)),
        -Math.PI / 10,
        Math.PI / 10,
      );
    }

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

    // YXZ = yaw, then pitch, then roll — proper aircraft convention for an
    // elongated hull (the saucer never cared, the starship does).
    craft.rotation.set(pitch.current, yaw.current, bank.current, "YXZ");

    // ---- Hover bob (applied to inner body so it doesn't fight flight Y) ----
    if (bodyRef.current) {
      if (reducedMotion) {
        bodyRef.current.position.y = 0;
      } else {
        bobPhase.current += delta * 1.6;
        const restFactor = 1 - THREE.MathUtils.clamp(speed / 1.2, 0, 1);
        // No hover bob while landed on a planet — the ship sits solidly.
        const bob = hasTarget ? 0 : Math.sin(bobPhase.current) * 0.06 * restFactor;
        bodyRef.current.position.y = THREE.MathUtils.damp(
          bodyRef.current.position.y,
          bob,
          4,
          delta,
        );
      }
    }

    // ---- Thrust FX driven by speed ----
    const targetThrust = reducedMotion
      ? 0.22
      : THREE.MathUtils.clamp(speed / 6, 0, 1);
    thrustLevel.current = reducedMotion
      ? targetThrust
      : THREE.MathUtils.damp(thrustLevel.current, targetThrust, 6, delta);

    if (thrustRef.current) {
      const tl = thrustLevel.current;
      const flicker = reducedMotion ? 1 : 1 + Math.sin(bobPhase.current * 4.2) * 0.08 * tl;
      thrustRef.current.scale.set(0.7 + tl * 0.4, 0.7 + tl * 0.4, (0.45 + tl * 1.6) * flicker);
      exhaustMat.opacity = 0.16 + tl * 0.72;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.25 + thrustLevel.current * 0.9;
    }

    // ---- Detail lighting: strips and nav blinkers ----
    if (reducedMotion) {
      stripMat.opacity = 0.8;
      navMats[0].opacity = 1;
      navMats[1].opacity = 1;
    } else {
      stripMat.opacity = 0.65 + Math.sin(bobPhase.current * 2.4) * 0.25;
      // Alternating blink: sharp on/off gate, half a cycle apart.
      navMats[0].opacity = Math.sin(bobPhase.current * 3.4) > 0.3 ? 1 : 0.08;
      navMats[1].opacity = Math.sin(bobPhase.current * 3.4 + Math.PI) > 0.3 ? 1 : 0.08;
    }

    previousPos.current.copy(craft.position);
  });

  return (
    <>
      <EngineTrail craftRef={groupRef} accent={accent} enabled={!reducedMotion} />
      <group ref={groupRef} visible={false} scale={compact ? 1.25 : 1.08}>
      <group ref={bodyRef}>
        {/* ── Fuselage: elongated hull along +z ── */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.2, 0.85, 8, 20]} />
          <meshStandardMaterial
            color={HULL}
            emissive={HULL}
            emissiveIntensity={0.22}
            metalness={0.72}
            roughness={0.22}
          />
        </mesh>

        {/* Nose cone */}
        <mesh position={[0, 0, 0.78]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.165, 0.46, 20]} />
          <meshStandardMaterial
            color={HULL}
            emissive={accentColor}
            emissiveIntensity={0.3}
            metalness={0.66}
            roughness={0.2}
          />
        </mesh>

        {/* Glass canopy — interior glow follows the destination accent */}
        <mesh position={[0, 0.165, 0.3]} scale={[1, 0.72, 1.55]}>
          <sphereGeometry args={[0.15, 24, 16]} />
          <meshStandardMaterial
            color={GLASS}
            emissive={accentColor}
            emissiveIntensity={0.9}
            metalness={0.16}
            roughness={0.1}
            transparent
            opacity={0.82}
          />
        </mesh>

        {/* Running-light strips along the fuselage sides */}
        {([1, -1] as const).map((side) => (
          <mesh key={side} position={[side * 0.205, 0.02, 0.05]} material={stripMat}>
            <boxGeometry args={[0.016, 0.035, 0.95]} />
          </mesh>
        ))}

        {/* Accent ring around the hull */}
        <mesh position={[0, 0, -0.06]}>
          <torusGeometry args={[0.215, 0.022, 10, 40]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.9}
            metalness={0.3}
            roughness={0.18}
          />
        </mesh>

        {/* ── Swept delta wings: clean white silhouette, accent tips only ── */}
        {([1, -1] as const).map((side) => (
          <group key={side} position={[side * 0.42, -0.04, -0.22]} rotation={[0, side * -0.52, side * 0.08]}>
            <mesh scale={[0.78, 0.045, 0.38]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color={HULL}
                emissive={HULL}
                emissiveIntensity={0.22}
                metalness={0.68}
                roughness={0.26}
              />
            </mesh>
            {/* Wingtip nav light — red port (+x is left when facing +z), green starboard */}
            <mesh position={[side * 0.4, 0, 0]} material={navMats[side === 1 ? 0 : 1]}>
              <sphereGeometry args={[0.05, 12, 8]} />
            </mesh>
          </group>
        ))}

        {/* Tail fin */}
        <mesh position={[0, 0.21, -0.5]} rotation={[-0.42, 0, 0]} scale={[0.04, 0.36, 0.4]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={HULL}
            emissive={HULL}
            emissiveIntensity={0.14}
            metalness={0.66}
            roughness={0.26}
          />
        </mesh>

        {/* ── Twin engine nacelles ── */}
        {([1, -1] as const).map((side) => (
          <group key={side} position={[side * 0.24, -0.02, -0.5]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.085, 0.105, 0.42, 16]} />
              <meshStandardMaterial
                color={HULL_DARK}
                emissive={HULL_DARK}
                emissiveIntensity={0.1}
                metalness={0.7}
                roughness={0.28}
              />
            </mesh>
            {/* Engine glow disc */}
            <mesh position={[0, 0, -0.215]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.085, 16]} />
              <meshBasicMaterial color={accentColor} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* ── Exhaust plumes: scale/fade with thrust ── */}
        <group ref={thrustRef} position={[0, -0.02, -0.72]}>
          {([1, -1] as const).map((side) => (
            <mesh
              key={side}
              position={[side * 0.24, 0, -0.22]}
              rotation={[-Math.PI / 2, 0, 0]}
              material={exhaustMat}
            >
              <coneGeometry args={[0.08, 0.6, 12, 1, true]} />
            </mesh>
          ))}
        </group>
      </group>

        <pointLight ref={lightRef} color={accentColor} intensity={0.35} distance={4} />
      </group>
    </>
  );
}

/* ──────────────────────────────────────────────────────────
 * Engine trail — world-space particle ribbon emitted from the
 * craft's engines; spawn rate and brightness scale with speed.
 * ────────────────────────────────────────────────────────── */

const TRAIL_COUNT = 110;
const TRAIL_TTL_S = 1.1;

function makeGlowDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

type EngineTrailProps = {
  craftRef: React.RefObject<THREE.Group | null>;
  accent: string;
  enabled: boolean;
};

function EngineTrail({ craftRef, accent, enabled }: EngineTrailProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const cursor = useRef(0);
  const emitCarry = useRef(0);
  const prevCraftPos = useRef<THREE.Vector3 | null>(null);
  const emitterLocal = useMemo(() => new THREE.Vector3(0, -0.02, -0.72), []);
  const emitterWorld = useMemo(() => new THREE.Vector3(), []);

  const positions = useMemo(() => new Float32Array(TRAIL_COUNT * 3).fill(99999), []);
  const agesRef = useRef<Float32Array | null>(null);
  if (agesRef.current === null) {
    agesRef.current = new Float32Array(TRAIL_COUNT).fill(TRAIL_TTL_S);
  }

  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);
  const dotTexture = useMemo(() => makeGlowDotTexture(), []);

  useEffect(() => {
    matRef.current?.color.copy(accentColor);
  }, [accentColor]);

  useEffect(() => () => dotTexture?.dispose(), [dotTexture]);

  useFrame((_state, deltaRaw) => {
    const points = pointsRef.current;
    const craft = craftRef.current;
    if (!points || !craft) return;

    const delta = Math.min(0.05, Math.max(0.0001, deltaRaw));
    const geometry = points.geometry;
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const ages = agesRef.current;
    if (!ages) return;

    if (!prevCraftPos.current) {
      prevCraftPos.current = craft.position.clone();
    }
    const speed = craft.position.distanceTo(prevCraftPos.current) / delta;
    prevCraftPos.current.copy(craft.position);

    const visible = enabled && craft.visible;
    points.visible = visible;

    // Age existing particles; expired ones get parked far away.
    let alive = 0;
    for (let i = 0; i < TRAIL_COUNT; i++) {
      if (ages[i] < TRAIL_TTL_S) {
        ages[i] += delta;
        if (ages[i] >= TRAIL_TTL_S) {
          posAttr.setXYZ(i, 99999, 99999, 99999);
        } else {
          alive++;
        }
      }
    }

    // Emit from the engine position, rate proportional to speed.
    if (visible && speed > 0.4) {
      emitterWorld.copy(emitterLocal);
      craft.localToWorld(emitterWorld);
      const rate = THREE.MathUtils.clamp(speed * 9, 6, 90); // particles/sec
      emitCarry.current += rate * delta;
      while (emitCarry.current >= 1) {
        emitCarry.current -= 1;
        const i = cursor.current;
        cursor.current = (cursor.current + 1) % TRAIL_COUNT;
        posAttr.setXYZ(
          i,
          emitterWorld.x + (Math.random() - 0.5) * 0.08,
          emitterWorld.y + (Math.random() - 0.5) * 0.08,
          emitterWorld.z + (Math.random() - 0.5) * 0.08,
        );
        ages[i] = 0;
      }
    }

    posAttr.needsUpdate = true;

    // Overall fade follows speed so the ribbon vanishes when parked.
    if (matRef.current) {
      const targetOpacity = THREE.MathUtils.clamp(speed / 5, 0.12, 0.9);
      matRef.current.opacity = THREE.MathUtils.damp(
        matRef.current.opacity,
        alive > 0 ? targetOpacity : 0,
        5,
        delta,
      );
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color={accentColor}
        map={dotTexture ?? undefined}
        size={0.55}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
