"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { Sparkles } from "@react-three/drei";

const CORONA_SIZE = 8;
const PURPLE = new THREE.Color("#7a56f2");

type SunProps = {
  onClick?: (event: { clientX: number; clientY: number }) => void;
  onHoverChange?: (hovered: boolean) => void;
  reducedMotion?: boolean;
};

function makeGlowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(214, 196, 255, 0.85)");
  g.addColorStop(0.25, "rgba(169, 139, 255, 0.4)");
  g.addColorStop(0.55, "rgba(122, 86, 242, 0.14)");
  g.addColorStop(1, "rgba(122, 86, 242, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Plasma surface: purple base, granulation cells and a few bright swirl bands.
 * Bands use integer sine cycles across the width so the longitude seam tiles.
 */
function makeSunTexture(size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const TAU = Math.PI * 2;
  // Deterministic noise so the surface is identical on every load.
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const base = ctx.createLinearGradient(0, 0, 0, size);
  base.addColorStop(0, "#6c4fe6");
  base.addColorStop(0.5, "#b39dff");
  base.addColorStop(1, "#6c4fe6");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Granulation: many soft cells, bright centres with darker rims.
  for (let i = 0; i < 420; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 4 + rand() * 16;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rand() > 0.5 ? "rgba(240,232,255,0.42)" : "rgba(200,175,255,0.3)");
    g.addColorStop(0.7, "rgba(70,40,180,0.14)");
    g.addColorStop(1, "rgba(40,20,120,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  // Swirl bands: thin wavy streaks of hot plasma.
  for (let b = 0; b < 7; b++) {
    const yc = size * (0.15 + rand() * 0.7);
    const k = 1 + Math.floor(rand() * 3);
    const phase = rand() * TAU;
    const amp = 6 + rand() * 18;
    ctx.beginPath();
    for (let x = 0; x <= size; x += 4) {
      const y = yc + Math.sin((x / size) * TAU * k + phase) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(246,240,255,${(0.28 + rand() * 0.22).toFixed(2)})`;
    ctx.lineWidth = 1.5 + rand() * 4;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

export function Sun({ onClick, onHoverChange, reducedMotion = false }: SunProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const pulsePhase = useRef(0);
  const glowTexture = useMemo(() => makeGlowTexture(), []);
  const surfaceTexture = useMemo(() => makeSunTexture(), []);

  useEffect(
    () => () => {
      glowTexture?.dispose();
      surfaceTexture?.dispose();
    },
    [glowTexture, surfaceTexture],
  );

  useFrame((_state, delta) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += delta * 0.12;
    }
    if (dustRef.current && !reducedMotion) {
      dustRef.current.rotation.y += delta * 0.02;
    }
    if (!reducedMotion) {
      pulsePhase.current += delta * 0.7;
      if (haloRef.current) {
        const pulse = 1 + Math.sin(pulsePhase.current * 1.7) * 0.04;
        haloRef.current.scale.setScalar(pulse);
      }
      if (glowRef.current) {
        const pulse = CORONA_SIZE + Math.sin(pulsePhase.current + 1.4) * 0.35;
        glowRef.current.scale.set(pulse, pulse, 1);
      }
    }
  });

  return (
    <>
      <group
        ref={groupRef}
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
        {glowTexture ? (
          <sprite ref={glowRef} scale={[CORONA_SIZE, CORONA_SIZE, 1]} renderOrder={-1}>
            <spriteMaterial
              map={glowTexture}
              transparent
              opacity={0.45}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        ) : null}

        <mesh ref={haloRef}>
          <sphereGeometry args={[3.2, 20, 20]} />
          <meshBasicMaterial color={PURPLE} transparent opacity={0.06} />
        </mesh>

        <mesh>
          <sphereGeometry args={[2.6, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            map={surfaceTexture}
            bumpMap={surfaceTexture}
            bumpScale={0.05}
            emissiveMap={surfaceTexture}
            // White emissive lets the plasma texture glow in its own colours;
            // the sun's light sits inside it, so lighting alone can't show the surface.
            emissive="#ffffff"
            emissiveIntensity={0.9}
            metalness={0.1}
            roughness={0.55}
            toneMapped={false}
          />
        </mesh>

        <pointLight color="#b89bff" intensity={42} distance={80} decay={1.6} />
      </group>

      <group ref={dustRef}>
        {/* Calm dust. It lives outside the spinning sun group on purpose: drei's
            Sparkles derive each speck's bob phase from its world x, so a fast
            spin turns the bob into jitter. A very slow turn keeps it floating. */}
        <Sparkles
          count={220}
          scale={[12, 1.2, 12]}
          size={2.4}
          speed={reducedMotion ? 0 : 0.35}
          noise={0.012}
          opacity={0.55}
          color="#d6c8ff"
          raycast={() => null}
        />
        <Sparkles
          count={14}
          scale={8}
          size={5}
          speed={reducedMotion ? 0 : 0.25}
          noise={0.02}
          opacity={0.7}
          color="#f1ebff"
          raycast={() => null}
        />
      </group>
    </>
  );
}
