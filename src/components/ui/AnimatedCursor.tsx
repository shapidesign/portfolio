"use client";

import { useEffect, useRef } from "react";

export function AnimatedCursor() {
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("custom-cursor-enabled");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let hovering = false;
    let rafId = 0;

    const interactiveSelector =
      "a, button, input, textarea, select, [role='button'], .project-card, .menu-button";

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const onOver = (event: Event) => {
      const target = event.target;
      if (target instanceof Element) {
        hovering = Boolean(target.closest(interactiveSelector));
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${hovering ? 1.65 : 1})`;
      dot.classList.toggle("hover", hovering);
      rafId = window.requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver, true);
    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver, true);
      document.body.classList.remove("custom-cursor-enabled");
    };
  }, []);

  return (
    <>
      <span className="cursor-dot" ref={dotRef} aria-hidden />
      <span className="cursor-ring" ref={ringRef} aria-hidden />
    </>
  );
}
