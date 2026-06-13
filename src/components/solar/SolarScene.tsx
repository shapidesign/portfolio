"use client";

import { Suspense } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Background } from "./Background";
import { Sun } from "./Sun";
import { Planet, type PlanetConfig } from "./Planet";
import { CameraRig, type CameraTarget } from "./CameraRig";
import { Spacecraft } from "./Spacecraft";

type SolarSceneProps = {
  planets: PlanetConfig[];
  hoveredSlug: string | null;
  focusedSlug: string | null;
  cameraTarget: CameraTarget;
  reducedMotion: boolean;
  spacecraftVisible: boolean;
  compact: boolean;
  voyageMotion?: boolean;
  planetPositions: Record<string, React.MutableRefObject<THREE.Vector3>>;
  onPlanetHover: (slug: string | null) => void;
  onPlanetClick: (slug: string, evt: { clientX: number; clientY: number }) => void;
  onSunHover: (hovered: boolean) => void;
  onSunClick: (evt: { clientX: number; clientY: number }) => void;
};

export function SolarScene({
  planets,
  hoveredSlug,
  focusedSlug,
  cameraTarget,
  reducedMotion,
  spacecraftVisible,
  compact,
  voyageMotion = false,
  planetPositions,
  onPlanetHover,
  onPlanetClick,
  onSunHover,
  onSunClick,
}: SolarSceneProps) {
  return (
    <Suspense fallback={null}>
      <Background voyageMotion={voyageMotion} />
      <CameraRig target={cameraTarget} parallax={4.5} reducedMotion={reducedMotion} compact={compact} />

      <Sun onHoverChange={onSunHover} onClick={onSunClick} />

      {planets.map((config) => (
        <Planet
          key={config.slug}
          config={config}
          paused={focusedSlug === config.slug}
          isHovered={hoveredSlug === config.slug}
          isActive={focusedSlug === config.slug}
          onHoverChange={(h) => onPlanetHover(h ? config.slug : null)}
          onClick={(e) => onPlanetClick(config.slug, e)}
          onPositionUpdate={(pos) => {
            const ref = planetPositions[config.slug];
            if (ref) ref.current.copy(pos);
          }}
        />
      ))}

      <Spacecraft
        visible={spacecraftVisible}
        targetKey={focusedSlug ?? "landing"}
        targetRef={focusedSlug ? planetPositions[focusedSlug] ?? null : null}
        targetSize={focusedSlug ? planets.find((planet) => planet.slug === focusedSlug)?.size : undefined}
        accent={focusedSlug ? planets.find((planet) => planet.slug === focusedSlug)?.accent : undefined}
        reducedMotion={reducedMotion}
        compact={compact}
      />

      {/* Cinematic grade: emissives glow, edges fall into darkness.
          Skipped on compact screens to keep mobile frame budget intact. */}
      {!compact ? (
        <EffectComposer multisampling={4}>
          <Bloom
            mipmapBlur
            intensity={0.5}
            luminanceThreshold={0.32}
            luminanceSmoothing={0.85}
            radius={0.7}
          />
          <Vignette eskil={false} offset={0.16} darkness={0.52} />
        </EffectComposer>
      ) : null}
    </Suspense>
  );
}
