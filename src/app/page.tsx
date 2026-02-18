"use client";

import { useRef } from "react";
import Link from "next/link";
import { CtaButton } from "@/components/ui/CtaButton";
import { CursorArtPlayer } from "@/components/ui/CursorArtPlayer";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/data/projects";
import VariableProximity from "@/components/ui/VariableProximity/VariableProximity";

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <main>
      <section className="hero section" ref={heroRef}>
        <div className="content-wrap hero-grid">
          <div className="hero-text">
            <p className="eyebrow">The portfolio of</p>
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
              I design with passion and curiosity, through research and learning, to find solutions to any problem.
            </p>
            <div className="hero-actions">
              <CtaButton href="/work">View Work</CtaButton>
              <CtaButton href="/contact" variant="ghost">
                Let&apos;s Collaborate
              </CtaButton>
            </div>
          </div>
          <CursorArtPlayer />
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <Reveal>
            <div className="section-head">
              <h2>Selected Work</h2>
              <Link href="/work" prefetch={false} className="text-link">
                See all projects
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="project-scroll">
          {projects.map((project) => (
            <Reveal key={project.slug}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section content-wrap about-teaser">
        <Reveal>
          <h2>About</h2>
          <p>
            I design with passion and curiosity, through research and learning, to find solutions to any problem.
          </p>
          <Link href="/about" className="text-link">
            Read more
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
