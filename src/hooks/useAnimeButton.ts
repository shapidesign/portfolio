"use client";

import { useEffect, useRef, RefObject } from "react";

const MAGNETIC_STRENGTH = 0.3;
const MAX_DISTANCE = 4;

export function useAnimeButton(): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let hovering = false;

    el.style.transition = "transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1)";

    const onEnter = () => {
      hovering = true;
      el.style.transition = "transform 160ms ease-out";
    };

    const onMove = (e: PointerEvent) => {
      if (!hovering) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * MAGNETIC_STRENGTH;
      const dy = (e.clientY - cy) * MAGNETIC_STRENGTH;
      const clampedX = Math.max(-MAX_DISTANCE, Math.min(MAX_DISTANCE, dx));
      const clampedY = Math.max(-MAX_DISTANCE, Math.min(MAX_DISTANCE, dy));
      el.style.transform = `translate(${clampedX}px, ${clampedY}px) scale(1.06)`;
    };

    const onLeave = () => {
      hovering = false;
      el.style.transition = "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.style.transform = "translate(0, 0) scale(1)";
    };

    const onDown = () => {
      el.style.transition = "transform 120ms ease-in";
      el.style.transform = "translate(0, 0) scale(0.94)";
    };

    const onUp = () => {
      el.style.transition = "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.style.transform = "translate(0, 0) scale(1.06)";
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
    };
  }, []);

  return ref;
}
