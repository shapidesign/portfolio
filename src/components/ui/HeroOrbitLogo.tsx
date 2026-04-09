"use client";

import { STAR_PATH } from "@/components/ui/HeroStarOutline";

export function HeroOrbitLogo() {
  return (
    <div className="hero-orbit-logo" aria-hidden="true">
      <div className="hero-orbit-track hero-orbit-track-a">
        <span className="hero-orbit-dot hero-orbit-dot-a" />
      </div>
      <div className="hero-orbit-track hero-orbit-track-b">
        <span className="hero-orbit-dot hero-orbit-dot-b" />
      </div>
      <div className="hero-orbit-track hero-orbit-track-c">
        <span className="hero-orbit-dash" />
      </div>

      <div className="hero-orbit-core">
        <svg className="hero-orbit-core-svg" viewBox="0 0 45 43" fill="none">
          <path
            d={STAR_PATH}
            fill="color-mix(in srgb, var(--color-primary) 42%, transparent)"
            stroke="var(--color-accent-blue)"
            strokeWidth="1"
            opacity="0.95"
          />
        </svg>
      </div>
    </div>
  );
}
