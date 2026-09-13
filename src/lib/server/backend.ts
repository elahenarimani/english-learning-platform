import { cookies } from "next/headers";

const BACKEND_URL = process.env.API_URL;

if (!BACKEND_URL) {
  throw new Error("API_URL is not defined");
}

interface BackendRequestOptions {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

export async function backendRequest<T>({
  path,
  method = "GET",
  body,
}: BackendRequestOptions): Promise<T> {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    throw new Error("Unauthorized");
  }

  const requestUrl = `${BACKEND_URL}/${path.replace(/^\/|\/$/g, "")}/`;

  const createRequest = (token?: string) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return {
      method,
      headers,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
      cache: "no-store" as const,
    };
  };

  let response = await fetch(
    requestUrl,
    createRequest(accessToken),
  );

  /*
   * اگر access token منقضی شده باشد
   */
  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch(
      `${BACKEND_URL}/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
        cache: "no-store",
      },
    );

    if (!refreshResponse.ok) {
      throw new Error("Unauthorized");
    }

    const refreshData = await refreshResponse.json();

    accessToken = refreshData.access;

    response = await fetch(
      requestUrl,
      createRequest(accessToken),
    );
  }

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Backend request failed: ${response.status} ${errorText}`,
    );
  }

  return response.json();
}