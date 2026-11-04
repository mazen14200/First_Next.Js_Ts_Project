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

    await api.post("/Auth/logout",
    {
        refreshToken,
        accessToken,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const res = NextResponse.json({
      message: "Logout successful",
    });

    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
    res.cookies.delete("accessTokenExpiresAt");

    return res;
  } catch (error) {
    console.log("LOGOUT ERROR:", error);

    return NextResponse.json(
      { message: "Logout failed" },
      { status: 401 }
    );
  }
}
