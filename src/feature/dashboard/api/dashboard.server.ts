import "server-only";

import { backendRequest } from "@/lib/server/backend";
import { requireStudentSession } from "@/lib/server/studentSession";
import type { EnrollmentsResponse } from "../types/enrollment.types";
import type { TutorsResponse } from "../types/tutorstypes";

export async function getEnrollmentsServer(): Promise<EnrollmentsResponse> {
  await requireStudentSession();
  return backendRequest<EnrollmentsResponse>({
    path: "enrollments/my/",
    method: "GET",
  });
}

// This loader serves the student tutors page, not the public tutor directory.
export async function getTutorsServer(): Promise<TutorsResponse> {
  await requireStudentSession();
  return backendRequest<TutorsResponse>({ path: "tutors", method: "GET" });
}
