import { NextResponse } from "next/server";
import { deactivateSkill } from "../../../../../features/skills/index";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const skillId = Number(id);

    if (Number.isNaN(skillId)) {
      return NextResponse.json(
        { message: "Invalid skill id" },
        { status: 400 }
      );
    }

    await deactivateSkill(skillId);

    return NextResponse.json(
      { message: "Skill deactivated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "PATCH /api/skills/[id]/deactivate failed:",
      error
    );

    return NextResponse.json(
      { message: "Failed to deactivate skill" },
      { status: 500 }
    );
  }
}