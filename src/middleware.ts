import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access-token")?.value;

  // Define protected routes
  const protectedRoutes = [
    "/projects",
    "/blogs",
    "/jobPosts",
    "/applications",
    "/gallery",
    "/projectEnquiry",
    "/contact",
  ];

  // Check if the request is for a protected route
  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    if (!token) {
      // Redirect to login if token is missing
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: [
    "/projects",
    "/blogs",
    "/jobPosts",
    "/applications",
    "/gallery",
    "/projectEnquiry",
    "/contact",
  ],
};
