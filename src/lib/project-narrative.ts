import type { Project } from "@/types/project";

export type NarrativeBlock = {
  /** Null means render body only — no subheader. */
  label: string | null;
  body: string;
};

/** Defaults when a label field has never been customized. */
export const DEFAULT_NARRATIVE_LABELS = {
  en: ["The Challenge", "The Approach", "The Decision"] as const,
  he: ["האתגר", "הגישה", "ההחלטה"] as const,
};

type Slot = {
  bodyEn?: string;
  bodyHe?: string;
  labelEn?: string;
  labelHe?: string;
  fallbackEn: string;
  fallbackHe: string;
};

function resolveLabel(
  stored: string | undefined,
  fallback: string,
): string | null {
  // undefined = never customized → show the familiar default
  if (stored === undefined) return fallback;
  // explicit empty = "just a paragraph, no subheader"
  const trimmed = stored.trim();
  return trimmed.length ? trimmed : null;
}

/**
 * Up to three story blocks. Empty bodies are dropped, so one filled slot
 * becomes a single paragraph (with or without a heading).
 */
export function getNarrativeBlocks(
  project: Project,
  isHebrew: boolean,
): NarrativeBlock[] {
  const slots: Slot[] = [
    {
      bodyEn: project.narrativeChallenge,
      bodyHe: project.heNarrativeChallenge,
      labelEn: project.narrativeChallengeLabel,
      labelHe: project.heNarrativeChallengeLabel,
      fallbackEn: DEFAULT_NARRATIVE_LABELS.en[0],
      fallbackHe: DEFAULT_NARRATIVE_LABELS.he[0],
    },
    {
      bodyEn: project.narrativeApproach,
      bodyHe: project.heNarrativeApproach,
      labelEn: project.narrativeApproachLabel,
      labelHe: project.heNarrativeApproachLabel,
      fallbackEn: DEFAULT_NARRATIVE_LABELS.en[1],
      fallbackHe: DEFAULT_NARRATIVE_LABELS.he[1],
    },
    {
      bodyEn: project.narrativeDecision,
      bodyHe: project.heNarrativeDecision,
      labelEn: project.narrativeDecisionLabel,
      labelHe: project.heNarrativeDecisionLabel,
      fallbackEn: DEFAULT_NARRATIVE_LABELS.en[2],
      fallbackHe: DEFAULT_NARRATIVE_LABELS.he[2],
    },
  ];

  return slots.flatMap((slot) => {
    const body = ((isHebrew && slot.bodyHe) || slot.bodyEn || "").trim();
    if (!body) return [];
    const label = resolveLabel(
      isHebrew ? slot.labelHe : slot.labelEn,
      isHebrew ? slot.fallbackHe : slot.fallbackEn,
    );
    return [{ label, body }];
  });
}
