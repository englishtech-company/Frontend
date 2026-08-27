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
  GroupClass,
  GroupClassStatus,
} from "@/lib/types";

export type ListGroupClassesParams = {
  page?: number;
  limit?: number;
  id?: number;
  name?: string;
  teacherName?: string;
  planName?: string;
  schedule?: string;
  level?: string;
  status?: GroupClassStatus;
};

type GroupClassPlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    group_classes: Record<string, string>;
  };
};

export type GroupClassPayload = {
  name: string;
  description?: string | null;
  teacher_id?: number | null;
  plan_id?: number | null;
  schedule?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  max_students?: number | null;
  status: GroupClassStatus;
  level?: string | null;
  student_ids?: number[];
};

export async function listGroupClasses(
  params: ListGroupClassesParams = {}
): Promise<Paginated<GroupClass>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  appendExact(query, "id", params.id);
  appendLike(query, "name", params.name);
  appendLike(query, "teacher_name", params.teacherName);
  appendLike(query, "plan_name", params.planName);
  appendLike(query, "schedule", params.schedule);
  appendLike(query, "level", params.level);
  appendExact(query, "status", params.status);

  const response = await api<ApiListResponse<"groupClasses", GroupClass>>(
    `/group-classes?${query.toString()}`
  );

  return response.groupClasses;
}

export async function getGroupClass(id: number): Promise<GroupClass> {
  const response = await api<ApiItemResponse<"groupClass", GroupClass>>(
    `/group-classes/${id}`
  );

  return response.groupClass;
}

export async function createGroupClass(
  data: GroupClassPayload
): Promise<GroupClass> {
  const response = await api<ApiItemResponse<"groupClass", GroupClass>>(
    "/group-classes/create",
    {
      method: "POST",
      body: data,
    }
  );

  return response.groupClass;
}

export async function updateGroupClass(
  id: number,
  data: Partial<GroupClassPayload>
): Promise<GroupClass> {
  const response = await api<ApiItemResponse<"groupClass", GroupClass>>(
    `/group-classes/${id}`,
    {
      method: "PUT",
      body: data,
    }
  );

  return response.groupClass;
}

export async function deleteGroupClass(id: number): Promise<void> {
  await api(`/group-classes/${id}`, {
    method: "DELETE",
  });
}

export async function getGroupClassOptions(): Promise<Record<string, string>> {
  const response = await api<GroupClassPlucksResponse>("/group-classes/plucks");

  return response.plucks.group_classes ?? {};
}

export async function enrollStudentInGroupClass(
  groupClassId: number,
  studentId: number
): Promise<GroupClass> {
  const groupClass = await getGroupClass(groupClassId);
  const enrolledIds = (
    groupClass.relationships?.students ??
    groupClass.students ??
    []
  ).map((student) => student.id);

  if (enrolledIds.includes(studentId)) {
    return groupClass;
  }

  return updateGroupClass(groupClassId, {
    student_ids: [...enrolledIds, studentId],
    max_students: groupClass.max_students ?? undefined,
  });
}
