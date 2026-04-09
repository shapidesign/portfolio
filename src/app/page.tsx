"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { CtaButton } from "@/components/ui/CtaButton";
import { Reveal } from "@/components/ui/Reveal";
import { WorkGateModal } from "@/components/ui/WorkGateModal";
import { hasVisitedWork } from "@/components/ui/WorkVisitMarker";
import { WorkProjectCard } from "@/components/work/WorkProjectCard";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";
import { projects } from "@/data/projects";

export default function HomePage() {
  const [gateOpen, setGateOpen] = useState(false);
  const { lang, isHebrew } = useLanguage();
  const s = useTranslation(lang);

  const handleCollaborate = useCallback((e: React.MouseEvent) => {
    if (!hasVisitedWork()) {
      e.preventDefault();
      setGateOpen(true);
    }
  }, []);

  const HOMEPAGE_SLUGS = ["digital-handprint", "small-world-problems", "no-gatekeeping"];
  const highlightedProjects = HOMEPAGE_SLUGS
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean) as typeof projects;

  return (
    <main>
      <WorkGateModal open={gateOpen} onClose={() => setGateOpen(false)} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-section content-wrap">
        <div className="hero-text">
          <p className="hero-eyebrow text-label">{s.heroName}</p>
          <h1 className="hero-headline text-statement font-display">
            {s.heroLine1}
            <span style={{ display: "block", marginTop: "0.05em" }}>
              {s.heroLine2}
            </span>
            <span style={{ display: "block" }}>
              {isHebrew ? (
                <span className="hero-headline-accent">
                  <strong>{s.heroLine3Accent}</strong>
                </span>
              ) : (
                <>
                  {s.heroLine3Prefix}{" "}
                  <span className="hero-headline-accent">
                    <em>our</em> solution.
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
          <p className="hero-orientation-line">
            {s.heroOrientationLine}
          </p>
        </div>
      </section>

      {/* ── Work Section ─────────────────────────────────── */}
      <section id="work" className="work-section section">
        <Reveal>
          <div className="section-head content-wrap">
            <div className="section-head-left">
              <h2 className="text-display font-display">{s.selectedWork}</h2>
              <span className="work-year-inline" aria-hidden>&apos;23 — &apos;26</span>
            </div>
            <Link href="/work" prefetch={false} className="text-link text-label">
              {s.seeAllProjects} →
            </Link>
          </div>
        </Reveal>

        <div className="work-showcase-grid">
          {highlightedProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 40}>
              <WorkProjectCard project={project} isHebrew={isHebrew} priority={index === 0} />
            </Reveal>
          ))}
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
