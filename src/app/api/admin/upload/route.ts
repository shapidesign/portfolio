import { NextResponse } from "next/server";
import { baseProjects } from "@/data/projects";
import { putPublic } from "@/lib/project-overrides";

const KNOWN_SLUGS = new Set(baseProjects.map((p) => p.slug));

/** Strip anything that isn't a safe filename character. */
function safeName(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
  return cleaned || "image";
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const slug = form.get("slug");
  const file = form.get("file");

  if (typeof slug !== "string" || !KNOWN_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Unknown project" }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  const blob = await putPublic(`content/uploads/${slug}/${safeName(file.name)}`, file, {
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}
