import type { Metadata } from "next";
import "../../styles/globals.scss";

import localFont from "next/font/local";
import { notFound } from "next/navigation";

import QueryProvider from "@/lib/react-query/QueryProvider";
// import { ToastContainer } from "@/components/ui/toast/ToastContainer";
import { ThemeProvider } from "@wrksz/themes/next";

import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export const metadata: Metadata = {
  title: "Learning English",
  description: "English Learning Platform",
};

const vazirmatn = localFont({
  src: [
    {
      path: "../../fonts/Vazirmatn-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/Vazirmatn-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/Vazirmatn-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fa" | "en")) {
    notFound();
  }

  const direction = locale === "fa" ? "rtl" : "ltr";
  const messages = await getMessages();
  return (
    <html
      lang={locale}
      dir={direction}
      className={vazirmatn.className}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
