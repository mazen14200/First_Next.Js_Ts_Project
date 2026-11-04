import { NextRequest, NextResponse } from "next/server";

import {
  createTeam,
  getTeams,
} from "../../../features/teams";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const pageNumberParam = searchParams.get("PageNumber");
    const pageSizeParam = searchParams.get("PageSize");
    const search = searchParams.get("Search") ?? "";

    const pageNumber = pageNumberParam
      ? Number(pageNumberParam)
      : 1;

    const pageSize = pageSizeParam
      ? Number(pageSizeParam)
      : 10;

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isInteger(pageSize) ||
      pageSize < 1
    ) {
      return NextResponse.json(
        {
          message: "Invalid pagination parameters.",
        },
        { status: 400 }
      );
    }

    const teams = await getTeams({
      pageNumber,
      pageSize,
      search,
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("GET /api/teams error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch teams.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const team = await createTeam(body);

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("POST /api/teams error:", error);

    return NextResponse.json(
      {
        message: "Failed to create team.",
      },
      { status: 500 }
    );
  }
}
