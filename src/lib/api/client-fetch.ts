import { LOGIN_PATH } from "../auth/constants";
import { sanitizeReturnTo } from "../auth/return-to";

import { SessionExpiredError } from "../auth/errors";

import { clearClientSession } from "../../features/auth/utils/session";

let redirecting = false;

function handleSessionExpired(): void {
  if (redirecting || typeof window === "undefined") {
    return;
  }

  redirecting = true;

  clearClientSession();

  const returnTo = sanitizeReturnTo(
    window.location.pathname + window.location.search
  );

  const params = new URLSearchParams({ reason: "expired" });

  if (returnTo && returnTo !== "/") {
    params.set("returnTo", returnTo);
  }

  window.location.replace(
    `${LOGIN_PATH}?${params.toString()}`
  );
}

export async function apiFetch(
  input: string,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 401) {
    const body: unknown = await response
      .clone()
      .json()
      .catch(() => null);

    const code =
      body && typeof body === "object"
        ? (body as { code?: string }).code
        : undefined;

    if (code === "SESSION_EXPIRED") {
      handleSessionExpired();
      throw new SessionExpiredError();
    }
  }

  return response;
}
