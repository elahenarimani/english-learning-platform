// import { apiClient } from "@/lib/api/apiClient";
// import { promises } from "dns";

// export interface RegisterRequest {
//   email: string;
//   password: string;
//   first_name: string;
//   last_name: string;
//   is_teacher: boolean;
// }
// export interface LoginRequest {
//   email: string;
//   password: string;
// }
// // export interface LoginResponse {
// //   ok: boolean;
// // }
// export interface User {
//   id: number;
//   email: string;
//   first_name: string;
//   last_name: string;
//   is_teacher: boolean;
//   profile_picture: string | null;
//   has_tutor_profile: boolean;
//   tutor_id: number | null;
//   tutor_approved: boolean | null;
// }


// // ثبت‌نام از طریق Route Handler داخلی Next.js
// export const registerUser = async (data: RegisterRequest) => {
//   const response = await apiClient.post("/register/", data);

//   return response.data;
// };

// // ورود و دریافت کوکی HttpOnly
// export const loginUser = async (data: LoginRequest) => {
//   const response = await apiClient.post("/login/", data);

//   return response.data;
// };

// // خروج و پاک‌سازی کوکی‌ها
// export const logoutUser = async () => {
//   const response = await apiClient.post("/logout/");

//   return response.data;
// };
// export const getMe = async () => {
//   const response = await apiClient.get("/me/");

//   return response.data;
// };





// ============================
import axios from "axios";

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

// ثبت‌نام از طریق Route Handler داخلی Next.js
export const registerUser = async (data: RegisterRequest) => {
  const response = await axios.post("/api/auth/register", data);
  return response.data;
};

// ورود و دریافت کوکی HttpOnly
export const loginUser = async (data: LoginRequest) => {
  const response = await axios.post("/api/auth/login", data);
  return response.data;
};

// خروج و پاک‌سازی کوکی‌ها
export const logoutUser = async () => {
  const response = await axios.post("/api/auth/logout");
  return response.data;
};

// دریافت اطلاعات کاربر لاگین شده
export const getMe = async (): Promise<User> => {
  const response = await axios.get("/api/backend/me/");
  return response.data;
};