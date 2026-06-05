import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: "No refresh token" },
        { status: 401 }
      );
    }

    // Call the backend refresh endpoint
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/token/refresh`,
      {},
      {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
        withCredentials: true,
      }
    );

    const newAccessToken = response.data.access;
    const newRefreshToken = response.data.refresh;

    if (!newAccessToken) {
      throw new Error("No access token in refresh response");
    }

    // Update access token cookie
    cookieStore.set("accessToken", newAccessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    // Update refresh token if provided
    if (newRefreshToken) {
      cookieStore.set("refreshToken", newRefreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Token refresh failed:", error);

    // Clear cookies on refresh failure
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return NextResponse.json(
      { success: false, error: "Token refresh failed" },
      { status: 401 }
    );
  }
}
