import { Project, Accent, ShapeVariant } from "../types/project";
import generatedRaw from "./projects.generated.json";

export type { Project, Accent, ShapeVariant };

// Helper to validate generated data
function isValidProject(item: unknown): item is Project {
  if (typeof item !== "object" || item === null) return false;
  const p = item as Record<string, unknown>;
  return typeof p.slug === "string" && typeof p.title === "string";
}

const generatedProjects: Project[] = Array.isArray(generatedRaw)
  ? (generatedRaw as unknown[]).filter(isValidProject)
  : [];

// Always prefer generated projects to avoid showing placeholder content.
export const projects: Project[] = generatedProjects;

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
