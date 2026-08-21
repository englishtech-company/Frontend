import { api } from "./api";
import type { ApiListResponse, ApiItemResponse, GroupClass } from "./types";

export async function listGroupClasses(
  params?: Record<string, unknown>
): Promise<ApiListResponse<"group_classes", GroupClass>["group_classes"]> {
  const result = await api.get<ApiListResponse<"group_classes", GroupClass>>("/group-classes", {
    params,
  });

  return result.data.group_classes;
}

export async function getGroupClass(id: number): Promise<GroupClass> {
  const result = await api.get<ApiItemResponse<"group_class", GroupClass>>(`/group-classes/${id}`);
  return result.data.group_class;
}

export async function createGroupClass(data: Partial<GroupClass>): Promise<GroupClass> {
  const result = await api.post<ApiItemResponse<"group_class", GroupClass>>("/group-classes/create", data);
  return result.data.group_class;
}

export async function updateGroupClass(id: number, data: Partial<GroupClass>): Promise<GroupClass> {
  const result = await api.put<ApiItemResponse<"group_class", GroupClass>>(`/group-classes/${id}`, data);
  return result.data.group_class;
}

export async function deleteGroupClass(id: number): Promise<void> {
  await api.delete(`/group-classes/${id}`);
}
