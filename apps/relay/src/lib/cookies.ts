import { serialize, parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

// Cookie configuration
const COOKIE_NAME = 'relay_session';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 24 * 60 * 60, // 24 hours
};

/**
 * Sets a session cookie in the response
 * @param res - Next.js API response object
 * @param token - The session token to set
 */
export function setSessionCookie(res: NextApiResponse, token: string): void {
  const cookie = serialize(COOKIE_NAME, token, COOKIE_OPTIONS);
  res.setHeader('Set-Cookie', cookie);
}

/**
 * Clears the session cookie from the response
 * @param res - Next.js API response object
 */
export function clearSessionCookie(res: NextApiResponse): void {
  const cookie = serialize(COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
  res.setHeader('Set-Cookie', cookie);
}

/**
 * Gets the session cookie value from the request
 * @param req - Next.js API request object
 * @returns The session token or undefined if not found
 */
export function getSessionCookie(req: NextApiRequest): string | undefined {
  if (!req.headers.cookie) {
    return undefined;
  }

  const cookies = parse(req.headers.cookie);
  return cookies[COOKIE_NAME];
}

/**
 * Gets the session cookie value from a cookie string (for middleware)
 * @param cookieString - The cookie string from the request
 * @returns The session token or undefined if not found
 */
export function getSessionCookieFromString(cookieString: string | undefined): string | undefined {
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
  return serialize(COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    httpOnly: false,
    maxAge: 0,
  });
}