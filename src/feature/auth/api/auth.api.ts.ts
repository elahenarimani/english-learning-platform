import { apiClient } from '@/lib/api/apiClient';
import { RegisterFormValues } from '../schemas/register.schema';

export const registerUser = async (
  data: RegisterFormValues
) => {
  const response = await apiClient.post(
    "/api/register",
    data
  );

  return response.data;
};