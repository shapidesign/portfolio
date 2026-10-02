"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";
import type { WallEntry } from "@/lib/kibbutz-wall";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { getFace } from "./faces";
import { shiftPlacement, type WallPoint } from "./wall-drag";

const POLL_MS = 3000;
const CHAR_MS = 90;
const POS_KEY = "kt-wall-positions";
const NUDGE = 1;
const NUDGE_SHIFT = 5;

/** Deterministic 0..1 values from the row id, so layout survives a refresh. */
function seeds(id: string, count: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    out.push((h >>> 0) / 4294967296);
  }
  return out;
}

function seedPoint(id: string): WallPoint {
  const [x, y] = seeds(id, 3);
  return { x: 2 + x * 58, y: 4 + y * 74 };
}

function rotation(id: string): number {
  const [, , r] = seeds(id, 3);
  return -8 + r * 16;
}

function wordStyle(entry: WallEntry, point: WallPoint): CSSProperties {
  return {
    "--x": `${point.x}%`,
    "--y": `${point.y}%`,
    "--rot": `${rotation(entry.id)}deg`,
    "--len": entry.text.length,
    color: `var(--kt-${entry.color})`,
  } as CSSProperties;
}

function loadPositions(): Record<string, WallPoint> {
  try {
    const raw = localStorage.getItem(POS_KEY);
    const data = raw ? (JSON.parse(raw) as unknown) : {};
    return data && typeof data === "object" ? (data as Record<string, WallPoint>) : {};
  } catch {
    return {};
  }
}

type Drag = {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  origin: WallPoint;
};

