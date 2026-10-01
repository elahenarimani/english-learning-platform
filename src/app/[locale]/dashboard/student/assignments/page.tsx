import Assignments from "@/feature/dashboard/components/Assignments/Assignments";
import { renderStudentPage } from "@/lib/server/studentPage";

export default function StudentAssignmentsPage() {
  return renderStudentPage(
    <div>
      <Assignments />
    </div>
  );
}
