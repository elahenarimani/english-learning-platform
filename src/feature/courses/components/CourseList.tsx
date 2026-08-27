import { useCourses } from "../hooks/useCourse";


export default function CourseList() {
  const { data, isLoading, isError } = useCourses();

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  return (
    <div>
      {data.map((course: any) => (
        <div key={course.id}>
          {course.title}
        </div>
      ))}
    </div>
  );
}