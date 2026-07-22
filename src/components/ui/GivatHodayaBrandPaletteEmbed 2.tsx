"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const BRAND_COLORS = [
  {
    hex: "#F4902D",
    nameEn: "Orange",
    nameHe: "כתום",
    textColor: "#101313",
  },
  {
    hex: "#101313",
    nameEn: "Black",
    nameHe: "שחור",
    textColor: "#FBF8F2",
  },
  {
    hex: "#FBF8F2",
    nameEn: "White",
    nameHe: "לבן",
    textColor: "#101313",
  },
] as const;

export function GivatHodayaBrandPaletteEmbed() {
  const { isHebrew } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`givat-brand-palette${isVisible ? " givat-brand-palette--visible" : ""}`}
      aria-label={isHebrew ? "מדריך צבעי המותג של גבעת הודיה" : "Givat Hodaya brand color guidelines"}
      role="img"
    >
      {BRAND_COLORS.map((color, index) => (
        <div
          key={color.hex}
          className="givat-brand-palette-band"
          style={
            {
              "--band-color": color.hex,
              "--band-text": color.textColor,
              "--band-index": index,
            } as React.CSSProperties
          }
        >
          <div className="givat-brand-palette-band-fill" />
          <div className="givat-brand-palette-band-meta">
            <span className="givat-brand-palette-hex">{color.hex}</span>
            <span className="givat-brand-palette-name">
              {isHebrew ? color.nameHe : color.nameEn}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
