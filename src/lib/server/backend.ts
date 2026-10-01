import "server-only";

import { cookies } from "next/headers";
import { BackendRequestError, SessionRecoveryRequired } from "./backendErrors";

interface BackendRequestOptions {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

export async function backendRequest<T>({ path, method = "GET", body }: BackendRequestOptions): Promise<T> {
  const base = process.env.API_URL;
  if (!base) throw new BackendRequestError("configuration");
  const access = (await cookies()).get("access_token")?.value;
  if (!access) throw new SessionRecoveryRequired();

  let cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (!cleanPath.endsWith("/") && !cleanPath.includes("?")) cleanPath += "/";
  const headers: Record<string, string> = { Authorization: `Bearer ${access}` };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(`${base.replace(/\/$/, "")}${cleanPath}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new BackendRequestError("network");
  }
  if (response.status === 401) throw new SessionRecoveryRequired();
  if (response.status === 403) throw new BackendRequestError("permission", 403);
  if (!response.ok) {
    throw new BackendRequestError(response.status >= 500 ? "server" : "response", response.status);
  }
  if (response.status === 204) return {} as T;
  try {
    return await response.json();
  } catch {
    throw new BackendRequestError("response", response.status);
  }
}
