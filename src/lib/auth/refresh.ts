import axios from "axios";

import { authBackend } from "./backend";
import {
  AuthUnavailableError,
  SessionExpiredError,
} from "./errors";

import { normalizeTokens } from "../../features/auth/types/auth.types";

import type { AuthTokens } from "../../features/auth/types/auth.types";

const REFRESH_CACHE_TTL_MS = 10_000;

const inflightRefreshes = new Map<
  string,
  Promise<AuthTokens>
>();

function classifyRefreshError(error: unknown): never {
  if (
    axios.isAxiosError(error) &&
    error.response &&
    [400, 401, 403].includes(error.response.status)
  ) {
    throw new SessionExpiredError();
  }

  throw new AuthUnavailableError();
}

async function requestTokenRefresh(
  refreshToken: string,
  accessToken?: string
): Promise<AuthTokens> {
  try {
    const response = await authBackend.post(
      "/Auth/refresh",
      { refreshToken },
      {
        headers: accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : undefined,
      }
    );

    return normalizeTokens(response.data);
  } catch (error) {
    classifyRefreshError(error);
  }
}

export function refreshSession(
  refreshToken: string,
  accessToken?: string
): Promise<AuthTokens> {
  const cached = inflightRefreshes.get(refreshToken);

  if (cached) {
    return cached;
  }

  const promise = requestTokenRefresh(
    refreshToken,
    accessToken
  ).catch((error) => {
    inflightRefreshes.delete(refreshToken);
    throw error;
  });

  inflightRefreshes.set(refreshToken, promise);

  // Keep the successful result briefly so late 401s reuse it
  promise.then(
    () => {
      setTimeout(() => {
        if (inflightRefreshes.get(refreshToken) === promise) {
          inflightRefreshes.delete(refreshToken);
        }
      }, REFRESH_CACHE_TTL_MS);
    },
    () => {}
  );

  return promise;
}
