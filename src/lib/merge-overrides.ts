import type { Project } from "@/types/project";

/** Fields the admin editor is allowed to override, keyed by project slug. */
export type ProjectOverrides = Record<string, Partial<Project>>;

/** Baseline for admin-created projects; overrides layer on top. */
export const DEFAULT_PROJECT: Omit<Project, "slug"> = {
  title: "Untitled project",
  subHeader: "",
  context: "",
  description: "",
  bodyText: "",
  images: [],
  tags: [],
  category: "Project",
  summary: "",
  services: [],
  year: "",
  challenge: "",
  process: "",
  outcome: "",
  accent: "primary",
  thumbnailShape: "square",
  thumbnailHoverShape: "circle",
};

/**
 * Pure merge: base project fields with the override fields layered on top.
 * Override rows whose slug isn't in base become new projects (admin-created),
 * built on DEFAULT_PROJECT. Reserved rows (slug starting "__", e.g. site
 * copy) are never treated as projects.
 * Side-effect free so it can be unit-checked without storage access.
 */
export function mergeOverrides(
  base: Project[],
  overrides: ProjectOverrides,
): Project[] {
  const merged = base.map((project) => {
    const override = overrides[project.slug];
    if (!override) return project;
    // ponytail: blank strings never override — an empty admin field means
    // "keep the base content", otherwise blanks mask real (e.g. Hebrew) copy.
    const meaningful = Object.fromEntries(
      Object.entries(override).filter(
        ([, v]) => !(typeof v === "string" && v.trim() === ""),
      ),
    );
    return { ...project, ...meaningful };
  });
  const known = new Set(base.map((project) => project.slug));
  for (const [slug, fields] of Object.entries(overrides)) {
    if (known.has(slug) || slug.startsWith("__")) continue;
    merged.push({ ...DEFAULT_PROJECT, ...fields, slug });
  }
  return merged;
}
