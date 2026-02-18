import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const APEX_DOMAIN = "shapidesign.com";
const WWW_DOMAIN = "www.shapidesign.com";

export function proxy(request: NextRequest) {
  const hostHeader = request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0].toLowerCase();

  if (hostname === APEX_DOMAIN) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.host = WWW_DOMAIN;
    redirectUrl.protocol = "https";
    return NextResponse.redirect(redirectUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"]
};
