import "server-only";
import type { WallEntry, WallInput } from "@/lib/kibbutz-wall";

/**
 * Wall persistence on its own Supabase project (PostgREST).
 *
 * The URL and publishable key are public by design; RLS does the gating:
 * reads are public, inserts require the x-wall-secret header.
 *
 * ponytail: credentials are embedded with env overrides, matching the admin
 * content store in project-overrides.ts. Upgrade path: set the three env vars
 * in Vercel and rotate the RLS policy secret.
 */
const URL =
  process.env.KIBBUTZ_WALL_SUPABASE_URL ?? "https://dimzkfozowzqttgwiwpt.supabase.co";
const KEY =
  process.env.KIBBUTZ_WALL_SUPABASE_KEY ?? "sb_publishable_4vbspAgUS5-Izmc5fYIg7A_bq8Lj35A";
const WRITE_SECRET =
  process.env.KIBBUTZ_WALL_WRITE_SECRET ?? "kw_c94fd8b14a2073a8d4bf6c4b31ab95af";

const TABLE = `${URL}/rest/v1/kibbutz_wall`;

/** Newest first. Returns [] when storage is unreachable so the wall never breaks. */
export async function readWall(limit = 60): Promise<WallEntry[]> {
  try {
    const res = await fetch(
      `${TABLE}?select=id,text,face,color,created_at&order=created_at.desc&limit=${limit}`,
      { headers: { apikey: KEY }, cache: "no-store" },
    );
    return res.ok ? ((await res.json()) as WallEntry[]) : [];
  } catch {
    return [];
  }
}

export async function addWallEntry(entry: WallInput): Promise<void> {
  const res = await fetch(TABLE, {
    method: "POST",
    headers: {
      apikey: KEY,
      "x-wall-secret": WRITE_SECRET,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([entry]),
  });
  if (!res.ok) {
    throw new Error(`Supabase wall insert failed (${res.status}): ${await res.text()}`);
  }
}
