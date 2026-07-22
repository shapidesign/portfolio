import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_TOKEN,
  verifyCredentials,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  let user = "";
  let pass = "";
  try {
    const body = await req.json();
    user = typeof body?.user === "string" ? body.user : "";
    pass = typeof body?.pass === "string" ? body.pass : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!verifyCredentials(user, pass)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