function WallWord({
  entry,
  animate,
  point,
  front,
  dragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: {
  entry: WallEntry;
  animate: boolean;
  point: WallPoint;
  front: boolean;
  dragging: boolean;
  onPointerDown: (e: PointerEvent<HTMLLIElement>) => void;
  onPointerMove: (e: PointerEvent<HTMLLIElement>) => void;
  onPointerUp: (e: PointerEvent<HTMLLIElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLLIElement>) => void;
}) {
  const reduce = usePrefersReducedMotion();
  const instant = !animate || reduce;
  const [typed, setTyped] = useState(0);
  const shown = instant ? entry.text.length : typed;

  useEffect(() => {
    if (instant) return;
    const id = setInterval(() => {
      setTyped((n) => {
        if (n + 1 >= entry.text.length) clearInterval(id);
        return n + 1;
      });
    }, CHAR_MS);
    return () => clearInterval(id);
  }, [instant, entry.text.length]);

  return (
    <li
      className={`kt-wall-word ${getFace(entry.face).className}${front ? " is-front" : ""}${dragging ? " is-dragging" : ""}`}
      style={wordStyle(entry, point)}
      aria-label={entry.text}
      aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      {/* Full text keeps the box size fixed; the ink layer reveals over it. */}
      <span aria-hidden className="kt-wall-ghost">
        {entry.text}
      </span>
      <span aria-hidden className="kt-wall-ink">
        {entry.text.slice(0, shown)}
      </span>
    </li>
  );
}

type WallCanvasProps = Readonly<{ settings: KibbutzTypeSettings; address: string }>;

export function WallCanvas({ settings, address }: WallCanvasProps) {
  const [entries, setEntries] = useState<WallEntry[] | null>(null);
  // Ids present on first load render instantly; later arrivals get typed in.
  const [initial, setInitial] = useState<Set<string> | null>(null);
  const [positions, setPositions] = useState<Record<string, WallPoint>>({});
  const [posReady, setPosReady] = useState(false);
  const [frontId, setFrontId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const positionsRef = useRef(positions);

  useEffect(() => {
    document.body.classList.add("kibbutz-type");
    document.body.style.setProperty("--kt-page-bg", settings.colorCream);
    return () => {
      document.body.classList.remove("kibbutz-type");
      document.body.style.removeProperty("--kt-page-bg");
    };
  }, [settings.colorCream]);

  useEffect(() => {
    // ponytail: deferred so the saved layout is read after hydration without a render-time ref write.
    queueMicrotask(() => {
      const loaded = loadPositions();
      positionsRef.current = loaded;
      setPositions(loaded);
      setPosReady(true);
    });
  }, []);

  useEffect(() => {
    if (!posReady) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(positions));
    } catch {
      // ponytail: private mode can reject storage; the drag still works this session.
    }
  }, [positions, posReady]);

  function pointFor(id: string): WallPoint {
    return positions[id] ?? seedPoint(id);
  }

  function place(id: string, next: WallPoint) {
    const updated = { ...positionsRef.current, [id]: next };
    positionsRef.current = updated;
    setPositions(updated);
    setFrontId(id);
  }

  function onPointerDown(entry: WallEntry, e: PointerEvent<HTMLLIElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    const origin = positionsRef.current[entry.id] ?? seedPoint(entry.id);
    dragRef.current = {
      id: entry.id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origin,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingId(entry.id);
    setFrontId(entry.id);
  }

  function onPointerMove(e: PointerEvent<HTMLLIElement>) {
    const drag = dragRef.current;
    const list = listRef.current;
    if (!drag || drag.pointerId !== e.pointerId || !list) return;
    const rect = list.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dx = ((e.clientX - drag.startX) / rect.width) * 100;
    const dy = ((e.clientY - drag.startY) / rect.height) * 100;
    place(drag.id, shiftPlacement(drag.origin.x, drag.origin.y, dx, dy, true));
  }

  function onPointerUp(e: PointerEvent<HTMLLIElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    setDraggingId(null);
  }

  function onKeyDown(entry: WallEntry, e: KeyboardEvent<HTMLLIElement>) {
    const step = e.shiftKey ? NUDGE_SHIFT : NUDGE;
    let dx = 0;
    let dy = 0;
    if (e.key === "ArrowLeft") dx = -step;
    else if (e.key === "ArrowRight") dx = step;
    else if (e.key === "ArrowUp") dy = -step;
    else if (e.key === "ArrowDown") dy = step;
    else return;
    e.preventDefault();
    const origin = positionsRef.current[entry.id] ?? seedPoint(entry.id);
    place(entry.id, shiftPlacement(origin.x, origin.y, dx, dy, true));
  }

  useEffect(() => {
    let alive = true;
    async function poll() {
      try {
        const res = await fetch("/api/kibbutz-wall/", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { entries: WallEntry[] };
        if (!alive) return;
        // Oldest first so the newest paints on top.
        const next = data.entries.slice().reverse();
        setInitial((prev) => prev ?? new Set(next.map((e) => e.id)));
        setEntries(next);
      } catch {
        // ponytail: keep showing the last good wall; next tick retries.
      }
    }
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div
      className="kt kt-wall"
      dir="rtl"
      lang="he"
      style={
        {
          "--kt-cream": settings.colorCream,
          "--kt-navy": settings.colorNavy,
          "--kt-green": settings.colorGreen,
          "--kt-orange": settings.colorOrange,
        } as CSSProperties
      }
    >
      <main className="kt-wall-main">
        <h1 className="sr-only">הקיר</h1>
        {entries && entries.length === 0 ? (
          <p className="kt-wall-empty">הקיר מחכה למילים הראשונות</p>
        ) : null}
        <ul className="kt-wall-list" ref={listRef}>
          {entries?.map((entry) => (
            <WallWord
              key={entry.id}
              entry={entry}
              animate={!initial?.has(entry.id)}
              point={pointFor(entry.id)}
              front={frontId === entry.id}
              dragging={draggingId === entry.id}
              onPointerDown={(e) => onPointerDown(entry, e)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onKeyDown={(e) => onKeyDown(entry, e)}
            />
          ))}
        </ul>
      </main>
      <p className="kt-wall-address">
        <span>{settings.navBadge}</span>
        <span dir="ltr">{address}</span>
      </p>
    </div>
  );
}
