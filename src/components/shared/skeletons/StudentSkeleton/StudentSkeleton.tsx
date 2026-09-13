import Skeleton from "@mui/material/Skeleton";
import styles from "./StudentSkeleton.module.scss";

export default function StudentSkeleton() {
  return (
    <section className={styles.container}>
      <Skeleton
        variant="text"
        width={180}
        height={40}
        className={styles.title}
      />

      <div className={styles.grid}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.header}>
              <Skeleton variant="rounded" width="45%" height={32} />
              <Skeleton variant="rounded" width="25%" height={32} />
            </div>

            <Skeleton variant="text" width="80%" height={32} />

            <Skeleton variant="text" width="60%" height={24} />

            <Skeleton variant="rounded" width="40%" height={32} />
          </div>
        ))}
      </div>
    </section>
  );
}