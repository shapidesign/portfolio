"use client";

import { useEffect, useRef, RefObject } from "react";

export function useAnimeButton(): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    el.style.transition = "transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1)";

    const onEnter = () => {
      el.style.transform = "scale(1.06)";
    };

    const onLeave = () => {
      el.style.transform = "scale(1)";
    };

    const onDown = () => {
      el.style.transition = "transform 120ms ease-in";
      el.style.transform = "scale(0.94)";
    };

    const onUp = () => {
      el.style.transition = "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.style.transform = "scale(1.06)";
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
    };
  }, []);

  return ref;
}
