"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent, useState, useMemo } from "react";
import type { Project } from "@/data/projects";
import { GeometricAccent } from "./GeometricAccent";

type ShapeVariant = "circle" | "square" | "triangle";
type ShapeColor = "primary" | "secondary" | "blue" | "green" | "white";

const ALL_SHAPES: ShapeVariant[] = ["circle", "square", "triangle"];
const ALL_COLORS: ShapeColor[] = ["primary", "secondary", "blue", "green", "white"];

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

  function handleCardNavigate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    setIsExiting(true);
    window.setTimeout(() => {
      router.push(`/work/${project.slug}`);
    }, 180);
  }

  return (
    <article className={`project-card ${isExiting ? "card-exit" : ""}`}>
      <div className="project-art">
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

      <div className="project-content">
        <p className="project-category">{project.subHeader || project.category}</p>
        <h3>{project.title}</h3>
        <p>{project.description || project.summary}</p>
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

      <Link
        href={`/work/${project.slug}`}
        className="project-link"
        onClick={handleCardNavigate}
      >
        View project
      </Link>
    </article>
  );
}
