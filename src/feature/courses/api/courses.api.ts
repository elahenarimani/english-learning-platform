import { apiClient } from '@/lib/api/apiClient';

export const getCourses = async () => {
  const response = await apiClient.get('/courses/');
  return response.data;
};

export const getCourse = async (id: number) => {
  const response = await apiClient.get(`/courses/${id}/`);
  return response.data;
};