import {
  AUTH_COOKIE,
  authCookieOptions,
} from "./constants";

import type { AuthTokens } from "../../features/auth/types/auth.types";

interface CookieWriter {
  set: (
    name: string,
    value: string,
    options: ReturnType<typeof authCookieOptions>
  ) => unknown;
}

export function setAuthCookies(
  target: CookieWriter,
  tokens: AuthTokens
): void {
  const options = authCookieOptions();

  target.set(
    AUTH_COOKIE.ACCESS_TOKEN,
    tokens.accessToken,
    options
  );
  target.set(
    AUTH_COOKIE.REFRESH_TOKEN,
    tokens.refreshToken,
    options
  );
  target.set(
    AUTH_COOKIE.ACCESS_TOKEN_EXPIRES_AT,
    tokens.accessTokenExpiresAt,
    options
  );
}

export function clearAuthCookies(target: CookieWriter): void {
  const options = authCookieOptions({ maxAge: 0 });

  for (const name of Object.values(AUTH_COOKIE)) {
    target.set(name, "", options);
  }
}
