"use client";

import Button from "@/components/kit/Button/Button";
// import { useEnrollments } from "../../hooks/useEnrollments";
import styles from "./MyCourses.module.scss";
import StudentSkeleton from "@/components/shared/skeletons/StudentSkeleton/StudentSkeleton";
import { Enrollment } from "../../types/enrollment.types";
  interface MyCoursesProps {
  data: Enrollment[];
}

const MyCourses = ({ data }: MyCoursesProps) => {


  // const { data, isLoading, isError } = useEnrollments();

  // console.log("Enrollments:", data);
  // console.log("loading:", isLoading);
  // console.log("error:", isError);

  // if (isLoading) {
  //   return <StudentSkeleton />;
  // }

  // if (isError) {
  //   return <p>Error loading courses.</p>;
  // }

  // if (!data || data.length === 0) {
  //   return <p>No courses found.</p>;
  // }

//   return (
//     <>
//       <p>My Courses</p>

//       <div className={styles["card-wrapper"]}>
//         {data.map((enrollment: Enrollment) => (
//           <div className={styles.card} key={enrollment.id}>
//             <div className={styles["card-header"]}>
//               <Button
//                 variant="contained"
//                 className={styles["course-name-button"]}
//               >
//                 {enrollment.course.title}
//               </Button>

//               <Button variant="contained" className={styles["course-status"]}>
//                 {enrollment.status}
//               </Button>
//             </div>

//             <h3 className={styles["card-title"]}>{enrollment.course.title}</h3>

//             <p className={styles["card-date"]}>{enrollment.submitted_at}</p>

//             <Button variant="text" className={styles["course-name-button"]}>
//               {enrollment.course.courseId}
//             </Button>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default MyCourses;
 if (!data || data.length === 0) {
    return <p>No courses found.</p>;
  }

  return (
    <>
      <p>My Courses</p>

      <div className={styles["card-wrapper"]}>
        {data.map((enrollment) => (
          <div className={styles.card} key={enrollment.id}>
            <div className={styles["card-header"]}>
              <Button
                variant="contained"
                className={styles["course-name-button"]}
              >
                {enrollment.course.title}
              </Button>

              <Button
                variant="contained"
                className={styles["course-status"]}
              >
                {enrollment.status}
              </Button>
            </div>

            <h3 className={styles["card-title"]}>
              {enrollment.course.title}
            </h3>

            <p className={styles["card-date"]}>
              {enrollment.submitted_at}
            </p>

            <Button
              variant="text"
              className={styles["course-name-button"]}
            >
              {enrollment.course.courseId}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default MyCourses;
