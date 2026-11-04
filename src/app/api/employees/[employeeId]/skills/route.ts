import { NextResponse } from "next/server";

import {
  getEmployeeSkills,
  createEmployeeSkill,
} from "../../../../../features/employees/skills/index";

interface RouteContext {
  params: Promise<{
    employeeId: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { employeeId } = await context.params;

    if (!employeeId) {
      return NextResponse.json(
        { message: "Employee id is required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);

    const pageNumber = Number(
      searchParams.get("PageNumber") ?? "1"
    );

    const pageSize = Number(
      searchParams.get("PageSize") ?? "10"
    );

    const search =
      searchParams.get("Search")?.trim() ?? "";

    const skillIdParam = searchParams.get("SkillId");

    const skillId =
      skillIdParam === null
        ? undefined
        : Number(skillIdParam);

    const skillLevelIdParam =
      searchParams.get("SkillLevelId");

    const skillLevelId =
      skillLevelIdParam === null
        ? undefined
        : Number(skillLevelIdParam);

    if (
      skillId !== undefined &&
      Number.isNaN(skillId)
    ) {
      return NextResponse.json(
        { message: "Invalid skill id" },
        { status: 400 }
      );
    }

    if (
      skillLevelId !== undefined &&
      Number.isNaN(skillLevelId)
    ) {
      return NextResponse.json(
        { message: "Invalid skill level id" },
        { status: 400 }
      );
    }

    const employeeSkills = await getEmployeeSkills({
      employeeId,
      skillId,
      skillLevelId,
      pageNumber,
      pageSize,
      search,
    });

    return NextResponse.json(employeeSkills);
  } catch (error) {
    console.error(
      "GET /api/employees/[employeeId]/skills failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch employee skills",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { employeeId } = await context.params;

    if (!employeeId) {
      return NextResponse.json(
        { message: "Employee id is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const employeeSkill = await createEmployeeSkill(
      employeeId,
      body
    );

    return NextResponse.json(employeeSkill, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "POST /api/employees/[employeeId]/skills failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to create employee skill",
      },
      {
        status: 500,
      }
    );
  }
}

