"use client";

import { useRef, useState, useCallback, useEffect } from "react";

type ImageCarouselProps = {
  images: string[];
  alt: string;
};

const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i;

function isImageUrl(url: string): boolean {
  if (IMAGE_EXTENSIONS.test(url)) return true;
  if (url.includes("prod-files-secure.s3.us-west-2.amazonaws.com")) return false;
  return true;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const filteredImages = images.filter(isImageUrl);
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const count = filteredImages.length;

  const scrollTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(index, count - 1));
      const slide = track.children[clamped] as HTMLElement | undefined;
      if (slide) {
        slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
      setCurrent(clamped);
    },
    [count]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Array.from(track.children).indexOf(entry.target as HTMLElement);
            if (idx >= 0) setCurrent(idx);
          }
        }
      },
      { root: track, threshold: 0.6 }
    );

    Array.from(track.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [filteredImages.length]);

  if (count === 0) return null;

  return (
    <div className="image-carousel">
      <div className="carousel-track" ref={trackRef}>
        {filteredImages.map((src, i) => (
          <div key={src} className="carousel-slide">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${alt} — image ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            className="carousel-btn carousel-btn-prev"
            onClick={() => scrollTo(current - 1)}
            aria-label="Previous image"
            disabled={current === 0}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="carousel-btn carousel-btn-next"
            onClick={() => scrollTo(current + 1)}
            aria-label="Next image"
            disabled={current === count - 1}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="carousel-dots" role="tablist" aria-label="Image navigation">
            {filteredImages.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === current ? "active" : ""}`}
                onClick={() => scrollTo(i)}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
