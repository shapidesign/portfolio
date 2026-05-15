"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { StarMark } from "@/components/ui/StarMark";
import { preventOrphan } from "@/i18n/typography";
import type { Project } from "@/types/project";

type NextProjectCardProps = {
  project: Project;
  onSelect?: (slug: string) => void;
};

export function NextProjectCard({ project, onSelect }: NextProjectCardProps) {
  const { isHebrew } = useLanguage();
  const title = (isHebrew && project.heTitle) || project.title;
  const descriptor = (isHebrew && project.heDescriptor) || project.descriptor || project.summary;
  const cta = isHebrew ? "צפו בפרויקט" : "View project";

  const inner = (
    <div className="next-project-copy">
      <p className="text-label">{preventOrphan(isHebrew ? "הפרויקט הבא" : "Next Project")}</p>
      <h2 className="font-display">
        <StarMark className="project-title-star" size={14} />
        {preventOrphan(title)}
      </h2>
      <p>{preventOrphan(descriptor)}</p>
      <span className="next-project-cta">
        {preventOrphan(cta)} <span aria-hidden>↗</span>
      </span>
    </div>
  );

  return (
    <section className="next-project-section">
      {onSelect ? (
        <button
          type="button"
          className="next-project-card"
          onClick={() => onSelect(project.slug)}
        >
          {inner}
        </button>
      ) : (
        <Link href={`/work/${project.slug}`} className="next-project-card" prefetch={false}>
          {inner}
        </Link>
      )}
    </section>
  );
}
