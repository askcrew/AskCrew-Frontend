import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Cookie configuration for security
const COOKIE_OPTIONS = {
  httpOnly: true, // Prevents JavaScript access (XSS protection)
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "strict" as const, // CSRF protection
  path: "/",
};

// Token expiration times
const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const USER_TYPE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, refreshToken, userType } = body;

    const cookieStore = await cookies();

    // Set access token
    if (accessToken) {
      cookieStore.set("accessToken", accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
    }

    // Set refresh token
    if (refreshToken) {
      cookieStore.set("refreshToken", refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });
    }

    // Set user type (not httpOnly since it's not sensitive)
    if (userType) {
      cookieStore.set("userType", userType, {
        ...COOKIE_OPTIONS,
        httpOnly: false, // Allow client-side access for UI purposes
        maxAge: USER_TYPE_MAX_AGE,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting auth cookies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to set cookies" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();

    // Clear all auth cookies
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("userType");
    cookieStore.delete("user");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing auth cookies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear cookies" },
      { status: 500 }
    );
  }
}
