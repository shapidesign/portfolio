import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSession } from "@/lib/admin-auth";

/**
 * Guards the admin API. Login is public; everything else under /api/admin
 * requires a valid session cookie. The /admin page self-guards (renders the
 * login form when unauthenticated) so it is not matched here.
 *
 * Next.js 16 renamed middleware.ts to proxy.ts — the old filename was
 * silently ignored, so routes also self-guard via requireAdmin() and never
 * rely on this file alone.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Normalize the trailingSlash redirect (/api/admin/login -> /api/admin/login/).
  const path = pathname.replace(/\/+$/, "");
  if (path === "/api/admin/login") return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!isValidSession(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
