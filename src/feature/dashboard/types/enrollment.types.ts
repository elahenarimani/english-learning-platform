export interface Lesson {
  id: number;
  title: string;
  description: string;
  lesson_video: string;
  lesson_document: string;
}

export interface Tutor {
  id: number;
  user: number;
  profile_picture: string;
  languages_spoken: string;
  subjects: string[];
}

export interface Course {
  id: number;
  courseId: string;
  title: string;
  description: string;
  detail: string;
  requirements: string;
  materials: string;
  price_per_hour: string;
  price_per_dollar: string;
  price_per_toman: string;
  language: string;
  level: string;
  schedule_day: string;
  schedule_start: string;
  schedule_end: string;
  capacity: number;
  active_students: number;
  length: number;
  course_duration: number;
  image: string;
  language_flag: string;
  lessons: Lesson[];
  tutor: Tutor;
}

export interface Enrollment {
  id: number;
  course: Course;
  status: "rejected" | "approved" | "pending_payment";
  payment_amount: string;
  currency: string;
  payment_note: string;
  payment_proof: string;
  submitted_at: string;
  reviewed_at: string;
}

export type EnrollmentsResponse = Enrollment[];