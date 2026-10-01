"use client";

import clsx from "clsx";
import { Ban, BookOpen, Calendar, CheckCircle, Clock, FileText, Hourglass, XCircle, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import styles from "./StudentDashboard.module.scss";
import { Enrollment } from "../../types/enrollment.types";
import { formatPersianDate } from "@/lib/utils/date";

interface StudentsProps {
  data: Enrollment[];
}

const statusIcons = {
  draft: FileText,
  pending_payment: Clock,
  under_review: Hourglass,
  approved: CheckCircle,
  rejected: XCircle,
  cancelled: Ban,
} satisfies Record<Enrollment["status"], LucideIcon>;

function isKnownStatus(value: unknown): value is Enrollment["status"] {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(statusIcons, value);
}

const StudentDashboard = ({ data }: StudentsProps) => {
  const t = useTranslations("MyCourses");


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
          const status = isKnownStatus(enrollment.status) ? enrollment.status : null;
          const StatusIcon = status ? statusIcons[status] : null;
          // Keep the existing cancellation styling without changing the API value.
          const styleStatus = status === "cancelled" ? "canceled" : status;
          const persianDate = formatPersianDate(enrollment.submitted_at);
          return (
            <div
              className={clsx(
                styles.card,
                styleStatus && styles[`card-status-${styleStatus}`],
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
                    styleStatus && styles[`status-${styleStatus}`],
                  )}
                >
                  {StatusIcon && <StatusIcon size={16} />}
                  <span>{t(status ? `status.${status}` : "status.unknown")}</span>
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

export default StudentDashboard;
