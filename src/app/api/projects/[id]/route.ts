import { NextRequest, NextResponse } from "next/server";

import {
  deleteProject,
  getProjectById,
  updateProject,
} from "../../../../features/projects";

import { authErrorResponse } from "../../../../lib/api/auth-error-response";
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const projectId = Number(id);

    if (Number.isNaN(projectId)) {
      return NextResponse.json(
        { message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const data = await getProjectById(projectId);

    return NextResponse.json(data);
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error("Failed to fetch project:", error);

    return NextResponse.json(
      { message: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const projectId = Number(id);

    if (Number.isNaN(projectId)) {
      return NextResponse.json(
        { message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const data = await updateProject(
      projectId,
      body
    );

    return NextResponse.json(data);
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error("Failed to update project:", error);

    return NextResponse.json(
      { message: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const projectId = Number(id);

    if (Number.isNaN(projectId)) {
      return NextResponse.json(
        { message: "Invalid project ID" },
        { status: 400 }
      );
    }

    await deleteProject(projectId);

    return NextResponse.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error("Failed to delete project:", error);

    return NextResponse.json(
      { message: "Failed to delete project" },
      { status: 500 }
    );
  }
}
