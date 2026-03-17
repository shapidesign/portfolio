"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent, useState, useMemo } from "react";
import type { Project, Accent, ShapeVariant } from "@/types/project";
import { GeometricAccent } from "./GeometricAccent";

const ALL_SHAPES: ShapeVariant[] = ["circle", "square", "triangle"];
const ALL_COLORS: Accent[] = ["primary", "secondary", "blue", "green", "white"];

const ACCENT_VAR: Record<Accent, string> = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  blue: "var(--color-accent-blue)",
  green: "var(--color-accent-green)",
  white: "var(--color-accent-white)",
};

function pickRandom<T>(arr: T[], exclude?: T): T {
  const filtered = exclude !== undefined ? arr.filter((item) => item !== exclude) : arr;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  const hoverShape = useMemo(
    () => pickRandom(ALL_SHAPES, project.thumbnailShape),
    [project.thumbnailShape]
  );
  const hoverColor = useMemo(
    () => pickRandom(ALL_COLORS, project.accent),
    [project.accent]
  );

  const projectHref = `/work/${project.slug}`;

  function handleCardClick(event: MouseEvent<HTMLElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setIsExiting(true);
    window.setTimeout(() => {
      router.push(projectHref);
    }, 180);
  }

  return (
    <article
      className={`project-card ${isExiting ? "card-exit" : ""}`}
      onClick={handleCardClick}
      role="link"
      tabIndex={-1}
    >
      <div className="project-content">
        <p className="project-category">{project.subHeader || project.category}</p>
        <h3>{project.title}</h3>
        {project.tags.length > 0 && (
          <div className="project-tags" aria-label="Project tags">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="project-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        className="project-art"
        style={{ "--card-accent": ACCENT_VAR[project.accent] } as React.CSSProperties}
      >
        <div className="project-shape-frame">
          <GeometricAccent
            variant={project.thumbnailShape}
            color={project.accent}
            size={98}
            className="project-shape project-shape-default"
          />
          <GeometricAccent
            variant={hoverShape}
            color={hoverColor}
            size={98}
            className="project-shape project-shape-hover"
          />
        </div>
      </div>

      <Link href={projectHref} className="project-link" tabIndex={0}>
        View project
      </Link>
    </article>
  );
}
