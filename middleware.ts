import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const userType = request.cookies.get("userType")?.value;
  const path = request.nextUrl.pathname;

  // Define protected routes for each user type
  const enterpriseRoutes = ["/enterprise/dashboard"];
  const studentRoutes = ["/student/dashboard"];
  const authRoutes = ["/viewer/login", "/viewer/sign-up"];

  // Check if the path matches any protected route pattern
  const isEnterpriseRoute = enterpriseRoutes.some((route) =>
    path.startsWith(route)
  );
  const isStudentRoute = studentRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // If user is logged in and trying to access auth pages, redirect to their dashboard
  if (accessToken && userType && isAuthRoute) {
    if (userType === "enterprise") {
      return NextResponse.redirect(
        new URL("/enterprise/dashboard", request.url)
      );
    } else if (userType === "student") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect enterprise routes
  if (isEnterpriseRoute) {
    if (!accessToken) {
      // Not authenticated - redirect to login
      return NextResponse.redirect(new URL("/viewer/login", request.url));
    }
    if (userType !== "enterprise") {
      // Wrong user type - redirect to appropriate page
      if (userType === "student") {
        return NextResponse.redirect(
          new URL("/student/dashboard", request.url)
        );
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect student routes
  if (isStudentRoute) {
    if (!accessToken) {
      // Not authenticated - redirect to login
      return NextResponse.redirect(new URL("/viewer/login", request.url));
    }
    if (userType !== "student") {
      // Wrong user type - redirect to appropriate page
      if (userType === "enterprise") {
        return NextResponse.redirect(
          new URL("/enterprise/dashboard", request.url)
        );
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|icons|images|sw.js).*)",
  ],
};
