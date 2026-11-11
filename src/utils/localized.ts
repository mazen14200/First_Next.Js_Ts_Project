export function pickLocalized(
  locale: string,
  arabic: string | null | undefined,
  english: string | null | undefined
): string {
  const value = locale === "ar" ? arabic : english;

  return value ?? arabic ?? english ?? "";
}
