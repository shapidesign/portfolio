"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { CtaButton } from "@/components/ui/CtaButton";
import { CursorArtPlayer } from "@/components/ui/CursorArtPlayer";
import { ProjectRow } from "@/components/ui/ProjectRow";
import { Reveal } from "@/components/ui/Reveal";
import { WorkGateModal } from "@/components/ui/WorkGateModal";
import { hasVisitedWork } from "@/components/ui/WorkVisitMarker";
import { projects } from "@/data/projects";
import VariableProximity from "@/components/ui/VariableProximity/VariableProximity";

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const [gateOpen, setGateOpen] = useState(false);

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
            <h1>
              <VariableProximity
                label="Yehonatan Shapira"
                fromFontVariationSettings="'wght' 300, 'opsz' 8"
                toFontVariationSettings="'wght' 900, 'opsz' 144"
                containerRef={heroRef}
                radius={200}
                falloff="gaussian"
                className="hero-variable-text"
              />
            </h1>
            <p className="hero-copy">
              Design is never <em>my</em> style. It&apos;s <em>your</em> problem and <em>our</em> solution.
            </p>
            <div className="hero-actions">
              <CtaButton href="#work">View Work</CtaButton>
              <CtaButton href="/contact" variant="ghost" onClick={handleCollaborate}>
                Let&apos;s Collaborate
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
              <h2>Selected Work</h2>
              <Link href="/work" prefetch={false} className="text-link">
                See all projects
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
          <h2>About</h2>
          <p className="lead">
            I&apos;m Yehonatan Shapira — a visual communication designer who believes
            good design starts by understanding the problem, not the tool. I work
            across branding, digital product, and experimental typography.
          </p>
          <Link href="/about" className="text-link">
            Read more about me
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
