import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { LOGIN_PATH } from "./lib/auth/constants";
import { sanitizeReturnTo } from "./lib/auth/return-to";

const PUBLIC_PATHS = new Set(["/login", "/register"]);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const hasSession = Boolean(accessToken || refreshToken);

  const isPublicPath = PUBLIC_PATHS.has(pathname);

  if (isPublicPath) {
    if (pathname === LOGIN_PATH && hasSession) {
      const reason =
        request.nextUrl.searchParams.get("reason");

      // Prevent redirect loop when cookies could not be cleared
      if (reason !== "expired") {
        const returnTo = sanitizeReturnTo(
          request.nextUrl.searchParams.get("returnTo")
        );

        return NextResponse.redirect(
          new URL(returnTo ?? "/", request.url)
        );
      }
    }

    return NextResponse.next();
  }

  if (!hasSession) {
    const loginUrl = new URL(LOGIN_PATH, request.url);

    if (pathname !== "/") {
      loginUrl.searchParams.set(
        "returnTo",
        pathname + search
      );
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
