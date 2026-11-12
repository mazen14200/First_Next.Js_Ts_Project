export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
}

export function normalizeTokens(
  data: unknown
): AuthTokens {
  const record =
    data && typeof data === "object"
      ? (data as Record<string, unknown>)
      : {};

  const accessToken = record.accessToken;
  const refreshToken = record.refreshToken;
  const accessTokenExpiresAt =
    record.accessTokenExpiresAt ?? record.expiresAt;

  if (
    typeof accessToken !== "string" ||
    !accessToken ||
    typeof refreshToken !== "string" ||
    !refreshToken ||
    typeof accessTokenExpiresAt !== "string" ||
    !accessTokenExpiresAt
  ) {
    throw new Error("Malformed auth token response");
  }

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
  };
}
