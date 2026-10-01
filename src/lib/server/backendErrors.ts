export class SessionRecoveryRequired extends Error {
  constructor() {
    super("Session recovery required");
    this.name = "SessionRecoveryRequired";
  }
}

export class BackendRequestError extends Error {
  constructor(
    public readonly kind: "network" | "server" | "permission" | "response" | "configuration",
    public readonly status?: number,
  ) {
    super(`Backend request failed: ${kind}`);
    this.name = "BackendRequestError";
  }
}
