import { NextResponse } from "next/server";
import axios from "axios";

import type { ApiErrorBody } from "@/types/crud.types";

import { ERROR_CODES } from "./error-codes";
import { errorResponse } from "./error-response";

export class InvalidQueryError extends Error {
  readonly param: string | null;

  constructor(param: string | null = null) {
    super(`Invalid query parameter${param ? `: ${param}` : ""}`);
    this.name = "InvalidQueryError";
    this.param = param;
  }
}

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
  return errorResponse(
    ERROR_CODES.INVALID_ID,
    `Invalid ${entityName} ID.`,
    400
  );
}

export function parsePagination(
  searchParams: URLSearchParams,
  maxPageSize = 100
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
    pageSize < 1 ||
    pageSize > maxPageSize
  ) {
    return null;
  }

  return { pageNumber, pageSize };
}

export function invalidPaginationResponse(): NextResponse {
  return errorResponse(
    ERROR_CODES.INVALID_PAGINATION,
    "Invalid pagination parameters.",
    400
  );
}

export function invalidQueryResponse(
  param?: string | null
): NextResponse {
  return errorResponse(
    ERROR_CODES.INVALID_QUERY,
    param
      ? `Invalid value for query parameter: ${param}.`
      : "Invalid query parameter.",
    400
  );
}

export function invalidBodyResponse(): NextResponse {
  return errorResponse(
    ERROR_CODES.INVALID_REQUEST,
    "Invalid JSON request body.",
    400
  );
}

export async function parseJsonBody(
  request: Request
): Promise<{ ok: true; body: unknown } | { ok: false }> {
  try {
    const text = await request.text();

    if (!text.trim()) {
      return { ok: false };
    }

    return { ok: true, body: JSON.parse(text) };
  } catch {
    return { ok: false };
  }
}

const STATUS_TO_CODE: Record<number, string> = {
  400: ERROR_CODES.VALIDATION_ERROR,
  401: ERROR_CODES.SESSION_EXPIRED,
  403: ERROR_CODES.FORBIDDEN,
  404: ERROR_CODES.NOT_FOUND,
  409: ERROR_CODES.CONFLICT,
  422: ERROR_CODES.VALIDATION_ERROR,
  500: ERROR_CODES.INTERNAL_ERROR,
  502: ERROR_CODES.SERVICE_UNAVAILABLE,
  503: ERROR_CODES.SERVICE_UNAVAILABLE,
};

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
        code:
          (typeof body === "object" &&
          body !== null &&
          "code" in body
            ? String((body as { code?: unknown }).code)
            : undefined) ??
          STATUS_TO_CODE[status] ??
          ERROR_CODES.UNKNOWN_ERROR,
        ...body,
        message,
      },
      { status }
    );
  }

  return errorResponse(
    ERROR_CODES.INTERNAL_ERROR,
    fallbackMessage,
    500
  );
}
