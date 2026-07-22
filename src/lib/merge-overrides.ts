import type { Project } from "@/types/project";

/** Fields the admin editor is allowed to override, keyed by project slug. */
export type ProjectOverrides = Record<string, Partial<Project>>;

/**
 * Pure merge: base project fields with the override fields layered on top.
 * Side-effect free so it can be unit-checked without Blob access.
 */
export function mergeOverrides(
  base: Project[],
  overrides: ProjectOverrides,
): Project[] {
  return base.map((project) => {
    const override = overrides[project.slug];
    return override ? { ...project, ...override } : project;
  });
}
