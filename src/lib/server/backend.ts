

import { cookies } from "next/headers";

const BACKEND_URL = process.env.API_URL;

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
  if (!BACKEND_URL) {
    throw new Error("API_URL environment variable is not defined");
  }

  const cookieStore = await cookies();

  let accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  // ۱. اگر هیچ توکنی وجود ندارد
  if (!accessToken && !refreshToken) {
    throw new Error("Unauthorized");
  }

  const cleanBase = BACKEND_URL.replace(/\/$/, "");
  let cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (!cleanPath.endsWith("/") && !cleanPath.includes("?")) {
    cleanPath += "/";
  }

  const requestUrl = `${cleanBase}${cleanPath}`;

  // ۲. اگر access_token نبود ولی refresh_token داشتیم، ابتدا توکن جدید می‌گیریم
  if (!accessToken && refreshToken) {
    accessToken = await refreshAndSaveToken(cleanBase, refreshToken, cookieStore);
  }

  // تابع ساخت Options برای fetch (مقدار اکتیو accessToken را مستقیماً دریافت می‌کند)
  const getFetchOptions = (token?: string) => {
    const headers: Record<string, string> = {};

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store" as const,
    };
  };

  // ارسال درخواست با توکن موجود
  let response = await fetch(requestUrl, getFetchOptions(accessToken));

  // ۳. اگر پاسخ 401 شد و refreshToken داریم، توکن را تمدید کرده و دوباره درخواست می‌زنیم
  if (response.status === 401 && refreshToken) {
    try {
      accessToken = await refreshAndSaveToken(cleanBase, refreshToken, cookieStore);
      response = await fetch(requestUrl, getFetchOptions(accessToken));
    } catch {
      throw new Error("Unauthorized");
    }
  }

  // ۴. مدیریت خطاهای غیر 2xx
  if (!response.ok) {
    const errorText = await response.text();

   

    throw new Error(`Backend request failed: ${response.status} ${errorText}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

async function refreshAndSaveToken(
  baseUrl: string,
  refreshToken: string,
  cookieStore: Awaited<ReturnType<typeof cookies>>
): Promise<string> {
  const refreshResponse = await fetch(`${baseUrl}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store",
  });

  if (!refreshResponse.ok) {
    throw new Error("Unauthorized");
  }

  const refreshData = await refreshResponse.json();
  const newAccessToken = refreshData.access as string;

  try {
    cookieStore.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch {
    // در صورتی که در لایه Server Component امکان set کردن کوکی نباشد
  }

  return newAccessToken;
}