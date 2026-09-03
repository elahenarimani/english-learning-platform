"use client";

import { ThemeProvider as ThemesProvider } from "@wrksz/themes";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  return (
    <ThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      {children}
    </ThemesProvider>
  );
}