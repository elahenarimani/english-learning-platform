
import { getEnrollmentsServer } from "@/feature/dashboard/api/dashboard.api";
import MyCourses from "@/feature/dashboard/components/Cources/MyCourses";

export default async function CoursesPage() {
  const enrollments = await getEnrollmentsServer();

  return (
    <div>
      <MyCourses data={enrollments} />
    </div>
  );
}