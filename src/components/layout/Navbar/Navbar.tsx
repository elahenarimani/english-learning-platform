"use client";
import { ThemeToggle } from "@/components/kit/theme-toggle/ThemeToggle";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import styles from "./Navbar.module.scss"
import Button from "@/components/kit/Button/Button";
export function Navbar() {
  const t = useTranslations("Home");
  return (
    <nav  className={styles.navbar}>
      <h1 className="dark:text-white dark:bg-amber-700">{t("title")}</h1>
      <p>{t("description")}</p>
      <ThemeToggle />
      
      <LanguageSwitcher />
      <Button variant="contained"> {t("description")}</Button>
      <Button variant="outlined"> {t("description")}</Button>
      <Button variant="text"> {t("description")}</Button>
      <Button variant="contained" color="brand"> {t("description")}</Button>
      <Button variant="contained" color="error"> {t("description")}</Button>
      <Button variant="contained" color="info"> {t("description")}</Button>
      <Button variant="contained" color="secondary"> {t("description")}</Button>
      <Button variant="contained" color="success"> {t("description")}</Button>
      <Button variant="contained" color="warning"> {t("description")}</Button>
       <Button variant="contained" loading>loading</Button>
        <Button variant="contained" disabled> disable</Button>
    </nav>
  );
}
