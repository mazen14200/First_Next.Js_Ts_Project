import type {
  ValidationResult,
  ValidationSchema,
} from "@/types/validation.types";

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) {
    return true;
  }

  return typeof value === "string" && value.trim() === "";
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

const STEP_EPSILON = 1e-9;

const LETTER_PATTERN = /\p{L}/u;
const ARABIC_LETTER_PATTERN = /\p{Script=Arabic}/u;
const LATIN_LETTER_PATTERN = /\p{Script=Latin}/u;

function hasInvalidScript(
  value: string,
  script: "arabic" | "latin"
): boolean {
  for (const char of value) {
    if (!LETTER_PATTERN.test(char)) {
      continue;
    }

    if (script === "arabic" && !ARABIC_LETTER_PATTERN.test(char)) {
      return true;
    }

    if (script === "latin" && !LATIN_LETTER_PATTERN.test(char)) {
      return true;
    }
  }

  return false;
}

export function validate(
  input: unknown,
  schema: ValidationSchema
): ValidationResult {
  const data: Record<string, unknown> =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};

  const fieldErrors: Record<string, string[]> = {};

  for (const [field, definition] of Object.entries(schema)) {
    const value = data[field];
    const rules = definition.rules;

    const hasRequired = rules.some(
      (rule) => rule.kind === "required"
    );
    const hasNullable = rules.some(
      (rule) => rule.kind === "nullable"
    );

    const codes = new Set<string>();

    if (value === null && hasNullable) {
      continue;
    }

    if (isEmpty(value)) {
      if (hasRequired) {
        codes.add("REQUIRED");
      }
      // Optional empty values skip the remaining rules
    } else {
      for (const rule of rules) {
        switch (rule.kind) {
          case "required":
          case "nullable":
            break;

          case "type": {
            if (rule.type === "string") {
              if (typeof value !== "string") {
                codes.add("INVALID_TYPE");
              }
            } else if (rule.type === "number") {
              if (toNumber(value) === null) {
                codes.add("INVALID_NUMBER");
              }
            } else if (typeof value !== "boolean") {
              codes.add("INVALID_TYPE");
            }
            break;
          }

          case "min":
          case "max": {
            const numeric = toNumber(value);

            if (numeric === null) {
              codes.add("INVALID_NUMBER");
            } else if (
              rule.kind === "min" &&
              numeric < rule.value
            ) {
              codes.add("MIN_VALUE");
            } else if (
              rule.kind === "max" &&
              numeric > rule.value
            ) {
              codes.add("MAX_VALUE");
            }
            break;
          }

          case "step": {
            if (rule.value !== "any") {
              const numeric = toNumber(value);

              if (numeric === null) {
                codes.add("INVALID_NUMBER");
              } else {
                const baseRule = rules.find(
                  (r) => r.kind === "min"
                );
                const base =
                  baseRule && baseRule.kind === "min"
                    ? baseRule.value
                    : 0;
                const remainder =
                  Math.abs(numeric - base) % rule.value;

                if (
                  remainder > STEP_EPSILON &&
                  Math.abs(remainder - rule.value) >
                    STEP_EPSILON
                ) {
                  codes.add("STEP_MISMATCH");
                }
              }
            }
            break;
          }

          case "minLength":
            if (
              String(value).length < rule.value
            ) {
              codes.add("MIN_LENGTH");
            }
            break;

          case "maxLength":
            if (
              String(value).length > rule.value
            ) {
              codes.add("MAX_LENGTH");
            }
            break;

          case "allowedValues":
            if (
              !rule.values.some(
                (allowed) =>
                  allowed === value ||
                  String(allowed) === String(value)
              )
            ) {
              codes.add("NOT_ALLOWED");
            }
            break;

          case "script":
            if (
              typeof value === "string" &&
              hasInvalidScript(value, rule.script)
            ) {
              codes.add(
                rule.script === "arabic"
                  ? "ARABIC_SCRIPT"
                  : "LATIN_SCRIPT"
              );
            }
            break;

          case "custom": {
            const customCode = rule.validate(value, data);

            if (customCode) {
              codes.add(customCode);
            }
            break;
          }
        }
      }
    }

    if (codes.size > 0) {
      fieldErrors[field] = [...codes];
    }
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}
