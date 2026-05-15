"use client";

import type { Project } from "../../types/project";
import type { PlanetConfig } from "./Planet";
import { preventOrphan } from "@/i18n/typography";

type VoyageHUDProps = {
  mode: "idle" | "riding" | "complete";
  project: Project | null;
  planet: PlanetConfig | null;
  activeIndex: number | null;
  total: number;
  isHebrew: boolean;
  modalOpen: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onOpenProject: () => void;
  onExit: () => void;
  onContact: () => void;
};

const STRINGS = {
  en: {
    chapter: "Voyage stop",
    completeEyebrow: "Route complete",
    completeTitle: "You made the loop",
    completeCopy:
      "That is the full route through the selected projects. You can keep exploring, open the archive, or get in touch.",
    previous: "Previous",
    next: "Continue voyage",
    finish: "Finish route",
    open: "Open case study",
    exit: "Exit ride",
    contact: "Contact",
    fallbackDiscipline: "Portfolio project",
  },
  he: {
    chapter: "תחנת מסע",
    completeEyebrow: "המסלול הושלם",
    completeTitle: "סיימת את הסיבוב",
    completeCopy: "זה היה המסלול המלא בין הפרויקטים הנבחרים. אפשר להמשיך לחקור, לפתוח את הרשימה, או ליצור קשר.",
    previous: "הקודם",
    next: "המשך מסע",
    finish: "סיום מסלול",
    open: "פתח קייס סטאדי",
    exit: "לצאת מהמסלול",
    contact: "צור קשר",
    fallbackDiscipline: "פרויקט פורטפוליו",
  },
} as const;

export function VoyageHUD({
  mode,
  project,
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

  if (!project || !planet || activeIndex === null) return null;

  const title = (isHebrew && project.heTitle) || project.title;
  const descriptor = (isHebrew && project.heDescriptor) || project.descriptor || project.summary;
  const discipline =
    (isHebrew && project.heDiscipline) || project.discipline || project.category || t.fallbackDiscipline;
  const status = (isHebrew && project.heStatus) || project.status || project.year;

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
        <span>{preventOrphan(discipline)}</span>
        <span>{preventOrphan(status)}</span>
      </div>
      {descriptor ? <p className="solar-voyage-copy">{preventOrphan(descriptor)}</p> : null}
      <div className="solar-voyage-actions">
        <button type="button" className="solar-voyage-primary" onClick={onOpenProject}>
          {preventOrphan(t.open)}
        </button>
        <button type="button" className="solar-voyage-secondary" onClick={onNext}>
          {preventOrphan(isLastStop ? t.finish : t.next)}
        </button>
      </div>
      <div className="solar-voyage-nav">
        <button type="button" onClick={onPrevious} disabled={activeIndex === 0}>
          {preventOrphan(t.previous)}
        </button>
        <button type="button" onClick={onExit}>
          {preventOrphan(t.exit)}
        </button>
      </div>
    </aside>
  );
}
