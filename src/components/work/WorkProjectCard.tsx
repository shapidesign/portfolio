"use client";

import Link from "next/link";
import { CardPreview } from "@/components/ui/CardPreview";
import { StarMark } from "@/components/ui/StarMark";
import type { Project } from "@/types/project";

type WorkProjectCardProps = {
  project: Project;
  isHebrew: boolean;
  priority?: boolean;
};

export function WorkProjectCard({ project, isHebrew, priority = false }: WorkProjectCardProps) {
  const title = (isHebrew && project.heTitle) || project.title;
  const status = (isHebrew && project.heStatus) || project.status || "";
  const descriptor = (isHebrew && project.heDescriptor) || project.descriptor || project.summary;
  const discipline = (isHebrew && project.heDiscipline) || project.discipline || project.category;
  const heroImage = project.images[0];

  return (
    <article className="project-card-redesign">
      <Link
        href={`/work/${project.slug}`}
        className="project-card-link"
        aria-label={`View project: ${title}`}
        prefetch={false}
      >
        <div className="project-card-media">
          {heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt=""
              className="project-card-image"
              loading={priority ? "eager" : "lazy"}
              decoding="async"
            />
          ) : (
            <CardPreview slug={project.slug} />
          )}
        </div>
        <div className="project-card-copy">
          <div className="project-card-copy-text">
            <h3 className="project-card-redesign-title font-display">
              <StarMark className="project-title-star" size={13} />
              {title}
            </h3>
            <p className="project-card-descriptor">{descriptor}</p>
          </div>
        </div>
        <div className="project-card-footer">
          <span className="project-card-discipline text-label">{discipline}</span>
          <span className="project-card-arrow" aria-hidden>
            <span className="project-arrow-glyph">↗</span>
          </span>
          <span className="project-status-tag text-label">{status}</span>
        </div>
      </Link>
    </article>
  );
}
