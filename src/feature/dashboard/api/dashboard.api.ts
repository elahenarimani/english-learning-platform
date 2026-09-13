import { apiClient } from "@/lib/api/apiClient"
import { EnrollmentsResponse } from "../types/enrollment.types";
import { cookies } from "next/headers";
import { backendRequest } from "@/lib/server/backend";

export const getStudentDashboard =async()=>{
    const response = await apiClient.get("/students/me/dashboard/");
    return response.data;
}
// client side API
export const getEnrollments = async () => {
  const response = await apiClient.get("/enrollments/");
  return response.data;
};
// server side API

export const getEnrollmentsServer =
  async (): Promise<EnrollmentsResponse> => {
    return backendRequest<EnrollmentsResponse>({
      path: "enrollments",
      method: "GET",
    });
  };