"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import styles from "./LanguageSwitcher.module.scss";
import { useLocale } from "next-intl";
import Button from "../../kit/Button/Button";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  console.log("router:",router)
  console.log("pthname:",pathname)
  console.log("local:",locale)

  const changeLanguage = () => {
    const nextLocale = locale === "fa" ? "en" : "fa";

    router.replace(pathname, {
      locale: nextLocale,
    });
  };

  return (
    <Button
      type="button"
      variant="text"
      onClick={changeLanguage}
      className={styles.button}
    >
      {locale === "fa" ? "en" : "فا"}
    </Button>
  );
}
