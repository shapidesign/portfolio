import { Project, Accent, ShapeVariant } from "../types/project";
import { projectsContent } from "./projects.content";
import generatedRaw from "./projects.generated.json";

export type { Project, Accent, ShapeVariant };

// Helper to validate generated data
function isValidProject(item: any): item is Project {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof item.slug === "string" &&
    typeof item.title === "string"
  );
}

const generatedProjects = Array.isArray(generatedRaw)
  ? generatedRaw.filter(isValidProject)
  : [];

// Use generated projects if available, otherwise fallback to static content
export const projects: Project[] =
  generatedProjects.length > 0 ? generatedProjects : projectsContent;

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
