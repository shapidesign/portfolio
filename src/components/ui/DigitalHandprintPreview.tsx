"use client";

import { useEffect, useRef } from "react";

interface Point { x: number; y: number }

interface ParsedData {
  points: Point[];
  ids: number[];
  totalStrokes: number;
}

const DATES = [
  "2026-02-07", "2026-02-08", "2026-02-09", "2026-02-10", "2026-02-11",
  "2026-02-12", "2026-02-13", "2026-02-14", "2026-02-16", "2026-02-17",
  "2026-02-18", "2026-02-19", "2026-02-21", "2026-02-22", "2026-02-23",
  "2026-02-24", "2026-02-25", "2026-02-26", "2026-02-27", "2026-03-02",
  "2026-03-03", "2026-03-04", "2026-03-08", "2026-03-09", "2026-03-10",
  "2026-03-11", "2026-03-12", "2026-03-13",
];

const COLORS = ["#FFD700", "#FF4500", "#1E90FF", "#32CD32"];

function parseFile(text: string, w: number, h: number): ParsedData {
  const lines = text.split("\n");
  const points: Point[] = [];
  const ids: number[] = [];
  let totalStrokes = 0;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let lastId = -1;

  for (const line of lines) {
    const parts = line.split(",");
    if (parts.length >= 4) {
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      const id = parseInt(parts[3]);
      if (!isNaN(x) && !isNaN(y)) {
        points.push({ x, y });
        ids.push(id);
        if (id !== lastId) { totalStrokes++; lastId = id; }
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const dataW = maxX - minX || 1;
  const dataH = maxY - minY || 1;
  const padding = 30;
  const scale = Math.min((w - padding * 2) / dataW, (h - padding * 2) / dataH);
  const cx = minX + dataW / 2;
  const cy = minY + dataH / 2;

  for (const p of points) {
    p.x = (p.x - cx) * scale + w / 2;
    p.y = (p.y - cy) * scale + h / 2;
  }

  return { points, ids, totalStrokes };
}

function drawSegment(
  ctx: CanvasRenderingContext2D,
  data: ParsedData,
  i: number,
  size: number,
) {
  if (i < 1 || i >= data.points.length - 2) return;
  const p0 = data.points[i - 1];
  const p1 = data.points[i];
  const p2 = data.points[i + 1];
  const p3 = data.points[i + 2];
  if (data.ids[i] !== data.ids[i + 1]) return;

  const col = COLORS[data.ids[i] % COLORS.length];

  const steps = 4;
  for (let st = 0; st < steps; st++) {
    const t = st / steps;
    const t1 = (st + 1) / steps;
    const t2a = t * t, t3a = t * t * t;
    const t2b = t1 * t1, t3b = t1 * t1 * t1;

    const ax = 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2a + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3a);
    const ay = 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2a + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3a);
    const bx = 0.5 * (2 * p1.x + (-p0.x + p2.x) * t1 + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2b + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3b);
    const by = 0.5 * (2 * p1.y + (-p0.y + p2.y) * t1 + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2b + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3b);

    const speed = Math.hypot(bx - ax, by - ay);
    const dynamicW = Math.max(size * 0.2, size * (1 - Math.min(speed, 60) / 70));
    const dist = Math.hypot(bx - ax, by - ay);
    const stepSize = Math.max(0.5, dynamicW * 0.2);
    const count = Math.ceil(dist / stepSize);

    ctx.fillStyle = col;
    for (let s = 0; s <= count; s++) {
      const frac = s / count;
      const x = ax + (bx - ax) * frac;
      const y = ay + (by - ay) * frac;
      ctx.beginPath();
      ctx.arc(x, y, dynamicW / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function DigitalHandprintPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ rafId: 0, aborted: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;
    s.aborted = false;

    let W = canvas.parentElement?.clientWidth ?? 400;
    let H = canvas.parentElement?.clientHeight ?? 300;
    canvas.width = W;
    canvas.height = H;

    async function runLoop() {
      while (!s.aborted) {
        const date = DATES[Math.floor(Math.random() * DATES.length)];
        let data: ParsedData;
        try {
          const res = await fetch(`/assets/cursor-art/${date}.txt`);
          const text = await res.text();
          if (s.aborted) return;
          W = canvas!.parentElement?.clientWidth ?? W;
          H = canvas!.parentElement?.clientHeight ?? H;
          canvas!.width = W;
          canvas!.height = H;
          data = parseFile(text, W, H);
        } catch {
          return;
        }
        if (data.points.length < 4) continue;

        ctx!.clearRect(0, 0, W, H);
        let idx = 1;
        const speed = 3;

        await new Promise<void>((resolve) => {
          function tick() {
            if (s.aborted) { resolve(); return; }
            if (!ctx) { resolve(); return; }

            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = "rgba(0,0,0,0.03)";
            ctx.fillRect(0, 0, W, H);
            ctx.globalCompositeOperation = "source-over";

            for (let i = 0; i < speed; i++) {
              if (idx >= data.points.length - 2) {
                resolve();
                return;
              }
              drawSegment(ctx, data, idx, 2.5);
              idx++;
            }
            s.rafId = requestAnimationFrame(tick);
          }
          s.rafId = requestAnimationFrame(tick);
        });

        if (s.aborted) return;
        await new Promise((r) => setTimeout(r, 1200));
      }
    }

    runLoop();

    return () => {
      s.aborted = true;
      cancelAnimationFrame(s.rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="work-card-preview-canvas"
      aria-hidden="true"
    />
  );
}
