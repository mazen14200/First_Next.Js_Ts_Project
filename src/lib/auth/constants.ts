export const AUTH_COOKIE = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  ACCESS_TOKEN_EXPIRES_AT: "accessTokenExpiresAt",
} as const;

export const AUTH_COOKIE_NAMES = [
  AUTH_COOKIE.ACCESS_TOKEN,
  AUTH_COOKIE.REFRESH_TOKEN,
  AUTH_COOKIE.ACCESS_TOKEN_EXPIRES_AT,
] as const;

export const LOGIN_PATH = "/login";

export interface AuthCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge?: number;
}

export function authCookieOptions(
  overrides: Partial<AuthCookieOptions> = {}
): AuthCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...overrides,
  };
}
