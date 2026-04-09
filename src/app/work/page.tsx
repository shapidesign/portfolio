"use client";

import { Reveal } from "@/components/ui/Reveal";
import { WorkProjectCard } from "@/components/work/WorkProjectCard";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";
import { projects } from "@/data/projects";

export default function WorkPage() {
  const projectCount = projects.length;
  const { lang, isHebrew } = useLanguage();
  const s = useTranslation(lang);

  return (
    <main>
      <div className="section content-wrap">
        <Reveal>
          <div className="section-head" style={{ paddingInline: 0 }}>
            <div className="section-head-left">
              <h1 className="text-display font-display">{s.workTitle}</h1>
              <span className="work-year-inline" aria-hidden>&apos;23 — &apos;26</span>
            </div>
            <p className="subtitle text-label">{s.workSubtitle(projectCount)}</p>
          </div>
        </Reveal>
      </div>

      {projectCount > 0 ? (
        <div className="work-showcase-grid">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 40}>
              <WorkProjectCard project={project} isHebrew={isHebrew} priority={index === 0} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="content-wrap">
          <Reveal>
            <p className="subtitle">Project data is currently unavailable. Please refresh shortly.</p>
          </Reveal>
        </div>
      )}
    </main>
  );
}
