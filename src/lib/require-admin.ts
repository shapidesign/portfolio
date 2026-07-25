import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, isValidSession } from "@/lib/admin-auth";

/**
 * In-route admin gate: returns a 401 response when the session cookie is
 * missing/invalid, or null when authenticated. Route handlers guard
 * themselves so auth never depends on proxy/middleware file conventions.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
