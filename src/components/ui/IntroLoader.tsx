"use client";

import { useEffect, useState, useCallback } from "react";
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

const STAR_PATH =
  "M16.1348 3.41309C19.1227 -1.13732 25.8401 -1.13732 28.8281 3.41309L28.5186 10.1064C29.534 11.6529 31.0958 12.7732 32.8877 13.2334L39.4678 10.8838C44.6726 12.2206 46.7028 18.5295 43.2549 22.6514L36.6475 24.4316C35.4529 25.8598 34.8488 27.697 34.958 29.5557L39.1621 34.7588C39.4765 40.1103 34.1666 44.03 29.1572 42.1211L25.1846 36.4492C23.4435 35.7858 21.5193 35.7858 19.7783 36.4492L15.8057 42.1211C10.7963 44.03 5.48741 40.1103 5.80176 34.7588L10.0049 29.5557C10.1141 27.6969 9.51001 25.8598 8.31543 24.4316L1.70801 22.6514C-1.73991 18.5295 0.290269 12.2206 5.49512 10.8838L12.0752 13.2334C13.8671 12.7732 15.4289 11.6529 16.4443 10.1064L16.1348 3.41309Z";

const outlineShapes = [
  { color: "var(--color-primary)", size: 56 },
  { color: "var(--color-accent-blue)", size: 56 },
  { color: "var(--color-accent-green)", size: 56 }
];

function OutlineStar({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 45 43" fill="none">
      <path d={STAR_PATH} stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export function IntroLoader() {
  const [visible, setVisible] = useState(shouldShowLoader);

  const dismiss = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (!visible) return;
    window.sessionStorage.setItem(LOADER_KEY, "1");

    const timer = setTimeout(dismiss, 1000);

    return () => clearTimeout(timer);
  }, [visible, dismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-loader"
          variants={containerVariants}
          exit="exit"
          aria-hidden
          onClick={dismiss}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") dismiss(); }}
          role="presentation"
          style={{ cursor: "pointer" }}
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
                <OutlineStar color={shape.color} size={shape.size} />
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
