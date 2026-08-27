import { api } from "@/lib/api";
import {
  appendDateRange,
  appendExact,
  appendLike,
  createListQuery,
} from "@/lib/filters/query";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type { ApiItemResponse, ApiListResponse, Paginated, Student } from "@/lib/types";

export type ListStudentsParams = {
  page?: number;
  limit?: number;
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  teacherName?: string;
  planName?: string;
  startDateFrom?: string;
  startDateTo?: string;
};

export type StudentPayload = {
  name: string;
  email: string;
  cpf?: string | null;
  phone?: string | null;
  address?: string | null;
  birthdate?: string | null;
  status: string;
  start_date?: string | null;
  end_date?: string | null;
  teacher_id?: number | null;
  plan_variant_id?: number | null;
  group_class_ids?: number[];
};

export async function listStudents(
  params: ListStudentsParams = {}
): Promise<Paginated<Student>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  appendExact(query, "id", params.id);
  appendLike(query, "name", params.name);
  appendLike(query, "email", params.email);
  appendLike(query, "phone", params.phone);
  appendExact(query, "status", params.status);
  appendLike(query, "teacher_name", params.teacherName);
  appendLike(query, "plan_name", params.planName);
  appendDateRange(query, "start_date", params.startDateFrom, params.startDateTo);

  const response = await api<ApiListResponse<"students", Student>>(
    `/students?${query.toString()}`
  );
  return response.students;
}

export async function getStudent(id: number): Promise<Student> {
  const response = await api<ApiItemResponse<"student", Student>>(`/students/${id}`);
  return response.student;
}

export async function createStudent(data: StudentPayload): Promise<Student> {
  const response = await api<ApiItemResponse<"student", Student>>("/students/create", {
    method: "POST",
    body: data,
  });
  return response.student;
}

export async function updateStudent(
  id: number,
  data: Partial<StudentPayload>
): Promise<Student> {
  const response = await api<ApiItemResponse<"student", Student>>(`/students/${id}`, {
    method: "PUT",
    body: data,
  });
  return response.student;
}

export async function deleteStudent(id: number): Promise<void> {
  await api(`/students/${id}`, { method: "DELETE" });
}

export async function getStudentOptions(): Promise<Record<string, string>> {
  const response = await api<{ action: string; plucks: Record<string, string> }>("/students/plucks");
  return response.plucks;
}
