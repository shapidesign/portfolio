"use client";

import { useCallback, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const labelRef = useRef<HTMLSpanElement>(null);

  const animateLabel = useCallback(() => {
    const el = labelRef.current;
    if (el && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transition = "none";
      el.style.transform = "rotate(0deg) scale(0.7)";
      el.style.opacity = "0.4";
      requestAnimationFrame(() => {
        el.style.transition =
          "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease";
        el.style.transform = "rotate(360deg) scale(1)";
        el.style.opacity = "1";
      });
    }
  }, []);

  function handleClick() {
    const next = lang === "en" ? "he" : "en";
    setLang(next);
    animateLabel();
  }

  const label = lang === "en" ? "EN" : "\u05e2\u05d1";
  const ariaLabel =
    lang === "en" ? "Switch to Hebrew" : "Switch to English";

  return (
    <button
      className="lang-toggle"
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      <span ref={labelRef} className="lang-toggle-label">
        {label}
      </span>
    </button>
  );
}
