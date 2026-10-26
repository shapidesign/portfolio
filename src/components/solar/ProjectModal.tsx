"use client";

import { useEffect, useId, useRef } from "react";
import type { Project } from "../../types/project";
import { ProjectCaseStudy } from "@/components/ui/ProjectCaseStudy";
import { preventOrphan } from "@/i18n/typography";

type ProjectModalProps = {
  open: boolean;
  project: Project | null;
  allProjects?: Project[];
  isHebrew: boolean;
  onClose: () => void;
  onSelectProject: (slug: string) => void;
};

export function ProjectModal({
  open,
  project,
  allProjects,
  isHebrew,
  onClose,
  onSelectProject,
}: ProjectModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [open, project?.slug]);

  if (!open || !project) return null;

  const closeLabel = isHebrew ? "סגור" : "Close";
  const escHint = isHebrew ? "ESC לסגירה" : "Press ESC to close";

  return (
    <div
      className="solar-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      dir={isHebrew ? "rtl" : "ltr"}
    >
      <div className="solar-modal-backdrop" onClick={onClose} aria-hidden />
      <div
        className="solar-modal-shell"
        ref={scrollRef}
        onTouchStart={(e) => {
          const scrollTop = scrollRef.current?.scrollTop ?? 0;
          dragStartY.current = scrollTop <= 4 ? e.touches[0].clientY : null;
        }}
        onTouchEnd={(e) => {
          if (dragStartY.current === null) return;
          const dy = e.changedTouches[0].clientY - dragStartY.current;
          dragStartY.current = null;
          if (dy > 76 && (scrollRef.current?.scrollTop ?? 0) <= 4) onClose();
        }}
      >
        <div className="solar-modal-toolbar">
          <span className="solar-sheet-handle" aria-hidden />
          <span className="solar-modal-esc-hint" aria-hidden>
            {preventOrphan(escHint)}
          </span>
          <button
            ref={closeBtnRef}
            type="button"
            className="solar-modal-close"
            onClick={onClose}
            aria-label={closeLabel}
          >
            <span aria-hidden>×</span>
          </button>
        </div>

        <div className="solar-modal-content">
          <span id={titleId} className="visually-hidden">
            {(isHebrew && project.heTitle) || project.title}
          </span>
          <main
            className="section content-wrap project-detail project-detail-with-nav"
            data-project-slug={project.slug}
          >
            <ProjectCaseStudy project={project} allProjects={allProjects} onSelectNext={onSelectProject} />
          </main>
        </div>
      </div>
    </div>
  );
}
