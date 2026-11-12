export class SessionExpiredError extends Error {
  readonly code = "SESSION_EXPIRED";

  constructor(message = "Session expired") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

export class AuthUnavailableError extends Error {
  readonly code = "AUTH_UNAVAILABLE";

  constructor(
    message = "Authentication service unavailable"
  ) {
    super(message);
    this.name = "AuthUnavailableError";
  }
}
