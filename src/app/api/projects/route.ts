import { NextRequest, NextResponse } from "next/server";

import {
  createProject,
  getProjects,
} from "@/features/projects";

import { authErrorResponse } from "@/lib/api/auth-error-response";
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const pageNumber = Number(
      searchParams.get("PageNumber") ?? "1"
    );

    const pageSize = Number(
      searchParams.get("PageSize") ?? "10"
    );

    const statusId = searchParams.get("StatusId");
    const managerId = searchParams.get("ManagerId");
    const startDateFrom = searchParams.get("StartDateFrom");
    const startDateTo = searchParams.get("StartDateTo");
    const search = searchParams.get("Search");

    const data = await getProjects({
      pageNumber,
      pageSize,
      ...(statusId && {
        statusId: Number(statusId),
      }),
      ...(managerId && {
        managerId,
      }),
      ...(startDateFrom && {
        startDateFrom,
      }),
      ...(startDateTo && {
        startDateTo,
      }),
      ...(search && {
        search,
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error("Failed to fetch projects:", error);

    return NextResponse.json(
      { message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = await createProject(body);

    return NextResponse.json(data);
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error("Failed to create project:", error);

    return NextResponse.json(
      { message: "Failed to create project" },
      { status: 500 }
    );
  }
}
