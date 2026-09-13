"use client";

import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div>
      <h1>{t("title")}</h1>

      <p>{t("description")}</p>

      <button onClick={() => window.history.back()}>
        {t("back")}
      </button>
    </div>
  );
}