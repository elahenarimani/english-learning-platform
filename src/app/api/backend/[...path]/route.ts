import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.API_URL;

if (!BACKEND_URL) {
  throw new Error("API_URL is not defined");
}

async function sendToBackend(
  url: string,
  request: NextRequest,
  body?: string,
  accessToken?: string,
) {
  const headers = new Headers(request.headers);

  headers.delete("host");
  headers.delete("content-length");
  headers.delete("cookie");
  headers.delete("authorization");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(url, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });
}

async function proxyRequest(
  request: NextRequest,
  context: {
    params: Promise<{ path: string[] }>;
  },
) {
  const { path } = await context.params;

  const pathName = path.join("/");

  const backendUrl = `${BACKEND_URL}/${pathName}/`;
  const queryString = request.nextUrl.search;
  const finalBackendUrl = `${backendUrl}${queryString}`;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  let body: string | undefined;

  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.text();
  }

  /*
   * LOGIN
   */
  if (pathName === "login") {
    const response = await sendToBackend(
      finalBackendUrl,
      request,
      body,
    );

    const responseBody = await response.text();

    if (!response.ok) {
      return new NextResponse(responseBody, {
        status: response.status,
        headers: {
          "Content-Type":
            response.headers.get("Content-Type") ??
            "application/json",
        },
      });
    }

    const data = JSON.parse(responseBody);

    const nextResponse = NextResponse.json({
      ok: true,
    });

    nextResponse.cookies.set("access_token", data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    nextResponse.cookies.set("refresh_token", data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return nextResponse;
  }

  /*
   * REFRESH
   *
   * Frontend:
   * /api/backend/token/refresh/
   *
   * Backend:
   * /api/token/refresh/
   */
  if (pathName === "token/refresh") {
    if (!refreshToken) {
      return NextResponse.json(
        {
          message: "Refresh token not found",
        },
        {
          status: 401,
        },
      );
    }

    const response = await fetch(
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

    const responseBody = await response.text();

    if (!response.ok) {
      const nextResponse = new NextResponse(responseBody, {
        status: response.status,
        headers: {
          "Content-Type":
            response.headers.get("Content-Type") ??
            "application/json",
        },
      });

      nextResponse.cookies.delete("access_token");
      nextResponse.cookies.delete("refresh_token");

      return nextResponse;
    }

    const data = JSON.parse(responseBody);

    const nextResponse = NextResponse.json({
      ok: true,
    });

    nextResponse.cookies.set(
      "access_token",
      data.access,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    );

    nextResponse.cookies.set(
      "refresh_token",
      data.refresh ?? refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    );

    return nextResponse;
  }

  /*
   * NORMAL REQUEST
   */
  let response = await sendToBackend(
    finalBackendUrl,
    request,
    body,
    accessToken,
  );

  /*
   * ACCESS TOKEN EXPIRED
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

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();

      response = await sendToBackend(
        finalBackendUrl,
        request,
        body,
        refreshData.access,
      );

      const responseBody = await response.text();

      const nextResponse = new NextResponse(
        responseBody,
        {
          status: response.status,
          headers: {
            "Content-Type":
              response.headers.get("Content-Type") ??
              "application/json",
          },
        },
      );

      nextResponse.cookies.set(
        "access_token",
        refreshData.access,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        },
      );

      nextResponse.cookies.set(
        "refresh_token",
        refreshData.refresh ?? refreshToken,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        },
      );

      return nextResponse;
    }

    const responseBody = await response.text();

    const nextResponse = new NextResponse(
      responseBody,
      {
        status: 401,
        headers: {
          "Content-Type":
            response.headers.get("Content-Type") ??
            "application/json",
        },
      },
    );

    nextResponse.cookies.delete("access_token");
    nextResponse.cookies.delete("refresh_token");

    return nextResponse;
  }

  /*
   * NORMAL RESPONSE
   */
  const responseBody = await response.text();

  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ??
        "application/json",
    },
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;