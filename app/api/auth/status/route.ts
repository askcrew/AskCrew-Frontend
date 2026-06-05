import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();

    // Get access token (returns null if not exists)
    const accessToken = cookieStore.get("accessToken")?.value || null;

    // Get user type (not sensitive, used for UI)
    const userType = cookieStore.get("userType")?.value || null;

    // Note: We intentionally don't expose refreshToken to the client
    // It's used only in server-side operations

    return NextResponse.json({
      accessToken,
      userType,
      isAuthenticated: !!accessToken,
    });
  } catch (error) {
    console.error("Error getting auth status:", error);
    return NextResponse.json(
      { accessToken: null, userType: null, isAuthenticated: false },
      { status: 500 }
    );
  }
}
