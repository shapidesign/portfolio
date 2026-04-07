"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const STAR_PATH =
  "M16.1348 3.41309C19.1227 -1.13732 25.8401 -1.13732 28.8281 3.41309L28.5186 10.1064C29.534 11.6529 31.0958 12.7732 32.8877 13.2334L39.4678 10.8838C44.6726 12.2206 46.7028 18.5295 43.2549 22.6514L36.6475 24.4316C35.4529 25.8598 34.8488 27.697 34.958 29.5557L39.1621 34.7588C39.4765 40.1103 34.1666 44.03 29.1572 42.1211L25.1846 36.4492C23.4435 35.7858 21.5193 35.7858 19.7783 36.4492L15.8057 42.1211C10.7963 44.03 5.48741 40.1103 5.80176 34.7588L10.0049 29.5557C10.1141 27.6969 9.51001 25.8598 8.31543 24.4316L1.70801 22.6514C-1.73991 18.5295 0.290269 12.2206 5.49512 10.8838L12.0752 13.2334C13.8671 12.7732 15.4289 11.6529 16.4443 10.1064L16.1348 3.41309Z";

export { STAR_PATH };

export function HeroStarOutline() {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  return (
    <svg
      className="hero-star-outline"
      viewBox="-2 -2 49 49"
      fill="none"
      aria-hidden="true"
    >
      {pathLength > 0 && !reducedMotion && (
        <path
          d={STAR_PATH}
          stroke="var(--color-primary)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength}
          className="hero-star-outline-trace"
          style={{ "--star-path-length": pathLength } as React.CSSProperties}
        />
      )}
      <path
        ref={pathRef}
        d={STAR_PATH}
        stroke="var(--color-primary)"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={reducedMotion ? 1 : 0.3}
      />
    </svg>
  );
}

/* ─── Autonomous floating star that adds purple text-stroke ─── */

const STAR_VB = 49;
const MASK_SCALE = 14;
const MASK_SIZE = STAR_VB * MASK_SCALE;

interface HeroStarTextStrokeProps {
  children: React.ReactNode;
}

export function HeroStarTextStroke({ children }: HeroStarTextStrokeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const [pos, setPos] = useState<{ x: number; y: number; angle: number } | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(touch);
    if (touch) return;

    const container = containerRef.current;
    if (!container) return;

    startRef.current = performance.now();

    function animate(now: number) {
      const t = (now - startRef.current) / 1000;
      const rect = container!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      const ampX = w * 0.35;
      const ampY = h * 0.25;
      const cx = w * 0.55;
      const cy = h * 0.45;

      // Compound Lissajous path for a more organic, unpredictable feel
      const x = cx + ampX * (Math.sin(t * 0.27) + 0.38 * Math.sin(t * 0.71 + 0.8));
      const y = cy + ampY * (Math.sin(t * 0.19 + 1.2) + 0.32 * Math.sin(t * 0.53 + 2.1));
      const angle = t * 22 + 15 * Math.sin(t * 0.31);

      setPos({ x, y, angle });
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [reducedMotion]);

  const active = !reducedMotion && !isTouch;
  const half = MASK_SIZE / 2;

  const svgTransform = pos
    ? `translate(${pos.x - half}, ${pos.y - half}) rotate(${pos.angle}, ${half}, ${half}) scale(${MASK_SCALE})`
    : undefined;

  return (
    <div ref={containerRef} className="hero-star-stroke-container">
      <div className="hero-star-stroke-base">
        {children}
      </div>

      {active && pos && (
        <>
          <svg width="0" height="0" className="hero-star-stroke-defs" aria-hidden="true">
            <defs>
              <clipPath id="hero-star-clip" clipPathUnits="userSpaceOnUse">
                <path d={STAR_PATH} transform={svgTransform} />
              </clipPath>
            </defs>
          </svg>

          <div
            className="hero-star-stroke-overlay"
            style={{ clipPath: "url(#hero-star-clip)" }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}
