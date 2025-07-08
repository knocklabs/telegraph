import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

// Session expiration time (24 hours)
const SESSION_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

// Types
type SessionPayload = {
  sub: string;
  email: string;
  exp: number;
  iat: number;
};

type GoogleTokenPayload = {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
};

// Environment variables validation
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID environment variable is required');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Initialize Google OAuth2 client
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Verifies a Google ID token and returns the payload
 * @param idToken - The Google ID token to verify
 * @returns The verified token payload
 * @throws Error if token is invalid or email is not verified
 */
export async function verifyGoogleIdToken(idToken: string): Promise<GoogleTokenPayload> {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      throw new Error('Invalid token payload');
    }

    // Ensure email is verified
    if (!payload.email_verified) {
      throw new Error('Email not verified');
    }

    // Ensure email exists
    if (!payload.email) {
      throw new Error('Email not found in token');
    }

    // Check if email is from knock.app domain
    if (!payload.email.endsWith('@knock.app')) {
      throw new Error('Access denied: Only @knock.app email addresses are allowed');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      email_verified: payload.email_verified,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Google token verification failed: ${error.message}`);
    }
    throw new Error('Google token verification failed: Unknown error');
  }
}

/**
 * Issues a new session JWT token
 * @param payload - The session payload containing user information
 * @returns A signed JWT token
 */
export function issueSessionJwt(payload: { sub: string; email: string }): string {
  const now = Math.floor(Date.now() / 1000);
  
  const sessionPayload: SessionPayload = {
    sub: payload.sub,
    email: payload.email,
    iat: now,
    exp: now + SESSION_EXPIRY,
  };

  return jwt.sign(sessionPayload, JWT_SECRET as string, { algorithm: 'HS256' });
}

/**
 * Parses and verifies a session JWT token
 * @param token - The JWT token to parse
 * @returns The session payload or null if invalid
 */
export function parseSessionJwt(token: string | undefined): SessionPayload | null {
  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET as string, { algorithms: ['HS256'] }) as unknown as SessionPayload;
    
    // Ensure the payload has required fields
    if (!payload.sub || !payload.email || !payload.exp) {
      return null;
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    // Verify email domain (additional security check)
    if (!payload.email.endsWith('@knock.app')) {
      return null;
    }

    return payload;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Validates a session token and returns user information
 * @param token - The session token to validate
 * @returns User information if valid, null otherwise
 */
export function validateSession(token: string | undefined): { sub: string; email: string } | null {
  const payload = parseSessionJwt(token);
  
  if (!payload) {
    return null;
  }

  return {
    sub: payload.sub,
    email: payload.email,
  };
}

/**
 * Generates a secure random JWT secret (for development/setup)
 * @returns A base64-encoded random string
 */
export function generateJwtSecret(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(64).toString('base64');
}