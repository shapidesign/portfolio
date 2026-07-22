import { appendFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const LOG_PATH = path.join(process.cwd(), ".cursor", "debug-d9a24e.log");

/** Dev-only: persist debug NDJSON lines when the Cursor ingest server is unavailable. */
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }
  try {
    const text = await req.text();
    if (!text.trim()) {
      return NextResponse.json({ ok: true });
    }
    await mkdir(path.dirname(LOG_PATH), { recursive: true });
    await appendFile(LOG_PATH, text.endsWith("\n") ? text : `${text}\n`, "utf8");
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "write failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
