import type { ReactNode } from "react";

export function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  return (
    typeof value === "string" && value.trim() === ""
  );
}

export function displayValue(value: unknown): ReactNode {
  if (isEmptyValue(value)) {
    return "—";
  }

  if (typeof value === "boolean") {
    return String(value);
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return value;
  }

  return value as ReactNode;
}
