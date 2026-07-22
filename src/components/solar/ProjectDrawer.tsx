"use client";

import Link from "next/link";
import type { Project } from "../../types/project";
import type { PlanetConfig } from "./Planet";

type ProjectDrawerProps = {
  open: boolean;
  project: Project | null;
  planet: PlanetConfig | null;
  isHebrew: boolean;
  onClose: () => void;
};

const STRINGS = {
  en: {
    eyebrow: "Mission Log",
    challenge: "Challenge",
    approach: "Approach",
    decision: "Decision",
    cta: "Open full case study →",
    closeAria: "Close",
  },
  he: {
    eyebrow: "יומן משימה",
    challenge: "אתגר",
    approach: "גישה",
    decision: "החלטה",
    cta: "פתח/י תיק עבודות מלא ←",
    closeAria: "סגור",
  },
} as const;

export function ProjectDrawer({ open, project, planet, isHebrew, onClose }: ProjectDrawerProps) {
  const accent = planet?.accent ?? "#7a56f2";
  const heroImage = project?.images?.[0];
  const t = isHebrew ? STRINGS.he : STRINGS.en;

  const title = (isHebrew && project?.heTitle) || project?.title;
  const descriptor = (isHebrew && project?.heDescriptor) || project?.descriptor;
  const challenge =
    (isHebrew && project?.heNarrativeChallenge) ||
    project?.narrativeChallenge ||
    project?.challenge ||
    project?.context;
  const approach =
    (isHebrew && project?.heNarrativeApproach) ||
    project?.narrativeApproach ||
    project?.process ||
    project?.summary;
  const decision =
    (isHebrew && project?.heNarrativeDecision) ||
    project?.narrativeDecision ||
    project?.outcome ||
    project?.summary;
  const tags = (isHebrew && project?.heTags?.length ? project.heTags : project?.tags) ?? [];
  const status = (isHebrew && project?.heStatus) || project?.status;
  const discipline = (isHebrew && project?.heDiscipline) || project?.discipline;

  return (
    <aside
      className={`solar-drawer ${open ? "is-open" : ""}`}
      style={{ ["--drawer-accent" as string]: accent }}
      aria-hidden={!open}
      dir={isHebrew ? "rtl" : "ltr"}
    >
      <header className="solar-drawer-header">
        <div className="solar-drawer-eyebrow">
          <span className="solar-drawer-dot" />
          {t.eyebrow}
          {project ? ` · ${project.year ?? ""}` : ""}
        </div>
        <button type="button" className="solar-drawer-close" onClick={onClose} aria-label={t.closeAria}>
          <span aria-hidden>×</span>
        </button>
      </header>

      {project ? (
        <div className="solar-drawer-body">
          <h2 className="solar-drawer-title">{title}</h2>
          {descriptor ? <p className="solar-drawer-descriptor">{descriptor}</p> : null}

          {heroImage ? (
            <div className="solar-drawer-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt={title} className="solar-drawer-hero-img" loading="lazy" />
            </div>
          ) : null}

          <div className="solar-drawer-grid">
            <section className="solar-drawer-card">
              <span className="solar-drawer-card-label">{t.challenge}</span>
              <p>{challenge}</p>
            </section>
            <section className="solar-drawer-card">
              <span className="solar-drawer-card-label">{t.approach}</span>
              <p>{approach}</p>
            </section>
            <section className="solar-drawer-card">
              <span className="solar-drawer-card-label">{t.decision}</span>
              <p>{decision}</p>
            </section>
          </div>

          {tags.length ? (
            <div className="solar-drawer-tags">
              {tags.slice(0, 8).map((tag) => (
                <span key={tag} className="solar-drawer-tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="solar-drawer-meta">
            {status ? <span>{status}</span> : null}
            {discipline ? <span>{discipline}</span> : null}
          </div>

          <Link href={`/work/${project.slug}`} className="solar-drawer-cta">
            {t.cta}
          </Link>
        </div>
      ) : null}
    </aside>
  );
}
