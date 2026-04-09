"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number; // ms before animation starts
  stagger?: number; // ms between each word
  inline?: boolean;
}

/**
 * Splits text into words and reveals them with a staggered animation.
 * Uses @chenglou/pretext for zero-reflow text layout metrics, ensuring
 * the IntersectionObserver trigger is accurate without forced reflows.
 */
export function WordReveal({ text, className = "", delay = 0, stagger = 60, inline = false }: WordRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(reducedMotion);

  // Split preserving <em>-style markup tokens
  const words = text.split(/(\s+)/).filter((w) => w.trim().length > 0);

  useEffect(() => {
    if (reducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          const t = window.setTimeout(() => setVisible(true), delay);
          return () => window.clearTimeout(t);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, reducedMotion]);

  if (reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      ref={containerRef}
      className={className}
      aria-label={text}
      style={{ display: inline ? "inline" : "block", overflowAnchor: "none" }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            display: "inline-block",
            overflow: visible ? "visible" : "hidden",
            verticalAlign: "bottom",
            marginInlineEnd: "0.3em",
            paddingBlock: "0.15em",
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: visible ? "translateY(0)" : "translateY(110%)",
              opacity: visible ? 1 : 0,
              transition: visible
                ? `transform 550ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * stagger}ms, opacity 400ms ease ${delay + i * stagger}ms`
                : "none",
              willChange: "transform",
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
