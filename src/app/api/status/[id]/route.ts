import { NextResponse } from "next/server";

import {
  deleteStatus,
  updateStatus,
} from "../../../../features/status/index";

import type {
  UpdateStatusRequest,
} from "../../../../features/status/index";

import { authErrorResponse } from "../../../../lib/api/auth-error-response";
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
    const statusId = Number(id);

    if (Number.isNaN(statusId)) {
      return NextResponse.json(
        { message: "Invalid status id" },
        { status: 400 }
      );
    }

    const data: UpdateStatusRequest = await request.json();

    await updateStatus(statusId, data);

    return NextResponse.json(
      { message: "Status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error("Failed to update status:", error);

    return NextResponse.json(
      { message: "Failed to update status" },
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
    const statusId = Number(id);

    if (Number.isNaN(statusId)) {
      return NextResponse.json(
        { message: "Invalid status id" },
        { status: 400 }
      );
    }

    await deleteStatus(statusId);

    return NextResponse.json(
      { message: "Status deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error("Failed to delete status:", error);

    return NextResponse.json(
      { message: "Failed to delete status" },
      { status: 500 }
    );
  }
}
