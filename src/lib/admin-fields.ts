import type { Project } from "@/types/project";

/**
 * Single source of truth for which project fields the admin editor exposes.
 * Client-safe (no server-only imports) so both the editor UI and the save API
 * can share it.
 */

/** An EN/HE text field pair. */
export type TextFieldPair = {
  label: string;
  en: keyof Project;
  he: keyof Project;
  multiline?: boolean;
};

export const TEXT_FIELDS: TextFieldPair[] = [
  { label: "Title", en: "title", he: "heTitle" },
  { label: "Sub-header", en: "subHeader", he: "heSubHeader", multiline: true },
  { label: "Card descriptor", en: "descriptor", he: "heDescriptor", multiline: true },
  { label: "Status", en: "status", he: "heStatus" },
  { label: "Discipline", en: "discipline", he: "heDiscipline" },
  { label: "Opener", en: "opener", he: "heOpener", multiline: true },
  { label: "Description (supports HTML)", en: "description", he: "heDescription", multiline: true },
  { label: "Narrative — Challenge", en: "narrativeChallenge", he: "heNarrativeChallenge", multiline: true },
  { label: "Narrative — Approach", en: "narrativeApproach", he: "heNarrativeApproach", multiline: true },
  { label: "Narrative — Decision", en: "narrativeDecision", he: "heNarrativeDecision", multiline: true },
];

/** Tags are stored as arrays; edited as comma-separated text in the UI. */
export const TAG_FIELDS = { label: "Tags", en: "tags" as const, he: "heTags" as const };

/** Single-value fields (no Hebrew counterpart). */
export const SINGLE_FIELDS: { label: string; key: keyof Project }[] = [
  { label: "Year", key: "year" },
  { label: "Project URL", key: "url" },
];

/** Every key the save API will accept from the editor. */
export const EDITABLE_KEYS: (keyof Project)[] = [
  ...TEXT_FIELDS.flatMap((f) => [f.en, f.he]),
  TAG_FIELDS.en,
  TAG_FIELDS.he,
  ...SINGLE_FIELDS.map((f) => f.key),
  "images",
];

const ARRAY_KEYS = new Set<keyof Project>([TAG_FIELDS.en, TAG_FIELDS.he, "images"]);

/**
 * Keep only editable keys and coerce values to the expected type (string or
 * string[]). Rejects anything unexpected so the overrides doc can never gain
 * arbitrary fields (e.g. a forged `slug`).
 */
export function sanitizeFields(input: Record<string, unknown>): Partial<Project> {
  const out: Record<string, unknown> = {};
  for (const key of EDITABLE_KEYS) {
    if (!(key in input)) continue;
    const value = input[key];
    if (ARRAY_KEYS.has(key)) {
      if (Array.isArray(value)) {
        out[key] = value.filter((v): v is string => typeof v === "string");
      }
    } else if (typeof value === "string") {
      out[key] = value;
    }
  }
  return out as Partial<Project>;
}
