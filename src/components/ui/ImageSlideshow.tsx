"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

interface ImageSlideshowProps {
  images: string[];
  interval?: number;
}

export function ImageSlideshow({ images, interval = 3500 }: ImageSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (images.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [images.length, interval]);

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          className="work-card-img"
          loading={i === 0 ? "eager" : "lazy"}
          sizes="(max-width: 900px) 100vw, 50vw"
          style={{
            opacity: i === current ? 1 : 0,
            transition: "opacity 800ms ease",
            zIndex: i === current ? 1 : 0,
          }}
        />
      ))}
    </>
  );
}
