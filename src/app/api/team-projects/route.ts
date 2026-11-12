import { NextRequest, NextResponse } from "next/server";

import {
  createTeamProject,
  getTeamProjects,
} from "@/features/team-projects";

import { authErrorResponse } from "@/lib/api/auth-error-response";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const teamIdParam = searchParams.get("TeamId");
    const projectIdParam = searchParams.get("ProjectId");
    const pageNumberParam =
      searchParams.get("PageNumber");
    const pageSizeParam =
      searchParams.get("PageSize");
    const search = searchParams.get("Search") ?? "";

    const teamId = teamIdParam
      ? Number(teamIdParam)
      : undefined;

    const projectId = projectIdParam
      ? Number(projectIdParam)
      : undefined;

    const pageNumber = pageNumberParam
      ? Number(pageNumberParam)
      : 1;

    const pageSize = pageSizeParam
      ? Number(pageSizeParam)
      : 10;

    if (
      (teamId !== undefined &&
        (!Number.isInteger(teamId) || teamId < 1)) ||
      (projectId !== undefined &&
        (!Number.isInteger(projectId) || projectId < 1)) ||
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isInteger(pageSize) ||
      pageSize < 1
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid team project parameters.",
        },
        { status: 400 }
      );
    }

    const teamProjects = await getTeamProjects({
      teamId,
      projectId,
      pageNumber,
      pageSize,
      search,
    });

    return NextResponse.json(teamProjects);
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error(
      "GET /api/team-projects error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch team projects.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const teamProject = await createTeamProject(body);

    return NextResponse.json(teamProject, {
      status: 201,
    });
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error(
      "POST /api/team-projects error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to create team project.",
      },
      { status: 500 }
    );
  }
}
