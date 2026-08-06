import { api } from "@/lib/api";
import type { ApiItemResponse, ApiListResponse, Paginated, Student } from "@/lib/types";

type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type StudentPayload = {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  birthdate?: string | null;
  status: string;
  start_date?: string | null;
  end_date?: string | null;
  teacher_id?: number | null;
  plan_variant_id?: number | null;
};

export async function listStudents(params: ListParams = {}): Promise<Paginated<Student>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  let url = `/students?pagination[page]=${page}&pagination[limit]=${limit}`;
  
  if (params.search) {
    url += `&filter[name]=${encodeURIComponent(params.search)}`;
  }
  if (params.status) {
    url += `&filter[status]=${encodeURIComponent(params.status)}`;
  }

  const response = await api<ApiListResponse<"students", Student>>(url);
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
