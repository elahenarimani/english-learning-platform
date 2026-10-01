import { z } from "zod";
import { getPathname, routing } from "@/i18n/routing";

// Validate the identity and role fields used after login before caching or redirecting.
export const loginUserSchema = z.object({
  id: z.number().int().positive(),
  email: z.email(),
  first_name: z.string(),
  last_name: z.string(),
  is_teacher: z.boolean(),
});

function hasControlCharacters(value: string): boolean {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
}

export function getLoginRedirect(
  callbackUrl: string | null,
  currentLocale: string,
  isTeacher: boolean,
): string {
  const locale =
    routing.locales.find((value) => value === currentLocale) ?? routing.defaultLocale;
  const dashboard = `/dashboard/${isTeacher ? "teacher" : "student"}`;
  const fallback = getPathname({ href: dashboard, locale });

  if (
    !callbackUrl ||
    !callbackUrl.startsWith("/") ||
    callbackUrl.startsWith("//") ||
    callbackUrl.includes("\\") ||
    hasControlCharacters(callbackUrl) ||
    /\s/.test(callbackUrl) ||
    callbackUrl.includes("#")
  ) {
    return fallback;
  }

  try {
    const decodedUrl = decodeURIComponent(callbackUrl);
    if (decodedUrl.includes("\\") || hasControlCharacters(decodedUrl)) return fallback;
    // Inspect segments before URL normalizes dot segments or encoded separators.
    const rawPath = callbackUrl.split("?")[0].replace(/\/$/, "");
    const segments = rawPath.slice(1).split("/");
    for (const segment of segments) {
      const decoded = decodeURIComponent(segment);
      if (
        !decoded ||
        decoded === "." ||
        decoded === ".." ||
        /[/\\%?#\s]/.test(decoded) ||
        hasControlCharacters(decoded)
      ) {
        return fallback;
      }
    }

    if (routing.locales.some((value) => value === segments[0])) {
      segments.shift();
    }
    const path = `/${segments.join("/")}`;

    // Only existing page patterns are return destinations; auth, API and home are excluded.
    const isPublicPage = /^\/(courses|blog)(\/[^/]+)?$/.test(path);
    const isStudentPage =
      /^\/dashboard\/student(?:\/(?:student-dashboard|assignments|payment|profile|courses(?:\/[^/]+)?|tutors(?:\/[^/]+)?))?$/.test(path);
    const isRolePage = isTeacher ? path === dashboard : isStudentPage;
    if (!isPublicPage && !isRolePage) return fallback;

    const url = new URL(callbackUrl, "https://internal.invalid");
    if (url.origin !== "https://internal.invalid") return fallback;
    // Preserve the query as supplied, including repeated keys and encoded values.
    return getPathname({ href: path, locale }) + url.search;
  } catch {
    return fallback;
  }
}
