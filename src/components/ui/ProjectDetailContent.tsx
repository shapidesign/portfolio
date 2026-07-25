"use client";

import { Reveal } from "@/components/ui/Reveal";
import { StarMark } from "@/components/ui/StarMark";
import { useLanguage } from "@/context/LanguageContext";
import { preventOrphan } from "@/i18n/typography";
import { getNarrativeBlocks } from "@/lib/project-narrative";
import { useTranslation } from "@/i18n/strings";
import type { Project } from "@/types/project";

type Props = {
  project: Project;
};

export function ProjectDetailContent({ project }: Props) {
  const { lang, isHebrew } = useLanguage();
  const s = useTranslation(lang);
  const title = (isHebrew && project.heTitle) || project.title;
  const opener = (isHebrew && project.heOpener) || project.opener || project.context;
  const status = (isHebrew && project.heStatus) || project.status;
  const discipline = (isHebrew && project.heDiscipline) || project.discipline || project.category;
  const projectUrl = project.url?.trim();

  return (
    <>
      <Reveal>
        <section className="project-cinematic-opener">
          <h1>{preventOrphan(title)}</h1>
          {opener && <p className="project-opener-line">{preventOrphan(opener)}</p>}
          <p className="project-opener-meta">
            {status ? preventOrphan(status) : null}
            <StarMark className="project-meta-star" size={11} />
            {discipline ? preventOrphan(discipline) : null}
            <StarMark className="project-meta-star" size={11} />
            {project.year}
          </p>
          {projectUrl ? (
            <a
              className="button button-ghost visit-project-link"
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {preventOrphan(s.visitProject)}
              <span aria-hidden> ↗</span>
            </a>
          ) : null}
        </section>
      </Reveal>
    </>
  );
}

type NarrativeProps = {
  project: Project;
};

export function ProjectNarrativeSections({ project }: NarrativeProps) {
  const { isHebrew } = useLanguage();
  const blocks = getNarrativeBlocks(project, isHebrew);

  if (!blocks.length) return null;

  return (
    <section className="project-narrative-sections">
      {blocks.map((block, index) => (
        <Reveal key={`${block.label ?? "body"}-${index}`}>
          <article className="project-narrative-block">
            {block.label ? (
              <h2 className="project-narrative-heading">{preventOrphan(block.label)}</h2>
            ) : null}
            <p className="project-narrative-copy">{preventOrphan(block.body)}</p>
          </article>
        </Reveal>
      ))}
    </section>
  );
}
