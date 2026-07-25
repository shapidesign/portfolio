import "server-only";
import { baseProjects } from "@/data/projects";
import type { Project } from "@/types/project";
import { mergeOverrides, type ProjectOverrides } from "@/lib/merge-overrides";
import { SITE_COPY_DEFAULTS, SITE_SLUG, type SiteCopy } from "@/lib/site-copy";

export type { ProjectOverrides };

/**
 * Admin content persistence on Supabase (PostgREST).
 *
 * The URL and anon key are public by design (they ship in every Supabase
 * client bundle); row-level security does the gating: reads are public,
 * writes require the x-admin-secret header checked by the RLS policy.
 *
 * ponytail: the write secret is embedded with an env override, matching the
 * user's requested hardcoded-credentials model for this admin. Upgrade path:
 * set CONTENT_WRITE_SECRET in Vercel env + update the RLS policy.
 */
const SUPABASE_URL =
  process.env.SUPABASE_URL ?? "https://svmgctxeojtdbntecohm.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bWdjdHhlb2p0ZGJudGVjb2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NTczMjksImV4cCI6MjA5NzMzMzMyOX0.fcRCOb2DFffxDG-Lv-8kKHjZovZzZ3eDn7t9o9CWBHI";
const WRITE_SECRET =
  process.env.CONTENT_WRITE_SECRET ?? "sp_content_write_7Kq2mXv9pLwR4tZ8";

const REST = `${SUPABASE_URL}/rest/v1`;

function baseHeaders(write = false): Record<string, string> {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...(write ? { "x-admin-secret": WRITE_SECRET } : {}),
  };
}

/** All per-slug overrides. Returns {} when unreachable so the site never breaks. */
export async function readOverrides(): Promise<ProjectOverrides> {
  try {
    const res = await fetch(`${REST}/project_overrides?select=slug,fields`, {
      headers: baseHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return {};
    const rows = (await res.json()) as { slug: string; fields: Partial<Project> }[];
    return Object.fromEntries(rows.map((r) => [r.slug, r.fields]));
  } catch {
    // ponytail: fall back to committed base content on any storage error.
    return {};
  }
}

/** Merge `fields` into the stored override row for `slug` (upsert). */
export async function saveOverride(
  slug: string,
  fields: Record<string, unknown>,
): Promise<void> {
  const existing = (await readOverrides())[slug] ?? {};
  const res = await fetch(`${REST}/project_overrides?on_conflict=slug`, {
    method: "POST",
    headers: {
      ...baseHeaders(true),
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify([{ slug, fields: { ...existing, ...fields } }]),
  });
  if (!res.ok) {
    throw new Error(`Supabase save failed (${res.status}): ${await res.text()}`);
  }
}

/** Store an uploaded image; returns the site-relative URL that serves it. */
export async function saveMedia(
  contentType: string,
  data: ArrayBuffer,
): Promise<string> {
  const res = await fetch(`${REST}/project_media?select=id`, {
    method: "POST",
    headers: {
      ...baseHeaders(true),
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify([
      {
        content_type: contentType,
        data_base64: Buffer.from(data).toString("base64"),
      },
    ]),
  });
  if (!res.ok) {
    throw new Error(`Supabase upload failed (${res.status}): ${await res.text()}`);
  }
  const [row] = (await res.json()) as { id: string }[];
  return `/api/media/${row.id}/`;
}

/** Fetch a stored image by id. Returns null when missing. */
export async function readMedia(
  id: string,
): Promise<{ contentType: string; data: Buffer } | null> {
  const res = await fetch(
    `${REST}/project_media?id=eq.${encodeURIComponent(id)}&select=content_type,data_base64`,
    { headers: baseHeaders(), cache: "no-store" },
  );
  if (!res.ok) return null;
  const rows = (await res.json()) as { content_type: string; data_base64: string }[];
  if (rows.length === 0) return null;
  return {
    contentType: rows[0].content_type,
    data: Buffer.from(rows[0].data_base64, "base64"),
  };
}

/** Site-wide copy: stored "__site__" row merged over defaults. */
export async function getSiteCopy(): Promise<SiteCopy> {
  const stored = (await readOverrides())[SITE_SLUG] ?? {};
  return { ...SITE_COPY_DEFAULTS, ...(stored as SiteCopy) };
}

/** Base projects with runtime admin overrides merged in. */
export async function getProjects(): Promise<Project[]> {
  return mergeOverrides(baseProjects, await readOverrides());
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((project) => project.slug === slug);
}
