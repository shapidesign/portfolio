import { NextResponse } from "next/server";
import { validateWallInput } from "@/lib/kibbutz-wall";
import { addWallEntry, readWall } from "@/lib/kibbutz-wall-store";

export const dynamic = "force-dynamic";

/** Public: the canvas polls this. */
export async function GET() {
  return NextResponse.json(
    { entries: await readWall() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

/** Public: the /kibbutz-type form posts here. Validation + filter is the trust boundary. */
// ponytail: no rate limit. Upgrade path: a Vercel Firewall rate-limit rule on /api/kibbutz-wall.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const result = validateWallInput(body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  try {
    await addWallEntry(result.entry);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
