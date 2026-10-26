"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "../../types/project";
import type { PlanetConfig } from "./Planet";
import { SUBJECTS } from "./planet-config";
import { preventOrphan } from "@/i18n/typography";

type ListViewProps = {
  open: boolean;
  projects: Project[];
  planets: PlanetConfig[];
  isHebrew: boolean;
  onSelect: (slug: string) => void;
  onClose: () => void;
};

const STRINGS = {
  en: {
    eyebrow: "Mission Archive",
    title: "Selected Work",
    close: "Back to 3D",
    fullIndex: "Open full /work index",
    fallbackStatus: "Project",
    allFilter: "All",
    readCaseStudy: "Read case study",
  },
  he: {
    eyebrow: "ארכיון משימות",
    title: "עבודות נבחרות",
    close: "לתצוגה מרחבית",
    fullIndex: "לכל העבודות",
    fallbackStatus: "פרויקט",
    allFilter: "הכול",
    readCaseStudy: "לצפייה בפרויקט",
  },
} as const;

export function ListView({ open, projects, planets, isHebrew, onSelect, onClose }: ListViewProps) {
  const [activeSubjectId, setActiveSubjectId] = useState<string>("all");
  const accentBySlug = new Map(planets.map((p) => [p.slug, p.accent]));
  const t = isHebrew ? STRINGS.he : STRINGS.en;

  if (!open) return null;

  const activeSubject = SUBJECTS.find((s) => s.id === activeSubjectId);
  const visibleProjects = activeSubject
    ? projects.filter((p) => activeSubject.projectSlugs.includes(p.slug))
    : projects;

  return (
    <section className="solar-list is-open" dir={isHebrew ? "rtl" : "ltr"}>
      <header className="solar-list-header">
        <div className="solar-list-header-top">
          <div>
            <span className="solar-list-eyebrow">{preventOrphan(t.eyebrow)}</span>
            <h2 className="solar-list-title">{preventOrphan(t.title)}</h2>
          </div>
          <button type="button" className="solar-list-close" onClick={onClose} aria-label={t.close}>
            {preventOrphan(t.close)}
          </button>
        </div>
        <div className="solar-list-filters" role="tablist" aria-label={t.title}>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubjectId === "all"}
            className={`solar-list-filter-chip ${activeSubjectId === "all" ? "is-active" : ""}`}
            onClick={() => setActiveSubjectId("all")}
          >
            {t.allFilter} ({projects.length})
          </button>
          {SUBJECTS.map((subject) => {
            const label = isHebrew ? subject.heTitle : subject.title;
            const isSelected = activeSubjectId === subject.id;
            return (
              <button
                key={subject.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`solar-list-filter-chip ${isSelected ? "is-active" : ""}`}
                style={{ ["--chip-accent" as string]: subject.accent }}
                onClick={() => setActiveSubjectId(subject.id)}
              >
                <span className="solar-list-filter-dot" aria-hidden />
                {preventOrphan(label)}
              </button>
            );
          })}
        </div>
      </header>
      <div className="solar-list-grid">
        {visibleProjects.map((project) => {
          const accent = accentBySlug.get(project.slug) ?? "#7a56f2";
          const cover = project.images?.[0];
          const title = (isHebrew && project.heTitle) || project.title;
          const status = (isHebrew && project.heStatus) || project.status || t.fallbackStatus;
          const discipline = (isHebrew && project.heDiscipline) || project.discipline || project.category;
          const descriptor =
            (isHebrew && (project.heDescriptor || project.heContext || project.heSubHeader)) ||
            project.descriptor ||
            project.summary;
          return (
            <button
              key={project.slug}
              type="button"
              className="solar-list-card"
              style={{ ["--card-accent" as string]: accent }}
              onClick={() => onSelect(project.slug)}
              aria-label={title}
            >
              <div className="solar-list-cover">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt={title} loading="lazy" />
                ) : (
                  <div className="solar-list-cover-fallback" />
                )}
                <svg className="solar-list-mark" viewBox="0 0 45 43" aria-hidden focusable="false">
                  <path
                    d="M16.1348 3.41309C19.1227 -1.13732 25.8401 -1.13732 28.8281 3.41309L28.5186 10.1064C29.534 11.6529 31.0958 12.7732 32.8877 13.2334L39.4678 10.8838C44.6726 12.2206 46.7028 18.5295 43.2549 22.6514L36.6475 24.4316C35.4529 25.8598 34.8488 27.697 34.958 29.5557L39.1621 34.7588C39.4765 40.1103 34.1666 44.03 29.1572 42.1211L25.1846 36.4492C23.4435 35.7858 21.5193 35.7858 19.7783 36.4492L15.8057 42.1211C10.7963 44.03 5.48741 40.1103 5.80176 34.7588L10.0049 29.5557C10.1141 27.6969 9.51001 25.8598 8.31543 24.4316L1.70801 22.6514C-1.73991 18.5295 0.290269 12.2206 5.49512 10.8838L12.0752 13.2334C13.8671 12.7732 15.4289 11.6529 16.4443 10.1064L16.1348 3.41309Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="solar-list-text">
                <div className="solar-list-meta-row">
                  <span className="solar-list-status">{preventOrphan(discipline || status)}</span>
                  <span className="solar-list-cta-hint" aria-hidden>
                    {preventOrphan(t.readCaseStudy)} ↗
                  </span>
                </div>
                <h3 className="solar-list-card-title">{preventOrphan(title)}</h3>
                {descriptor ? <p>{preventOrphan(descriptor)}</p> : null}
              </div>
            </button>
          );
        })}
      </div>
      <div className="solar-list-footer">
        <Link href="/work" className="solar-drawer-cta solar-drawer-cta-ghost">
          {preventOrphan(t.fullIndex)} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
