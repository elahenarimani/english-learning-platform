import { apiClient } from "@/lib/api/apiClient"

export const getStudentDashboard =async()=>{
    const response = await apiClient.get("/students/me/dashboard/");
    return response.data;
}
// client side API
export const getEnrollments = async () => {
  const response = await apiClient.get("/enrollments/");
  return response.data;
};
