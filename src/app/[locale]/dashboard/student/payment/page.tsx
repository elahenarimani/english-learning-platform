
import Payment from "@/feature/dashboard/components/Payment/Payment";
import { renderStudentPage } from "@/lib/server/studentPage";

export default function StudentCoursePage() {
  return renderStudentPage(
    <div>
      <Payment/>
    </div>
  );
}
