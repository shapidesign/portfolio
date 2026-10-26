"use client";

import type { PlanetConfig } from "./Planet";
import { preventOrphan } from "@/i18n/typography";

type VoyageHUDProps = {
  mode: "idle" | "riding" | "complete";
  planet: PlanetConfig | null;
  activeIndex: number | null;
  total: number;
  isHebrew: boolean;
  modalOpen: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onOpenProject: (slug: string) => void;
  onExit: () => void;
  onContact: () => void;
};

const STRINGS = {
  en: {
    chapter: "Voyage stop",
    completeEyebrow: "Route complete",
    completeTitle: "You made the loop",
    completeCopy:
      "That is the full route through every subject. You can keep exploring, open the archive, or get in touch.",
    previous: "Previous",
    next: "Continue voyage",
    finish: "Finish route",
    projects: "Projects in this orbit",
    exit: "Exit ride",
    contact: "Contact",
    mobileOverview: "Overview",
    mobileNext: "Next",
  },
  he: {
    chapter: "תחנת מסע",
    completeEyebrow: "המסלול הושלם",
    completeTitle: "סיימת את הסיבוב",
    completeCopy: "זה היה המסלול המלא בין כל התחומים. אפשר להמשיך לחקור, לפתוח את הרשימה, או ליצור קשר.",
    previous: "הקודם",
    next: "המשך מסע",
    finish: "סיום מסלול",
    projects: "פרויקטים במסלול",
    exit: "לצאת מהמסלול",
    contact: "צור קשר",
    mobileOverview: "למבט על",
    mobileNext: "הבא",
  },
} as const;

export function VoyageHUD({
  mode,
  planet,
  activeIndex,
  total,
  isHebrew,
  modalOpen,
  onPrevious,
  onNext,
  onOpenProject,
  onExit,
  onContact,
}: VoyageHUDProps) {
  if (mode === "idle" || modalOpen) return null;

  const t = isHebrew ? STRINGS.he : STRINGS.en;
  const progress = activeIndex === null ? total : activeIndex + 1;
  const isLastStop = activeIndex !== null && activeIndex >= total - 1;

  if (mode === "complete") {
    return (
      <aside className="solar-voyage-hud is-complete" dir={isHebrew ? "rtl" : "ltr"}>
        <span className="solar-voyage-eyebrow">{preventOrphan(t.completeEyebrow)}</span>
        <h2 className="solar-voyage-title">{preventOrphan(t.completeTitle)}</h2>
        <p className="solar-voyage-copy">{preventOrphan(t.completeCopy)}</p>
        <div className="solar-voyage-actions">
          <button type="button" className="solar-voyage-primary" onClick={onContact}>
            {preventOrphan(t.contact)}
          </button>
          <button type="button" className="solar-voyage-secondary" onClick={onExit}>
            {preventOrphan(t.exit)}
          </button>
        </div>
      </aside>
    );
  }

  if (!planet || activeIndex === null) return null;

  const title = (isHebrew && planet.heTitle) || planet.title;
  const moons = planet.moons ?? [];

  return (
    <aside
      className="solar-voyage-hud"
      dir={isHebrew ? "rtl" : "ltr"}
      style={{ ["--voyage-accent" as string]: planet.accent }}
    >
      <div className="solar-voyage-kicker">
        <span>{preventOrphan(t.chapter)}</span>
        <span>
          {progress}/{total}
        </span>
      </div>
      <h2 className="solar-voyage-title">{preventOrphan(title)}</h2>
      <div className="solar-voyage-meta">
        <span>{preventOrphan(t.projects)}</span>
      </div>
      <div className="solar-voyage-moons">
        {moons.map((moon) => (
          <button
            key={moon.slug}
            type="button"
            className="solar-voyage-moon"
            style={{ ["--moon-accent" as string]: moon.accent }}
            onClick={() => onOpenProject(moon.slug)}
          >
            <span className="solar-voyage-moon-title">
              {preventOrphan((isHebrew && moon.heTitle) || moon.title)}
            </span>
            <span className="solar-voyage-moon-arrow" aria-hidden>
              ↗
            </span>
          </button>
        ))}
      </div>
      <div className="solar-voyage-actions solar-voyage-actions--desktop">
        <button type="button" className="solar-voyage-secondary" onClick={onNext}>
          {preventOrphan(isLastStop ? t.finish : t.next)}
        </button>
      </div>
      <div className="solar-voyage-nav solar-voyage-nav--desktop">
        <button type="button" onClick={onPrevious}>
          {preventOrphan(t.previous)}
        </button>
        <button type="button" onClick={onExit}>
          {preventOrphan(t.exit)}
        </button>
      </div>
      <div className="solar-voyage-mobile-controls">
        <button
          type="button"
          className="solar-voyage-step-btn"
          onClick={onPrevious}
          aria-label={t.previous}
        >
          <span aria-hidden>{isHebrew ? "→" : "←"}</span>
        </button>
        <button
          type="button"
          className="solar-voyage-overview-btn"
          onClick={onExit}
        >
          {preventOrphan(t.mobileOverview)}
        </button>
        <button
          type="button"
          className="solar-voyage-step-btn solar-voyage-step-btn--primary"
          onClick={onNext}
        >
          <span>{preventOrphan(isLastStop ? t.finish : t.mobileNext)}</span>
          <span aria-hidden>{isHebrew ? "←" : "→"}</span>
        </button>
      </div>
    </aside>
  );
}
