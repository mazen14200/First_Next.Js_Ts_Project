import { NextResponse } from "next/server";
import { updateDepartment, deleteDepartment } from "@/features/departments";

import { authErrorResponse } from "@/lib/api/auth-error-response";
interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const departmentId = Number(id);

    if (Number.isNaN(departmentId)) {
      return NextResponse.json(
        { message: "Invalid department id" },
        { status: 400 }
      );
    }

    const body = await request.json();

    await updateDepartment(departmentId, body);

    return NextResponse.json(
      { message: "Department updated successfully" },
      { status: 200 }
    );
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error("PUT /api/department/[id] failed:", error);

    return NextResponse.json(
      { message: "Failed to update department" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const departmentId = Number(id);

    if (Number.isNaN(departmentId)) {
      return NextResponse.json(
        { message: "Invalid department id" },
        { status: 400 }
      );
    }

    await deleteDepartment(departmentId);

    return NextResponse.json(
      { message: "Department deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error("DELETE /api/department/[id] failed:", error);

    return NextResponse.json(
      { message: "Failed to delete department" },
      { status: 500 }
    );
  }
}
