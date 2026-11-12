import { NextResponse } from "next/server";

import {
  createStatus,
  getStatuses,
} from "../../../features/status/index";

import type {
  CreateStatusRequest,
} from "../../../features/status/index";

import { authErrorResponse } from "../../../lib/api/auth-error-response";
export async function GET() {
  try {
    const statuses = await getStatuses();

    return NextResponse.json(statuses);
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error(
      "GET /api/status failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch statuses",
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
    const data: CreateStatusRequest =
      await request.json();

    const status = await createStatus(data);

    return NextResponse.json(status, {
      status: 201,
    });
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.error(
      "POST /api/status failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to create status",
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
