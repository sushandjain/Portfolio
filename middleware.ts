import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "portfolio_session";
const JWT_SECRET_STRING = process.env.JWT_SECRET || "super_secret_portfolio_jwt_key_sushan_jain_2026_secure_key_32chars";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "sushandjain@gmail.com").toLowerCase().trim();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isAuthRoute = pathname === "/admin/login" || pathname === "/admin/forgot-password" || pathname === "/admin/reset-password";
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let isValidSession = false;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (
        payload.email &&
        payload.role === "admin" &&
        (payload.email as string).toLowerCase().trim() === ADMIN_EMAIL
      ) {
        isValidSession = true;
      }
    } catch {
      isValidSession = false;
    }
  }

  // If user is already authenticated and visits login/forgot-password, redirect to admin dashboard
  if (isAuthRoute && isValidSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If user is NOT authenticated and attempts to access protected admin pages, redirect to login
  if (!isAuthRoute && !isValidSession) {
    const loginUrl = new URL("/admin/login", request.url);
    if (pathname !== "/admin") {
      loginUrl.searchParams.set("from", pathname);
    }
    const response = NextResponse.redirect(loginUrl);
    // Clear invalid cookie if present
    if (token) {
      response.cookies.delete(SESSION_COOKIE_NAME);
    }
    return response;
  }

  // Proceed with enhanced security headers for admin routes
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
