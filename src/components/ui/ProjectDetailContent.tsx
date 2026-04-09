"use client";

import { Reveal } from "@/components/ui/Reveal";
import { StarMark } from "@/components/ui/StarMark";
import { useLanguage } from "@/context/LanguageContext";
import type { Project } from "@/types/project";

type Props = {
  project: Project;
};

export function ProjectDetailContent({ project }: Props) {
  const { isHebrew } = useLanguage();
  const title = (isHebrew && project.heTitle) || project.title;
  const opener = (isHebrew && project.heOpener) || project.opener || project.context;
  const status = (isHebrew && project.heStatus) || project.status;
  const discipline = (isHebrew && project.heDiscipline) || project.discipline || project.category;

  return (
    <>
      <Reveal>
        <section className="project-cinematic-opener">
          <h1>{title}</h1>
          {opener && <p className="project-opener-line">{opener}</p>}
          <p className="project-opener-meta">
            {status}
            <StarMark className="project-meta-star" size={11} />
            {discipline}
            <StarMark className="project-meta-star" size={11} />
            {project.year}
          </p>
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
  const challenge = (isHebrew && project.heNarrativeChallenge) || project.narrativeChallenge;
  const approach = (isHebrew && project.heNarrativeApproach) || project.narrativeApproach;
  const decision = (isHebrew && project.heNarrativeDecision) || project.narrativeDecision;

  if (!challenge && !approach && !decision) return null;

  const challengeHeading = isHebrew ? "האתגר" : "The Challenge";
  const approachHeading = isHebrew ? "הגישה" : "The Approach";
  const decisionHeading = isHebrew ? "ההחלטה" : "The Decision";

  return (
    <section className="project-narrative-sections">
      {challenge && (
        <Reveal>
          <article className="project-narrative-block">
            <h2 className="project-narrative-heading">{challengeHeading}</h2>
            <p className="project-narrative-copy">{challenge}</p>
          </article>
        </Reveal>
      )}
      {approach && (
        <Reveal>
          <article className="project-narrative-block">
            <h2 className="project-narrative-heading">{approachHeading}</h2>
            <p className="project-narrative-copy">{approach}</p>
          </article>
        </Reveal>
      )}
      {decision && (
        <Reveal>
          <article className="project-narrative-block">
            <h2 className="project-narrative-heading">{decisionHeading}</h2>
            <p className="project-narrative-copy">{decision}</p>
          </article>
        </Reveal>
      )}
    </section>
  );
}
