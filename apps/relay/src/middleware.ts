import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSessionCookieFromString } from "./lib/cookies";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public assets and the auth routes themselves
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/login" ||
    pathname.startsWith("/public") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/api/_next") ||
    pathname.startsWith("/__nextjs")
  ) {
    return NextResponse.next();
  }

  // Get the session token from cookies
  const cookieHeader = request.headers.get("cookie");
  const token = getSessionCookieFromString(cookieHeader || undefined);

  // Basic JWT validation (we can't use the full parseSessionJwt in Edge runtime)
  if (token && isValidJwtFormat(token)) {
    try {
      // Basic token format validation and expiry check
      const payload = parseJwtPayload(token);

      if (payload && payload.email && payload.email.endsWith("@knock.app")) {
        // Check if token is expired
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp > now) {
          return NextResponse.next();
        }
      }
    } catch (_error) {
      // Token is invalid, redirect to login
    }
  }

  // Not authenticated → send to /login
  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

// Helper function to validate JWT format
function isValidJwtFormat(token: string): boolean {
  const parts = token.split(".");
  return parts.length === 3;
}

// Helper function to parse JWT payload (without verification for Edge runtime)
function parseJwtPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = atob(paddedPayload);
    return JSON.parse(decoded);
  } catch (_error) {
    return null;
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
