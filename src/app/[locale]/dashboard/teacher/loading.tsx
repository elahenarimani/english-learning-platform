import Spinner from "@/components/kit/Spinner/Spinner";
import { useTranslations } from "next-intl";

type LoadingProps = {
  message?: string;
};

export default function Loading({ message }: LoadingProps) {
  const t = useTranslations("Loading");

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
      }}
    >
      <Spinner />

      <span>{message ?? t("message")}</span>
    </div>
  );
}