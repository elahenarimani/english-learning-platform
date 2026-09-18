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
  try {
    const body = await request.json();

    // ارسال اطلاعات به endpoint لاگین جنگو (آدرس لاگین خود را چک کنید، معمولا /token/ یا /login/ است)
    const res = await fetch(`${BACKEND_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { detail: data.detail || "اطلاعات ورود اشتباه است." },
        { status: res.status }
      );
    }

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
  } catch (error) {
    return NextResponse.json(
      { message: "خطایی در برقراری ارتباط با سرور رخ داده است." },
      { status: 500 }
    );
  }
}