import { NextResponse } from "next/server";
import {
  getProjects,
  createProject,
} from "../../../../features/projects/services/projects.service";

import type { CreateProjectRequest } from "../../../../features/projects/types/project.types";
import axios from "axios";

export async function GET() {
  try {
    const projects = await getProjects();

    return NextResponse.json(projects);
  } catch (error) {
    console.log("GET PROJECTS ERROR:", error);

    return NextResponse.json(
      { message: "Failed to get projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateProjectRequest = await request.json();

    const project = await createProject(body);

    return NextResponse.json(project);
  } catch (error) {
    console.log("POST PROJECT ERROR:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? {
          message: "Failed to create project",
        },
        {
          status: error.response?.status ?? 500,
        }
      );
    }

    return NextResponse.json(
      { message: "Failed to create project" },
      { status: 500 }
    );
  }
}