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
export interface LoginResponse {
  ok: boolean;
  access: string;
  refresh: string;
}
export const registerUser = async (data: RegisterRequest) => {
  const response = await apiClient.post("/register/", data);

  return response.data;
};
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post("/login/", data);
  return response.data;
};
