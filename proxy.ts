import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/api/admin/login", "/api/admin/logout"];

export function proxy(request: NextRequest) {
  if (PUBLIC_PATHS.some((p) => request.nextUrl.pathname === p)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("fsr_admin_token")?.value;
  const validToken = process.env.ADMIN_SESSION_TOKEN;

  if (!token || token !== validToken) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path+", "/api/admin/:path*"],
};
