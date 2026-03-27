"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";
import type { Project } from "@/types/project";

type Props = {
  project: Project;
  previousProject: Project | null;
  nextProject: Project | null;
};

export function ProjectDetailContent({ project, previousProject, nextProject }: Props) {
  const { isHebrew } = useLanguage();
  const { lang } = useLanguage();
  const s = useTranslation(lang);

  const title = (isHebrew && project.heTitle) || project.title;
  const subHeader = (isHebrew && project.heSubHeader) || project.subHeader || project.category;
  const context = (isHebrew && project.heContext) || project.context;
  const tags = isHebrew && project.heTags?.length ? project.heTags : project.tags;

  const prevTitle = previousProject
    ? (isHebrew && previousProject.heTitle) || previousProject.title
    : "";
  const nextTitle = nextProject
    ? (isHebrew && nextProject.heTitle) || nextProject.title
    : "";

  return (
    <>
      <Reveal>
        <p className="eyebrow">{subHeader}</p>
        <h1>{title}</h1>
        {context && <p className="project-context-detail">{context}</p>}
      </Reveal>

      <Reveal>
        <div className="meta-row">
          {tags.length > 0 &&
            tags.map((tag) => (
              <span key={tag} className="project-tag">
                {tag}
              </span>
            ))}
          {project.year && <span className="meta-year">{project.year}</span>}
        </div>
      </Reveal>

      {project.url && (
        <Reveal>
          <a href={project.url} className="button button-ghost" target="_blank" rel="noreferrer noopener">
            {s.visitProject}
          </a>
        </Reveal>
      )}

      {(previousProject || nextProject) && (
        <Reveal>
          <nav className="project-nav-text" aria-label="Project navigation">
            {previousProject ? (
              <Link href={`/work/${previousProject.slug}`} className="project-nav-text-link project-nav-text-prev">
                <span className="project-nav-text-arrow" aria-hidden>{s.arrowBack}</span>
                <span>
                  <span className="project-nav-text-label">{s.previousProject}</span>
                  <span className="project-nav-text-title">{prevTitle}</span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {nextProject ? (
              <Link href={`/work/${nextProject.slug}`} className="project-nav-text-link project-nav-text-next">
                <span>
                  <span className="project-nav-text-label">{s.nextProject}</span>
                  <span className="project-nav-text-title">{nextTitle}</span>
                </span>
                <span className="project-nav-text-arrow" aria-hidden>{s.arrowForward}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </Reveal>
      )}

      <Reveal>
        <div className="detail-actions">
          <Link href="/work" className="button button-ghost">
            {s.backToWork}
          </Link>
          <Link href="/contact" className="button button-primary">
            {s.startAProject}
          </Link>
        </div>
      </Reveal>
    </>
  );
}
