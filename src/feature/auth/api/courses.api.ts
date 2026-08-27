import { apiClient } from '@/lib/api/apiClient';

export const login = async (data:any) => {
  const response = await apiClient.post('/auth/login/', data);
  return response.data;
};