import { api } from "@/lib/api";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type {
  ApiItemResponse,
  ApiListResponse,
  Paginated,
  GroupClass,
  GroupClassStatus,
} from "@/lib/types";

type ListGroupClassesParams = {
  page?: number;
  limit?: number;
  search?: string;
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
};

export async function listGroupClasses(
  params: ListGroupClassesParams = {}
): Promise<Paginated<GroupClass>> {
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

  return response.plucks.group_classes;
}
