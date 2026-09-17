export function redirectToLogin() {
  if (typeof window === "undefined") {
    return;
  }

  const pathname = window.location.pathname;

  const locale = pathname.startsWith("/en")
    ? "en"
    : "fa";

  window.location.href = `/${locale}/login`;
}