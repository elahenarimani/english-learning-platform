import { getTutorsServer } from "@/feature/dashboard/api/dashboard.api";
import Tutors from "@/feature/dashboard/components/tutors/Tutors";
import { notFound } from "next/navigation";
export default async function TutorsPage() {
  const tutors = await getTutorsServer();
  if (!tutors) {
    notFound();
  }
  return (
    <div>
      <Tutors data={tutors || []} />
    </div>
  );
}
