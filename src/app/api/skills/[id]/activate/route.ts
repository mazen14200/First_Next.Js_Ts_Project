import { NextRequest, NextResponse } from "next/server";

import { skillsService } from "../../../../../features/skills/services/skills.service";

import {
  invalidIdResponse,
  parseId,
  toErrorResponse,
} from "../../../../../lib/api/route-helpers";

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

    await skillsService.activate(skillId);

    return NextResponse.json({
      message: "Skill activated successfully",
    });
  } catch (error) {
    console.error(
      "PATCH /api/skills/[id]/activate failed:",
      error
    );

    return toErrorResponse(
      error,
      "Failed to activate skill"
    );
  }
}
