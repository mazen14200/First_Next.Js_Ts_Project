import type { ErrorMessageKey } from "@/lib/api/error-message";

const VALIDATION_CODE_TO_KEY: Record<
  string,
  ErrorMessageKey
> = {
  REQUIRED: "required",
  INVALID_TYPE: "invalidRequest",
  INVALID_NUMBER: "invalidNumber",
  MIN_VALUE: "minValue",
  MAX_VALUE: "maxValue",
  STEP_MISMATCH: "stepMismatch",
  MIN_LENGTH: "minLength",
  MAX_LENGTH: "maxLength",
  NOT_ALLOWED: "notAllowed",
  ARABIC_SCRIPT: "arabicOnly",
  LATIN_SCRIPT: "latinOnly",
};

export function validationMessageKey(
  code: string
): ErrorMessageKey {
  return VALIDATION_CODE_TO_KEY[code] ?? "invalidRequest";
}
