"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type BackgroundProps = {
  count?: number;
};

const seededUnit = (index: number, salt: number) => {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const getReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Distant star backdrop. We render a sphere shell of `count` plain dots and
 * patch the points-material shader so each star twinkles on the GPU. A small
 * pool of shooting-stars is layered on top.
 */
export function Background({ count = 1800 }: BackgroundProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const uTimeRef = useRef({ value: 0 });
  const [reducedMotion, setReducedMotion] = useState(getReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReducedMotion(media.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const { positions, colors, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const ph = new Float32Array(count);

    const tints: THREE.Color[] = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#dac9ff"),
      new THREE.Color("#a98bff"),
      new THREE.Color("#9bd9ff"),
    ];

    for (let i = 0; i < count; i++) {
      const r = 60 + seededUnit(i, 1) * 30;
      const theta = seededUnit(i, 2) * Math.PI * 2;
      const phi = Math.acos(2 * seededUnit(i, 3) - 1);
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const tint = tints[Math.floor(seededUnit(i, 4) * tints.length)];
      col[i * 3 + 0] = tint.r;
      col[i * 3 + 1] = tint.g;
      col[i * 3 + 2] = tint.b;

      ph[i] = seededUnit(i, 5) * Math.PI * 2;
    }

    return { positions: pos, colors: col, phases: ph };
  }, [count]);

  // Patch the points material to add per-vertex twinkle.
  const handleMaterialRef = (mat: THREE.PointsMaterial | null) => {
    materialRef.current = mat;
    if (!mat) return;
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uTimeRef.current;
      shader.vertexShader = shader.vertexShader
        .replace(
          "void main() {",
          `attribute float aPhase;
           varying float vTwinkle;
           uniform float uTime;
           void main() {
             float t = uTime;
             vTwinkle = 0.65 + 0.35 * sin(t * 2.1 + aPhase * 1.3);
          `,
        )
        .replace(
          "gl_PointSize = size;",
          "gl_PointSize = size * (0.7 + 0.4 * sin(uTime * 1.6 + aPhase));",
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "void main() {",
          `varying float vTwinkle;
           void main() {`,
        )
        .replace(
          "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
          "gl_FragColor = vec4( outgoingLight, diffuseColor.a * vTwinkle );",
        );
    };
    mat.needsUpdate = true;
  };

  useFrame((_state, delta) => {
    if (!reducedMotion) {
      uTimeRef.current.value += delta;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.012;
      pointsRef.current.rotation.x += delta * 0.004;
    }
  });

  return (
    <>
      <ambientLight color="#2a1c4a" intensity={0.35} />

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        </bufferGeometry>
        <pointsMaterial
          ref={handleMaterialRef}
          size={0.6}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>

      <ShootingStars enabled={!reducedMotion} />
    </>
  );
}

/* ──────────────────────────────────────────────────────────
 * Shooting stars — small pool of fast streaks across the sky
 * ────────────────────────────────────────────────────────── */

const POOL_SIZE = 2;
const TTL_S = 1.2;
const SPAWN_RATE_PER_S = 1 / 7.5; // average one shooter every ~7.5s

type Shooter = {
  active: boolean;
  life: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
};

function ShootingStars({ enabled }: { enabled: boolean }) {
  const firstMeshRef = useRef<THREE.Mesh | null>(null);
  const secondMeshRef = useRef<THREE.Mesh | null>(null);
  const shootersRef = useRef<Shooter[]>(
    Array.from({ length: POOL_SIZE }, () => ({
      active: false,
      life: 0,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
    })),
  );

  const spawn = (s: Shooter) => {
    // Random origin on the upper sphere shell so streaks read against the sky.
    const r = 70;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * 0.6 + 0.1; // bias toward the top
    s.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
    );
    // Velocity tangent-ish to the sphere, mostly downward across the view.
    s.velocity.set(
      (Math.random() - 0.5) * 40,
      -10 - Math.random() * 14,
      (Math.random() - 0.5) * 40,
    );
    s.life = 0;
    s.active = true;
  };

  useFrame((_state, delta) => {
    if (!enabled) return;
    let anyActive = false;
    for (const [index, s] of shootersRef.current.entries()) {
      const mesh = index === 0 ? firstMeshRef.current : secondMeshRef.current;
      if (s.active) {
        anyActive = true;
        s.life += delta;
        s.position.addScaledVector(s.velocity, delta);
        if (s.life >= TTL_S) {
          s.active = false;
        }
        if (mesh) {
          mesh.visible = true;
          mesh.position.copy(s.position);
          // Orient the streak along its velocity vector.
          const dir = s.velocity.clone().normalize();
          const quat = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(1, 0, 0),
            dir,
          );
          mesh.quaternion.copy(quat);
          // Fade alpha as life progresses (peak in the middle).
          const t = s.life / TTL_S;
          const alpha = Math.sin(t * Math.PI);
          const mat = mesh.material as THREE.MeshBasicMaterial;
          mat.opacity = alpha * 0.95;
        }
      } else {
        if (mesh) mesh.visible = false;
      }
    }
    if (!anyActive && Math.random() < delta * SPAWN_RATE_PER_S) {
      const idle = shootersRef.current.find((s) => !s.active);
      if (idle) spawn(idle);
    }
  });

  return (
    <>
      <mesh ref={firstMeshRef} visible={false}>
        {/* Long thin streak; aligned to +x in local space and rotated each frame. */}
        <boxGeometry args={[3.5, 0.06, 0.06]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh ref={secondMeshRef} visible={false}>
        <boxGeometry args={[3.5, 0.06, 0.06]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
      </mesh>
    </>
  );
}
