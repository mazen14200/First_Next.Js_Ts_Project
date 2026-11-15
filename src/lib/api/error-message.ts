import { ApiError } from "./api-error";
import { SessionExpiredError } from "../auth/errors";

export type ErrorMessageKey =
  | "validationFailed"
  | "required"
  | "invalidNumber"
  | "minValue"
  | "maxValue"
  | "stepMismatch"
  | "minLength"
  | "maxLength"
  | "notAllowed"
  | "arabicOnly"
  | "latinOnly"
  | "invalidRequest"
  | "notFound"
  | "conflict"
  | "forbidden"
  | "network"
  | "unavailable"
  | "sessionExpired"
  | "server"
  | "unknown";

const CODE_TO_KEY: Record<string, ErrorMessageKey> = {
  VALIDATION_ERROR: "validationFailed",
  INVALID_ID: "invalidRequest",
  INVALID_QUERY: "invalidRequest",
  INVALID_PAGINATION: "invalidRequest",
  NOT_FOUND: "notFound",
  CONFLICT: "conflict",
  FORBIDDEN: "forbidden",
  SESSION_EXPIRED: "sessionExpired",
  UNAUTHENTICATED: "sessionExpired",
  NETWORK_ERROR: "network",
  SERVICE_UNAVAILABLE: "unavailable",
  INTERNAL_ERROR: "server",
  UNKNOWN_ERROR: "unknown",
};

const STATUS_TO_KEY: Record<number, ErrorMessageKey> = {
  400: "invalidRequest",
  401: "sessionExpired",
  403: "forbidden",
  404: "notFound",
  409: "conflict",
  422: "validationFailed",
  500: "server",
  502: "unavailable",
  503: "unavailable",
};

export function apiErrorMessageKey(
  error: unknown
): ErrorMessageKey {
  if (error instanceof SessionExpiredError) {
    return "sessionExpired";
  }

  if (error instanceof ApiError) {
    if (error.code && CODE_TO_KEY[error.code]) {
      return CODE_TO_KEY[error.code];
    }

    return STATUS_TO_KEY[error.status] ?? "unknown";
  }

  if (error instanceof Error && error.name === "TypeError") {
    return "network";
  }

  return "unknown";
}
