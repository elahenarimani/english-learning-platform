
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.API_URL;

function backendError(code: string) {
  return NextResponse.json(
    { detail: "Unable to complete the backend request.", code },
    { status: 502 },
  );
}

function forwardResponse(response: Response) {
  const headers = new Headers(response.headers);
  // Browser session cookies are managed by Next.js, not forwarded from the API.
  headers.delete("set-cookie");
  headers.delete("x-session-state");
  return new NextResponse(response.body, { status: response.status, headers });
}

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join("/");
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("host");

  if (accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  const searchParams = request.nextUrl.search;
  const targetUrl = `${BACKEND_URL}/${path}/${searchParams}`;

  // ذخیره بدنه درخواست برای جلوگیری از چندبار خوندن Stream
  const requestBody =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined;

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method: request.method,
      headers: requestHeaders,
      body: requestBody,
      cache: "no-store",
    });
  } catch {
    return backendError("backend_unavailable");
  }

  // مدیریت تمدید توکن در صورت دریافت ۴۰۱
  if (response.status === 401 && refreshToken) {
    let refreshRes: Response;
    try {
      refreshRes = await fetch(`${BACKEND_URL}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
        cache: "no-store",
      });
    } catch {
      return backendError("refresh_unavailable");
    }

    if (refreshRes.status === 401) {
      const error: unknown = await refreshRes.json().catch(() => null);
      if (
        error !== null &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "token_not_valid"
      ) {
        const res = NextResponse.json(
          { detail: "Session has expired. Please sign in again.", code: "token_not_valid" },
          { status: 401, headers: { "X-Session-State": "expired" } },
        );
        for (const name of ["access_token", "refresh_token"]) {
          res.cookies.set(name, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
          });
        }
        return res;
      }
    }

    if (!refreshRes.ok) return backendError("refresh_failed");

    let newAccessToken: string | undefined;
    try {
      // Next.js parses all Set-Cookie headers, including Expires values containing commas.
      newAccessToken = new NextResponse(null, { headers: refreshRes.headers })
        .cookies.get("access_token")?.value;
    } catch {
      return backendError("invalid_refresh_response");
    }
    if (!newAccessToken || !/^[A-Za-z0-9._~-]+$/.test(newAccessToken)) {
      return backendError("invalid_refresh_response");
    }

    requestHeaders.set("Authorization", `Bearer ${newAccessToken}`);
    try {
      response = await fetch(targetUrl, {
        method: request.method,
        headers: requestHeaders,
        body: requestBody,
        cache: "no-store",
      });

    } catch {
      return backendError("backend_unavailable");
    }

    const res = forwardResponse(response);
    // A second 401 stays a failure; do not refresh again or persist the rejected access token.
    if (response.status !== 401) {
      res.cookies.set("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });
    }
    return res;
  }

  return forwardResponse(response);
}

export {
  proxyRequest as GET,
  proxyRequest as POST,
  proxyRequest as PUT,
  proxyRequest as PATCH,
  proxyRequest as DELETE,
};
