'use client';

import React, { useRef, Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Environment, Html, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// Scroll mapping function
export function mapScrollToCamera(progress: number) {
  const t = Math.max(0, Math.min(1, progress || 0));
  const x = THREE.MathUtils.lerp(-2, 2, t);
  const y = 0;
  const z = THREE.MathUtils.lerp(12, 6, t);
  return { x, y, z };
}

// Default texture URLs
const DEFAULT_EARTH_DIFFUSE = 'https://cdn.apewebapps.com/threejs/168/examples/textures/planets/earth_day_4096.jpg';
const DEFAULT_EARTH_NORMAL = 'https://cdn.apewebapps.com/threejs/168/examples/textures/planets/earth_normal_2048.jpg';
const DEFAULT_EARTH_CLOUDS = 'https://cdn.apewebapps.com/threejs/168/examples/textures/planets/earth_clouds_2048.png';
const DEFAULT_MOON_DIFFUSE = 'https://cdn.apewebapps.com/threejs/168/examples/textures/planets/moon_1024.jpg';

interface PlanetHeroProps {
  title?: string;
  subtitle?: string;
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export default function PlanetHero({ 
  title = "Shapi Design",
  subtitle = "Creative developer crafting cosmic digital experiences. Scroll to explore my universe of projects.",
  customColors = {
    primary: '#66d9ef',
    secondary: '#a6e22e',
    accent: '#f92672'
  }
}: PlanetHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="planet-hero-section">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={["#0c0c0c"]} />
        <Suspense fallback={
          <Html center>
            <span className="text-primary font-mono">Loading space...</span>
          </Html>
        }>
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
            <RimAtmosphere radius={2.18} color={customColors.primary} intensity={1.0} />
          </Float>

          {/* Companion moon */}
          <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
            <group position={[4.2, 0.6, -1.5]}>
              <Planet 
                radius={0.7} 
                rotation={[0, 1.1, 0]} 
                roughness={1.0} 
                metalness={0.0} 
                textureUrl={DEFAULT_MOON_DIFFUSE} 
              />
              <RimAtmosphere radius={0.73} color={customColors.secondary} intensity={0.5} />
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
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>

      {/* Overlay UI */}
      <div className="planet-hero-overlay">
        <div className="planet-hero-content">
          <h1 className="planet-hero-title">
            {title}
          </h1>
          <p className="planet-hero-subtitle">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

// Scroll Camera Rig Component
function ScrollCameraRig({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const { camera } = useThree();
  const progressRef = useRef(0);

  useEffect(() => {
    function computeProgress() {
      const el = containerRef?.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height + vh;
      const passed = vh - rect.top;
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

// Planet Component
interface PlanetProps {
  radius?: number;
  rotation?: [number, number, number];
  textureUrl?: string;
  normalUrl?: string;
  cloudsUrl?: string;
  metalness?: number;
  roughness?: number;
}

function Planet({ 
  radius = 1, 
  rotation = [0, 0, 0], 
  textureUrl, 
  normalUrl, 
  cloudsUrl, 
  metalness = 0.0, 
  roughness = 1.0 
}: PlanetProps) {
  const ref = useRef<THREE.Mesh>(null);

  const colorMap = useTexture(textureUrl || '');
  const normalMap = useTexture(normalUrl || '');
  const cloudsMap = useTexture(cloudsUrl || '');

  useFrame((_, dt) => { 
    if (ref.current) ref.current.rotation.y += dt * 0.08; 
  });

  return (
    <group>
      <mesh ref={ref} rotation={rotation} castShadow receiveShadow>
        <icosahedronGeometry args={[radius, 8]} />
        <meshStandardMaterial
          color={"#ffffff"}
          metalness={metalness}
          roughness={roughness}
          map={textureUrl ? colorMap : undefined}
          normalMap={normalUrl ? normalMap : undefined}
          envMapIntensity={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Cloud layer if provided */}
      {cloudsUrl && (
        <mesh>
          <sphereGeometry args={[radius * 1.03, 64, 64]} />
          <meshStandardMaterial
            transparent
            opacity={0.6}
            depthWrite={false}
            map={cloudsMap}
          />
        </mesh>
      )}
    </group>
  );
}

// Rim Atmosphere Component
interface RimAtmosphereProps {
  radius?: number;
  color?: string;
  intensity?: number;
}

function RimAtmosphere({ radius = 1.05, color = '#88ccff', intensity = 1.0 }: RimAtmosphereProps) {
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
