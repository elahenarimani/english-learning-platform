import { useQuery } from '@tanstack/react-query';
import { getCourses } from '../api/courses.api';

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });
};