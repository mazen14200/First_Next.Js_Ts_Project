import { NextRequest, NextResponse } from "next/server";

import { authBackend } from "@/lib/auth/backend";
import { AUTH_COOKIE } from "@/lib/auth/constants";
import { clearAuthCookies } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(
    AUTH_COOKIE.ACCESS_TOKEN
  )?.value;
  const refreshToken = request.cookies.get(
    AUTH_COOKIE.REFRESH_TOKEN
  )?.value;

  /*
   * Best-effort token revocation on the backend.
   * Logout always succeeds locally even if the
   * backend is unreachable or tokens are missing.
   */
  if (accessToken && refreshToken) {
    try {
      await authBackend.post(
        "/Auth/logout",
        { refreshToken, accessToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Backend logout failed:", error);
    }
  }

  const res = NextResponse.json({
    message: "Logout successful",
  });

  clearAuthCookies(res.cookies);

  return res;
}
