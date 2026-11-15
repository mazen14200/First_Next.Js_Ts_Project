import { NextResponse } from "next/server";

import { ERROR_CODES } from "./error-codes";

import type { ErrorCode } from "./error-codes";

interface ErrorResponseOptions {
  fieldErrors?: Record<string, string[]>;
}

export function errorResponse(
  code: ErrorCode,
  message: string,
  status: number,
  options: ErrorResponseOptions = {}
): NextResponse {
  return NextResponse.json(
    {
      code,
      message,
      ...(options.fieldErrors && {
        fieldErrors: options.fieldErrors,
      }),
    },
    { status }
  );
}

export function validationErrorResponse(
  fieldErrors: Record<string, string[]>
): NextResponse {
  return errorResponse(
    ERROR_CODES.VALIDATION_ERROR,
    "Some fields need attention.",
    400,
    { fieldErrors }
  );
}


