"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { makeAtmosphereMaterial } from "./atmosphere-material";

// Corona sprite diameter ≈ 2.2x the 2.6-radius ball.
const CORONA_SIZE = 11.5;

// The centre body reads as a spinning soccer ball and links to the shirts store.
// It keeps a real point light so the orbiting planets stay illuminated.

type SunProps = {
  onClick?: (event: { clientX: number; clientY: number }) => void;
  onHoverChange?: (hovered: boolean) => void;
  reducedMotion?: boolean;
};

// Radial corona gradient: warm white core fading through lavender to nothing.
function makeCoronaTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255, 250, 240, 0.9)");
  g.addColorStop(0.32, "rgba(219, 199, 255, 0.42)");
  g.addColorStop(0.62, "rgba(184, 155, 255, 0.14)");
  g.addColorStop(1, "rgba(184, 155, 255, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Black pentagons on white, placed at the 12 icosahedron vertices — the classic
// minimal soccer-ball motif. Computed in 3D direction space so it maps cleanly
// onto the sphere regardless of equirectangular pole distortion.
// ponytail: pentagons only (no hexagon seam lines) — good enough soccer read;
// upgrade path is a truncated-icosahedron geometry if a crisper ball is wanted.
function makeSoccerTexture() {
  const W = 1024;
  const H = 512;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const phi = (1 + Math.sqrt(5)) / 2;
  const raw = [
    [0, 1, phi], [0, 1, -phi], [0, -1, phi], [0, -1, -phi],
    [1, phi, 0], [1, -phi, 0], [-1, phi, 0], [-1, -phi, 0],
    [phi, 0, 1], [phi, 0, -1], [-phi, 0, 1], [-phi, 0, -1],
  ];
  const verts = raw.map(([x, y, z]) => {
    const l = Math.hypot(x, y, z);
    return [x / l, y / l, z / l] as const;
  });
  const bases = verts.map((v) => {
    const up: readonly [number, number, number] = Math.abs(v[1]) > 0.99 ? [1, 0, 0] : [0, 1, 0];
    let t1x = up[1] * v[2] - up[2] * v[1];
    let t1y = up[2] * v[0] - up[0] * v[2];
    let t1z = up[0] * v[1] - up[1] * v[0];
    const l = Math.hypot(t1x, t1y, t1z);
    t1x /= l; t1y /= l; t1z /= l;
    const t2x = v[1] * t1z - v[2] * t1y;
    const t2y = v[2] * t1x - v[0] * t1z;
    const t2z = v[0] * t1y - v[1] * t1x;
    return { t1: [t1x, t1y, t1z] as const, t2: [t2x, t2y, t2z] as const };
  });

  const APOTHEM = 0.32; // angular apothem of each pentagon (radians)
  const SEG = (2 * Math.PI) / 5;

  const isDark = (dx: number, dy: number, dz: number) => {
    let best = 0;
    let bestDot = -2;
    for (let i = 0; i < verts.length; i++) {
      const v = verts[i];
      const d = dx * v[0] + dy * v[1] + dz * v[2];
      if (d > bestDot) { bestDot = d; best = i; }
    }
    const ang = Math.acos(Math.min(1, Math.max(-1, bestDot)));
    const b = bases[best];
    const a = dx * b.t1[0] + dy * b.t1[1] + dz * b.t1[2];
    const c = dx * b.t2[0] + dy * b.t2[1] + dz * b.t2[2];
    const m = (((Math.atan2(c, a) % SEG) + SEG) % SEG) - SEG / 2;
    return ang <= APOTHEM / Math.cos(m);
  };

  const img = ctx.createImageData(W, H);
  const data = img.data;
  for (let py = 0; py < H; py++) {
    const theta = (py / H) * Math.PI;
    const st = Math.sin(theta);
    const ct = Math.cos(theta);
    for (let px = 0; px < W; px++) {
      const lon = (px / W) * 2 * Math.PI;
      const dark = isDark(st * Math.cos(lon), ct, st * Math.sin(lon));
      const idx = (py * W + px) * 4;
      const val = dark ? 16 : 244;
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  if (process.env.NODE_ENV !== "production") {
    console.assert(verts.length === 12, "soccer: expected 12 pentagon centres");
    console.assert(isDark(verts[0][0], verts[0][1], verts[0][2]), "soccer: pentagon centre should be dark");
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

export function Sun({ onClick, onHoverChange, reducedMotion = false }: SunProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coronaRef = useRef<THREE.Sprite>(null);
  const pulsePhase = useRef(0);
  const soccerTexture = useMemo(() => makeSoccerTexture(), []);
  const coronaTexture = useMemo(() => makeCoronaTexture(), []);
  const atmosphereMat = useMemo(() => makeAtmosphereMaterial("#b89bff", 0.8, 2.6), []);

  useEffect(
    () => () => {
      coronaTexture?.dispose();
      atmosphereMat.dispose();
    },
    [coronaTexture, atmosphereMat],
  );

  useFrame((_state, delta) => {
    if (groupRef.current) {
      // Slow, frame-rate-independent spin.
      groupRef.current.rotation.y += delta * 0.12;
    }
    if (coronaRef.current && !reducedMotion) {
      pulsePhase.current += delta * 0.7;
      const pulse = 1 + Math.sin(pulsePhase.current) * 0.04;
      coronaRef.current.scale.setScalar(CORONA_SIZE * pulse);
      coronaRef.current.material.opacity = 0.85 + Math.sin(pulsePhase.current * 1.3) * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      rotation={[0.5, 0, 0.15]}
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
      {/* Soccer ball — self-lit white so pentagons stay readable in the dark scene */}
      <mesh>
        <sphereGeometry args={[2.6, 48, 48]} />
        <meshStandardMaterial
          map={soccerTexture ?? undefined}
          emissiveMap={soccerTexture ?? undefined}
          emissive="#ffffff"
          emissiveIntensity={0.55}
          metalness={0.05}
          roughness={0.75}
        />
      </mesh>

      {/* Fresnel shell — the ball hangs inside a lavender glow */}
      <mesh scale={3.05} material={atmosphereMat} raycast={() => null}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>

      {/* Camera-facing corona, pulses gently */}
      {coronaTexture ? (
        <sprite ref={coronaRef} scale={CORONA_SIZE} raycast={() => null}>
          <spriteMaterial
            map={coronaTexture}
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      ) : null}

      {/* Real light source so orbiting planets stay illuminated from the centre */}
      <pointLight color="#b89bff" intensity={42} distance={80} decay={1.6} />
    </group>
  );
}
