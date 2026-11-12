export const APP_STORAGE_KEYS = [
  // Add application-specific storage keys here.
  // The "locale" cookie is intentionally preserved.
] as const;

export function clearClientSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  for (const key of APP_STORAGE_KEYS) {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  }
}
