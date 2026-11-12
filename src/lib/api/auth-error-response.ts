import { NextResponse } from "next/server";
import axios from "axios";

import { clearAuthCookies } from "@/lib/auth/cookies";
import {
  AuthUnavailableError,
  SessionExpiredError,
} from "@/lib/auth/errors";

export function authErrorResponse(
  error: unknown
): NextResponse | null {
  if (
    error instanceof SessionExpiredError ||
    (axios.isAxiosError(error) &&
      error.response?.status === 401)
  ) {
    const response = NextResponse.json(
      {
        code: "SESSION_EXPIRED",
        message: "Session expired",
      },
      { status: 401 }
    );

    clearAuthCookies(response.cookies);

    return response;
  }

  if (error instanceof AuthUnavailableError) {
    return NextResponse.json(
      {
        code: "AUTH_UNAVAILABLE",
        message: "Authentication service unavailable",
      },
      { status: 503 }
    );
  }

  return null;
}
