"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import type { Project } from "@/types/project";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";

const STAR_PATH =
  "M16.1348 3.41309C19.1227 -1.13732 25.8401 -1.13732 28.8281 3.41309L28.5186 10.1064C29.534 11.6529 31.0958 12.7732 32.8877 13.2334L39.4678 10.8838C44.6726 12.2206 46.7028 18.5295 43.2549 22.6514L36.6475 24.4316C35.4529 25.8598 34.8488 27.697 34.958 29.5557L39.1621 34.7588C39.4765 40.1103 34.1666 44.03 29.1572 42.1211L25.1846 36.4492C23.4435 35.7858 21.5193 35.7858 19.7783 36.4492L15.8057 42.1211C10.7963 44.03 5.48741 40.1103 5.80176 34.7588L10.0049 29.5557C10.1141 27.6969 9.51001 25.8598 8.31543 24.4316L1.70801 22.6514C-1.73991 18.5295 0.290269 12.2206 5.49512 10.8838L12.0752 13.2334C13.8671 12.7732 15.4289 11.6529 16.4443 10.1064L16.1348 3.41309Z";

type ProjectRowProps = {
  project: Project;
};

export function ProjectRow({ project }: ProjectRowProps) {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();
  const { isHebrew, lang } = useLanguage();
  const s = useTranslation(lang);
  const href = `/work/${project.slug}`;

  const title = (isHebrew && project.heTitle) || project.title;
  const tags = (isHebrew && project.heTags?.length ? project.heTags : project.tags);

  function handleClick(e: MouseEvent<HTMLElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => router.push(href), 160);
  }

  return (
    <Link
      href={href}
      className={`project-row ${isExiting ? "project-row-exit" : ""}`}
      onClick={handleClick}
    >
      <svg className="project-row-star" width="22" height="22" viewBox="0 0 45 43" fill="none" aria-hidden>
        <path d={STAR_PATH} fill="var(--color-primary)" />
      </svg>

      <span className="project-row-title">{title}</span>

      <span className="project-row-tags">
        {tags.slice(0, 3).join(" · ")}
      </span>

      <span className="project-row-year">{project.year}</span>

      <span className="project-row-arrow" aria-hidden>{s.arrowForward}</span>
    </Link>
  );
}
