import axios from "axios";
import { cookies } from "next/headers";

import { AUTH_COOKIE } from "../lib/auth/constants";
import { setAuthCookies } from "../lib/auth/cookies";
import {
  AuthUnavailableError,
  SessionExpiredError,
} from "../lib/auth/errors";
import { refreshSession } from "../lib/auth/refresh";

const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

serverApi.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(
    AUTH_COOKIE.ACCESS_TOKEN
  )?.value;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

serverApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const retriedRequest =
      originalRequest as typeof originalRequest & {
        _retry?: boolean;
      };

    if (retriedRequest._retry) {
      return Promise.reject(new SessionExpiredError());
    }

    const cookieStore = await cookies();

    const accessToken = cookieStore.get(
      AUTH_COOKIE.ACCESS_TOKEN
    )?.value;
    const refreshToken = cookieStore.get(
      AUTH_COOKIE.REFRESH_TOKEN
    )?.value;

    if (!refreshToken) {
      return Promise.reject(new SessionExpiredError());
    }

    let tokens;

    try {
      tokens = await refreshSession(refreshToken, accessToken);
    } catch (refreshError) {
      if (refreshError instanceof AuthUnavailableError) {
        return Promise.reject(refreshError);
      }

      return Promise.reject(
        refreshError instanceof SessionExpiredError
          ? refreshError
          : new SessionExpiredError()
      );
    }

    try {
      setAuthCookies(cookieStore, tokens);
    } catch {
      console.error(
        "Failed to persist refreshed auth cookies. " +
          "serverApi must only be called from Route Handlers or Server Actions."
      );
    }

    retriedRequest._retry = true;
    retriedRequest.headers.Authorization =
      `Bearer ${tokens.accessToken}`;

    return serverApi(retriedRequest);
  }
);

export default serverApi;
