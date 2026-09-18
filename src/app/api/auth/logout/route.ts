// import { NextResponse } from "next/server";

// export async function POST() {
//   const response = NextResponse.json({
//     ok: true,
//   });

//   response.cookies.delete("access_token");
//   response.cookies.delete("refresh_token");

//   return response;
// }
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "خروج با موفقیت انجام شد" },
    { status: 200 }
  );

  // حذف کوکی‌ها با تنظیم تاریخ انقضا روی 0
  response.cookies.set("access_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  response.cookies.set("refresh_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}