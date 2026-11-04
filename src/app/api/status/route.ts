import { NextResponse } from "next/server";

import {
  createStatus,
  getStatuses,
} from "../../../features/status/index";

import type {
  CreateStatusRequest,
} from "../../../features/status/index";

export async function GET() {
  try {
    const statuses = await getStatuses();

    return NextResponse.json(statuses);
  } catch (error) {
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