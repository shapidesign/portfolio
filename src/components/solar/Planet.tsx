"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { makeAtmosphereMaterial } from "./atmosphere-material";

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
  /** Saturn-style ring */
  ringed?: boolean;
};

type PlanetProps = {
  config: PlanetConfig;
  paused?: boolean;
  isHovered?: boolean;
  isActive?: boolean;
  compact?: boolean;
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

const isGaseous = (slug: string) => seededUnit(slug, 3, 11) > 0.45;

/**
 * Procedural equirectangular surface. Gaseous planets get strong horizontal
 * banding plus a storm spot; rocky planets get subtler bands and craters.
 * Band edges use integer sine cycles across the width so the texture tiles
 * seamlessly at the longitude seam.
 */
function makePlanetTexture(config: PlanetConfig, size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const slug = config.slug;
  const gaseous = isGaseous(slug);
  const accent = new THREE.Color(config.accent);
  const deep = mixColor(accent, new THREE.Color("#05030b"), 0.74);
  const mid = mixColor(accent, new THREE.Color("#ece9ff"), 0.18);
  const highlight = mixColor(accent, new THREE.Color("#ffffff"), 0.34);
  const shadow = mixColor(accent, new THREE.Color("#000000"), 0.55);

  // Base: vertical (latitude) gradient — bright equator, deep poles.
  const base = ctx.createLinearGradient(0, 0, 0, size);
  base.addColorStop(0, `#${deep.getHexString()}`);
  base.addColorStop(0.5, `#${mid.getHexString()}`);
  base.addColorStop(1, `#${deep.getHexString()}`);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Horizontal bands with wavy, seam-safe edges.
  const bandCount = gaseous
    ? 6 + Math.floor(seededUnit(slug, 1, 1) * 5)
    : 3 + Math.floor(seededUnit(slug, 1, 1) * 3);
  const TAU = Math.PI * 2;
  const bandEdge = (x: number, k: number, phase: number, amp: number) =>
    Math.sin((x / size) * TAU * k + phase) * amp +
    Math.sin((x / size) * TAU * (k + 2) + phase * 1.7) * amp * 0.4;

  for (let i = 0; i < bandCount; i++) {
    const yc = ((i + 0.5) / bandCount) * size + (seededUnit(slug, i, 2) - 0.5) * (size / bandCount) * 0.5;
    const h = (size / bandCount) * (0.4 + seededUnit(slug, i, 3) * 0.55);
    const k = 1 + Math.floor(seededUnit(slug, i, 4) * 3);
    const phaseTop = seededUnit(slug, i, 5) * TAU;
    const phaseBot = seededUnit(slug, i, 6) * TAU;
    const amp = gaseous ? 4 + seededUnit(slug, i, 7) * 11 : 2 + seededUnit(slug, i, 7) * 5;

    ctx.beginPath();
    for (let x = 0; x <= size; x += 4) {
      const y = yc - h / 2 + bandEdge(x, k, phaseTop, amp);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    for (let x = size; x >= 0; x -= 4) {
      ctx.lineTo(x, yc + h / 2 + bandEdge(x, k, phaseBot, amp));
    }
    ctx.closePath();
    const tone = i % 3;
    ctx.fillStyle =
      tone === 0
        ? `#${shadow.getHexString()}52`
        : tone === 1
          ? `#${highlight.getHexString()}30`
          : `#${deep.getHexString()}44`;
    ctx.fill();
  }

  // Fine turbulence: low-alpha blobs in both directions.
  for (let i = 0; i < 70; i++) {
    const x = seededUnit(slug, i, 12) * size;
    const y = seededUnit(slug, i, 13) * size;
    const rx = 6 + seededUnit(slug, i, 14) * (gaseous ? 34 : 14);
    const ry = 2 + seededUnit(slug, i, 15) * (gaseous ? 6 : 10);
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
    ctx.fillStyle =
      seededUnit(slug, i, 16) > 0.5
        ? `#${highlight.getHexString()}18`
        : `#${shadow.getHexString()}20`;
    ctx.fill();
  }

  if (gaseous) {
    // Great-storm spot with a soft glow rim.
    const sx = seededUnit(slug, 5, 21) * size;
    const sy = size * (0.3 + seededUnit(slug, 6, 21) * 0.4);
    const sr = size * (0.05 + seededUnit(slug, 7, 21) * 0.05);
    const storm = ctx.createRadialGradient(sx, sy, sr * 0.15, sx, sy, sr);
    storm.addColorStop(0, `#${highlight.getHexString()}e6`);
    storm.addColorStop(0.55, `#${accent.getHexString()}88`);
    storm.addColorStop(1, `#${accent.getHexString()}00`);
    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(1.7, 1);
    ctx.translate(-sx, -sy);
    ctx.fillStyle = storm;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, TAU);
    ctx.fill();
    ctx.restore();
  } else {
    // Craters, rocky worlds only.
    for (let i = 0; i < 140; i++) {
      const x = seededUnit(slug, i, 6) * size;
      const y = seededUnit(slug, i, 7) * size;
      const r = 0.8 + seededUnit(slug, i, 8) * 3;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle =
        seededUnit(slug, i, 9) > 0.55
          ? `#${highlight.getHexString()}50`
          : `#${shadow.getHexString()}42`;
      ctx.fill();
    }
  }

  // Pole darkening on top of everything.
  const poles = ctx.createLinearGradient(0, 0, 0, size);
  poles.addColorStop(0, "rgba(2,1,8,0.6)");
  poles.addColorStop(0.16, "rgba(2,1,8,0)");
  poles.addColorStop(0.84, "rgba(2,1,8,0)");
  poles.addColorStop(1, "rgba(2,1,8,0.6)");
  ctx.fillStyle = poles;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Night-side city lights: warm dot clusters over a dim accent base, used as
 * emissiveMap. The accent base keeps the whole surface faintly self-lit (the
 * pre-redesign look) so planets stay colorful; the dots sparkle on top.
 */
function makeCityLightsTexture(slug: string, accent: string, size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const base = new THREE.Color(accent).multiplyScalar(0.32);
  ctx.fillStyle = `#${base.getHexString()}`;
  ctx.fillRect(0, 0, size, size);

  const clusterCount = 10 + Math.floor(seededUnit(slug, 0, 31) * 8);
  for (let c = 0; c < clusterCount; c++) {
    // Keep clusters off the poles where equirectangular stretch smears them.
    const cx = seededUnit(slug, c, 32) * size;
    const cy = size * (0.2 + seededUnit(slug, c, 33) * 0.6);
    const spread = size * (0.02 + seededUnit(slug, c, 34) * 0.05);
    const dots = 18 + Math.floor(seededUnit(slug, c, 35) * 30);
    for (let d = 0; d < dots; d++) {
      // Two summed randoms bias dots toward the cluster centre.
      const ox = (seededUnit(slug, c * 97 + d, 36) + seededUnit(slug, c * 97 + d, 37) - 1) * spread;
      const oy = (seededUnit(slug, c * 97 + d, 38) + seededUnit(slug, c * 97 + d, 39) - 1) * spread;
      const r = 0.4 + seededUnit(slug, c * 97 + d, 40) * 1.1;
      ctx.beginPath();
      ctx.arc(((cx + ox) % size + size) % size, cy + oy, r, 0, Math.PI * 2);
      ctx.fillStyle = seededUnit(slug, c * 97 + d, 41) > 0.8 ? "#fff3d6" : "#ffd9a0";
      ctx.fill();
    }
    // Faint haze so clusters read as glowing regions, not confetti.
    const haze = ctx.createRadialGradient(cx, cy, 0, cx, cy, spread * 1.6);
    haze.addColorStop(0, "rgba(255,214,150,0.16)");
    haze.addColorStop(1, "rgba(255,214,150,0)");
    ctx.fillStyle = haze;
    ctx.beginPath();
    ctx.arc(cx, cy, spread * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

/** Banded Saturn-style ring texture, mapped via ringGeometry's planar UVs. */
function makeRingTexture(config: PlanetConfig, innerFrac: number, size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const accent = new THREE.Color(config.accent);
  const pale = mixColor(accent, new THREE.Color("#f2ecff"), 0.55);
  const dim = mixColor(accent, new THREE.Color("#0a0616"), 0.4);

  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(Math.max(0, innerFrac - 0.01), "rgba(0,0,0,0)");
  const bands = 14;
  for (let i = 0; i <= bands; i++) {
    const f = innerFrac + ((1 - innerFrac) * i) / bands;
    const u = seededUnit(config.slug, i, 51);
    // Cassini-style gap around two thirds out.
    const gap = i === Math.floor(bands * 0.62);
    const color = u > 0.5 ? pale : dim;
    const alpha = gap ? 0.04 : 0.22 + u * 0.5;
    g.addColorStop(Math.min(1, f), `rgba(${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)},${alpha.toFixed(2)})`);
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Shared conic alpha gradient for orbit paths — symmetric around the bright
 * point so the path glows near the planet and fades opposite it. Module-level
 * singleton; never disposed on purpose (one 128px texture for the whole app).
 */
let orbitAlphaTexture: THREE.Texture | null | undefined;
function getOrbitAlphaTexture() {
  if (orbitAlphaTexture !== undefined) return orbitAlphaTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx || typeof ctx.createConicGradient !== "function") {
    orbitAlphaTexture = null; // old browser: fall back to flat opacity
    return orbitAlphaTexture;
  }
  const g = ctx.createConicGradient(0, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.5, "rgba(255,255,255,0.1)");
  g.addColorStop(1, "rgba(255,255,255,1)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  orbitAlphaTexture = new THREE.CanvasTexture(canvas);
  orbitAlphaTexture.needsUpdate = true;
  return orbitAlphaTexture;
}

const RING_INNER = 1.5;
const RING_OUTER = 2.35;

export function Planet({
  config,
  paused = false,
  isHovered = false,
  isActive = false,
  compact = false,
  onHoverChange,
  onClick,
  onPositionUpdate,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(config.startAngle);
  const tmpVec = useRef(new THREE.Vector3()).current;

  const surfaceTexture = useMemo(
    () => makePlanetTexture(config, compact ? 256 : 512),
    [config, compact],
  );
  const cityTexture = useMemo(
    () => makeCityLightsTexture(config.slug, config.accent, compact ? 128 : 256),
    [config.slug, config.accent, compact],
  );
  const ringTexture = useMemo(
    () => (config.ringed ? makeRingTexture(config, RING_INNER / RING_OUTER) : null),
    [config],
  );
  const atmosphereMat = useMemo(
    () => makeAtmosphereMaterial(config.accent, 0.55, 3.2),
    [config.accent],
  );
  const orbitAlpha = getOrbitAlphaTexture();

  useEffect(
    () => () => {
      surfaceTexture?.dispose();
      cityTexture?.dispose();
      ringTexture?.dispose();
      atmosphereMat.dispose();
    },
    [surfaceTexture, cityTexture, ringTexture, atmosphereMat],
  );

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
    if (orbitRef.current) {
      // Spins the conic alpha gradient so the bright arc tracks the planet.
      // The gradient's bright point lands at ring-local angle PI/2 (conic
      // gradients start at 12 o'clock; flipY mirrors it there), hence -PI/2.
      orbitRef.current.rotation.z = a - Math.PI / 2;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
    if (scaleRef.current) {
      const target = config.size * (isHovered ? 1.3 : 1);
      const next = THREE.MathUtils.damp(scaleRef.current.scale.x, target, 8, delta);
      scaleRef.current.scale.setScalar(next);
    }
    // Atmosphere glow: brighter when hovered, brightest when active.
    const glowTarget = isActive ? 1.45 : isHovered ? 1.1 : 0.55;
    const u = atmosphereMat.uniforms.uIntensity;
    u.value = THREE.MathUtils.damp(u.value, glowTarget, 6, delta);
  });

  return (
    <>
      <mesh ref={orbitRef} rotation={[Math.PI / 2 - config.tilt, 0, 0]}>
        <ringGeometry args={[config.radius - 0.022, config.radius + 0.022, 160]} />
        <meshBasicMaterial
          color={config.accent}
          alphaMap={orbitAlpha ?? undefined}
          transparent
          opacity={orbitAlpha ? (isActive ? 0.55 : 0.3) : isActive ? 0.38 : 0.16}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={groupRef}>
        <group ref={scaleRef} scale={config.size}>
          <mesh
            ref={meshRef}
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
              emissiveMap={cityTexture}
              emissive="#ffffff"
              emissiveIntensity={1.1}
              metalness={0.12}
              roughness={0.72}
            />
          </mesh>

          {/* Fresnel rim glow — the accent-colored atmosphere halo */}
          <mesh scale={1.22} material={atmosphereMat} raycast={() => null}>
            <sphereGeometry args={[1, 24, 24]} />
          </mesh>

          {config.ringed && ringTexture ? (
            <mesh rotation={[Math.PI / 2.6, 0, 0.35]} raycast={() => null}>
              <ringGeometry args={[RING_INNER, RING_OUTER, 96]} />
              <meshBasicMaterial
                map={ringTexture}
                transparent
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          ) : null}
        </group>
      </group>
    </>
  );
}
