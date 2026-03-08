import { NextRequest, NextResponse } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/urls",
  "/links",
  "/earnings",
  "/disclosures",
  "/settings",
];

const authPaths = ["/sign-in", "/sign-up"];

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const { pathname } = request.nextUrl;

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
    "/earnings/:path*",
    "/disclosures/:path*",
    "/settings/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
