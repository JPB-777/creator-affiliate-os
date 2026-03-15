import { NextRequest, NextResponse } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/urls",
  "/links",
  "/broken-links",
  "/earnings",
  "/disclosures",
  "/settings",
  "/onboarding",
  "/tags",
  "/activity",
  "/opportunities",
  "/content-drift",
];

const authPaths = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const { pathname } = request.nextUrl;

  // Rate limit auth POST requests (sign-in/sign-up form submissions)
  if (
    request.method === "POST" &&
    pathname.startsWith("/api/auth")
  ) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { checkAuthRateLimit } = await import("@/lib/rate-limit");
    const { success } = await checkAuthRateLimit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }
  }

  // Redirect authenticated users away from auth pages
  if (sessionCookie && authPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to sign-in
  if (!sessionCookie && protectedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/urls/:path*",
    "/links/:path*",
    "/broken-links/:path*",
    "/earnings/:path*",
    "/disclosures/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
    "/tags/:path*",
    "/activity/:path*",
    "/opportunities/:path*",
    "/content-drift/:path*",
    "/sign-in",
    "/sign-up",
    "/api/auth/:path*",
  ],
};
