"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { CtaButton } from "@/components/ui/CtaButton";
import { CursorArtPlayer } from "@/components/ui/CursorArtPlayer";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/data/projects";
import VariableProximity from "@/components/ui/VariableProximity/VariableProximity";

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(":scope > *")?.clientWidth ?? 320;
    el.scrollBy({ left: direction === "next" ? cardWidth + 16 : -(cardWidth + 16), behavior: "smooth" });
  }, []);

  return (
    <main>
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
        <div className="project-scroll-shell">
          <button
            type="button"
            className="scroll-btn scroll-btn-prev"
            aria-label="Scroll to previous project"
            onClick={() => scroll("prev")}
          >
            &#8592;
          </button>
          <div className="project-scroll" ref={scrollRef}>
            {projects.map((project) => (
              <Reveal key={project.slug}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
          <button
            type="button"
            className="scroll-btn scroll-btn-next"
            aria-label="Scroll to next project"
            onClick={() => scroll("next")}
          >
            &#8594;
          </button>
        </div>
      </section>

      <section className="section content-wrap about-teaser">
        <Reveal>
          <h2>About</h2>
          <p>
            Design is never my style. It&apos;s your problem and our solution.
          </p>
          <Link href="/about" className="text-link">
            Read more
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
