import { NextResponse } from "next/server";
import api from "../../../../services/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await api.post("/Auth/Login", body);

    const { accessToken, refreshToken, accessTokenExpiresAt } = response.data;

    const res = NextResponse.json({
      message: "Login successful",
    });

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.cookies.set("accessTokenExpiresAt", accessTokenExpiresAt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Login failed" },
      { status: 401 }
    );
  }
}