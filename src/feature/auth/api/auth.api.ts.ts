import { apiClient } from '@/lib/api/apiClient';

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_teacher: boolean;
}
export const registerUser = async (
  data: RegisterRequest
) => {
  const response = await apiClient.post(
    "/register/",
    data
  );

  return response.data;
};