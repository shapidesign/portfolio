"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as motion from "motion/react-client";
import { useMotionValue, useTransform, useSpring } from "motion/react";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay: i * 0.4,
        type: "spring" as const,
        duration: 1.8,
        bounce: 0
      },
      opacity: { delay: i * 0.4, duration: 0.01 }
    }
  })
};

export function HeroShapes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const rotateX = useTransform(smoothY, [-1, 1], [3, -3]);
  const rotateY = useTransform(smoothX, [-1, 1], [-3, 3]);

  const shiftX1 = useTransform(smoothX, [-1, 1], [-6, 6]);
  const shiftY1 = useTransform(smoothY, [-1, 1], [-6, 6]);
  const shiftX2 = useTransform(smoothX, [-1, 1], [4, -4]);
  const shiftY2 = useTransform(smoothY, [-1, 1], [4, -4]);
  const shiftX3 = useTransform(smoothX, [-1, 1], [-8, 8]);
  const shiftY3 = useTransform(smoothY, [-1, 1], [-3, 3]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseX.set(nx);
      mouseY.set(ny);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const strokeColors = {
    primary: "var(--color-primary)",
    secondary: "var(--color-secondary)",
    blue: "var(--color-accent-blue)",
    green: "var(--color-accent-green)",
    white: "var(--color-accent-white)"
  };

  return (
    <div
      className="hero-art"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden
      style={{ display: "grid", placeItems: "center", padding: 0 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          perspective: 800,
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center"
        }}
      >
        <motion.svg
          viewBox="0 0 400 400"
          width="100%"
          height="100%"
          style={{ maxWidth: 380, maxHeight: 380 }}
          initial={reducedMotion ? "visible" : "hidden"}
          animate="visible"
        >
          {/* Large circle */}
          <motion.circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke={strokeColors.primary}
            strokeWidth="2"
            variants={draw}
            custom={0}
            style={{ translateX: shiftX1, translateY: shiftY1 }}
          />

          {/* Quarter arc top-right */}
          <motion.path
            d="M 200 50 A 150 150 0 0 1 350 200"
            fill="none"
            stroke={strokeColors.blue}
            strokeWidth="2"
            strokeLinecap="round"
            variants={draw}
            custom={1}
            style={{ translateX: shiftX2, translateY: shiftY2 }}
          />

          {/* Diagonal line */}
          <motion.line
            x1="80"
            y1="320"
            x2="320"
            y2="80"
            stroke={strokeColors.secondary}
            strokeWidth="2"
            strokeLinecap="round"
            variants={draw}
            custom={2}
            style={{ translateX: shiftX3, translateY: shiftY3 }}
          />

          {/* Inner square, rotated 45deg */}
          <motion.rect
            x="140"
            y="140"
            width="120"
            height="120"
            fill="none"
            stroke={strokeColors.green}
            strokeWidth="2"
            transform="rotate(45 200 200)"
            variants={draw}
            custom={3}
            style={{ translateX: shiftX2, translateY: shiftY1 }}
          />

          {/* Small circle accent */}
          <motion.circle
            cx="200"
            cy="200"
            r="40"
            fill="none"
            stroke={strokeColors.white}
            strokeWidth="1.5"
            variants={draw}
            custom={4}
            style={{ translateX: shiftX1, translateY: shiftY3 }}
          />

          {/* Bottom arc */}
          <motion.path
            d="M 50 200 A 150 150 0 0 1 200 350"
            fill="none"
            stroke={strokeColors.primary}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={0.5}
            variants={draw}
            custom={5}
            style={{ translateX: shiftX3, translateY: shiftY2 }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
}
