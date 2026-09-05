import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { baseProjects } from "@/data/projects";
import { sanitizeFields } from "@/lib/admin-fields";
import { saveOverride } from "@/lib/project-overrides";
import { SITE_SLUG, sanitizeSiteCopy } from "@/lib/site-copy";
import {
  KIBBUTZ_TYPE_SLUG,
  sanitizeKibbutzTypeSettings,
} from "@/lib/kibbutz-type-settings";
import { requireAdmin } from "@/lib/require-admin";

const KNOWN_SLUGS = new Set(baseProjects.map((p) => p.slug));

/** New (admin-created) project slugs: lowercase kebab, no leading/trailing dash. */
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

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

  // Reserved site-copy row, existing project, or a new valid slug (create).
  const isSiteCopy = slug === SITE_SLUG;
  const isKibbutzType = slug === KIBBUTZ_TYPE_SLUG;
  if (!isSiteCopy && !isKibbutzType && !KNOWN_SLUGS.has(slug) && !SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Invalid project slug" }, { status: 400 });
  }

  try {
    const fields = isSiteCopy
      ? sanitizeSiteCopy(rawFields)
      : isKibbutzType
        ? sanitizeKibbutzTypeSettings(rawFields)
        : sanitizeFields(rawFields);
    await saveOverride(
      slug,
      fields,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // Push edits live immediately.
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath(`/work/${slug}`);
  if (isKibbutzType) revalidatePath("/kibbutz-type");

  return NextResponse.json({ ok: true });
}
