
import { useQuery } from "@tanstack/react-query";
import { getEnrollments } from "../api/dashboard.api";


export const useEnrollments = () => {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: getEnrollments,
  });
};