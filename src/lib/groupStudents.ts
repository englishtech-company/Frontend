import { api } from "./api";
import type { ApiListResponse, ApiItemResponse, GroupStudent } from "./types";

export async function listGroupStudents(
  params?: Record<string, unknown>
): Promise<ApiListResponse<"group_students", GroupStudent>["group_students"]> {
  const result = await api.get<ApiListResponse<"group_students", GroupStudent>>("/group-students", {
    params,
  });

  return result.data.group_students;
}

export async function getGroupStudent(id: number): Promise<GroupStudent> {
  const result = await api.get<ApiItemResponse<"group_student", GroupStudent>>(`/group-students/${id}`);
  return result.data.group_student;
}

export async function createGroupStudent(data: Partial<GroupStudent>): Promise<GroupStudent> {
  const result = await api.post<ApiItemResponse<"group_student", GroupStudent>>("/group-students/create", data);
  return result.data.group_student;
}

export async function updateGroupStudent(id: number, data: Partial<GroupStudent>): Promise<GroupStudent> {
  const result = await api.put<ApiItemResponse<"group_student", GroupStudent>>(`/group-students/${id}`, data);
  return result.data.group_student;
}

export async function deleteGroupStudent(id: number): Promise<void> {
  await api.delete(`/group-students/${id}`);
}
