import { NextResponse } from "next/server";
import { activateSkill } from "../../../../../features/skills/index";

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

    await activateSkill(skillId);

    return NextResponse.json(
      { message: "Skill activated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "PATCH /api/skills/[id]/activate failed:",
      error
    );

    return NextResponse.json(
      { message: "Failed to activate skill" },
      { status: 500 }
    );
  }
}