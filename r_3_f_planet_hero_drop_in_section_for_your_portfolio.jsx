'use client';

// NOTE: ASCII-only source to avoid parser errors like "Expecting Unicode escape sequence \\uXXXX".
// This version adds scroll-driven camera motion and realistic default textures (Earth + Moon).

import React, { useRef, Suspense, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Environment, Html, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/*
  HOW TO USE
  1) Install deps:
     npm i three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing
  2) Drop <PlanetHero /> into any React/Next page section.
  3) Scroll the page to drive the camera. Section progress controls camera x/z.
  4) Realistic textures default to CDN links; override via props if you host your own.
*/

// -----------------------------
// Scroll mapping (exported so we can test it)
// -----------------------------
export function mapScrollToCamera(progress) {
  // Clamp 0..1
  const t = Math.max(0, Math.min(1, progress || 0));
  // Path: x from -2 to +2, y fixed, z from 12 to 6
  const x = THREE.MathUtils.lerp(-2, 2, t);
  const y = 0;
  const z = THREE.MathUtils.lerp(12, 6, t);
  return { x, y, z };
}

// Simple runtime tests (acts as a sanity check in dev/preview)
(function runTests() {
  function approx(a, b, eps = 1e-6) { return Math.abs(a - b) <= eps; }
  const a0 = mapScrollToCamera(0);
  console.assert(approx(a0.x, -2) && approx(a0.y, 0) && approx(a0.z, 12), 'mapScrollToCamera(0) failed');
  const a05 = mapScrollToCamera(0.5);
  console.assert(approx(a05.x, 0) && approx(a05.y, 0) && approx(a05.z, 9), 'mapScrollToCamera(0.5) failed');
  const a1 = mapScrollToCamera(1);
  console.assert(approx(a1.x, 2) && approx(a1.y, 0) && approx(a1.z, 6), 'mapScrollToCamera(1) failed');
})();

export default function PlanetHero() {
  const containerRef = useRef(null);
  return (
    <div ref={containerRef} className="relative w-full h-[120vh] overflow-hidden rounded-2xl">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={["#0c0c0c"]} />
        <Suspense fallback={<Html center><span className="text-white">Loading space...</span></Html>}>
          <Stars radius={80} depth={40} count={8000} factor={4} fade speed={0.5} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 4, 3]} intensity={2.2} />

          {/* Main planet: Earth-like defaults */}
          <Float speed={1} rotationIntensity={0.7} floatIntensity={0.6}>
            <Planet
              radius={2.1}
              rotation={[0.2, 0.8, 0]}
              textureUrl={DEFAULT_EARTH_DIFFUSE}
              normalUrl={DEFAULT_EARTH_NORMAL}
              cloudsUrl={DEFAULT_EARTH_CLOUDS}
              roughness={0.9}
              metalness={0.0}
            />
            <RimAtmosphere radius={2.18} color="#7ad8ff" intensity={1.0} />
          </Float>

          {/* Companion moon */}
          <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
            <group position={[4.2, 0.6, -1.5]}>
              <Planet radius={0.7} rotation={[0, 1.1, 0]} roughness={1.0} metalness={0.0} textureUrl={DEFAULT_MOON_DIFFUSE} />
              <RimAtmosphere radius={0.73} color="#a0b6ff" intensity={0.5} />
            </group>
          </Float>

          {/* Post FX */}
          <EffectComposer multisampling={4}>
            <Bloom intensity={0.9} mipmapBlur luminanceThreshold={1} levels={6} />
            <ChromaticAberration offset={[0.0008, 0.0008]} blendFunction={BlendFunction.NORMAL} />
            <Vignette eskil={false} offset={0.25} darkness={0.9} />
          </EffectComposer>

          <Environment preset="city" />
          <ScrollCameraRig containerRef={containerRef} />
        </Suspense>
        {/* Keep controls for minor interaction; no autorotate because scroll drives motion */}
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>

      {/* Overlay UI */}
      <div className="pointer-events-none absolute inset-0 flex items-end">
        <div className="m-6 md:m-10 p-4 md:p-6 rounded-2xl bg-black/30 border border-white/10 backdrop-blur">
          <h1 className="text-white text-3xl md:text-5xl font-semibold tracking-tight">Cosmic Interfaces</h1>
          <p className="text-white/80 mt-2 max-w-xl text-sm md:text-base">Scroll to fly the camera. Real textures, subtle glow, and post-processing for a studio look.</p>
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// Camera scroll rig
// -----------------------------
function ScrollCameraRig({ containerRef }) {
  const { camera } = useThree();
  const progressRef = useRef(0);

  useEffect(() => {
    function computeProgress() {
      const el = containerRef?.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height + vh;
      const passed = vh - rect.top; // how much of the section has passed the viewport top
      const raw = passed / total;
      return Math.max(0, Math.min(1, raw));
    }
    function onScroll() { progressRef.current = computeProgress(); }
    function onResize() { progressRef.current = computeProgress(); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [containerRef]);

  useFrame((_, dt) => {
    const { x, y, z } = mapScrollToCamera(progressRef.current);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 3, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 3, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 3, dt);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// -----------------------------
// Planet with optional realistic textures + clouds
// -----------------------------
interface PlanetProps {
  radius?: number;
  rotation?: [number, number, number];
  textureUrl?: string | undefined;
  normalUrl?: string | undefined;
  cloudsUrl?: string | undefined;
  metalness?: number;
  roughness?: number;
}

function Planet({ radius = 1, rotation = [0, 0, 0], textureUrl, normalUrl, cloudsUrl, metalness = 0.0, roughness = 1.0 }: PlanetProps) {
  const ref = useRef<THREE.Mesh>(null);

  // Load maps only if urls provided; useTexture plays well with Suspense
  const colorMap = useTexture(textureUrl || undefined);
  const normalMap = useTexture(normalUrl || undefined);
  const cloudsMap = useTexture(cloudsUrl || undefined);

  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.08; });

  return (
    <group>
      <mesh ref={ref} rotation={rotation} castShadow receiveShadow>
        <icosahedronGeometry args={[radius, 8]} />
        <meshStandardMaterial
          color={"#ffffff"}
          metalness={metalness}
          roughness={roughness}
          map={textureUrl ? (colorMap as THREE.Texture) : undefined}
          normalMap={normalUrl ? (normalMap as THREE.Texture) : undefined}
          envMapIntensity={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Cloud layer if provided */}
      {cloudsUrl ? (
        <mesh>
          <sphereGeometry args={[radius * 1.03, 64, 64]} />
          <meshStandardMaterial
            transparent
            opacity={0.6}
            depthWrite={false}
            map={cloudsMap as THREE.Texture}
          />
        </mesh>
      ) : null}
    </group>
  );
}

// -----------------------------
// Rim atmosphere shader
// -----------------------------
interface RimProps { radius?: number; color?: string; intensity?: number }
function RimAtmosphere({ radius = 1.05, color = '#88ccff', intensity = 1.0 }: RimProps) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uColor: { value: new THREE.Color(color) },
          uIntensity: { value: intensity }
        }}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalMatrix * normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          uniform vec3 uColor;
          uniform float uIntensity;
          void main() {
            float rim = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
            gl_FragColor = vec4(uColor * rim * uIntensity, rim * 0.9);
          }
        `}
      />
    </mesh>
  );
}

// -----------------------------
// Default texture URLs (swap to your own if you prefer hosting locally)
// -----------------------------
const DEFAULT_EARTH_DIFFUSE = 'https://cdn.apewebapps.com/threejs/168/examples/textures/planets/earth_day_4096.jpg';
const DEFAULT_EARTH_NORMAL  = 'https://cdn.apewebapps.com/threejs/168/examples/textures/planets/earth_normal_2048.jpg';
const DEFAULT_EARTH_CLOUDS  = 'https://cdn.apewebapps.com/threejs/168/examples/textures/planets/earth_clouds_2048.png';
const DEFAULT_MOON_DIFFUSE  = 'https://cdn.apewebapps.com/threejs/168/examples/textures/planets/moon_1024.jpg';

// -----------------------------
// Minimal demo
// -----------------------------
export function PlanetHeroDemo() {
  return (
    <div className="w-full h-[60vh]">
      <PlanetHero />
    </div>
  );
}
