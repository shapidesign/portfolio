"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ProjectHeaderObserver } from "@/components/ui/ProjectHeaderObserver";
import {
  ProjectDetailContent,
  ProjectNarrativeSections,
} from "@/components/ui/ProjectDetailContent";
import { ProjectHeroImage } from "@/components/ui/ProjectHeroImage";
import { NextProjectCard } from "@/components/ui/NextProjectCard";
import { TetrisLoaderEmbed } from "@/components/ui/TetrisLoaderEmbed";
import { DigitalHandprintEmbed } from "@/app/work/[slug]/DigitalHandprintEmbed";
import { DavidkaProjectEmbed } from "@/app/work/[slug]/DavidkaProjectEmbed";
import { projects } from "@/data/projects";
import { useLanguage } from "@/context/LanguageContext";
import type { Project } from "@/types/project";

type ProjectCaseStudyProps = {
  project: Project;
  onSelectNext?: (slug: string) => void;
};

export function ProjectCaseStudy({ project, onSelectNext }: ProjectCaseStudyProps) {
  const { isHebrew } = useLanguage();
  const slug = project.slug;
  const title = (isHebrew && project.heTitle) || project.title;
  const isDigitalHandprint = slug === "digital-handprint";
  const isDavidka = slug === "small-world-problems";
  const hasScrollImages = !isDigitalHandprint && !isDavidka && project.images.length > 0;
  const currentIndex = projects.findIndex((entry) => entry.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const leadImageAlt = isHebrew ? `${title} - תמונת פתיחה` : `${title} hero`;

  const embedNode = isDigitalHandprint ? (
    <DigitalHandprintEmbed />
  ) : isDavidka ? (
    <DavidkaProjectEmbed />
  ) : null;

  const scrollGalleryImages = project.images
    .filter((src) => !src.includes("tetris animation"))
    .filter(
      (src) => !(slug === "animal-to-logo" && src.includes("alma + text.webp")),
    );

  const leadImage = scrollGalleryImages[0] || project.images[0];
  const editorialImages = scrollGalleryImages.slice(1);

  return (
    <>
      <ProjectHeaderObserver title={project.title} heTitle={project.heTitle}>
        <ProjectDetailContent project={project} />
      </ProjectHeaderObserver>

      {leadImage && (
        <Reveal>
          <ProjectHeroImage src={leadImage} alt={leadImageAlt} />
        </Reveal>
      )}

      {embedNode && (
        <Reveal>
          <section className="project-media-shell">
            <div className="project-media-content">{embedNode}</div>
          </section>
        </Reveal>
      )}

      <ProjectNarrativeSections project={project} />

      {hasScrollImages && (
        <section className="project-editorial-work">
          {editorialImages.map((src, index) => (
            <Reveal key={`${src}-${index}`} delay={index * 50}>
              <figure
                className={`project-editorial-item ${
                  index % 3 === 1
                    ? "project-editorial-item--half"
                    : "project-editorial-item--full"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={isHebrew ? `${title} - תמונה ${index + 2}` : `${title} - Image ${index + 2}`}
                  className="project-editorial-image"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </Reveal>
          ))}

          {slug === "no-gatekeeping" && (
            <Reveal>
              <TetrisLoaderEmbed />
            </Reveal>
          )}
        </section>
      )}

      <Reveal>
        <NextProjectCard project={nextProject} onSelect={onSelectNext} />
      </Reveal>
    </>
  );
}
