import { NextRequest, NextResponse } from "next/server";

import {
  deleteTeam,
  getTeamById,
  updateTeam,
} from "../../../../features/teams";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const teamId = Number(id);

    if (!Number.isInteger(teamId) || teamId < 1) {
      return NextResponse.json(
        {
          message: "Invalid team ID.",
        },
        { status: 400 }
      );
    }

    const team = await getTeamById(teamId);

    return NextResponse.json(team);
  } catch (error) {
    console.error("GET /api/teams/[id] error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch team.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const teamId = Number(id);

    if (!Number.isInteger(teamId) || teamId < 1) {
      return NextResponse.json(
        {
          message: "Invalid team ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const team = await updateTeam(teamId, body);

    return NextResponse.json(team);
  } catch (error) {
    console.error("PUT /api/teams/[id] error:", error);

    return NextResponse.json(
      {
        message: "Failed to update team.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const teamId = Number(id);

    if (!Number.isInteger(teamId) || teamId < 1) {
      return NextResponse.json(
        {
          message: "Invalid team ID.",
        },
        { status: 400 }
      );
    }

    await deleteTeam(teamId);

    return NextResponse.json(
      {
        message: "Team deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/teams/[id] error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete team.",
      },
      { status: 500 }
    );
  }
}
