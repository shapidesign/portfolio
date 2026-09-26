import "server-only";
import { REST, baseHeaders } from "@/lib/project-overrides";
import type { WallEntry, WallInput } from "@/lib/kibbutz-wall";

const TABLE = `${REST}/kibbutz_wall`;

/** Newest first. Returns [] when storage is unreachable so the wall never breaks. */
export async function readWall(limit = 60): Promise<WallEntry[]> {
  try {
    const res = await fetch(
      `${TABLE}?select=id,text,face,color,created_at&order=created_at.desc&limit=${limit}`,
      { headers: baseHeaders(), cache: "no-store" },
    );
    return res.ok ? ((await res.json()) as WallEntry[]) : [];
  } catch {
    return [];
  }
}

export async function addWallEntry(entry: WallInput): Promise<void> {
  const res = await fetch(TABLE, {
    method: "POST",
    headers: { ...baseHeaders(true), "Content-Type": "application/json" },
    body: JSON.stringify([entry]),
  });
  if (!res.ok) {
    throw new Error(`Supabase wall insert failed (${res.status}): ${await res.text()}`);
  }
}
