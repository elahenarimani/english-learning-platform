"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>{t("title")}</h2>

      <button onClick={() => reset()}>
        {t("tryAgain")}
      </button>
    </div>
  );
}