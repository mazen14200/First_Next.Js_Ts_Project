import { NextResponse } from "next/server";
import axios from "axios";

import type { ApiErrorBody } from "@/types/crud.types";

export function parseId(id: string): number | null {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

export function invalidIdResponse(
  entityName: string
): NextResponse {
  return NextResponse.json(
    { message: `Invalid ${entityName} ID.` },
    { status: 400 }
  );
}

export function parsePagination(
  searchParams: URLSearchParams
): { pageNumber: number; pageSize: number } | null {
  const pageNumberParam = searchParams.get("PageNumber");
  const pageSizeParam = searchParams.get("PageSize");

  const pageNumber = pageNumberParam
    ? Number(pageNumberParam)
    : 1;

  const pageSize = pageSizeParam
    ? Number(pageSizeParam)
    : 10;

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    !Number.isInteger(pageSize) ||
    pageSize < 1
  ) {
    return null;
  }

  return { pageNumber, pageSize };
}

export function invalidPaginationResponse(): NextResponse {
  return NextResponse.json(
    { message: "Invalid pagination parameters." },
    { status: 400 }
  );
}

export function toErrorResponse(
  error: unknown,
  fallbackMessage: string
): NextResponse {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | ApiErrorBody
      | undefined;

    const status = error.response?.status ?? 500;

    const message =
      (typeof data === "object" && data !== null
        ? data.message ?? data.detail
        : typeof data === "string"
          ? data
          : undefined) ?? fallbackMessage;

    const body =
      typeof data === "object" && data !== null ? data : {};

    return NextResponse.json(
      {
        ...body,
        message,
      },
      { status }
    );
  }

  return NextResponse.json(
    { message: fallbackMessage },
    { status: 500 }
  );
}
