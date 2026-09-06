"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

const CORONA_SIZE = 11.5;
const PURPLE = new THREE.Color("#7a56f2");
const PURPLE_HOT = new THREE.Color("#a98bff");

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

export function Sun({ onClick, onHoverChange, reducedMotion = false }: SunProps) {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const pulsePhase = useRef(0);
  const glowTexture = useMemo(() => makeGlowTexture(), []);

  useEffect(
    () => () => {
      glowTexture?.dispose();
    },
    [glowTexture],
  );

  useFrame((_state, delta) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += delta * 0.12;
    }
    if (!reducedMotion) {
      pulsePhase.current += delta * 0.7;
      if (haloRef.current) {
        const pulse = 1 + Math.sin(pulsePhase.current * 1.7) * 0.04;
        haloRef.current.scale.setScalar(pulse);
      }
      if (glowRef.current) {
        const pulse = CORONA_SIZE + Math.sin(pulsePhase.current + 1.4) * 0.7;
        glowRef.current.scale.set(pulse, pulse, 1);
      }
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
      {glowTexture ? (
        <sprite ref={glowRef} scale={[CORONA_SIZE, CORONA_SIZE, 1]} renderOrder={-1}>
          <spriteMaterial
            map={glowTexture}
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ) : null}

      <mesh ref={haloRef}>
        <sphereGeometry args={[3.2, 20, 20]} />
        <meshBasicMaterial color={PURPLE} transparent opacity={0.12} />
      </mesh>

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

      <pointLight color="#b89bff" intensity={42} distance={80} decay={1.6} />
    </group>
  );
}
