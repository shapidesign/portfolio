"use client";

import { STAR_PATH } from "@/components/ui/HeroStarOutline";

type StarMarkProps = {
  className?: string;
  size?: number;
  filled?: boolean;
};

export function StarMark({ className = "", size = 16, filled = true }: StarMarkProps) {
  return (
    <svg
      className={`star-mark ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 45 43"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={STAR_PATH}
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={filled ? 0 : 1.9}
      />
    </svg>
  );
}
