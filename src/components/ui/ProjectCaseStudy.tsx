"use client";

import { Fragment, useEffect, useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectHeaderObserver } from "@/components/ui/ProjectHeaderObserver";
import {
  ProjectDetailContent,
  ProjectNarrativeSections,
} from "@/components/ui/ProjectDetailContent";
import { ProjectHeroImage } from "@/components/ui/ProjectHeroImage";
import { NextProjectCard } from "@/components/ui/NextProjectCard";
import { TetrisLoaderEmbed } from "@/components/ui/TetrisLoaderEmbed";
import { GivatHodayaBrandPaletteEmbed } from "@/components/ui/GivatHodayaBrandPaletteEmbed";
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
  const typeRevealRef = useRef<HTMLVideoElement>(null);

  // Looping decorative video: keep it paused for reduced-motion users.
  useEffect(() => {
    const video = typeRevealRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  const slug = project.slug;
  const title = (isHebrew && project.heTitle) || project.title;
  const isDigitalHandprint = slug === "digital-handprint";
  const isDavidka = slug === "small-world-problems";
  const isGivatHodaya = slug === "rethinking-real-estate";
  const hasScrollImages = !isDigitalHandprint && !isDavidka && project.images.length > 0;
  const currentIndex = projects.findIndex((entry) => entry.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const leadImageAlt = isHebrew ? `${title} - תמונת פתיחה` : `${title} hero`;

  const embedNode = isDigitalHandprint ? (
    <DigitalHandprintEmbed />
  ) : isDavidka ? (
    <DavidkaProjectEmbed />
  ) : isGivatHodaya ? (
    <GivatHodayaBrandPaletteEmbed />
  ) : null;

  const scrollGalleryImages = project.images
    .filter((src) => !src.includes("tetris animation"))
    // The color guidelines are replaced by the animated palette embed, and the
    // logotype reveal asset is a flattened white-on-white image.
    .filter(
      (src) =>
        !(
          isGivatHodaya &&
          (src.includes("color-guidelines") || src.includes("logotype-reveal"))
        ),
    );

  const leadImage = scrollGalleryImages[0] || project.images[0];
  const editorialImages = scrollGalleryImages.slice(1);

  return (
    <>
      <ProjectHeaderObserver title={project.title} heTitle={project.heTitle}>
        <ProjectDetailContent project={project} />
      </ProjectHeaderObserver>

      {leadImage && isGivatHodaya ? (
        <Reveal>
          <div className="project-hero-media project-hero-media--brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leadImage}
              alt={leadImageAlt}
              className="project-hero-image--brand"
              loading="eager"
              decoding="async"
            />
          </div>
        </Reveal>
      ) : leadImage ? (
        <Reveal>
          <ProjectHeroImage src={leadImage} alt={leadImageAlt} />
        </Reveal>
      ) : null}

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
            <Fragment key={`${src}-${index}`}>
              <Reveal delay={index * 50}>
                <figure
                  className={`project-editorial-item ${
                    index % 3 === 1
                      ? "project-editorial-item--half"
                      : "project-editorial-item--full"
                  }${isGivatHodaya ? " project-editorial-item--brand" : ""}`}
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

              {isGivatHodaya && index === 0 && (
                <Reveal>
                  <figure className="project-editorial-item project-editorial-item--full project-editorial-item--brand project-editorial-item--video">
                    <video
                      ref={typeRevealRef}
                      className="project-editorial-video"
                      src="/videos/rethinking-real-estate/logotype-reveal.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={
                        isHebrew
                          ? `${title} - אנימציית בניית הלוגוטייפ`
                          : `${title} - logotype construction animation`
                      }
                    />
                  </figure>
                </Reveal>
              )}
            </Fragment>
          ))}

          {isGivatHodaya && (
            <Reveal>
              <figure className="project-editorial-item project-editorial-item--full project-editorial-item--brand project-editorial-item--brand-dark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/rethinking-real-estate/black-logo-v5.png"
                  alt={
                    isHebrew
                      ? `${title} - הלוגו בלבן על גבי שחור המותג`
                      : `${title} - white logotype on the brand black`
                  }
                  className="project-editorial-image project-editorial-image--inverted"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </Reveal>
          )}

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
