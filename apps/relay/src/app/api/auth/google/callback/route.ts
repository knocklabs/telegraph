import { NextRequest, NextResponse } from "next/server";

import { issueSessionJwt, verifyGoogleIdToken } from "@/lib/auth";
import { setSessionCookie } from "@/lib/cookies";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { credential } = body;

    if (!credential) {
      return NextResponse.json(
        { error: "Missing credential" },
        { status: 400 },
      );
    }

    // Verify the Google ID token
    const googlePayload = await verifyGoogleIdToken(credential);

    // Issue our own session JWT
    const sessionToken = issueSessionJwt({
      sub: googlePayload.sub,
      email: googlePayload.email,
    });

    // Create the response
    const response = NextResponse.json(
      {
        success: true,
        token: sessionToken,
        user: {
          email: googlePayload.email,
          name: googlePayload.name,
          picture: googlePayload.picture,
        },
      },
      { status: 200 },
    );

    // Set the session cookie
    setSessionCookie(response, sessionToken);

    return response;
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    // Get appropriate error message
    const errorMessage =
      error instanceof Error ? error.message : "Authentication failed";

    // Check if it's a domain restriction error
    if (errorMessage.includes("Only @knock.app email addresses are allowed")) {
      return NextResponse.json(
        { error: "Access denied: Only @knock.app email addresses are allowed" },
        { status: 403 },
      );
    }

    // Check if it's an email verification error
    if (errorMessage.includes("Email not verified")) {
      return NextResponse.json(
        { error: "Please verify your email address and try again" },
        { status: 400 },
      );
    }

    // Generic error for other cases
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 },
    );
  }
}
