import { NextResponse } from "next/server";
import {
  updateSkill,
  deleteSkill,
} from "../../../../features/skills/index";

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
    const skillId = Number(id);

    if (Number.isNaN(skillId)) {
      return NextResponse.json(
        { message: "Invalid skill id" },
        { status: 400 }
      );
    }

    const body = await request.json();

    await updateSkill(skillId, body);

    return NextResponse.json(
      { message: "Skill updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/skills/[id] failed:", error);

    return NextResponse.json(
      { message: "Failed to update skill" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
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

    await deleteSkill(skillId);

    return NextResponse.json(
      { message: "Skill deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/skills/[id] failed:", error);

    return NextResponse.json(
      { message: "Failed to delete skill" },
      { status: 500 }
    );
  }
}