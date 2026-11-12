import { NextResponse } from "next/server";

import { getNewProjectCode } from "@/features/projects";

import { authErrorResponse } from "@/lib/api/auth-error-response";
export async function GET() {
  try {
    const data = await getNewProjectCode();

    return NextResponse.json(data);
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error("Failed to fetch new project code:", error);

    return NextResponse.json(
      { message: "Failed to fetch new project code" },
      { status: 500 }
    );
  }
}
