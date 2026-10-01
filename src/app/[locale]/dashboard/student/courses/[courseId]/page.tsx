import NotFound from "@/components/shared/NotFound";
import { renderStudentPage } from "@/lib/server/studentPage";

export default function CoursePage() {
  return renderStudentPage(<NotFound />);
}
