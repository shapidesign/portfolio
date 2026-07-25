import { NextResponse } from "next/server";
import { baseProjects } from "@/data/projects";
import { saveMedia } from "@/lib/project-overrides";
import { requireAdmin } from "@/lib/require-admin";

const KNOWN_SLUGS = new Set(baseProjects.map((p) => p.slug));

/**
 * ponytail: images are stored base64 in Postgres and served via /api/media.
 * Ceiling: request body limit ~4.5MB on Vercel, so cap uploads at 4MB.
 * Upgrade path: Supabase Storage bucket + service-role key env var.
 */
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const slug = form.get("slug");
  const file = form.get("file");

  // Existing project or a valid admin-created slug (see save route).
  const validSlug =
    typeof slug === "string" &&
    (KNOWN_SLUGS.has(slug) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug));
  if (!validSlug) {
    return NextResponse.json({ error: "Unknown project" }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image too large — keep uploads under 4MB." },
      { status: 400 },
    );
  }

  try {
    const url = await saveMedia(file.type, await file.arrayBuffer());
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
