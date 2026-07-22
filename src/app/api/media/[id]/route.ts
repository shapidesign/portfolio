import { NextResponse } from "next/server";
import { readMedia } from "@/lib/project-overrides";

/** Serves admin-uploaded images stored in Supabase. Content is immutable per id. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return new NextResponse(null, { status: 400 });
  }

  const media = await readMedia(id);
  if (!media) return new NextResponse(null, { status: 404 });

  return new NextResponse(new Uint8Array(media.data), {
    headers: {
      "Content-Type": media.contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
