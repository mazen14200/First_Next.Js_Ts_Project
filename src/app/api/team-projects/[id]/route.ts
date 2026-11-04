import { NextRequest, NextResponse } from "next/server";

import {
  deleteTeamProject,
  getTeamProjectById,
  updateTeamProject,
} from "../../../../features/team-projects";

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
    const teamProjectId = Number(id);

    if (
      !Number.isInteger(teamProjectId) ||
      teamProjectId < 1
    ) {
      return NextResponse.json(
        {
          message: "Invalid team project ID.",
        },
        { status: 400 }
      );
    }

    const teamProject =
      await getTeamProjectById(teamProjectId);

    return NextResponse.json(teamProject);
  } catch (error) {
    console.error(
      "GET /api/team-projects/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch team project.",
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
    const teamProjectId = Number(id);

    if (
      !Number.isInteger(teamProjectId) ||
      teamProjectId < 1
    ) {
      return NextResponse.json(
        {
          message: "Invalid team project ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const teamProject =
      await updateTeamProject(
        teamProjectId,
        body
      );

    return NextResponse.json(teamProject);
  } catch (error) {
    console.error(
      "PUT /api/team-projects/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to update team project.",
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
    const teamProjectId = Number(id);

    if (
      !Number.isInteger(teamProjectId) ||
      teamProjectId < 1
    ) {
      return NextResponse.json(
        {
          message: "Invalid team project ID.",
        },
        { status: 400 }
      );
    }

    await deleteTeamProject(teamProjectId);

    return NextResponse.json(
      {
        message:
          "Team project deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "DELETE /api/team-projects/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to delete team project.",
      },
      { status: 500 }
    );
  }
}