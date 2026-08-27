import { api } from "@/lib/api";
import {
  appendExact,
  appendLike,
  createListQuery,
} from "@/lib/filters/query";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type {
  ApiItemResponse,
  ApiListResponse,
  Paginated,
  Teacher,
  TeacherStatus,
} from "@/lib/types";

export type ListTeachersParams = {
  page?: number;
  limit?: number;
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
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
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  appendExact(query, "id", params.id);
  appendLike(query, "name", params.name);
  appendLike(query, "email", params.email);
  appendLike(query, "phone", params.phone);
  appendExact(query, "status", params.status);

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
