import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { baseProjects } from "@/data/projects";
import { sanitizeFields } from "@/lib/admin-fields";
import { saveOverride } from "@/lib/project-overrides";

const KNOWN_SLUGS = new Set(baseProjects.map((p) => p.slug));

export async function POST(req: Request) {
  let slug = "";
  let rawFields: Record<string, unknown> = {};
  try {
    const body = await req.json();
    slug = typeof body?.slug === "string" ? body.slug : "";
    rawFields =
      body?.fields && typeof body.fields === "object" ? body.fields : {};
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!KNOWN_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Unknown project" }, { status: 400 });
  }

  try {
    await saveOverride(slug, sanitizeFields(rawFields));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // Push edits live immediately.
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath(`/work/${slug}`);

  return NextResponse.json({ ok: true });
}
