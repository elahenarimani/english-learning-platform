import { apiClient } from "@/lib/api/apiClient"
import { EnrollmentsResponse } from "../types/enrollment.types";
import { backendRequest } from "@/lib/server/backend";
import {  TutorsResponse } from "../types/toturstypes";

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

export const getTotursServer = 
async(): Promise<TutorsResponse> =>{
  return backendRequest<TutorsResponse>({
    path:"tutors",
    method:"GET"
  })
}  