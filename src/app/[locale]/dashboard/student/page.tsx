// import MyCourses from "@/feature/dashboard/components/MyCources/MyCourses";

// export default function StudentDashboardPage() {
//   return (
//     <div>
//       <MyCourses />
//     </div>
//   );
// }
import MyCourses from "@/feature/dashboard/components/MyCources/MyCourses";
import { getEnrollmentsServer } from "@/feature/dashboard/api/dashboard.api";

export default async function StudentDashboardPage() {
  const enrollments = await getEnrollmentsServer();

  return (
    <div>
      <MyCourses data={enrollments} />
    </div>
  );
}