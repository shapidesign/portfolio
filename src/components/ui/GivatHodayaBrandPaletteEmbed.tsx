"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

type Swatch = {
  id: string;
  name: { en: string; he: string };
  hex: string;
  rgb: string;
  cmyk: string;
  pantone?: string;
  /** Text color that keeps contrast on top of the swatch. */
  ink: string;
  /** Subtle inner border for light swatches. */
  bordered?: boolean;
};

const SWATCHES: Swatch[] = [
  {
    id: "orange",
    name: { en: "Orange", he: "כתום" },
    hex: "#F4902D",
    rgb: "R 244  G 144  B 45",
    cmyk: "C 0%  M 52%  Y 87%  K 0%",
    pantone: "Pantone P 20-8-C · 715 C",
    ink: "#101313",
  },
  {
    id: "black",
    name: { en: "Black", he: "שחור" },
    hex: "#101313",
    rgb: "R 16  G 19  B 19",
    cmyk: "C 84%  M 73%  Y 68%  K 86%",
    ink: "#FBF8F2",
  },
  {
    id: "white",
    name: { en: "White", he: "לבן" },
    hex: "#FBF8F2",
    rgb: "R 251  G 248  B 242",
    cmyk: "C 2%  M 5%  Y 5%  K 0%",
    ink: "#101313",
    bordered: true,
  },
];

export function GivatHodayaBrandPaletteEmbed() {
  const { isHebrew } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (inView) return;
    const el = sectionRef.current;
    if (!el) return;

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            io?.disconnect();
            setInView(true);
          }
        },
        { threshold: 0.25 },
      );
      io.observe(el);
    }

    // Safety net so the palette is never left invisible.
    const timer = setTimeout(() => setInView(true), 1500);
    return () => {
      io?.disconnect();
      clearTimeout(timer);
    };
  }, [inView]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const copyHex = async (swatch: Swatch) => {
    try {
      await navigator.clipboard.writeText(swatch.hex);
      setCopiedId(swatch.id);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopiedId(null), 1600);
    } catch {
      // Clipboard unavailable — the value is still visible as text.
    }
  };

  const screenLabel = isHebrew ? "שימוש במסכים" : "Screen";
  const printLabel = isHebrew ? "שימוש לדפוס" : "Print";
  const heading = isHebrew ? "צבעי המותג" : "Brand Colors";
  const copiedLabel = isHebrew ? "הועתק!" : "Copied!";

  return (
    <section
      ref={sectionRef}
      className={`gh-palette${inView ? " gh-palette--in" : ""}`}
      dir={isHebrew ? "rtl" : "ltr"}
      aria-label={heading}
    >
      <h2 className="gh-palette-heading">{heading}</h2>
      <div className="gh-palette-stack">
        {SWATCHES.map((swatch, index) => (
          <div
            key={swatch.id}
            className={`gh-palette-row${swatch.bordered ? " gh-palette-row--bordered" : ""}`}
            style={
              {
                "--gh-swatch": swatch.hex,
                "--gh-ink": swatch.ink,
                "--gh-delay": `${index * 140}ms`,
                "--gh-origin": isHebrew ? "right" : "left",
              } as React.CSSProperties
            }
          >
            <span className="gh-palette-fill" aria-hidden="true" />
            <div className="gh-palette-content">
              <p className="gh-palette-name">{isHebrew ? swatch.name.he : swatch.name.en}</p>
              <dl className="gh-palette-specs">
                <div className="gh-palette-spec">
                  <dt>{screenLabel}</dt>
                  <dd>
                    <button
                      type="button"
                      className="gh-palette-hex"
                      onClick={() => copyHex(swatch)}
                      aria-label={
                        isHebrew
                          ? `העתקת ערך הצבע ${swatch.hex}`
                          : `Copy color value ${swatch.hex}`
                      }
                    >
                      {copiedId === swatch.id ? copiedLabel : swatch.hex}
                    </button>
                    <span className="gh-palette-value">{swatch.rgb}</span>
                  </dd>
                </div>
                <div className="gh-palette-spec">
                  <dt>{printLabel}</dt>
                  <dd>
                    <span className="gh-palette-value">{swatch.cmyk}</span>
                    {swatch.pantone && (
                      <span className="gh-palette-value">{swatch.pantone}</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
      <span className="gh-palette-live" aria-live="polite">
        {copiedId ? copiedLabel : ""}
      </span>
    </section>
  );
}
