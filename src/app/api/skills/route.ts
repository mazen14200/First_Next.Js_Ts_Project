import { NextResponse } from "next/server";

import {
  getSkills,
  createSkill,
} from "../../../features/skills/index";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const pageNumber = Number(
      searchParams.get("PageNumber") ?? "1"
    );

    const pageSize = Number(
      searchParams.get("PageSize") ?? "10"
    );

    const search =
      searchParams.get("Search")?.trim() ?? "";

    const isActiveParam =
      searchParams.get("IsActive");

    const isActive =
      isActiveParam === null
        ? undefined
        : isActiveParam === "true";

    const skills = await getSkills(
      pageNumber,
      pageSize,
      search,
      isActive
    );

    return NextResponse.json(skills);
  } catch (error) {
    console.error(
      "GET /api/skills failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch skills",
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

    const skill = await createSkill(body);

    return NextResponse.json(skill, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "POST /api/skills failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to create skill",
      },
      {
        status: 500,
      }
    );
  }
}