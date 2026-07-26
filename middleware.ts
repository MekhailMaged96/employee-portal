import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const PUBLIC_ROUTES = ["/login", "/register", "/forbidden"];
const ADMIN_ROUTES = ["/users", "/roles"];

function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get("token")?.value ?? null;
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = jwtDecode<{ exp?: number }>(token);
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function extractRoles(token: string): string[] {
  try {
    const payload = jwtDecode<Record<string, unknown>>(token);
    const raw =
      (payload.roles ?? payload.authorities ?? payload.role ?? payload.scope ?? []) as
        | string
        | string[]
        | { authority?: string; name?: string }[];

    const arr = Array.isArray(raw) ? raw : String(raw).split(/[\s,]+/);
    return arr
      .map((r) =>
        typeof r === "object"
          ? (r as { authority?: string }).authority ?? (r as { name?: string }).name ?? ""
          : String(r),
      )
      .filter(Boolean)
      .map((r) => r.replace(/^ROLE_/, ""));
  } catch {
    return [];
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let public routes through always
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(req);

  // No token or expired → redirect to login, preserve intended destination
  if (!token || isTokenExpired(token)) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only routes
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    const roles = extractRoles(token);
    if (!roles.includes("ADMIN")) {
      const forbiddenUrl = req.nextUrl.clone();
      forbiddenUrl.pathname = "/forbidden";
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons.svg).*)"],
};
