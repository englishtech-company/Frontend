import { api } from "@/lib/api";
import type { Lesson, MakeupClass, Enrollment } from "@/lib/types";
import type { StudentMakeupSummary } from "@/lib/makeupClasses";

export interface RegisterStudentClassPayload {
  enrollment_id: number;
  class_type: "regular" | "makeup" | "extra";
  teacher_id: number;
  scheduled_at: string; // ISO datetime string or YYYY-MM-DDTHH:mm
  duration_minutes: number;
  makeup_class_id?: number | null;
  consume_new_credit?: boolean;
  topic?: string;
  notes?: string | null;
}

export interface RegisterStudentClassResponse {
  action: string;
  status: number;
  msg: string;
  lesson: Lesson;
  makeup_class?: MakeupClass | null;
  enrollment: Enrollment;
  makeup_summary: StudentMakeupSummary;
}

export async function registerStudentClass(
  studentId: number,
  payload: RegisterStudentClassPayload
): Promise<RegisterStudentClassResponse> {
  return await api<RegisterStudentClassResponse>(
    `/students/${studentId}/classes`,
    {
      method: "POST",
      body: payload,
    }
  );
}
