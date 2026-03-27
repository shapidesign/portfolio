"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { CtaButton } from "@/components/ui/CtaButton";
import { CursorArtPlayer } from "@/components/ui/CursorArtPlayer";
import { ProjectRow } from "@/components/ui/ProjectRow";
import { Reveal } from "@/components/ui/Reveal";
import { WorkGateModal } from "@/components/ui/WorkGateModal";
import { hasVisitedWork } from "@/components/ui/WorkVisitMarker";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";
import { projects } from "@/data/projects";
import VariableProximity from "@/components/ui/VariableProximity/VariableProximity";

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const { lang } = useLanguage();
  const s = useTranslation(lang);

  const handleCollaborate = useCallback((e: React.MouseEvent) => {
    if (!hasVisitedWork()) {
      e.preventDefault();
      setGateOpen(true);
    }
  }, []);

  return (
    <main>
      <WorkGateModal open={gateOpen} onClose={() => setGateOpen(false)} />

      <section className="hero section" ref={heroRef}>
        <div className="content-wrap hero-grid">
          <div className="hero-text">
            <h1 dir={lang === "he" ? "rtl" : "ltr"}>
              <VariableProximity
                label={s.heroName}
                fromFontVariationSettings="'wght' 300"
                toFontVariationSettings="'wght' 900"
                containerRef={heroRef}
                radius={200}
                falloff="gaussian"
                className="hero-variable-text"
              />
            </h1>
            <p className="hero-copy">{s.heroTagline}</p>
            <div className="hero-actions">
              <CtaButton href="#work">{s.viewWork}</CtaButton>
              <CtaButton href="/contact" variant="ghost" onClick={handleCollaborate}>
                {s.letsCollaborate}
              </CtaButton>
            </div>
          </div>
          <CursorArtPlayer />
        </div>
      </section>

      <section id="work" className="section">
        <div className="content-wrap">
          <Reveal>
            <div className="section-head">
              <h2>{s.selectedWork}</h2>
              <Link href="/work" prefetch={false} className="text-link">
                {s.seeAllProjects}
              </Link>
            </div>
          </Reveal>
          <div className="project-list">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 60}>
                <ProjectRow project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section content-wrap about-teaser">
        <Reveal>
          <h2>{s.aboutTeaserTitle}</h2>
          <p className="lead">{s.aboutTeaserBody}</p>
          <Link href="/about" className="text-link">
            {s.readMoreAboutMe}
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
