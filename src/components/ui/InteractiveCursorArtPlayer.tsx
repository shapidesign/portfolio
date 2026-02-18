"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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

const DATES = [
  "2026-02-07",
  "2026-02-08",
  "2026-02-09",
  "2026-02-10",
  "2026-02-11",
  "2026-02-12",
  "2026-02-13",
  "2026-02-14",
  "2026-02-16",
  "2026-02-17"
];

const PALETTES: Record<string, string[]> = {
  neon: ["#FFD700", "#FF4500", "#1E90FF", "#32CD32"],
  pastel: ["#F8B4C8", "#A8D8EA", "#FFD3B6", "#DCEDC1"],
  mono: ["#FFFFFF", "#CCCCCC", "#999999", "#666666"],
  warm: ["#FF6B35", "#F7C59F", "#EFEFD0", "#004E89"]
};

type BrushMode = "pollock" | "line" | "dots";

const SPEEDS = [
  { label: "0.5x", value: 1 },
  { label: "1x", value: 3 },
  { label: "2x", value: 6 },
  { label: "4x", value: 12 }
];

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
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
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
  const padding = 50;
  const scale = Math.min((w - padding * 2) / dataW, (h - padding * 2) / dataH);
  const cx = minX + dataW / 2;
  const cy = minY + dataH / 2;

  for (const p of points) {
    p.x = (p.x - cx) * scale + w / 2;
    p.y = (p.y - cy) * scale + h / 2;
  }

  return { points, times, ids, totalStrokes };
}

