
import MyCourses from "@/feature/dashboard/components/Cources/MyCourses";
import { renderStudentPage } from "@/lib/server/studentPage";

export default function CoursesPage() {

  return renderStudentPage(
    <div>
      <MyCourses />
    </div>
  );
}
