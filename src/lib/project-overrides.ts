import "server-only";
import { head, put } from "@vercel/blob";
import { baseProjects } from "@/data/projects";
import type { Project } from "@/types/project";
import { mergeOverrides, type ProjectOverrides } from "@/lib/merge-overrides";

export type { ProjectOverrides };

/** Stable Blob pathname for the overrides document (no random suffix). */
const OVERRIDES_PATH = "content/projects-overrides.json";

/**
 * All Blob read/write tokens present in env, regardless of the prefix chosen
 * when connecting the store (BLOB_READ_WRITE_TOKEN, admin_READ_WRITE_TOKEN, ...).
 * A project can have several stores connected at once (e.g. a leftover private
 * store plus a new public one), so we consider every candidate.
 */
function candidateTokens(): string[] {
  const tokens: string[] = [];
  const add = (v?: string) => {
    if (v && v.startsWith("vercel_blob_rw_") && !tokens.includes(v)) tokens.push(v);
  };
  add(process.env.BLOB_READ_WRITE_TOKEN);
  for (const [key, value] of Object.entries(process.env)) {
    if (key.endsWith("READ_WRITE_TOKEN") && typeof value === "string") add(value);
  }
  return tokens;
}

/** The token that last succeeded for a public write, cached per process. */
let cachedPublicToken: string | null = null;

function isPrivateStoreError(err: unknown): boolean {
  return err instanceof Error && /private (store|access)/i.test(err.message);
}

/**
 * Write a public blob using whichever connected store accepts public access.
 * Skips private stores automatically so a leftover private store connection
 * can't break uploads. Throws a clear error if no public store is available.
 */
export async function putPublic(
  pathname: string,
  body: string | Blob | ArrayBuffer | ReadableStream | File,
  extra: Record<string, unknown> = {},
): Promise<{ url: string }> {
  const ordered = cachedPublicToken
    ? [cachedPublicToken, ...candidateTokens().filter((t) => t !== cachedPublicToken)]
    : candidateTokens();
  if (ordered.length === 0) {
    throw new Error("No Vercel Blob token found. Connect a Blob store to the project.");
  }
  let lastErr: unknown;
  for (const token of ordered) {
    try {
      const blob = await put(pathname, body, { access: "public", token, ...extra });
      cachedPublicToken = token;
      return { url: blob.url };
    } catch (err) {
      lastErr = err;
      if (isPrivateStoreError(err)) continue; // try the next store
      throw err;
    }
  }
  throw new Error(
    "No PUBLIC Vercel Blob store is connected. Create a Blob store with public access. " +
      (lastErr instanceof Error ? lastErr.message : ""),
  );
}

/**
 * Read the overrides document from Vercel Blob. Returns {} when the blob does
 * not exist yet or Blob is unreachable (e.g. local dev without a token), so the
 * site always falls back to the committed base content.
 */
export async function readOverrides(): Promise<ProjectOverrides> {
  // Find the store that actually holds the overrides file. Auth header is
  // harmless on a public URL and enables reads from a private store too.
  const ordered = cachedPublicToken
    ? [cachedPublicToken, ...candidateTokens().filter((t) => t !== cachedPublicToken)]
    : candidateTokens();
  for (const token of ordered) {
    try {
      const meta = await head(OVERRIDES_PATH, { token });
      const res = await fetch(meta.url, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return (await res.json()) as ProjectOverrides;
    } catch {
      // Not in this store (or no token) — try the next.
    }
  }
  // ponytail: no overrides yet / Blob unreachable -> fall back to base content.
  return {};
}

/** Persist the full overrides document back to Blob (overwrites in place). */
export async function writeOverrides(overrides: ProjectOverrides): Promise<void> {
  await putPublic(OVERRIDES_PATH, JSON.stringify(overrides), {
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
