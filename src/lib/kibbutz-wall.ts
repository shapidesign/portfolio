/**
 * Kibbutz Type wall — shared (client + server) constants, validation, and
 * profanity filter. The API route re-runs everything here; the form only
 * uses it for instant feedback.
 */
import type { FaceId } from "@/components/kibbutz-type/faces";

export const WALL_MAX_LEN = 40;

export const WALL_COLORS = [
  { key: "navy", he: "כחול" },
  { key: "green", he: "ירוק" },
  { key: "orange", he: "כתום" },
] as const;

export type WallColor = (typeof WALL_COLORS)[number]["key"];

export type WallEntry = {
  id: string;
  text: string;
  face: FaceId;
  color: WallColor;
  created_at: string;
};

export type WallInput = Pick<WallEntry, "text" | "face" | "color">;

/**
 * `kibbutz_wall_face_check` only allows dan and kelta. Babayit rows are stored
 * as kelta with this prefix, then restored on read. Invisible to visitors.
 */
export const BABAYIT_WALL_MARK = "\u2060";

export function encodeBabayitForLegacyWall(entry: WallInput): WallInput {
  if (entry.face !== "babayit") return entry;
  return { ...entry, face: "kelta", text: `${BABAYIT_WALL_MARK}${entry.text}` };
}

export function decodeWallEntry<T extends { text: string; face: FaceId }>(entry: T): T {
  if (!entry.text.startsWith(BABAYIT_WALL_MARK)) return entry;
  return { ...entry, face: "babayit", text: entry.text.slice(BABAYIT_WALL_MARK.length) };
}

// ponytail: type-only import above keeps this file runnable by node --experimental-strip-types.
const FACE_IDS = new Set<string>(["dan", "kelta", "babayit"] satisfies FaceId[]);
const COLOR_KEYS = new Set<string>(WALL_COLORS.map((c) => c.key));

/** Hebrew letters, digits, whitespace, and punctuation both faces cover. */
const ALLOWED_RE = /^[\u05D0-\u05EA0-9\s!#'()*,\-./:;?[\]_{}·–—‘’“”•…׳״]+$/;

/* ─── Filter ─────────────────────────────────────────── */

const FINALS: Record<string, string> = { ך: "כ", ם: "מ", ן: "נ", ף: "פ", ץ: "צ" };

/** Strip nikkud, fold final forms, collapse repeats, drop separators inside words. */
export function normalizeHebrew(s: string): string {
  return s
    .replace(/[\u0591-\u05C7]/g, "")
    .replace(/[ךםןףץ]/g, (c) => FINALS[c])
    .replace(/[^\u05D0-\u05EA\s]+/g, "") // punctuation used as a separator: ז.י.ן → זין
    .replace(/(.)\1+/g, "$1") // זיייין → זין
    .replace(/\s+/g, " ")
    .trim();
}

// ponytail: plain stem lists, normalized with the same function as the input.
// Ceiling: no transliteration (zona), no leetspeak, no semantic judgement.
// Upgrade path: add stems here; a false positive means moving a stem from
// SUBSTRING to WORD.
const SUBSTRING_STEMS = ["זונה", "שרמוט", "פיפי", "קוקסינל", "זדינ", "מניאק", "כוסאמ", "כוסעמ"].map(
  normalizeHebrew,
);
const WORD_STEMS = ["זין", "פות", "חרא", "הומו"].map(normalizeHebrew);

const PREFIX = "(?:ו?(?:ה|ב|ל|ש|כש|מה)?)";
// Suffixes go through the same normalization (ים → ימ) so they match folded input.
const SUFFIX = `(?:${["ים", "אים", "ות", "י", "ה", "ית", "יות", "ם", "ן"].map(normalizeHebrew).join("|")})?`;
const WORD_RE = new RegExp(`(?:^| )${PREFIX}(?:${WORD_STEMS.join("|")})${SUFFIX}(?= |$)`);
/** כוס alone / כוסות / כוס קפה is a cup; glued or followed by אמ/עמ it is not. */
const KOS_RE = /כוס ?(?:ית|יות|אמ|עמ)/;

export function isBlocked(text: string): boolean {
  const norm = normalizeHebrew(text);
  const squashed = norm.replace(/ /g, "");
  return (
    SUBSTRING_STEMS.some((stem) => squashed.includes(stem)) ||
    WORD_RE.test(norm) ||
    KOS_RE.test(norm)
  );
}

/* ─── Validation ─────────────────────────────────────── */

export type WallValidation =
  | { ok: true; entry: WallInput }
  | { ok: false; error: "invalid" | "blocked" };

export function validateWallInput(body: unknown): WallValidation {
  const b = (body ?? {}) as Record<string, unknown>;
  // Dan kerns ן/ל against a period but has no pair for the ellipsis glyph, so wall copy never uses "…".
  const text =
    typeof b.text === "string" ? b.text.trim().replace(/\s+/g, " ").replace(/…/g, "...") : "";
  if (
    text.length === 0 ||
    text.length > WALL_MAX_LEN ||
    !ALLOWED_RE.test(text) ||
    typeof b.face !== "string" ||
    !FACE_IDS.has(b.face) ||
    typeof b.color !== "string" ||
    !COLOR_KEYS.has(b.color)
  ) {
    return { ok: false, error: "invalid" };
  }
  if (isBlocked(text)) return { ok: false, error: "blocked" };
  return { ok: true, entry: { text, face: b.face as FaceId, color: b.color as WallColor } };
}
