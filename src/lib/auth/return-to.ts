export function sanitizeReturnTo(
  value: string | null | undefined
): string | null {
  if (!value) {
    return null;
  }

  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return null;
  }

  return value;
}
