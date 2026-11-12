import { NextResponse } from "next/server";

import {
  getDepartments,
  createDepartment,
} from "@/features/departments";

import { authErrorResponse } from "@/lib/api/auth-error-response";
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

    const departments = await getDepartments(
      pageNumber,
      pageSize,
      search
    );

    return NextResponse.json(departments);
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error(
      "GET /api/department failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch departments",
        error:
          error instanceof Error
            ? error.message
            : String(error),
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

    const department = await createDepartment(body);

    return NextResponse.json(department, {
      status: 201,
    });
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error(
      "POST /api/department failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to create department",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}
