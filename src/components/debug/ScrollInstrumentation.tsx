"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// #region agent log
function debugLog(
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown>
) {
  const body = JSON.stringify({
    sessionId: "d9a24e",
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
    runId: "post-fix-3",
  });
  fetch("http://127.0.0.1:7792/ingest/f5c509ac-bd89-485d-a916-848b059aa870", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "d9a24e",
    },
    body,
  }).catch(() => {});
  fetch("/api/debug-session-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).catch(() => {});
}
// #endregion

/**
 * Temporary debug instrumentation for scroll jank (session d9a24e).
 */
export function ScrollInstrumentation() {
  const pathname = usePathname();
  const navPrevRef = useRef<string | null>(null);

  // H-A: large single-step scroll deltas (smooth scroll, restoration, snap)
  useEffect(() => {
    let lastY = window.scrollY;
    let lastSh = document.documentElement.scrollHeight;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      const sh = document.documentElement.scrollHeight;
      const dSh = sh - lastSh;
      lastY = y;
      lastSh = sh;
      if (Math.abs(dy) > 18 || Math.abs(dSh) > 2) {
        // #region agent log
        debugLog("A", "ScrollInstrumentation.tsx:scroll", "scroll-or-layout", {
          scrollY: y,
          deltaY: dy,
          scrollHeight: sh,
          scrollHeightDelta: dSh,
          innerHeight: window.innerHeight,
        });
        // #endregion
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // H-B: document height changes without user scroll (Reveal, images, route)
  useEffect(() => {
    let lastSh = document.documentElement.scrollHeight;
    const ro = new ResizeObserver(() => {
      const sh = document.documentElement.scrollHeight;
      if (sh === lastSh) return;
      // #region agent log
      debugLog("B", "ScrollInstrumentation.tsx:resizeObserver", "doc-scrollheight-change", {
        scrollHeight: sh,
        delta: sh - lastSh,
        scrollY: window.scrollY,
        innerHeight: window.innerHeight,
      });
      // #endregion
      lastSh = sh;
    });
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  // H-C: navigation vs scroll position after paint
  useEffect(() => {
    if (navPrevRef.current === null) {
      navPrevRef.current = pathname;
      return;
    }
    if (navPrevRef.current === pathname) return;
    const from = navPrevRef.current;
    navPrevRef.current = pathname;
    // #region agent log
    debugLog("C", "ScrollInstrumentation.tsx:nav", "pathname-change", {
      from,
      to: pathname,
      scrollY: window.scrollY,
      scrollHeight: document.documentElement.scrollHeight,
    });
    // #endregion
    requestAnimationFrame(() => {
      // #region agent log
      debugLog("C", "ScrollInstrumentation.tsx:nav-raf1", "after-raf1", {
        scrollY: window.scrollY,
      });
      // #endregion
      requestAnimationFrame(() => {
        // #region agent log
        debugLog("C", "ScrollInstrumentation.tsx:nav-raf2", "after-raf2", {
          scrollY: window.scrollY,
        });
        // #endregion
      });
    });
  }, [pathname]);

  // H-D: viewport chrome / orientation (dvh jumps)
  useEffect(() => {
    let lastIh = window.innerHeight;
    const onResize = () => {
      const ih = window.innerHeight;
      if (ih === lastIh) return;
      // #region agent log
      debugLog("D", "ScrollInstrumentation.tsx:window-resize", "inner-height-change", {
        innerHeight: ih,
        delta: ih - lastIh,
        scrollY: window.scrollY,
        visualViewportHeight: window.visualViewport?.height,
      });
      // #endregion
      lastIh = ih;
    };
    window.addEventListener("resize", onResize, { passive: true });
    const vv = window.visualViewport;
    let lastVvh = vv?.height;
    let lastVvTop = vv?.offsetTop;
    const onVv = () => {
      const h = vv?.height;
      const t = vv?.offsetTop;
      if (h === lastVvh && t === lastVvTop) return;
      lastVvh = h;
      lastVvTop = t;
      // #region agent log
      debugLog("D", "ScrollInstrumentation.tsx:vv-resize", "visual-viewport-change", {
        visualViewportHeight: h,
        visualViewportOffsetTop: t,
        scrollY: window.scrollY,
        innerHeight: window.innerHeight,
      });
      // #endregion
    };
    vv?.addEventListener("resize", onVv);
    vv?.addEventListener("scroll", onVv);
    return () => {
      window.removeEventListener("resize", onResize);
      vv?.removeEventListener("resize", onVv);
      vv?.removeEventListener("scroll", onVv);
    };
  }, []);

  // H-E: hash / history navigation (smooth scroll on html)
  useEffect(() => {
    const onHash = () => {
      // #region agent log
      debugLog("E", "ScrollInstrumentation.tsx:hashchange", "hashchange", {
        hash: window.location.hash,
        scrollY: window.scrollY,
      });
      // #endregion
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return null;
}
