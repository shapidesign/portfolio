import "server-only";
import {
  decodeWallEntry,
  encodeBabayitForLegacyWall,
  type WallEntry,
  type WallInput,
} from "@/lib/kibbutz-wall";

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

/** Probe row from diagnosing the face check. RLS allows insert, not delete. */
const HIDDEN_WALL_IDS = new Set(["7cc1f4f2-8825-4028-8131-35a20f4bdb8a"]);

function insertWall(entry: WallInput): Promise<Response> {
  return fetch(TABLE, {
    method: "POST",
    headers: {
      apikey: KEY,
      "x-wall-secret": WRITE_SECRET,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([entry]),
  });
}

/** Newest first. Returns [] when storage is unreachable so the wall never breaks. */
export async function readWall(limit = 60): Promise<WallEntry[]> {
  try {
    const res = await fetch(
      `${TABLE}?select=id,text,face,color,created_at&order=created_at.desc&limit=${limit}`,
      { headers: { apikey: KEY }, cache: "no-store" },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as WallEntry[];
    return rows.filter((row) => !HIDDEN_WALL_IDS.has(row.id)).map(decodeWallEntry);
  } catch {
    return [];
  }
}

export async function addWallEntry(entry: WallInput): Promise<void> {
  let res = await insertWall(entry);
  if (!res.ok) {
    const detail = await res.text();
    // Table check predates Babayit. Store it as marked kelta and restore on read.
    if (entry.face === "babayit" && detail.includes("kibbutz_wall_face_check")) {
      res = await insertWall(encodeBabayitForLegacyWall(entry));
      if (!res.ok) {
        throw new Error(`Supabase wall insert failed (${res.status}): ${await res.text()}`);
      }
      return;
    }
    throw new Error(`Supabase wall insert failed (${res.status}): ${detail}`);
  }
}
