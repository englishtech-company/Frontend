import { api } from "@/lib/api";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type {
  ApiItemResponse,
  ApiListResponse,
  Paginated,
  Teacher,
  TeacherStatus,
} from "@/lib/types";

type ListTeachersParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: TeacherStatus;
};

type TeacherPlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    teachers: Record<string, string>;
  };
};

export type TeacherPayload = {
  name: string;
  email: string;
  phone?: string | null;
  status: TeacherStatus;
  notes?: string | null;
};

export async function listTeachers(
  params: ListTeachersParams = {}
): Promise<Paginated<Teacher>> {
  const query = new URLSearchParams({
    "pagination[page]": String(params.page ?? 1),
    "pagination[limit]": String(params.limit ?? DEFAULT_LIST_LIMIT),
  });

  const search = params.search?.trim();

  if (search) {
    query.set("name", `%${search}%`);
  }

  if (params.status) {
    query.set("status", params.status);
  }

  const response = await api<ApiListResponse<"teachers", Teacher>>(
    `/teachers?${query.toString()}`
  );

  return response.teachers;
}

export async function getTeacher(id: number): Promise<Teacher> {
  const response = await api<ApiItemResponse<"teacher", Teacher>>(
    `/teachers/${id}`
  );

  return response.teacher;
}

export async function createTeacher(
  data: TeacherPayload
): Promise<Teacher> {
  const response = await api<ApiItemResponse<"teacher", Teacher>>(
    "/teachers/create",
    {
      method: "POST",
      body: data,
    }
  );

  return response.teacher;
}

export async function updateTeacher(
  id: number,
  data: Partial<TeacherPayload>
): Promise<Teacher> {
  const response = await api<ApiItemResponse<"teacher", Teacher>>(
    `/teachers/${id}`,
    {
      method: "PUT",
      body: data,
    }
  );

  return response.teacher;
}

export async function deleteTeacher(id: number): Promise<void> {
  await api(`/teachers/${id}`, {
    method: "DELETE",
  });
}

export async function getTeacherOptions(): Promise<Record<string, string>> {
  const response = await api<TeacherPlucksResponse>("/teachers/plucks");

  return response.plucks.teachers;
}
