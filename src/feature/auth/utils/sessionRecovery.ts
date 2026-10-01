export type RecoveryResult = "renewed" | "expired" | "temporary" | "blocked";

let pending: Promise<RecoveryResult> | undefined;
const prefix = "session-recovery:";

export function clearRecoveryAttempt(destination: string) {
  try {
    sessionStorage.removeItem(prefix + destination);
  } catch {
    // Storage unavailable: automatic attempts are disabled below.
  }
}

export function recoverSession(destination: string, manual = false): Promise<RecoveryResult> {
  // Share the active browser request across mounts and Strict Mode effect replays.
  if (pending) {
    try { sessionStorage.setItem(prefix + destination, "attempted"); } catch { /* No automatic retry without storage. */ }
    return pending;
  }
  try {
    if (!manual && sessionStorage.getItem(prefix + destination)) {
      return Promise.resolve("blocked");
    }
    sessionStorage.setItem(prefix + destination, "attempted");
  } catch {
    if (!manual) return Promise.resolve("blocked");
  }

  pending = (async (): Promise<RecoveryResult> => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", "X-Session-Refresh": "1" },
        body: "{}",
        cache: "no-store",
      });
      const data: unknown = await response.json();
      if (data !== null && typeof data === "object") {
        if (response.ok && "ok" in data && data.ok === true) return "renewed";
        if (response.status === 401 && "code" in data && data.code === "token_not_valid") {
          return "expired";
        }
      }
      return "temporary";
    } catch {
      return "temporary";
    }
  })().finally(() => { pending = undefined; });
  return pending;
}
