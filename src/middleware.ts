import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("uw_auth");
  const isLoginPage = request.nextUrl.pathname === "/login";

  // If authenticated and trying to access login, redirect to home
  if (isLoginPage && authCookie?.value === "neil_authenticated") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If not authenticated and not on login page, redirect to login
  if (!isLoginPage && authCookie?.value !== "neil_authenticated") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
