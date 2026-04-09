"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { StarMark } from "@/components/ui/StarMark";
import type { Project } from "@/types/project";

type NextProjectCardProps = {
  project: Project;
};

export function NextProjectCard({ project }: NextProjectCardProps) {
  const { isHebrew } = useLanguage();
  const title = (isHebrew && project.heTitle) || project.title;
  const descriptor = (isHebrew && project.heDescriptor) || project.descriptor || project.summary;
  const cta = isHebrew ? "צפו בפרויקט" : "View project";

  return (
    <section className="next-project-section">
      <Link href={`/work/${project.slug}`} className="next-project-card" prefetch={false}>
        <div className="next-project-copy">
          <p className="text-label">{isHebrew ? "הפרויקט הבא" : "Next Project"}</p>
          <h2 className="font-display">
            <StarMark className="project-title-star" size={14} />
            {title}
          </h2>
          <p>{descriptor}</p>
          <span className="next-project-cta">{cta} ↗</span>
        </div>
      </Link>
    </section>
  );
}
