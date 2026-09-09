import { apiClient } from "@/lib/api/apiClient";
import { promises } from "dns";

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_teacher: boolean;
}
export interface LoginRequest {
  email: string;
  password: string;
}
// export interface LoginResponse {
//   ok: boolean;
// }
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_teacher: boolean;
  profile_picture: string | null;
  has_tutor_profile: boolean;
  tutor_id: number | null;
  tutor_approved: boolean | null;
}
export const registerUser = async (data: RegisterRequest) => {
  const response = await apiClient.post("/register/", data);

  return response.data;
};
export const loginUser = async (data: LoginRequest) => {
  const response = await apiClient.post("/login/", data);

  return response.data;
};
export const getMe = async () => {
  const response = await apiClient.get("/me/");

  return response.data;
};