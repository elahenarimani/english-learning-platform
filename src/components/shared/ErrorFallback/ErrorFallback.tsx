"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/kit/Button/Button";
import styles from "./ErrorFallback.module.scss";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorFallback({
  error,
  reset,
}: ErrorFallbackProps) {
  const t = useTranslations("Errors");

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.icon}>⚠️</span>

        <h2 className={styles.title}>
          {t("title")}
        </h2>

        <p className={styles.description}>
          {t("description")}
        </p>

        {process.env.NODE_ENV === "development" && (
          <p className={styles.debugMessage}>
            {error.message}
          </p>
        )}

        <Button
          type="button"
          onClick={reset}
        >
          {t("retry")}
        </Button>
      </div>
    </div>
  );
}