import Profile from "@/feature/dashboard/components/Profile/Profile";
import { renderStudentPage } from "@/lib/server/studentPage";

export default function StudentProfilePage() {
  return renderStudentPage(
    <div>
      <Profile />
    </div>
  );
}
