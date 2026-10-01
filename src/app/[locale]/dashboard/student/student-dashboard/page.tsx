import { getEnrollmentsServer } from "@/feature/dashboard/api/dashboard.server";
import { SessionRecoveryRequired } from "@/lib/server/backendErrors";
import SessionRecovery from "@/feature/auth/components/SessionRecovery/SessionRecovery";
import StudentDashboard from "@/feature/dashboard/components/student-dashboard/StudentDashboard";

export default async function StudentDashboardPage() {
  let data;
  try {
    data = await getEnrollmentsServer();
  } catch (error) {
    if (error instanceof SessionRecoveryRequired) {
      return <SessionRecovery needsRecovery renderId={crypto.randomUUID()} />;
    }
    throw error;
  }
  return (
    <SessionRecovery needsRecovery={false} renderId={crypto.randomUUID()}>
      <div><StudentDashboard data={data || []} /></div>
    </SessionRecovery>
  );
}
