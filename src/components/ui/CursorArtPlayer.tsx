"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Point {
  x: number;
  y: number;
}

interface ParsedData {
  points: Point[];
  times: number[];
  ids: number[];
  totalStrokes: number;
}

const SQUIGGLE_COLORS = ["#FFD700", "#FF4500", "#1E90FF", "#32CD32"];
const SPEED = 1;
const SIZE = 3;
const OPACITY = 1.0;
const TRAIL_ALPHA = 0.05;

function getThemeColor(id: number): string {
  return SQUIGGLE_COLORS[id % SQUIGGLE_COLORS.length];
}

function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function parseFile(text: string, w: number, h: number): ParsedData {
  const lines = text.split("\n");
  const points: Point[] = [];
  const times: number[] = [];
  const ids: number[] = [];
  let totalStrokes = 0;
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  let lastId = -1;

  for (const line of lines) {
    const parts = line.split(",");
    if (parts.length >= 4) {
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      const t = parseInt(parts[2]);
      const id = parseInt(parts[3]);

      if (!isNaN(x) && !isNaN(y)) {
        points.push({ x, y });
        times.push(t);
        ids.push(id);

        if (id !== lastId) {
          totalStrokes++;
          lastId = id;
        }

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const dataW = maxX - minX || 1;
  const dataH = maxY - minY || 1;
  const padding = 50;
  const scale = Math.min((w - padding * 2) / dataW, (h - padding * 2) / dataH);
  const centerX = minX + dataW / 2;
  const centerY = minY + dataH / 2;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    p.x = (p.x - centerX) * scale + w / 2;
    p.y = (p.y - centerY) * scale + h / 2;
  }

  return { points, times, ids, totalStrokes };
}

function drawPollock(
  ctx: CanvasRenderingContext2D,
  p1: Point,
  p2: Point,
  speed: number,
  id: number,
  alphaMult: number = 1
) {
  const col = getThemeColor(id);
  const baseSize = SIZE;
  const dynamicW = Math.max(baseSize * 0.2, baseSize * (1 - Math.min(speed, 60) / 70));
  const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const stepSize = Math.max(0.5, dynamicW * 0.2);
  const steps = Math.ceil(dist / stepSize);

  ctx.fillStyle = hexToRGBA(col, OPACITY * alphaMult);

  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const x = p1.x + (p2.x - p1.x) * t;
    const y = p1.y + (p2.y - p1.y) * t;
    ctx.beginPath();
    ctx.arc(x, y, dynamicW / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderSegment(
  ctx: CanvasRenderingContext2D,
  data: ParsedData,
  i: number,
  alphaMult: number = 1
) {
  if (i < 0 || i >= data.points.length - 2) return;

  const p0 = data.points[i > 0 ? i - 1 : i];
  const p1 = data.points[i];
  const p2 = data.points[i + 1];
  const p3 = data.points[i + 2];

  const id1 = data.ids[i];
  const id2 = data.ids[i + 1];

  if (id1 === id2) {
    const steps = 5;
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t1 = (s + 1) / steps;
      const t2a = t * t,
        t3a = t * t * t;
      const t2b = t1 * t1,
        t3b = t1 * t1 * t1;

      const ax =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2a +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3a);
      const ay =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2a +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3a);
      const bx =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t1 +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2b +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3b);
      const by =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * t1 +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2b +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3b);

      const segSpeed = Math.hypot(bx - ax, by - ay);
      drawPollock(ctx, { x: ax, y: ay }, { x: bx, y: by }, segSpeed, id1, alphaMult);
    }
  }
}

export function CursorArtPlayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    playing: false,
    playbackIndex: 0,
    currentStroke: 0,
    data: null as ParsedData | null,
    rafId: 0
  });
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push("/work/thoughtful-design");
  }, [router]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = container.clientWidth;
    let H = container.clientHeight;
    canvas.width = W;
    canvas.height = H;

    const state = stateRef.current;

    function resetCanvas() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      state.playbackIndex = 0;
      state.currentStroke = 0;
    }

    function animate() {
      if (!ctx || !state.data) return;

      if (!state.playing || state.data.points.length < 4) {
        state.rafId = requestAnimationFrame(animate);
        return;
      }

      // Trail fade
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_ALPHA})`;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < SPEED; i++) {
        if (state.playbackIndex >= state.data.points.length - 3) {
          // Loop: reset and continue
          resetCanvas();
          continue;
        }

        const idx = state.playbackIndex;
        const id1 = state.data.ids[idx];

        if (idx === 0 || state.data.ids[idx - 1] !== id1) {
          state.currentStroke++;
        }

        renderSegment(ctx, state.data, idx);
        state.playbackIndex++;
      }

      // Counter display
      if (counterRef.current && state.data) {
        const disp = Math.min(state.currentStroke, state.data.totalStrokes);
        counterRef.current.textContent = `${disp} / ${state.data.totalStrokes}`;
      }

      state.rafId = requestAnimationFrame(animate);
    }

    async function loadData() {
      try {
        const res = await fetch("/assets/cursor-art-2026-02-16.txt");
        const text = await res.text();

        W = container!.clientWidth;
        H = container!.clientHeight;
        canvas!.width = W;
        canvas!.height = H;

        state.data = parseFile(text, W, H);
        resetCanvas();

        if (!reducedMotion) {
          state.playing = true;
          state.rafId = requestAnimationFrame(animate);
        } else {
          // For reduced motion: draw all segments at once (static)
          if (state.data) {
            for (let i = 0; i < state.data.points.length - 3; i++) {
              renderSegment(ctx!, state.data, i);
            }
            if (counterRef.current) {
              counterRef.current.textContent = `${state.data.totalStrokes} / ${state.data.totalStrokes}`;
            }
          }
        }
      } catch (err) {
        console.error("Failed to load cursor-art data:", err);
      }
    }

    loadData();

    const handleResize = () => {
      if (!container || !canvas || !ctx) return;
      W = container.clientWidth;
      H = container.clientHeight;
      canvas.width = W;
      canvas.height = H;

      if (state.data) {
        // Re-fetch and re-parse to re-normalize coordinates
        fetch("/assets/cursor-art-2026-02-16.txt")
          .then((res) => res.text())
          .then((text) => {
            state.data = parseFile(text, W, H);
            resetCanvas();
          });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      state.playing = false;
      cancelAnimationFrame(state.rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="hero-art"
      ref={containerRef}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="View Thoughtful Design project"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0
        }}
      />
      <div
        ref={counterRef}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          fontSize: 14,
          fontFamily: "monospace",
          color: "#888",
          pointerEvents: "none",
          zIndex: 3
        }}
      />
    </div>
  );
}
