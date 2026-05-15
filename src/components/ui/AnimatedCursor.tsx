"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnimatedCursor() {
  const pathname = usePathname();
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // The solar homepage uses native pointer feedback; the custom cursor would
    // fight the canvas hover state and is heavy to maintain at 60fps.
    if (pathname === "/") return;
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
    let textHovering = false;
    let rafId = 0;

    const interactiveSelector =
      "a, button, input, textarea, select, [role='button'], .project-card, .menu-button";
    const textHoverSelector =
      "p.lead, p.subtitle, p.project-narrative-copy, p.project-opener-line, p.project-card-descriptor, .next-project-copy p, p.contact-availability, p.form-sent-copy";

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const onOver = (event: Event) => {
      const target = event.target;
      if (target instanceof Element) {
        hovering = Boolean(target.closest(interactiveSelector));
        textHovering = Boolean(target.closest(textHoverSelector));
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${hovering ? 1.65 : 1})`;
      dot.classList.toggle("hover", hovering);
      ring.classList.toggle("hover", hovering);
      dot.classList.toggle("text", textHovering);
      ring.classList.toggle("text", textHovering);
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
  }, [pathname]);

  if (pathname === "/") return null;

  return (
    <>
      <span className="cursor-dot" ref={dotRef} aria-hidden />
      <span className="cursor-ring" ref={ringRef} aria-hidden />
    </>
  );
}
