"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";
import type { WallEntry } from "@/lib/kibbutz-wall";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { getFace } from "./faces";

const POLL_MS = 3000;
const CHAR_MS = 90;

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

function placement(entry: WallEntry): CSSProperties {
  const [x, y, r] = seeds(entry.id, 3);
  return {
    "--x": `${2 + x * 58}%`,
    "--y": `${4 + y * 74}%`,
    "--rot": `${-8 + r * 16}deg`,
    "--len": entry.text.length,
    color: `var(--kt-${entry.color})`,
  } as CSSProperties;
}

function WallWord({ entry, animate }: { entry: WallEntry; animate: boolean }) {
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
      className={`kt-wall-word ${getFace(entry.face).className}`}
      style={placement(entry)}
      aria-label={entry.text}
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

  useEffect(() => {
    document.body.classList.add("kibbutz-type");
    document.body.style.setProperty("--kt-page-bg", settings.colorCream);
    return () => {
      document.body.classList.remove("kibbutz-type");
      document.body.style.removeProperty("--kt-page-bg");
    };
  }, [settings.colorCream]);

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
        <ul className="kt-wall-list">
          {entries?.map((entry) => (
            <WallWord key={entry.id} entry={entry} animate={!initial?.has(entry.id)} />
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
