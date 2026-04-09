"use client";

import { useEffect, useRef } from "react";

type ProjectHeroImageProps = {
  src: string;
  alt: string;
};

export function ProjectHeroImage({ src, alt }: ProjectHeroImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = image.getBoundingClientRect();
      const offset = Math.max(-120, Math.min(120, -rect.top * 0.15));
      image.style.transform = `translateY(${offset}px) scale(1.03)`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="project-hero-media">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imageRef} src={src} alt={alt} className="project-hero-image" loading="eager" decoding="async" />
    </div>
  );
}
