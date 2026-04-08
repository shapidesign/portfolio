"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CtaButton } from "@/components/ui/CtaButton";
import { WordReveal } from "@/components/ui/WordReveal";
import { HeroStarOutline, HeroStarTextStroke } from "@/components/ui/HeroStarOutline";
import { CardPreview } from "@/components/ui/CardPreview";
import { ImageSlideshow } from "@/components/ui/ImageSlideshow";
import { Reveal } from "@/components/ui/Reveal";
import { WorkGateModal } from "@/components/ui/WorkGateModal";
import { hasVisitedWork } from "@/components/ui/WorkVisitMarker";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";
import { projects } from "@/data/projects";

export default function HomePage() {
  const [gateOpen, setGateOpen] = useState(false);
  const { lang, isHebrew } = useLanguage();
  const s = useTranslation(lang);
  const router = useRouter();

  const handleCollaborate = useCallback((e: React.MouseEvent) => {
    if (!hasVisitedWork()) {
      e.preventDefault();
      setGateOpen(true);
    }
  }, []);

  function handleCardClick(slug: string) {
    router.push(`/work/${slug}`);
  }

  const featured = projects[0];
  const pair = projects.slice(1, 3);
  const grid3 = projects.slice(3, 6);

  return (
    <main>
      <WorkGateModal open={gateOpen} onClose={() => setGateOpen(false)} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-section content-wrap">
        <HeroStarOutline />
        <HeroStarTextStroke>
          <div className="hero-text">
            <p className="hero-eyebrow text-label">{s.heroName}</p>
            <h1 className="hero-headline text-statement font-display">
              <WordReveal
                text={s.heroLine1}
                delay={0}
                stagger={40}
              />
              <span style={{ display: "block", marginTop: "0.05em" }}>
                <WordReveal
                  text={s.heroLine2}
                  delay={180}
                  stagger={40}
                />
              </span>
            <span style={{ display: "block" }}>
              {isHebrew ? (
                <span className="hero-headline-accent" style={{ display: "inline" }}>
                  <WordReveal text="והפתרון" inline delay={340} stagger={40} />
                  {" "}
                  <strong>
                    <WordReveal text="שלנו." inline delay={400} stagger={40} />
                  </strong>
                </span>
              ) : (
                <>
                  <WordReveal text="and" inline delay={340} stagger={40} />
                  {" "}
                  <span className="hero-headline-accent" style={{ display: "inline" }}>
                    <em>
                      <WordReveal text="our" inline delay={380} stagger={40} />
                    </em>
                    {" "}
                    <WordReveal text="solution." inline delay={420} stagger={40} />
                  </span>
                </>
              )}
            </span>
            </h1>
            <div className="hero-actions">
              <CtaButton href="#work">{s.viewWork}</CtaButton>
              <CtaButton href="/contact" variant="ghost" onClick={handleCollaborate}>
                {s.letsCollaborate}
              </CtaButton>
            </div>
          </div>
        </HeroStarTextStroke>
      </section>

      {/* ── Work Section ─────────────────────────────────── */}
      <section id="work" className="work-section section">
        <Reveal>
          <div className="section-head content-wrap">
            <h2 className="text-display font-display">{s.selectedWork}</h2>
            <Link href="/work" prefetch={false} className="text-link text-label">
              {s.seeAllProjects} →
            </Link>
          </div>
        </Reveal>

        <div className="work-showcase">
          {/* Featured — full bleed */}
          {featured && (
            <Reveal>
              <button
                type="button"
                className="work-card work-featured"
                data-slug={featured.slug}
                onClick={() => handleCardClick(featured.slug)}
                aria-label={`View project: ${isHebrew && featured.heTitle ? featured.heTitle : featured.title}`}
              >
                {featured.images.length > 1 ? (
                  <ImageSlideshow images={featured.images} />
                ) : featured.images[0] ? (
                  <img
                    src={featured.images[0]}
                    alt=""
                    className="work-card-img"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <CardPreview slug={featured.slug} />
                )}
                <div className="work-card-overlay" />
                <div className="work-card-content">
                  <h3 className="work-card-title">
                    {isHebrew && featured.heTitle ? featured.heTitle : featured.title}
                  </h3>
                </div>
              </button>
            </Reveal>
          )}

          {/* Pair — 50/50 */}
          {pair.length > 0 && (
            <div className="work-pair">
              {pair.map((project, i) => (
                <Reveal key={project.slug} delay={i * 80}>
                  <button
                    type="button"
                    className="work-card"
                    data-slug={project.slug}
                    style={{ width: "100%", height: "100%" }}
                    onClick={() => handleCardClick(project.slug)}
                    aria-label={`View project: ${isHebrew && project.heTitle ? project.heTitle : project.title}`}
                  >
                    {project.images.length > 1 ? (
                      <ImageSlideshow images={project.images} />
                    ) : project.images[0] ? (
                      <img
                        src={project.images[0]}
                        alt=""
                        className="work-card-img"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <CardPreview slug={project.slug} />
                    )}
                    <div className="work-card-overlay" />
                    <div className="work-card-content">
                      <h3 className="work-card-title">
                        {isHebrew && project.heTitle ? project.heTitle : project.title}
                      </h3>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          )}

          {/* Tight 3 */}
          {grid3.length > 0 && (
            <div className="work-grid-3">
              {grid3.map((project, i) => (
                <Reveal key={project.slug} delay={i * 60}>
                  <button
                    type="button"
                    className="work-card"
                    data-slug={project.slug}
                    style={{ width: "100%", height: "100%" }}
                    onClick={() => handleCardClick(project.slug)}
                    aria-label={`View project: ${isHebrew && project.heTitle ? project.heTitle : project.title}`}
                  >
                    {project.images.length > 1 ? (
                      <ImageSlideshow images={project.images} />
                    ) : project.images[0] ? (
                      <img
                        src={project.images[0]}
                        alt=""
                        className="work-card-img"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <CardPreview slug={project.slug} />
                    )}
                    <div className="work-card-overlay" />
                    <div className="work-card-content">
                      <h3 className="work-card-title">
                        {isHebrew && project.heTitle ? project.heTitle : project.title}
                      </h3>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── About Teaser ─────────────────────────────────── */}
      <section className="section content-wrap about-teaser">
        <Reveal>
          <h2 className="text-display font-display">{s.aboutTeaserTitle}</h2>
          <p className="lead">{s.aboutTeaserBody}</p>
          <Link href="/about" className="text-link">
            {s.readMoreAboutMe}
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
