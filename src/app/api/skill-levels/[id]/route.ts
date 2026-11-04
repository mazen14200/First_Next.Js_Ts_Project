import { NextResponse } from "next/server";
import {
  updateSkillLevel,
  deleteSkillLevel,
} from "../../../../features/skill-levels/index";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const skillLevelId = Number(id);

    if (Number.isNaN(skillLevelId)) {
      return NextResponse.json(
        { message: "Invalid skill level id" },
        { status: 400 }
      );
    }

    const body = await request.json();

    await updateSkillLevel(skillLevelId, body);

    return NextResponse.json(
      { message: "Skill level updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/skill-levels/[id] failed:", error);

    return NextResponse.json(
      { message: "Failed to update skill level" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const skillLevelId = Number(id);

    if (Number.isNaN(skillLevelId)) {
      return NextResponse.json(
        { message: "Invalid skill level id" },
        { status: 400 }
      );
    }

    await deleteSkillLevel(skillLevelId);

    return NextResponse.json(
      { message: "Skill level deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/skill-levels/[id] failed:", error);

    return NextResponse.json(
      { message: "Failed to delete skill level" },
      { status: 500 }
    );
  }
}
