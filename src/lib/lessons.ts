import { api } from "@/lib/api";
import { createListQuery } from "@/lib/filters/query";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type {
  Lesson,
  ApiListResponse,
  ApiItemResponse,
  Paginated,
} from "@/lib/types";

export interface ListLessonsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  teacher_id?: string | number;
  group_class_id?: string | number;
  student_id?: string | number;
  class_datetime_from?: string;
  class_datetime_to?: string;
}

export type LessonPayload = {
  group_class_id?: number | null;
  student_id?: number | null;
  teacher_id: number;
  class_datetime: string;
  topic: string;
  status: string;
  observation?: string | null;
};

// ─── Flat list ────────────────────────────────────────────────────────────────

export async function listLessons(
  params: ListLessonsParams = {}
): Promise<Paginated<Lesson>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  const search = params.search?.trim();
  if (search) query.set("topic", `%${search}%`);
  if (params.status) query.set("status", String(params.status));
  if (params.teacher_id) query.set("teacher_id", String(params.teacher_id));
  if (params.group_class_id) query.set("group_class_id", String(params.group_class_id));
  if (params.student_id) query.set("student_id", String(params.student_id));
  if (params.class_datetime_from) query.set("class_datetime_from", String(params.class_datetime_from));
  if (params.class_datetime_to) query.set("class_datetime_to", String(params.class_datetime_to));

  const response = await api<ApiListResponse<"lessons", Lesson>>(
    `/lessons?${query.toString()}`
  );
  return response.lessons;
}

// ─── Nested under GroupClass ──────────────────────────────────────────────────

export async function listLessonsForGroupClass(
  groupClassId: number,
  params: ListLessonsParams = {}
): Promise<Paginated<Lesson>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  const search = params.search?.trim();
  if (search) query.set("topic", `%${search}%`);
  if (params.status) query.set("status", String(params.status));

  const response = await api<ApiListResponse<"lessons", Lesson>>(
    `/group-classes/${groupClassId}/lessons?${query.toString()}`
  );
  return response.lessons;
}

export async function createLessonForGroupClass(
  groupClassId: number,
  data: LessonPayload
): Promise<Lesson> {
  const response = await api<ApiItemResponse<"lesson", Lesson>>(
    `/group-classes/${groupClassId}/lessons/create`,
    { method: "POST", body: data }
  );
  return response.lesson;
}

export async function updateLessonForGroupClass(
  groupClassId: number,
  lessonId: number,
  data: Partial<LessonPayload>
): Promise<Lesson> {
  const response = await api<ApiItemResponse<"lesson", Lesson>>(
    `/group-classes/${groupClassId}/lessons/${lessonId}`,
    { method: "PUT", body: data }
  );
  return response.lesson;
}

// ─── Nested under Student ─────────────────────────────────────────────────────

export async function listLessonsForStudent(
  studentId: number,
  params: ListLessonsParams = {}
): Promise<Paginated<Lesson>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  const search = params.search?.trim();
  if (search) query.set("topic", `%${search}%`);
  if (params.status) query.set("status", String(params.status));

  const response = await api<ApiListResponse<"lessons", Lesson>>(
    `/students/${studentId}/lessons?${query.toString()}`
  );
  return response.lessons;
}

export async function createLessonForStudent(
  studentId: number,
  data: LessonPayload
): Promise<Lesson> {
  const response = await api<ApiItemResponse<"lesson", Lesson>>(
    `/students/${studentId}/lessons/create`,
    { method: "POST", body: data }
  );
  return response.lesson;
}

export async function updateLessonForStudent(
  studentId: number,
  lessonId: number,
  data: Partial<LessonPayload>
): Promise<Lesson> {
  const response = await api<ApiItemResponse<"lesson", Lesson>>(
    `/students/${studentId}/lessons/${lessonId}`,
    { method: "PUT", body: data }
  );
  return response.lesson;
}

// ─── Flat CRUD (read/delete always flat) ─────────────────────────────────────

export async function getLesson(id: number | string): Promise<Lesson> {
  const response = await api<ApiItemResponse<"lesson", Lesson>>(`/lessons/${id}`);
  return response.lesson;
}

export async function createLesson(data: LessonPayload): Promise<Lesson> {
  const response = await api<ApiItemResponse<"lesson", Lesson>>("/lessons/create", {
    method: "POST",
    body: data,
  });
  return response.lesson;
}

export async function updateLesson(
  id: number | string,
  data: Partial<LessonPayload>
): Promise<Lesson> {
  const response = await api<ApiItemResponse<"lesson", Lesson>>(
    `/lessons/${id}`,
    { method: "PUT", body: data }
  );
  return response.lesson;
}

export async function deleteLesson(id: number | string): Promise<void> {
  await api(`/lessons/${id}`, { method: "DELETE" });
}
