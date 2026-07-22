import "server-only";
import { head, put } from "@vercel/blob";
import { baseProjects } from "@/data/projects";
import type { Project } from "@/types/project";
import { mergeOverrides, type ProjectOverrides } from "@/lib/merge-overrides";

export type { ProjectOverrides };

/** Stable Blob pathname for the overrides document (no random suffix). */
const OVERRIDES_PATH = "content/projects-overrides.json";

/**
 * Read the overrides document from Vercel Blob. Returns {} when the blob does
 * not exist yet or Blob is unreachable (e.g. local dev without a token), so the
 * site always falls back to the committed base content.
 */
export async function readOverrides(): Promise<ProjectOverrides> {
  try {
    const meta = await head(OVERRIDES_PATH);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return {};
    return (await res.json()) as ProjectOverrides;
  } catch {
    // ponytail: swallow "not found"/no-token errors -> fall back to base content.
    return {};
  }
}

/** Persist the full overrides document back to Blob (overwrites in place). */
export async function writeOverrides(overrides: ProjectOverrides): Promise<void> {
  await put(OVERRIDES_PATH, JSON.stringify(overrides), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

/** Base projects with runtime admin overrides merged in. */
export async function getProjects(): Promise<Project[]> {
  return mergeOverrides(baseProjects, await readOverrides());
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((project) => project.slug === slug);
}
