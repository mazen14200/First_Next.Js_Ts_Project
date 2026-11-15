import type { ApiErrorBody } from "@/types/crud.types";

import { ERROR_CODES } from "./error-codes";

import type { ErrorCode } from "./error-codes";

export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode | string;
  readonly fieldErrors: Record<string, string[]> | null;
  readonly body: ApiErrorBody | null;

  constructor(
    status: number,
    message: string,
    body: ApiErrorBody | null = null,
    code?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code =
      code ??
      (body && typeof body === "object" && "code" in body
        ? String((body as { code?: unknown }).code)
        : "");
    this.fieldErrors =
      body?.fieldErrors ?? body?.errors ?? null;
    this.body = body;
  }
}

export { ERROR_CODES };
