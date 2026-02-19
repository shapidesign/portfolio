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
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
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

  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxSrc(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxSrc]);

  if (count === 0) return null;

  return (
    <>
      <div className="image-carousel">
        <div className="carousel-track" ref={trackRef}>
          {filteredImages.map((src, i) => (
            <div key={src} className="carousel-slide">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${alt} — image ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                onClick={() => setLightboxSrc(src)}
              />
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

      {lightboxSrc && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged image"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="lightbox-close"
            onClick={() => setLightboxSrc(null)}
            aria-label="Close enlarged image"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxSrc}
            alt={alt}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
