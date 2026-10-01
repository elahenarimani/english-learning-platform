export interface Lesson {
  id: number;
  title: string;
  description: string;
  lesson_video: string | null;
  lesson_document: string | null;
}

export interface Tutor {
  id: number;
  user: number;
  profile_picture: string | null;
  languages_spoken: unknown;
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
  image: string | null;
  language_flag: string | null;
  lessons: Lesson[];
  tutor: Tutor;
}

export interface Enrollment {
  id: number;
  course: Course;
  status: "draft" | "pending_payment" | "under_review" | "approved" | "rejected" | "cancelled";
  payment_amount: string | null;
  currency: string;
  payment_note: string;
  payment_proof: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export type EnrollmentsResponse = Enrollment[];
