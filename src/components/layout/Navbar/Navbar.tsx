"use client";
import { ThemeToggle } from "@/components/ui/theme-toggle/ThemeToggle";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../LanguageSwitcher";
import styles from "./Navbar.module.scss"
export function Navbar() {
  const t = useTranslations("Home");
  return (
    <nav  className={styles.navbar}>
      <h1 className="dark:text-white dark:bg-amber-700">{t("title")}</h1>
      <p>{t("description")}</p>
      <ThemeToggle />
      <LanguageSwitcher />
    </nav>
  );
}
