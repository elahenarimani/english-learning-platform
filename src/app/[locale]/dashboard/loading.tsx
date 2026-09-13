
import StudentSkeleton from "@/components/shared/skeletons/StudentSkeleton/StudentSkeleton";
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
      <StudentSkeleton />

      <span>{message ?? t("message")}</span>
    </div>
  );
}