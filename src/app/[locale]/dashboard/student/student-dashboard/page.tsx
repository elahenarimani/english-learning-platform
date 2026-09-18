import StudentDashboard from "@/feature/dashboard/components/student-dashboard/StudentDashboard";

import { getEnrollmentsServer } from "@/feature/dashboard/api/dashboard.api";
export default async function StudentDashboardPage() {
  const enrollments = await getEnrollmentsServer();

  return (
    <div>
      <StudentDashboard data={enrollments || []} />
    </div>
  );
}