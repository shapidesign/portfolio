"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

function getTimeBasedTheme(): Theme {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 18 ? "light" : "dark";
}

function isDaytime(): boolean {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 18;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window === "undefined" ? "light" : getTimeBasedTheme()
  );
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasConfirmedThisSession, setHasConfirmedThisSession] = useState(false);
  const iconRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.removeItem("theme");
      localStorage.removeItem("theme-manual");
    } catch {}

    const frameId = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!showConfirm) return;
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowConfirm(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showConfirm]);

  const animateIcon = useCallback(() => {
    const svg = iconRef.current;
    if (svg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      svg.style.transition = "none";
      svg.style.transform = "rotate(0deg) scale(0.7)";
      requestAnimationFrame(() => {
        svg.style.transition = "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)";
        svg.style.transform = "rotate(360deg) scale(1)";
      });
    }
  }, []);

  function applyTheme(next: Theme) {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    animateIcon();
  }

  function handleClick() {
    if (hasConfirmedThisSession) {
      applyTheme(theme === "light" ? "dark" : "light");
    } else {
      setShowConfirm(true);
    }
  }

  function handleConfirm() {
    const next: Theme = theme === "light" ? "dark" : "light";
    applyTheme(next);
    setHasConfirmedThisSession(true);
    setShowConfirm(false);
  }

  function handleCancel() {
    setShowConfirm(false);
  }

  if (!mounted) return <div style={{ width: 36, height: 36 }} />;

  const daytime = isDaytime();
  const nextMode = theme === "light" ? "dark" : "light";
  const confirmText = daytime
    ? `It\u2019s daytime \u2014 switch to dark mode?`
    : `It\u2019s nighttime \u2014 switch to light mode?`;

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button
        className="theme-toggle"
        type="button"
        onClick={handleClick}
        aria-label={`Switch to ${nextMode} mode`}
      >
        {theme === "light" ? (
          <svg ref={iconRef} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg ref={iconRef} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </button>

      {showConfirm && (
        <div className="theme-confirm" role="dialog" aria-label="Confirm theme change">
          <p className="theme-confirm-text">{confirmText}</p>
          <div className="theme-confirm-actions">
            <button type="button" className="theme-confirm-yes" onClick={handleConfirm}>
              Yes
            </button>
            <button type="button" className="theme-confirm-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
