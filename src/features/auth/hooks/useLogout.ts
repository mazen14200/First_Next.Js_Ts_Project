"use client";

import { clearClientSession } from "@/features/auth/utils/session";

export function useLogout(): () => Promise<void> {
  return async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // Logout always succeeds locally
    } finally {
      clearClientSession();
      window.location.replace("/login");
    }
  };
}
