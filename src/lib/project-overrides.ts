import "server-only";
import { head, put } from "@vercel/blob";
import { baseProjects } from "@/data/projects";
import type { Project } from "@/types/project";
import { mergeOverrides, type ProjectOverrides } from "@/lib/merge-overrides";

export type { ProjectOverrides };

/** Stable Blob pathname for the overrides document (no random suffix). */
const OVERRIDES_PATH = "content/projects-overrides.json";

/**
 * Resolve the Blob read/write token from env, regardless of the prefix chosen
 * when connecting the store. Defaults to BLOB_READ_WRITE_TOKEN; otherwise picks
 * any `*_READ_WRITE_TOKEN` whose value looks like a Blob token (e.g. a store
 * connected with the "admin" prefix -> admin_READ_WRITE_TOKEN).
 */
export function getBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  for (const [key, value] of Object.entries(process.env)) {
    if (
      key.endsWith("READ_WRITE_TOKEN") &&
      typeof value === "string" &&
      value.startsWith("vercel_blob_rw_")
    ) {
      return value;
    }
  }
  return undefined;
}

/**
 * Read the overrides document from Vercel Blob. Returns {} when the blob does
 * not exist yet or Blob is unreachable (e.g. local dev without a token), so the
 * site always falls back to the committed base content.
 */
export async function readOverrides(): Promise<ProjectOverrides> {
  try {
    const meta = await head(OVERRIDES_PATH, { token: getBlobToken() });
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
    token: getBlobToken(),
  });
}

/** Base projects with runtime admin overrides merged in. */
export async function getProjects(): Promise<Project[]> {
  return mergeOverrides(baseProjects, await readOverrides());
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((project) => project.slug === slug);
}
