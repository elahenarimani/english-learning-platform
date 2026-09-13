import { useQuery } from "@tanstack/react-query";
import { getStudentDashboard } from "../api/dashboard.api";

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ["student-dashboard"],
    queryFn:getStudentDashboard,
  });
};
