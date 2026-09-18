// import createMiddleware from "next-intl/middleware";
// import { routing } from "./i18n/routing";

// export default createMiddleware(routing);

// export const config = {
//   matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
// };
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// ۱. ایجاد میدلور i18n جهت اضافه کردن خودکار /fa یا /en
const intlMiddleware = createMiddleware(routing);

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // اجرای اولیه‌ی میدلور زبان (اگر کاربر روی / باشد، آن را به /fa یا /en ریدایرکت می‌کند)
  const response = intlMiddleware(request);

  // استخراج توکن‌ها از کوکی
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  // پاک‌سازی پیشوند زبان از آدرس برای بررسی آسان‌تر (مثلاً /fa/login -> /login)
  const pathnameWithoutLocale = pathname.replace(/^\/(fa|en)/, "") || "/";

  // اگر کاربر روی آدرس ریشه (/) آمد و لاگین نبود -> هدایت به لاگین
  if (pathnameWithoutLocale === "/") {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/fa/login", request.url));
    } else {
      return NextResponse.redirect(new URL("/fa/dashboard/student", request.url));
    }
  }

  // بررسی مسیرهای محافظت شده (مثل /dashboard/student)
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/fa/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // بررسی مسیرهای ورود/ثبت‌نام (اگر لاگین است دوباره نروید به لاگین)
  const isAuthRoute = authRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/fa/dashboard/student", request.url));
  }

  return response;
}

export const config = {
  // این matcher بررسی می‌کند که تمام مسیرها (حتی مسیر /) از این میدلور رد شوند
  matcher: [
    "/",
    "/(fa|en)/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};