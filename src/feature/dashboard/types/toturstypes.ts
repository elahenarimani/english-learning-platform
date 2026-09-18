export interface TutorUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LanguageSpoken {
  language: string;
  level: string;
}

export type LanguagesSpoken =
  | Record<string, string>
  | string[]
  | LanguageSpoken[];

export interface Certificate {
  id: number;
  title: string;
  issued_by: string;
  issue_date: string;
  certificate_image: string | null;
  tutor: number;
}

export interface Education {
  id: number;
  degree: string;
  institution_name: string;
  country: string;
  city: string;
  field: string;
  start_date: string;
  end_date: string;
  tutor: number;
}

export interface Experience {
  id: number;
  title: string;
  organization: string;
  country: string;
  city: string;
  start_date: string;
  end_date: string;
  description: string;
  tutor: number;
}

export interface TutorCourse {
  id: number;
  course_title: string;
  duration_minutes: number;
  course_type: string;
  price_per_hour: string;
  lesson_package: string;
  language: string;
  days_available: string | string[];
  time_slots: string | string[];
  start_date: string;
  description: string;
  tutor: number;
}

export interface Tutor {
  id: number;
  user: TutorUser;
  profile_picture: string | null;
  languages_spoken: LanguageSpoken[] | string[];
  country: string;
  subjects: string[];
  phone_number: string;
  bio: string;
  teaching_style: string;
  expectation: string;
  description: string;
  intro_video_url: string;
  intro_video_file: string | null;
  certificates: Certificate[];
  educations: Education[];
  experiences: Experience[];
  courses: TutorCourse[];
  is_approved: boolean;
}

export type TutorsResponse = Tutor[];
