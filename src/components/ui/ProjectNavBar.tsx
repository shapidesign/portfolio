"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Project } from "@/types/project";

const STAR_PATH =
  "M16.1348 3.41309C19.1227 -1.13732 25.8401 -1.13732 28.8281 3.41309L28.5186 10.1064C29.534 11.6529 31.0958 12.7732 32.8877 13.2334L39.4678 10.8838C44.6726 12.2206 46.7028 18.5295 43.2549 22.6514L36.6475 24.4316C35.4529 25.8598 34.8488 27.697 34.958 29.5557L39.1621 34.7588C39.4765 40.1103 34.1666 44.03 29.1572 42.1211L25.1846 36.4492C23.4435 35.7858 21.5193 35.7858 19.7783 36.4492L15.8057 42.1211C10.7963 44.03 5.48741 40.1103 5.80176 34.7588L10.0049 29.5557C10.1141 27.6969 9.51001 25.8598 8.31543 24.4316L1.70801 22.6514C-1.73991 18.5295 0.290269 12.2206 5.49512 10.8838L12.0752 13.2334C13.8671 12.7732 15.4289 11.6529 16.4443 10.1064L16.1348 3.41309Z";

type ProjectNavBarProps = {
  projects: Project[];
  currentSlug: string;
};

export function ProjectNavBar({ projects, currentSlug }: ProjectNavBarProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const footer = document.querySelector(".site-footer");
    if (!bar || !footer) return;

    let rafId = 0;
    const update = () => {
      const footerRect = footer.getBoundingClientRect();
      const overlap = window.innerHeight - footerRect.top;
      if (overlap > 0) {
        bar.style.transform = `translateY(-${overlap}px)`;
      } else {
        bar.style.transform = "";
      }
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <nav ref={barRef} className="project-nav-bar" aria-label="Project navigation">
      <div className="project-nav-bar-inner">
        {projects.map((project) => {
          const isCurrent = project.slug === currentSlug;
          const isHovered = hoveredSlug === project.slug;

          return (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className={`project-nav-star ${isCurrent ? "project-nav-star--current" : ""}`}
              aria-label={project.title}
              aria-current={isCurrent ? "page" : undefined}
              onMouseEnter={() => setHoveredSlug(project.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              onFocus={() => setHoveredSlug(project.slug)}
              onBlur={() => setHoveredSlug(null)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 45 43"
                fill="none"
                aria-hidden
              >
                <path
                  d={STAR_PATH}
                  fill={isCurrent ? "#ffffff" : "none"}
                  stroke="#ffffff"
                  strokeWidth={isCurrent ? 0 : 2}
                  opacity={isCurrent ? 1 : 0.55}
                />
              </svg>

              <AnimatePresence>
                {isHovered && !reducedMotion && (
                  <motion.span
                    className="project-nav-tooltip"
                    role="tooltip"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    {project.title}
                  </motion.span>
                )}
              </AnimatePresence>

              {reducedMotion && isHovered && (
                <span className="project-nav-tooltip" role="tooltip">
                  {project.title}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
