import { NextRequest, NextResponse } from "next/server";

import { skillsService } from "../../../../../features/skills/services/skills.service";

import {
  invalidIdResponse,
  parseId,
  toErrorResponse,
} from "../../../../../lib/api/route-helpers";

import { authErrorResponse } from "../../../../../lib/api/auth-error-response";
interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const skillId = parseId(id);

    if (skillId === null) {
      return invalidIdResponse("skill");
    }

    await skillsService.deactivate(skillId);

    return NextResponse.json({
      message: "Skill deactivated successfully",
    });
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error(
      "PATCH /api/skills/[id]/deactivate failed:",
      error
    );

    return toErrorResponse(
      error,
      "Failed to deactivate skill"
    );
  }
}

