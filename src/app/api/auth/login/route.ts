import { NextResponse } from "next/server";
import axios from "axios";

import { authBackend } from "@/lib/auth/backend";
import { setAuthCookies } from "@/lib/auth/cookies";
import { normalizeTokens } from "@/features/auth/types/auth.types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await authBackend.post(
      "/Auth/Login",
      body
    );

    const tokens = normalizeTokens(response.data);

    const res = NextResponse.json({
      message: "Login successful",
    });

    setAuthCookies(res.cookies, tokens);

    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        );
      }

      if (status === 400) {
        return NextResponse.json(
          {
            message:
              "Invalid login request. Please check your input.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "Login service unavailable" },
        { status: 503 }
      );
    }

    console.error("Login route error:", error);

    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}
