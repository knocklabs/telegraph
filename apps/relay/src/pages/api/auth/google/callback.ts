import { NextApiRequest, NextApiResponse } from 'next';
import { verifyGoogleIdToken, issueSessionJwt } from '@/lib/auth';
import { setSessionCookie } from '@/lib/cookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Missing credential' });
    }

    // Verify the Google ID token
    const googlePayload = await verifyGoogleIdToken(credential);

    // Issue our own session JWT
    const sessionToken = issueSessionJwt({
      sub: googlePayload.sub,
      email: googlePayload.email,
    });

    // Set the session cookie
    setSessionCookie(res, sessionToken);

    // Return success response with token for localStorage
    res.status(200).json({
      success: true,
      token: sessionToken,
      user: {
        email: googlePayload.email,
        name: googlePayload.name,
        picture: googlePayload.picture,
      },
    });
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    
    // Return appropriate error message
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    
    // Check if it's a domain restriction error
    if (errorMessage.includes('Only @knock.app email addresses are allowed')) {
      return res.status(403).json({ error: 'Access denied: Only @knock.app email addresses are allowed' });
    }
    
    // Check if it's an email verification error
    if (errorMessage.includes('Email not verified')) {
      return res.status(400).json({ error: 'Please verify your email address and try again' });
    }
    
    // Generic error for other cases
    return res.status(401).json({ error: 'Authentication failed' });
  }
}