// import { NextRequest, NextResponse } from "next/server";

// const BACKEND_URL = process.env.API_URL;

// const ACCESS_TOKEN_COOKIE = "access_token";
// const REFRESH_TOKEN_COOKIE = "refresh_token";

// const cookieOptions = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: "lax" as const,
//   path: "/",
// };

// export async function POST(request: NextRequest) {
//   try {
//     if (!BACKEND_URL) {
//       throw new Error("API_URL is not defined");
//     }

//     const body = await request.text();

//     const response = await fetch(
//       `${BACKEND_URL}/login/`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body,
//         cache: "no-store",
//       },
//     );

//     const responseBody = await response.text();

//     if (!response.ok) {
//       return new NextResponse(responseBody, {
//         status: response.status,
//         headers: {
//           "Content-Type":
//             response.headers.get("Content-Type") ??
//             "application/json",
//         },
//       });
//     }

//     const data = JSON.parse(responseBody);

//     if (!data.access || !data.refresh) {
//       return NextResponse.json(
//         {
//           message: "Invalid token response",
//         },
//         {
//           status: 500,
//         },
//       );
//     }

//     const nextResponse = NextResponse.json({
//       ok: true,
//     });

//     nextResponse.cookies.set(
//       ACCESS_TOKEN_COOKIE,
//       data.access,
//       cookieOptions,
//     );

//     nextResponse.cookies.set(
//       REFRESH_TOKEN_COOKIE,
//       data.refresh,
//       cookieOptions,
//     );

//     return nextResponse;
//   } catch (error) {
//     console.error("Login route error:", error);

//     return NextResponse.json(
//       {
//         message: "Internal server error",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.API_URL;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "درخواست ورود نامعتبر است.", code: "invalid_request" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json(
      { detail: "ارتباط با سرور ورود برقرار نشد.", code: "login_unavailable" },
      { status: 502 },
    );
  }

  // Do not expose upstream bodies: error responses can contain sensitive data.
  if (!res.ok) {
    return NextResponse.json(
      { detail: "درخواست ورود ناموفق بود.", code: "login_rejected" },
      { status: res.status },
    );
  }

  try {
    const data: unknown = await res.json();
    if (
      data === null || typeof data !== "object" ||
      !("access" in data) || !("refresh" in data) ||
      typeof data.access !== "string" || data.access.trim().length === 0 ||
      typeof data.refresh !== "string" || data.refresh.trim().length === 0
    ) throw new Error("Invalid login response");

    const { access, refresh } = data;

    const response = NextResponse.json(
      { success: true, message: "ورود با موفقیت انجام شد" },
      { status: 200 }
    );

    const isProduction = process.env.NODE_ENV === "production";

    // تنظیم کوکی access_token
    response.cookies.set("access_token", access, {
      httpOnly: true,
      secure: isProduction, // روی localhost باید false باشد تا مرورگر کوکی را قبول کند
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    // تنظیم کوکی refresh_token
    response.cookies.set("refresh_token", refresh, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json(
      { detail: "پاسخ سرور ورود نامعتبر است.", code: "invalid_login_response" },
      { status: 502 }
    );
  }
}