function drawPollock(
  ctx: CanvasRenderingContext2D,
  p1: Point, p2: Point,
  speed: number, color: string, size: number
) {
  const dynamicW = Math.max(size * 0.2, size * (1 - Math.min(speed, 60) / 70));
  const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const stepSize = Math.max(0.5, dynamicW * 0.2);
  const steps = Math.ceil(dist / stepSize);
  ctx.fillStyle = color;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const x = p1.x + (p2.x - p1.x) * t;
    const y = p1.y + (p2.y - p1.y) * t;
    ctx.beginPath();
    ctx.arc(x, y, dynamicW / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  p1: Point, p2: Point,
  color: string, size: number
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function drawDots(
  ctx: CanvasRenderingContext2D,
  p1: Point,
  color: string, size: number
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p1.x, p1.y, size * 0.8, 0, Math.PI * 2);
  ctx.fill();
}

export function InteractiveCursorArtPlayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    playing: true,
    playbackIndex: 0,
    currentStroke: 0,
    data: null as ParsedData | null,
    rafId: 0,
    speed: 3,
    brush: "pollock" as BrushMode,
    palette: "neon",
    size: 3
  });

  const [selectedDate, setSelectedDate] = useState(DATES[DATES.length - 1]);
  const [brush, setBrush] = useState<BrushMode>("pollock");
  const [palette, setPalette] = useState("neon");
  const [speedIdx, setSpeedIdx] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [strokeInfo, setStrokeInfo] = useState("");

  const getColor = useCallback((id: number) => {
    const colors = PALETTES[stateRef.current.palette] || PALETTES.neon;
    return colors[id % colors.length];
  }, []);

  const renderSegment = useCallback(
    (ctx: CanvasRenderingContext2D, data: ParsedData, i: number) => {
      if (i < 0 || i >= data.points.length - 2) return;
      const p0 = data.points[i > 0 ? i - 1 : i];
      const p1 = data.points[i];
      const p2 = data.points[i + 1];
      const p3 = data.points[i + 2];
      const id1 = data.ids[i];
      const id2 = data.ids[i + 1];
      if (id1 !== id2) return;

      const col = hexToRGBA(getColor(id1), 1);
      const s = stateRef.current;

      if (s.brush === "dots") {
        drawDots(ctx, p1, col, s.size);
        return;
      }

      const steps = 5;
      for (let st = 0; st < steps; st++) {
        const t = st / steps;
        const t1 = (st + 1) / steps;
        const t2a = t * t, t3a = t * t * t;
        const t2b = t1 * t1, t3b = t1 * t1 * t1;

        const ax = 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2a + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3a);
        const ay = 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2a + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3a);
        const bx = 0.5 * (2 * p1.x + (-p0.x + p2.x) * t1 + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2b + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3b);
        const by = 0.5 * (2 * p1.y + (-p0.y + p2.y) * t1 + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2b + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3b);

        const segSpeed = Math.hypot(bx - ax, by - ay);

        if (s.brush === "line") {
          drawLine(ctx, { x: ax, y: ay }, { x: bx, y: by }, col, s.size);
        } else {
          drawPollock(ctx, { x: ax, y: ay }, { x: bx, y: by }, segSpeed, col, s.size);
        }
      }
    },
    [getColor]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;
    s.playing = playing;
    s.brush = brush;
    s.palette = palette;
    s.speed = SPEEDS[speedIdx].value;

    let W = container.clientWidth;
    let H = container.clientHeight;
    canvas.width = W;
    canvas.height = H;

    function resetCanvas() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      s.playbackIndex = 0;
      s.currentStroke = 0;
    }

    function animate() {
      if (!ctx || !s.data) return;
      if (!s.playing || s.data.points.length < 4) {
        s.rafId = requestAnimationFrame(animate);
        return;
      }

      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < s.speed; i++) {
        if (s.playbackIndex >= s.data.points.length - 3) {
          resetCanvas();
          continue;
        }
        const idx = s.playbackIndex;
        if (idx === 0 || s.data.ids[idx - 1] !== s.data.ids[idx]) {
          s.currentStroke++;
        }
        renderSegment(ctx, s.data, idx);
        s.playbackIndex++;
      }

      const disp = Math.min(s.currentStroke, s.data.totalStrokes);
      setStrokeInfo(`${disp} / ${s.data.totalStrokes}`);
      s.rafId = requestAnimationFrame(animate);
    }

    let aborted = false;

    async function loadData() {
      try {
        const res = await fetch(`/assets/cursor-art/${selectedDate}.txt`);
        const text = await res.text();
        if (aborted) return;
        W = container!.clientWidth;
        H = container!.clientHeight;
        canvas!.width = W;
        canvas!.height = H;
        s.data = parseFile(text, W, H);
        resetCanvas();
        s.rafId = requestAnimationFrame(animate);
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
      if (s.data) {
        fetch(`/assets/cursor-art/${selectedDate}.txt`)
          .then((r) => r.text())
          .then((text) => {
            if (aborted) return;
            s.data = parseFile(text, W, H);
            resetCanvas();
          });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      aborted = true;
      s.playing = false;
      cancelAnimationFrame(s.rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedDate, brush, palette, speedIdx, playing, renderSegment]);

  const handleReset = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stateRef.current.playbackIndex = 0;
    stateRef.current.currentStroke = 0;
  };

  return (
    <div className="cursor-art-interactive">
      <div className="cursor-art-canvas-wrap" ref={containerRef}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
        />
      </div>
      <div className="cursor-art-controls">
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          aria-label="Select recording date"
        >
          {DATES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={brush}
          onChange={(e) => setBrush(e.target.value as BrushMode)}
          aria-label="Select brush style"
        >
          <option value="pollock">Pollock</option>
          <option value="line">Smooth Line</option>
          <option value="dots">Dots</option>
        </select>

        <select
          value={palette}
          onChange={(e) => setPalette(e.target.value)}
          aria-label="Select color palette"
        >
          <option value="neon">Neon</option>
          <option value="pastel">Pastel</option>
          <option value="mono">Mono</option>
          <option value="warm">Warm</option>
        </select>

        {SPEEDS.map((sp, i) => (
          <button
            key={sp.label}
            className={i === speedIdx ? "active" : ""}
            onClick={() => setSpeedIdx(i)}
            aria-label={`Set speed to ${sp.label}`}
          >
            {sp.label}
          </button>
        ))}

        <button onClick={() => setPlaying((p) => !p)}>
          {playing ? "Pause" : "Play"}
        </button>
        <button onClick={handleReset}>Reset</button>

        <span className="cursor-art-counter">{strokeInfo}</span>
      </div>
    </div>
  );
}
