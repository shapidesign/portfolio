"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import type { PlanetConfig } from "./Planet";
import { preventOrphan } from "@/i18n/typography";

type PlanetHUDProps = {
  visible: boolean;
  planet: PlanetConfig | null;
  positionRef: React.MutableRefObject<THREE.Vector3> | null;
  cameraRef: React.MutableRefObject<THREE.Camera | null>;
  isHebrew: boolean;
};

export function PlanetHUD({ visible, planet, positionRef, cameraRef, isHebrew }: PlanetHUDProps) {
  const [screen, setScreen] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!visible || !planet || !positionRef || !cameraRef.current) {
      return;
    }
    let raf = 0;
    const tmp = new THREE.Vector3();
    const tick = () => {
      const camera = cameraRef.current;
      const pos = positionRef.current;
      if (camera && pos) {
        tmp.copy(pos).project(camera);
        const x = (tmp.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-tmp.y * 0.5 + 0.5) * window.innerHeight;
        setScreen({ x, y });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, planet, positionRef, cameraRef]);

  if (!visible || !planet || !screen) return null;

  const label = isHebrew ? "משימה" : "Mission";
  const title = (isHebrew && planet.heTitle) || planet.title;

  return (
    <div
      className="solar-hud"
      dir={isHebrew ? "rtl" : "ltr"}
      style={{
        left: `${screen.x}px`,
        top: `${screen.y - 90}px`,
        borderColor: planet.accent,
        color: planet.accent,
      }}
    >
      <span className="solar-hud-label">{preventOrphan(label)}</span>
      <span className="solar-hud-title">{preventOrphan(title)}</span>
    </div>
  );
}
