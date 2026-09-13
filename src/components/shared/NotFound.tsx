import Link from "next/link";
import { useTranslations } from "next-intl";

type NotFoundProps = {
  title?: string;
  description?: string;
  href?: string;
  linkText?: string;
};

export default function NotFound({
  title,
  description,
  href = "/",
  linkText,
}: NotFoundProps) {
  const t = useTranslations("NotFound");

  return (
    <main>
      <h1>{title ?? t("title")}</h1>

      <p>{description ?? t("description")}</p>

      <Link href={href}>
        {linkText ?? t("backToHome")}
      </Link>
    </main>
  );
}