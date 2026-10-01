import { NextRequest, NextResponse } from "next/server";

function reply(status: number, code: string) {
  return NextResponse.json({ code }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function sessionExpired() {
  const response = reply(401, "token_not_valid");
  for (const name of ["access_token", "refresh_token"]) {
    response.cookies.set(name, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }
  return response;
}

export async function POST(request: NextRequest) {
  // Must be explicitly configured; never derive trust from Host/Forwarded headers.
  const configuredOrigin = process.env.APP_ORIGIN;
  let origin: URL;
  try {
    if (!configuredOrigin) return reply(503, "refresh_not_configured");
    origin = new URL(configuredOrigin);
    if (
      !["http:", "https:"].includes(origin.protocol) ||
      origin.username || origin.password || origin.pathname !== "/" ||
      origin.search || origin.hash ||
      (process.env.NODE_ENV === "production" && origin.protocol !== "https:")
    ) return reply(503, "refresh_not_configured");
  } catch {
    return reply(503, "refresh_not_configured");
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (
    request.headers.get("origin") !== origin.origin ||
    (fetchSite !== null && fetchSite !== "same-origin") ||
    request.headers.get("x-session-refresh") !== "1" ||
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json"
  ) return reply(403, "refresh_request_forbidden");

  // Only the HttpOnly cookie is accepted, regardless of any browser request body.
  const refresh = request.cookies.get("refresh_token")?.value;
  if (!refresh) return sessionExpired();

  const backendUrl = process.env.API_URL;
  if (!backendUrl) return reply(503, "refresh_not_configured");

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${backendUrl.replace(/\/$/, "")}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
      cache: "no-store",
      redirect: "error",
    });
  } catch {
    return reply(502, "refresh_unavailable");
  }

  if (backendResponse.status === 401) {
    const error: unknown = await backendResponse.json().catch(() => null);
    if (error !== null && typeof error === "object" &&
      "code" in error && error.code === "token_not_valid") {
      return sessionExpired();
    }
  }
  if (!backendResponse.ok) return reply(502, "refresh_failed");

  let access: string | undefined;
  try {
    // Next.js handles multiple Set-Cookie headers and commas inside Expires.
    access = new NextResponse(null, { headers: backendResponse.headers })
      .cookies.get("access_token")?.value;
  } catch {
    return reply(502, "invalid_refresh_response");
  }
  if (!access || !/^[A-Za-z0-9._~-]+$/.test(access)) {
    return reply(502, "invalid_refresh_response");
  }

  const response = NextResponse.json({ ok: true }, {
    headers: { "Cache-Control": "no-store" },
  });
  response.cookies.set("access_token", access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });
  return response;
}

export function GET() {
  const response = reply(405, "method_not_allowed");
  response.headers.set("Allow", "POST");
  return response;
}
