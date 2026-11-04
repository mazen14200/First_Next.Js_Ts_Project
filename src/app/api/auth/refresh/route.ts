import { NextRequest, NextResponse } from "next/server";
import api from "../../../../services/server-api";

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { message: "Tokens not found" },
        { status: 401 }
      );
    }

    const response = await api.post("/Auth/refresh", {refreshToken},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresAt } = response.data;

    const res = NextResponse.json({
      message: "Token refreshed successfully",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    res.cookies.set("accessToken", newAccessToken, cookieOptions);

    res.cookies.set("refreshToken", newRefreshToken, cookieOptions);

    res.cookies.set("accessTokenExpiresAt", expiresAt, cookieOptions);

    return res;
  } catch (error) {
    console.log("REFRESH ERROR:", error);

    return NextResponse.json(
      { message: "Refresh failed" },
      { status: 401 }
    );
  }
}