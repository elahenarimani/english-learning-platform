"use client";

import clsx from "clsx";
import { BookOpen, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import styles from "./MyCourses.module.scss";
import { Enrollment } from "../../types/enrollment.types";
import { formatPersianDate } from "@/lib/utils/date";

interface MyCoursesProps {
  data: Enrollment[];
}

const MyCourses = ({ data }: MyCoursesProps) => {
  const t = useTranslations("MyCourses");

  const statusIcons = {
    approved: CheckCircle,
    rejected: XCircle,
    pending_payment: Clock,
  };

  if (!data || data.length === 0) {
    return (
      <div className={styles["empty-wrapper"]}>
        <BookOpen size={60} />
        <p>{t("empty")}</p>
      </div>
    );
  }

  return (
    <section className={styles["course-wrapper"]}>
      <h2 className={styles.title}>{t("title")}</h2>

      <div className={styles["card-wrapper"]}>
        {data.map((enrollment) => {
          const status = enrollment.status?.toLowerCase();

          const StatusIcon = status
            ? statusIcons[status as keyof typeof statusIcons]
            : null;
          const persianDate = formatPersianDate(enrollment.submitted_at);
          return (
            <div
              className={clsx(
                styles.card,
                status && styles[`card-status-${status}`],
              )}
              key={enrollment.id}
            >
              {/* Course title + status */}

              <div className={styles["card-header"]}>
                <span className={styles["course-id"]}>
                  {enrollment.course.courseId}
                </span>
                <div
                  className={clsx(
                    styles["course-status"],
                    status && styles[`status-${status}`],
                  )}
                >
                  {StatusIcon && <StatusIcon size={16} />}
                  <span>{status ? t(`status.${status}`) : ""}</span>
                </div>
              </div>
              <h3 className={styles["card-title"]}>
                {enrollment.course.title}
              </h3>
              {/* Submitted date */}
              <div className={styles["date-wrapper"]}>
                <Calendar className={styles["calendar-icon"]} size={18} />

                <p className={styles["card-date"]} dir="ltr">
                  <span>{persianDate.year}</span>{" "}
                   <span dir="rtl">{persianDate.month}</span>{" "}
                  <span>{persianDate.day}</span>{" "}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MyCourses;
