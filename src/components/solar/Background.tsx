"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const seededUnit = (index: number, salt: number) => {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const getReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(getReducedMotion);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReducedMotion(media.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);
  return reducedMotion;
}

/**
 * Deep-space backdrop: three parallax star shells with GPU twinkle, soft
 * nebula sprites in the brand palette, occasional shooting stars, and a
 * hyperspace warp-streak layer that fades in whenever the camera travels fast.
 */
export function Background() {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <ambientLight color="#2a1c4a" intensity={0.35} />

      <Nebula reducedMotion={reducedMotion} />

      {/* Far shell: dense, dim, almost static — sells depth. */}
      <StarLayer
        count={1300}
        salt={11}
        radiusMin={74}
        radiusMax={96}
        size={0.42}
        opacity={0.62}
        driftY={0.004}
        driftX={0.0012}
        reducedMotion={reducedMotion}
      />
      {/* Mid shell: the main field. */}
      <StarLayer
        count={850}
        salt={29}
        radiusMin={56}
        radiusMax={74}
        size={0.68}
        opacity={0.85}
        driftY={0.009}
        driftX={0.003}
        reducedMotion={reducedMotion}
      />
      {/* Near shell: sparse, bright, fastest parallax. */}
      <StarLayer
        count={260}
        salt={47}
        radiusMin={42}
        radiusMax={56}
        size={1.05}
        opacity={1}
        driftY={0.016}
        driftX={0.005}
        reducedMotion={reducedMotion}
      />

      <ShootingStars enabled={!reducedMotion} />
      <WarpStreaks enabled={!reducedMotion} />
    </>
  );
}

/* ──────────────────────────────────────────────────────────
 * Star layer — points shell with per-vertex GPU twinkle
 * ────────────────────────────────────────────────────────── */

type StarLayerProps = {
  count: number;
  salt: number;
  radiusMin: number;
  radiusMax: number;
  size: number;
  opacity: number;
  driftY: number;
  driftX: number;
  reducedMotion: boolean;
};

