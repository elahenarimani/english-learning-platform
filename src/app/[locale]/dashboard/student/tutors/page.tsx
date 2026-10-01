import { notFound } from "next/navigation";
import { getTutorsServer } from "@/feature/dashboard/api/dashboard.server";
import { SessionRecoveryRequired } from "@/lib/server/backendErrors";
import SessionRecovery from "@/feature/auth/components/SessionRecovery/SessionRecovery";
import Tutors from "@/feature/dashboard/components/tutors/Tutors";

export default async function TutorsPage() {
  let data;
  try {
    data = await getTutorsServer();
  } catch (error) {
    if (error instanceof SessionRecoveryRequired) {
      return <SessionRecovery needsRecovery renderId={crypto.randomUUID()} />;
    }
    throw error;
  }
  if (!data) notFound();
  return (
    <SessionRecovery needsRecovery={false} renderId={crypto.randomUUID()}>
      <div><Tutors data={data || []} /></div>
    </SessionRecovery>
  );
}
