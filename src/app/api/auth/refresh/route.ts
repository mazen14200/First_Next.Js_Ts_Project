import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE } from "../../../../lib/auth/constants";
import { setAuthCookies } from "../../../../lib/auth/cookies";
import { refreshSession } from "../../../../lib/auth/refresh";
import { authErrorResponse } from "../../../../lib/api/auth-error-response";

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(
      AUTH_COOKIE.ACCESS_TOKEN
    )?.value;
    const refreshToken = request.cookies.get(
      AUTH_COOKIE.REFRESH_TOKEN
    )?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          code: "SESSION_EXPIRED",
          message: "Session expired",
        },
        { status: 401 }
      );
    }

    const tokens = await refreshSession(
      refreshToken,
      accessToken
    );

    const res = NextResponse.json({
      message: "Token refreshed successfully",
    });

    setAuthCookies(res.cookies, tokens);

    return res;
  } catch (error) {
    const authResponse = authErrorResponse(error);

    if (authResponse) {
      return authResponse;
    }

    console.error("Refresh route error:", error);

    return NextResponse.json(
      { message: "Refresh failed" },
      { status: 500 }
    );
  }
}