function StarLayer({
  count,
  salt,
  radiusMin,
  radiusMax,
  size,
  opacity,
  driftY,
  driftX,
  reducedMotion,
}: StarLayerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const uTimeRef = useRef({ value: 0 });

  const { positions, colors, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const ph = new Float32Array(count);

    const tints: THREE.Color[] = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#dac9ff"),
      new THREE.Color("#a98bff"),
      new THREE.Color("#9bd9ff"),
      new THREE.Color("#ffe9c9"),
    ];

    for (let i = 0; i < count; i++) {
      const r = radiusMin + seededUnit(i, salt + 1) * (radiusMax - radiusMin);
      const theta = seededUnit(i, salt + 2) * Math.PI * 2;
      const phi = Math.acos(2 * seededUnit(i, salt + 3) - 1);
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const tint = tints[Math.floor(seededUnit(i, salt + 4) * tints.length)];
      col[i * 3 + 0] = tint.r;
      col[i * 3 + 1] = tint.g;
      col[i * 3 + 2] = tint.b;

      ph[i] = seededUnit(i, salt + 5) * Math.PI * 2;
    }

    return { positions: pos, colors: col, phases: ph };
  }, [count, salt, radiusMin, radiusMax]);

  // Patch the points material to add per-vertex twinkle on the GPU.
  const handleMaterialRef = (mat: THREE.PointsMaterial | null) => {
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
      // Patch via the color_fragment chunk include — the literal gl_FragColor
      // line doesn't exist in the unexpanded shader source on modern three.
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "void main() {",
          `varying float vTwinkle;
           void main() {`,
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
           float starDist = length(gl_PointCoord - vec2(0.5));
           float starMask = smoothstep(0.5, 0.22, starDist);
           diffuseColor.a *= vTwinkle * starMask;`,
        );
    };
    mat.needsUpdate = true;
  };

  useFrame((_state, delta) => {
    if (reducedMotion) return;
    uTimeRef.current.value += delta;
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * driftY;
      pointsRef.current.rotation.x += delta * driftX;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <pointsMaterial
        ref={handleMaterialRef}
        size={size}
        sizeAttenuation
        vertexColors
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </points>
  );
}

/* ──────────────────────────────────────────────────────────
 * Nebula — soft additive cloud sprites, slow drift
 * ────────────────────────────────────────────────────────── */

function makeNebulaTexture(hex: string, seed: number) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const color = new THREE.Color(hex);
  const rgb = `${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}`;

  // Layered soft blobs read as volumetric cloud rather than a flat disc.
  const blobCount = 7;
  for (let i = 0; i < blobCount; i++) {
    const bx = size * (0.5 + (seededUnit(i, seed + 1) - 0.5) * 0.55);
    const by = size * (0.5 + (seededUnit(i, seed + 2) - 0.5) * 0.55);
    const br = size * (0.16 + seededUnit(i, seed + 3) * 0.3);
    const alpha = 0.10 + seededUnit(i, seed + 4) * 0.16;
    const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    g.addColorStop(0, `rgba(${rgb}, ${alpha})`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

const NEBULA_SPRITES = [
  { color: "#7a56f2", position: [-48, 16, -54] as const, scale: 72, opacity: 0.5, seed: 3 },
  { color: "#ae81ff", position: [40, -12, -58] as const, scale: 58, opacity: 0.38, seed: 17 },
  { color: "#66d9ef", position: [54, 24, -32] as const, scale: 44, opacity: 0.26, seed: 31 },
  { color: "#f92672", position: [-32, -28, 50] as const, scale: 48, opacity: 0.2, seed: 43 },
  { color: "#7a56f2", position: [12, 32, 56] as const, scale: 62, opacity: 0.32, seed: 59 },
] as const;

function Nebula({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const textures = useMemo(
    () => NEBULA_SPRITES.map((sprite) => makeNebulaTexture(sprite.color, sprite.seed)),
    [],
  );

  useEffect(() => {
    return () => {
      for (const texture of textures) texture?.dispose();
    };
  }, [textures]);

  useFrame((_state, delta) => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.0035;
  });

  return (
    <group ref={groupRef}>
      {NEBULA_SPRITES.map((sprite, index) =>
        textures[index] ? (
          <sprite
            key={`${sprite.color}-${index}`}
            position={[sprite.position[0], sprite.position[1], sprite.position[2]]}
            scale={[sprite.scale, sprite.scale, 1]}
          >
            <spriteMaterial
              map={textures[index]}
              transparent
              opacity={sprite.opacity}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        ) : null,
      )}
    </group>
  );
}

/* ──────────────────────────────────────────────────────────
 * Warp streaks — hyperspace lines that appear at travel speed
 * ────────────────────────────────────────────────────────── */

const WARP_COUNT = 90;
// Camera speed (units/s) where streaks start and reach full strength.
const WARP_SPEED_MIN = 5;
const WARP_SPEED_FULL = 20;

function WarpStreaks({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const prevCam = useRef<THREE.Vector3 | null>(null);
  const strength = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seedsRef = useRef<
    { angle: number; radius: number; z: number; length: number; speed: number }[] | null
  >(null);
  if (seedsRef.current === null) {
    seedsRef.current = Array.from({ length: WARP_COUNT }, (_, i) => ({
      angle: seededUnit(i, 101) * Math.PI * 2,
      radius: 2.5 + seededUnit(i, 102) * 8.5,
      z: -6 - seededUnit(i, 103) * 34,
      length: 3 + seededUnit(i, 104) * 4,
      speed: 0.75 + seededUnit(i, 105) * 0.5,
    }));
  }

  useFrame((_state, deltaRaw) => {
    const group = groupRef.current;
    const mesh = meshRef.current;
    const mat = matRef.current;
    const seeds = seedsRef.current;
    if (!group || !mesh || !mat || !seeds) return;

    const delta = Math.min(0.05, Math.max(0.0001, deltaRaw));

    if (!prevCam.current) {
      prevCam.current = camera.position.clone();
    }
    const speed = camera.position.distanceTo(prevCam.current) / delta;
    prevCam.current.copy(camera.position);

    const target = enabled
      ? THREE.MathUtils.clamp((speed - WARP_SPEED_MIN) / (WARP_SPEED_FULL - WARP_SPEED_MIN), 0, 1)
      : 0;
    // Asymmetric ramp: streaks snap in with acceleration, then linger through
    // the deceleration phase so the warp reads as a whoosh with a tail.
    const lambda = target > strength.current ? 9 : 2.2;
    strength.current = THREE.MathUtils.damp(strength.current, target, lambda, delta);
    const k = strength.current;

    group.visible = k > 0.02;
    if (!group.visible) return;

    // Pin the streak tunnel to the camera so it always fills the view.
    group.position.copy(camera.position);
    group.quaternion.copy(camera.quaternion);
    mat.opacity = k * 0.85;

    for (let i = 0; i < WARP_COUNT; i++) {
      const s = seeds[i];
      s.z += delta * (24 + speed * 0.7) * s.speed * k;
      if (s.z > 2) s.z -= 40;
      dummy.position.set(Math.cos(s.angle) * s.radius, Math.sin(s.angle) * s.radius, s.z);
      dummy.scale.set(1, 1, s.length * (0.5 + k));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef} visible={false}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, WARP_COUNT]} frustumCulled={false}>
        <boxGeometry args={[0.06, 0.06, 1]} />
        <meshBasicMaterial
          ref={matRef}
          color="#bcd9ff"
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </group>
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
