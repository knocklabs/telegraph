import { NextResponse } from "next/server";

import { clearSessionCookie } from "@/lib/cookies";

export async function POST(): Promise<NextResponse> {
  try {
    // Create the response
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 },
    );

    // Clear the session cookie
    clearSessionCookie(response);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
