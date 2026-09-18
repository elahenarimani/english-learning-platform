
import { getEnrollmentsServer } from "@/feature/dashboard/api/dashboard.api";
import MyCourses from "@/feature/dashboard/components/Cources/MyCourses";

export default async function StudentPage() {
  const enrollments = await getEnrollmentsServer();

  return (
    <div>
      student
    </div>
  );
}