"use client";

// import clsx from "clsx";
// import { BookOpen, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import styles from "./Tutors.module.scss";
import { Tutor } from "../../types/tutorstypes";
import { User } from "lucide-react";
// import { Enrollment } from "../../types/enrollment.types";
// import { formatPersianDate } from "@/lib/utils/date";
import Image from "next/image";
import Button from "@/components/kit/Button/Button";
interface tutorsProps {
  data: Tutor[];
}

const Tutors = ({ data }: tutorsProps) => {
  const t = useTranslations("tutors");
  console.log("tutors:", data);

  if (!data || data.length === 0) {
    return (
      <div className={styles["empty-wrapper"]}>
        <User size={60} />
        <p>{t("empty")}</p>
      </div>
    );
  }
  return (
    <section className={styles["totur-wrapper"]}>
      <h2 className={styles.title}>{t("title")}</h2>
      <p>{t("description")}</p>
      <div className={styles["card-wrapper"]}>
        {data.map((tutors) => {
          console.log("profile_picture:", tutors.profile_picture);
          const languages = tutors.languages_spoken;

          let firstLanguage = "";

          if (Array.isArray(languages)) {
            if (languages.length > 0) {
              const first = languages[0];

              if (typeof first === "string") {
                firstLanguage = first;
              } else {
                firstLanguage = first.language;
              }
            }
          } else {
            firstLanguage = Object.keys(languages)[0] ?? "";
          }
          return (
            <div key={tutors.id} className={styles.card}>
              <div className={styles["profile-image-wrapper"]}>
                {tutors.profile_picture ? (
                  <Image
                    src={tutors.profile_picture}
                    alt={`${tutors.user.first_name} ${tutors.user.last_name}`}
                    fill
                    sizes="120px"
                    className={styles["profile-image"]}
                  />
                ) : (
                  <div className={styles["profile-placeholder"]}>No Image</div>
                )}
              </div>
              <p>{firstLanguage}</p>

              <p>
                {tutors.user.first_name} {tutors.user.last_name}
              </p>
              <Button>مشاهده کامل پروفایل</Button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Tutors;
