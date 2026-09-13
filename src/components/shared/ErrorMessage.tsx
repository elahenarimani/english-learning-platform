"use client";

import { useTranslations } from "next-intl";

type ErrorMessageProps = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorMessage({
  message,
  onRetry,
}: ErrorMessageProps) {
  const t = useTranslations("ErrorMessage");

  return (
    <div role="alert">
      <p>{message ?? t("message")}</p>

      {onRetry && (
        <button type="button" onClick={onRetry}>
          {t("retry")}
        </button>
      )}
    </div>
  );
}