"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

type SunProps = {
  onClick?: (event: { clientX: number; clientY: number }) => void;
  onHoverChange?: (hovered: boolean) => void;
};

const PURPLE = new THREE.Color("#7a56f2");
const PURPLE_HOT = new THREE.Color("#a98bff");

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

export function Sun({ onClick, onHoverChange }: SunProps) {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Sprite>(null);

  const glowTexture = useMemo(() => makeGlowTexture(), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
    const t = state.clock.getElapsedTime();
    if (haloRef.current) {
      const s = 1 + Math.sin(t * 1.2) * 0.04;
      haloRef.current.scale.set(s, s, s);
    }
    if (glowRef.current) {
      // Slow corona breathing — slightly out of phase with the halo.
      const s = 11.5 + Math.sin(t * 0.7 + 1.4) * 0.7;
      glowRef.current.scale.set(s, s, 1);
    }
  });

  return (
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
      {/* Wide corona glow — additive sprite, breathes slowly */}
      {glowTexture ? (
        <sprite ref={glowRef} scale={[11.5, 11.5, 1]} renderOrder={-1}>
          <spriteMaterial
            map={glowTexture}
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ) : null}

      {/* Soft outer halo — picks up bloom but stays subtle */}
      <mesh ref={haloRef} scale={1}>
        <sphereGeometry args={[3.2, 20, 20]} />
        <meshBasicMaterial color={PURPLE} transparent opacity={0.12} />
      </mesh>

      {/* Sun body — round purple ball */}
      <mesh>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshStandardMaterial
          color={PURPLE}
          emissive={PURPLE_HOT}
          emissiveIntensity={1.15}
          metalness={0.1}
          roughness={0.55}
          toneMapped={false}
        />
      </mesh>

      {/* Real light source so planets get illuminated from the sun */}
      <pointLight color="#b89bff" intensity={42} distance={80} decay={1.6} />
    </group>
  );
}
