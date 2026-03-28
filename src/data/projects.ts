import { Project, Accent, ShapeVariant } from "../types/project";
import generatedRaw from "./projects.generated.json";

export type { Project, Accent, ShapeVariant };

const PROJECT_CONTEXT: Record<string, string> = {
  "small-world-problems":
    "A typographic experiment exploring how a single letter, scaled and repositioned, changes meaning. Made as a self-initiated study in visual impact (and a bit of humor).",
  "the-misfit-market":
    "Research and brand identity for a concept sustainable grocery that celebrates imperfect produce. Developed as a student project at HiT.",
  "animal-to-logo":
    "An exercise in reduction \u2014 taking complex animal forms and distilling them to their meaningful truth. Inspired by Paul Rand\u2019s and George Bokhua\u2019s approach to logo thinking. HiT.",
  "digital-handprint":
    "A self-portrait built in code, not pixels. An exploration of what it means to leave a mark in a digital space that remembers nothing, and a hint of self-criticism about my computer use habits.",
  "keeping-it-clean":
    "Packaging system for The Clean Dot, designed around the idea that cleaning products shouldn\u2019t look like a compromise, hidden underneath the sink \u2014 they should be right there on the counter!",
  "no-gatekeeping":
    "A free web directory of design resources, built for students who need an easy way to find the tools that will help their academic work. Designed and developed independently for HiT VC Department.",
};

const HE_PROJECT_CONTEXT: Record<string, string> = {
  "the-misfit-market":
    "מחקר וזהות מותגית לסופרמרקט קונספט בר-קיימא שחוגג תוצרת לא-מושלמת. פותח כפרויקט לימודים בהיט.",
  "keeping-it-clean":
    "מערכת אריזות ל-The Clean Dot, בנויה סביב הרעיון שמוצרי ניקיון לא צריכים להיות פשרה מתחת לכיור — הם צריכים לעמוד על השיש!",
};

function isValidProject(item: unknown): item is Project {
  if (typeof item !== "object" || item === null) return false;
  const p = item as Record<string, unknown>;
  return typeof p.slug === "string" && typeof p.title === "string";
}

const generatedProjects: Project[] = Array.isArray(generatedRaw)
  ? (generatedRaw as unknown[]).filter(isValidProject).map((p) => ({
      ...p,
      context: PROJECT_CONTEXT[p.slug] ?? "",
      ...(!p.heContext && HE_PROJECT_CONTEXT[p.slug]
        ? { heContext: HE_PROJECT_CONTEXT[p.slug] }
        : {}),
    }))
  : [];

export const projects: Project[] = generatedProjects;

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
