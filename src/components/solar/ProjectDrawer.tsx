"use client";

import Link from "next/link";
import type { Project } from "../../types/project";
import type { PlanetConfig } from "./Planet";
import { getNarrativeBlocks } from "@/lib/project-narrative";

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
    cta: "Open full case study →",
    closeAria: "Close",
  },
  he: {
    eyebrow: "יומן משימה",
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
  const blocks = project ? getNarrativeBlocks(project, isHebrew) : [];
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

          {blocks.length ? (
            <div className="solar-drawer-grid">
              {blocks.map((block, index) => (
                <section className="solar-drawer-card" key={`${block.label ?? "body"}-${index}`}>
                  {block.label ? (
                    <span className="solar-drawer-card-label">{block.label}</span>
                  ) : null}
                  <p>{block.body}</p>
                </section>
              ))}
            </div>
          ) : null}

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
