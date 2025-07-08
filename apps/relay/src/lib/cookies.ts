import { parse, serialize } from "cookie";
import { NextRequest, NextResponse } from "next/server";

// Cookie configuration
const COOKIE_NAME = "relay_session";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 24 * 60 * 60, // 24 hours
};

/**
 * Sets a session cookie in the response
 * @param res - Next.js Response object
 * @param token - The session token to set
 */
export function setSessionCookie(res: NextResponse, token: string): void {
  const cookie = serialize(COOKIE_NAME, token, COOKIE_OPTIONS);
  res.headers.set("Set-Cookie", cookie);
}

/**
 * Clears the session cookie from the response
 * @param res - Next.js Response object
 */
export function clearSessionCookie(res: NextResponse): void {
  const cookie = serialize(COOKIE_NAME, "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
  res.headers.set("Set-Cookie", cookie);
}

/**
 * Gets the session cookie value from the request
 * @param req - Next.js Request object
 * @returns The session token or undefined if not found
 */
export function getSessionCookie(req: NextRequest): string | undefined {
  const cookieString = req.headers.get("cookie");
  return getSessionCookieFromString(cookieString || undefined);
}

/**
 * Gets the session cookie value from a cookie string (for middleware)
 * @param cookieString - The cookie string from the request
 * @returns The session token or undefined if not found
 */
export function getSessionCookieFromString(
  cookieString: string | undefined,
): string | undefined {
  if (!cookieString) {
    return undefined;
  }

  const cookies = parse(cookieString);
  return cookies[COOKIE_NAME];
}

/**
 * Creates a cookie string for setting in the browser
 * @param token - The session token
 * @returns A cookie string that can be set in the browser
 */
export function createCookieString(token: string): string {
  return serialize(COOKIE_NAME, token, {
    ...COOKIE_OPTIONS,
    httpOnly: false, // Allow client-side access for localStorage sync
  });
}

/**
 * Creates a cookie string for clearing in the browser
 * @returns A cookie string that clears the session cookie
 */
export function createClearCookieString(): string {
  return serialize(COOKIE_NAME, "", {
    ...COOKIE_OPTIONS,
    httpOnly: false,
    maxAge: 0,
  });
}
