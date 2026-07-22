"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { STAR_PATH_2D, STAR_VIEWBOX } from "./star-path";

export type BurstSeed = { id: string; x: number; y: number };

type StarBurstProps = {
  bursts: BurstSeed[];
  onExpire: (id: string) => void;
};

const PARTICLES_PER_BURST = 12;
const BURST_DURATION_MS = 650;
const TINTS = ["#ffffff", "#dac9ff", "#a98bff", "#9bd9ff", "#7a56f2"];

const seededUnit = (seed: string, index: number, salt: number) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const x = Math.sin(hash + index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const getReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * DOM overlay that paints a small constellation of star-shaped particles
 * flying outward from the click point. Cheap (CSS keyframes; no rAF) and
 * pointer-events: none so it never intercepts canvas interactions.
 */
export function StarBurst({ bursts, onExpire }: StarBurstProps) {
  return (
    <div className="solar-burst-layer" aria-hidden>
      {bursts.map((b) => (
        <Burst key={b.id} seed={b} onExpire={onExpire} />
      ))}
    </div>
  );
}

function Burst({ seed, onExpire }: { seed: BurstSeed; onExpire: (id: string) => void }) {
  const [reduced, setReduced] = useState(getReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReduced(mq.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => onExpire(seed.id), BURST_DURATION_MS + 80);
    return () => window.clearTimeout(t);
  }, [seed.id, onExpire]);

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLES_PER_BURST }, (_, i) => {
        const angle =
          (i / PARTICLES_PER_BURST) * Math.PI * 2 + seededUnit(seed.id, i, 1) * 0.4;
        const distance = 70 + seededUnit(seed.id, i, 2) * 90;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const rot = (seededUnit(seed.id, i, 3) - 0.5) * 540;
        const size = 9 + seededUnit(seed.id, i, 4) * 7;
        return {
          style: {
            "--dx": `${dx}px`,
            "--dy": `${dy}px`,
            "--rot": `${rot}deg`,
            "--size": `${size}px`,
            "--delay": `${seededUnit(seed.id, i, 5) * 60}ms`,
            color: TINTS[i % TINTS.length],
          } as CSSProperties,
        };
      }),
    [seed.id],
  );

  return (
    <div className="solar-burst" style={{ left: seed.x, top: seed.y }}>
      {/* central flash for any motion preference */}
      <span className="solar-burst-flash" />
      {(reduced ? [] : particles).map(({ style }, i) => {
        return (
          <svg
            key={i}
            className="solar-burst-particle"
            viewBox={STAR_VIEWBOX}
            style={style}
          >
            <path d={STAR_PATH_2D} fill="currentColor" />
          </svg>
        );
      })}
    </div>
  );
}
