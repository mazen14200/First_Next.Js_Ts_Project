import { NextResponse } from "next/server";
import axios from "axios";

import { deleteProject } from "@/features/projects/services/projects.service";

import { authErrorResponse } from "@/lib/api/auth-error-response";
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const projectId = Number(id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json(
        { message: "Invalid project id" },
        { status: 400 }
      );
    }

    await deleteProject(projectId);

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.log("DELETE PROJECT ERROR:", error);

    if (axios.isAxiosError(error)) {
      console.log("API ERROR RESPONSE:", error.response?.data);

      return NextResponse.json(
        error.response?.data ?? {
          message: "Failed to delete project",
        },
        {
          status: error.response?.status ?? 500,
        }
      );
    }

    return NextResponse.json(
      { message: "Failed to delete project" },
      { status: 500 }
    );
  }
}
