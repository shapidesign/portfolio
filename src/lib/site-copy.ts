/**
 * Site-wide editable copy (home hero + main CTAs).
 *
 * ponytail: stored as one reserved row (slug "__site__") in the existing
 * project_overrides table — no new table/API. Upgrade path: dedicated
 * site_settings table if this outgrows a single JSON blob.
 *
 * Client-safe (no server-only imports) so the admin editor and the save API
 * share the same field list and sanitizer.
 */

export const SITE_SLUG = "__site__";

export type SiteCopy = Record<string, string>;

export type SiteCopyFieldPair = {
  label: string;
  en: string;
  he: string;
  multiline?: boolean;
};

export const SITE_COPY_FIELDS: SiteCopyFieldPair[] = [
  { label: "Home — Eyebrow", en: "homeEyebrow", he: "heHomeEyebrow" },
  { label: "Home — Headline", en: "homeTitle", he: "heHomeTitle" },
  { label: "Home — Intro", en: "homeIntro", he: "heHomeIntro", multiline: true },
  { label: "CTA — Start the ride", en: "homeCtaStart", he: "heHomeCtaStart" },
  { label: "CTA — About", en: "homeCtaAbout", he: "heHomeCtaAbout" },
  { label: "CTA — List view", en: "homeCtaList", he: "heHomeCtaList" },
];

/** Canonical default copy; components fall back to these when unset. */
export const SITE_COPY_DEFAULTS: SiteCopy = {
  homeEyebrow: "Selected work, in orbit",
  heHomeEyebrow: "עבודות נבחרות במסלול",
  homeTitle: "time to start exploring",
  heHomeTitle: "הגיע הזמן להתחיל לחקור",
  homeIntro:
    "Take the guided ride, tap a planet to open a project, or switch to the list when you want the quick version.",
  heHomeIntro:
    "אפשר לצאת למסלול מודרך, לפתוח פרויקט דרך אחד הכוכבים, או לעבור לרשימה כשבא לך לראות הכול מהר.",
  homeCtaStart: "Start the ride",
  heHomeCtaStart: "להתחיל את המסלול",
  homeCtaAbout: "About",
  heHomeCtaAbout: "אודות",
  homeCtaList: "List View",
  heHomeCtaList: "רשימה",
};

const SITE_COPY_KEYS = new Set(
  SITE_COPY_FIELDS.flatMap((f) => [f.en, f.he]),
);

/** Keep only known site-copy keys with string values. */
export function sanitizeSiteCopy(input: Record<string, unknown>): SiteCopy {
  const out: SiteCopy = {};
  for (const [key, value] of Object.entries(input)) {
    if (SITE_COPY_KEYS.has(key) && typeof value === "string") out[key] = value;
  }
  return out;
}
