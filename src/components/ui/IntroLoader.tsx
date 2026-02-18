"use client";

import { useEffect, useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

const LOADER_KEY = "portfolio-intro-seen";

function shouldShowLoader(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.sessionStorage.getItem(LOADER_KEY) === "1") return false;
  return true;
}

const shapeVariants = {
  hidden: { scale: 0, rotate: -20, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      delay: i * 0.12,
      type: "spring" as const,
      duration: 0.5,
      bounce: 0.35
    }
  }),
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" as const }
  }
};

const containerVariants = {
  exit: {
    opacity: 0,
    transition: { duration: 0.4, ease: "easeInOut" as const }
  }
};

const outlineShapes = [
  { type: "square" as const, color: "var(--color-primary)", size: 56 },
  { type: "circle" as const, color: "var(--color-accent-blue)", size: 56 },
  { type: "triangle" as const, color: "var(--color-secondary)", size: 56 }
];

function OutlineSquare({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <rect x="1" y="1" width={size - 2} height={size - 2} stroke={color} strokeWidth="2" />
    </svg>
  );
}

function OutlineCircle({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 1} stroke={color} strokeWidth="2" />
    </svg>
  );
}

function OutlineTriangle({ color, size }: { color: string; size: number }) {
  const h = size * 0.866;
  return (
    <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`} fill="none">
      <polygon
        points={`${size / 2},2 2,${h - 1} ${size - 2},${h - 1}`}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IntroLoader() {
  const [visible, setVisible] = useState(shouldShowLoader);

  useEffect(() => {
    if (!visible) return;
    window.sessionStorage.setItem(LOADER_KEY, "1");

    const timer = setTimeout(() => {
      setVisible(false);
    }, 1600);

    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-loader"
          variants={containerVariants}
          exit="exit"
          aria-hidden
        >
          <div className="intro-loader-grid">
            {outlineShapes.map((shape, i) => (
              <motion.span
                key={i}
                variants={shapeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={i}
                style={{ display: "inline-flex" }}
              >
                {shape.type === "square" && <OutlineSquare color={shape.color} size={shape.size} />}
                {shape.type === "circle" && <OutlineCircle color={shape.color} size={shape.size} />}
                {shape.type === "triangle" && <OutlineTriangle color={shape.color} size={shape.size} />}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
