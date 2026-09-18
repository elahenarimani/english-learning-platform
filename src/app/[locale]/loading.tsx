
import StudentSkeleton from "@/components/shared/skeletons/StudentSkeleton/StudentSkeleton";
import { getTranslations } from "next-intl/server";

type LoadingProps = {
  message?: string;
};

export default async function Loading({ message }: LoadingProps) {
  const t = await getTranslations("Loading");

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
      <StudentSkeleton/>

      <p>{message || t("message")}</p>
    </div>
  );
}