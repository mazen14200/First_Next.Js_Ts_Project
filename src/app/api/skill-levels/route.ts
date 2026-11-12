import { NextResponse } from "next/server";

import {
  getSkillLevels,
  createSkillLevel,
} from "@/features/skill-levels";

import { authErrorResponse } from "@/lib/api/auth-error-response";
export async function GET() {
  try {
    const skillLevels = await getSkillLevels();

    return NextResponse.json(skillLevels);
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error(
      "GET /api/skill-levels failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch skill levels",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const skillLevel = await createSkillLevel(body);

    return NextResponse.json(skillLevel, {
      status: 201,
    });
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error(
      "POST /api/skill-levels failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to create skill level",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}
