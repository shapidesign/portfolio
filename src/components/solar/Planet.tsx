"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

export type PlanetConfig = {
  slug: string;
  title: string;
  heTitle?: string;
  /** monokai accent — used as emissive tint */
  accent: string;
  /** orbit radius from sun, in scene units */
  radius: number;
  /** orbit angular velocity (radians/sec) */
  speed: number;
  /** initial angle along the orbit */
  startAngle: number;
  /** vertical tilt of the orbit plane */
  tilt: number;
  /** size of the planet itself */
  size: number;
};

type PlanetProps = {
  config: PlanetConfig;
  paused?: boolean;
  isHovered?: boolean;
  isActive?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  onClick?: (event: { clientX: number; clientY: number }) => void;
  /** receives the live world position each frame, for HUD projection */
  onPositionUpdate?: (pos: THREE.Vector3) => void;
};

const seededUnit = (seed: string, index: number, salt: number) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const x = Math.sin(hash + index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function mixColor(a: THREE.Color, b: THREE.Color, t: number) {
  return a.clone().lerp(b, t);
}

function makePlanetTexture(config: PlanetConfig, size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const accent = new THREE.Color(config.accent);
  const deep = mixColor(accent, new THREE.Color("#05030b"), 0.74);
  const mid = mixColor(accent, new THREE.Color("#ece9ff"), 0.18);
  const highlight = mixColor(accent, new THREE.Color("#ffffff"), 0.34);
  const shadow = mixColor(accent, new THREE.Color("#000000"), 0.55);

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, `#${highlight.getHexString()}`);
  gradient.addColorStop(0.34, `#${mid.getHexString()}`);
  gradient.addColorStop(1, `#${deep.getHexString()}`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const contourCount = 18 + Math.floor(seededUnit(config.slug, 1, 1) * 18);
  for (let i = 0; i < contourCount; i++) {
    const y = seededUnit(config.slug, i, 2) * size;
    const amp = 8 + seededUnit(config.slug, i, 3) * 28;
    const freq = 1.3 + seededUnit(config.slug, i, 4) * 2.8;
    ctx.beginPath();
    for (let x = -8; x <= size + 8; x += 8) {
      const n =
        Math.sin(x * 0.025 * freq + seededUnit(config.slug, i, 5) * Math.PI * 2) * amp +
        Math.sin(x * 0.061 + i) * amp * 0.35;
      const py = y + n;
      if (x === -8) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }
    ctx.lineTo(size + 8, size + 8);
    ctx.lineTo(-8, size + 8);
    ctx.closePath();
    ctx.fillStyle = i % 3 === 0 ? `#${shadow.getHexString()}55` : `#${highlight.getHexString()}24`;
    ctx.fill();
  }

  for (let i = 0; i < 180; i++) {
    const x = seededUnit(config.slug, i, 6) * size;
    const y = seededUnit(config.slug, i, 7) * size;
    const r = 0.8 + seededUnit(config.slug, i, 8) * 2.8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle =
      seededUnit(config.slug, i, 9) > 0.55
        ? `#${highlight.getHexString()}50`
        : `#${shadow.getHexString()}42`;
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

export function Planet({
  config,
  paused = false,
  isHovered = false,
  isActive = false,
  onHoverChange,
  onClick,
  onPositionUpdate,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(config.startAngle);
  const tmpVec = useRef(new THREE.Vector3()).current;
  const surfaceTexture = useMemo(() => makePlanetTexture(config), [config]);

  useFrame((_state, delta) => {
    if (!paused && !isHovered) {
      angleRef.current -= config.speed * delta;
    }
    const a = angleRef.current;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    if (groupRef.current) {
      groupRef.current.position.set(
        cos * config.radius,
        sin * config.radius * Math.sin(config.tilt),
        sin * config.radius * Math.cos(config.tilt),
      );
      if (onPositionUpdate) {
        groupRef.current.getWorldPosition(tmpVec);
        onPositionUpdate(tmpVec);
      }
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      const targetScale = isHovered ? config.size * 1.3 : config.size;
      const cur = meshRef.current.scale.x;
      const next = cur + (targetScale - cur) * Math.min(1, delta * 8);
      meshRef.current.scale.setScalar(next);
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y -= delta * 0.08;
    }
  });

  return (
    <>
      <mesh rotation={[Math.PI / 2 - config.tilt, 0, 0]}>
        <ringGeometry args={[config.radius - 0.018, config.radius + 0.018, 160]} />
        <meshBasicMaterial
          color={config.accent}
          transparent
          opacity={isActive ? 0.38 : 0.16}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          scale={config.size}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            onHoverChange?.(true);
          }}
          onPointerOut={() => {
            document.body.style.cursor = "";
            onHoverChange?.(false);
          }}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onClick?.({ clientX: e.clientX, clientY: e.clientY });
          }}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            map={surfaceTexture}
            bumpMap={surfaceTexture}
            bumpScale={0.075}
            emissive={config.accent}
            emissiveIntensity={isActive ? 0.42 : isHovered ? 0.28 : 0.14}
            metalness={0.12}
            roughness={0.72}
          />
        </mesh>

        <mesh ref={cloudRef} scale={config.size * 1.018}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={isActive ? 0.11 : 0.06}
            depthWrite={false}
          />
        </mesh>

      </group>
    </>
  );
}
