import { NextResponse } from "next/server";

import {
  updateEmployeeSkill,
  deleteEmployeeSkill,
} from "../../../../../../features/employees/skills/index";

interface RouteContext {
  params: Promise<{
    employeeId: string;
    skillId: string;
  }>;
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { employeeId, skillId } =
      await context.params;

    if (!employeeId) {
      return NextResponse.json(
        { message: "Employee id is required" },
        { status: 400 }
      );
    }

    const parsedSkillId = Number(skillId);

    if (Number.isNaN(parsedSkillId)) {
      return NextResponse.json(
        { message: "Invalid skill id" },
        { status: 400 }
      );
    }

    const body = await request.json();

    await updateEmployeeSkill(
      employeeId,
      parsedSkillId,
      body
    );

    return NextResponse.json(
      {
        message:
          "Employee skill updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PUT /api/employees/[employeeId]/skills/[skillId] failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to update employee skill",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const { employeeId, skillId } =
      await context.params;

    if (!employeeId) {
      return NextResponse.json(
        { message: "Employee id is required" },
        { status: 400 }
      );
    }

    const parsedSkillId = Number(skillId);

    if (Number.isNaN(parsedSkillId)) {
      return NextResponse.json(
        { message: "Invalid skill id" },
        { status: 400 }
      );
    }

    await deleteEmployeeSkill(
      employeeId,
      parsedSkillId
    );

    return NextResponse.json(
      {
        message:
          "Employee skill deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE /api/employees/[employeeId]/skills/[skillId] failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to delete employee skill",
      },
      {
        status: 500,
      }
    );
  }
}

