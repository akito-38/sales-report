import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/api/auth/login", "/login"];

function isProtectedPath(pathname: string): boolean {
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return false;
  }
  if (pathname.startsWith("/api/") || pathname.startsWith("/dashboard/")) {
    return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get("auth_token")?.value ??
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          error: {
            code: "AUTH_UNAUTHORIZED",
            message: "認証が必要です",
          },
        },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          error: {
            code: "AUTH_UNAUTHORIZED",
            message: "認証が必要です",
          },
        },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};
