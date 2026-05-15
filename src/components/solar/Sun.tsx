"use client";

import { useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

type SunProps = {
  onClick?: (event: { clientX: number; clientY: number }) => void;
  onHoverChange?: (hovered: boolean) => void;
};

const PURPLE = new THREE.Color("#7a56f2");
const PURPLE_HOT = new THREE.Color("#a98bff");

export function Sun({ onClick, onHoverChange }: SunProps) {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
    if (haloRef.current) {
      const t = state.clock.getElapsedTime();
      const s = 1 + Math.sin(t * 1.2) * 0.04;
      haloRef.current.scale.set(s, s, s);
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
          emissiveIntensity={0.9}
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
