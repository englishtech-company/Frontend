import { api } from "@/lib/api";
import {
  appendExact,
  createListQuery,
} from "@/lib/filters/query";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type {
  ApiItemResponse,
  ApiListResponse,
  MakeupClass,
  MakeupClassStatus,
  Paginated,
} from "@/lib/types";

export type ListMakeupClassesParams = {
  page?: number;
  limit?: number;
  id?: number;
  status?: MakeupClassStatus | "pending";
  enrollment_id?: number;
  student_id?: number;
  group_class_id?: number;
  teacher_id?: number;
  original_date_from?: string;
  original_date_to?: string;
  sort_by_urgency?: boolean;
  expiring_soon?: boolean;
};

/** Raw summary returned by GET /makeup-classes/student-summary/{id} */
export type MakeupClassSummary = {
  limit: number;
  used: number;
  remaining: number;
  available: number;
  scheduled: number;
  concluded: number;
  expired: number;
  expiring_soon: number;
};

/** Friendly summary returned by GET /students/{id}/makeup-summary */
export type StudentMakeupSummary = {
  limit: number;
  used: number;
  remaining: number;
  available_credits: number;
  scheduled_classes: number;
  expiring_soon_count: number;
  concluded: number;
  expired: number;
};

export type MakeupClassPayload = {
  enrollment_id?: number | null;
  group_class_id?: number | null;
  teacher_id?: number | null;
  original_date: string;
  expired_date: string;
  new_date?: string | null;
  status?: MakeupClassStatus;
};

type MakeupClassPlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    statuses: Array<{ id: string; name: string }>;
    status_options: Record<string, string>;
    makeup_classes: Record<string, string>;
  };
};

export async function listMakeupClasses(
  params: ListMakeupClassesParams = {}
): Promise<Paginated<MakeupClass>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  appendExact(query, "id", params.id);
  appendExact(query, "status", params.status);
  appendExact(query, "enrollment_id", params.enrollment_id);
  appendExact(query, "student_id", params.student_id);
  appendExact(query, "group_class_id", params.group_class_id);
  appendExact(query, "teacher_id", params.teacher_id);
  appendExact(query, "original_date_from", params.original_date_from);
  appendExact(query, "original_date_to", params.original_date_to);
  if (params.sort_by_urgency) query.set("sort_by_urgency", "1");
  if (params.expiring_soon)   query.set("expiring_soon", "1");

  const response = await api<ApiListResponse<"makeupClasses", MakeupClass>>(
    `/makeup-classes?${query.toString()}`
  );
  return response.makeupClasses;
}

export async function getMakeupClassPlucks(): Promise<MakeupClassPlucksResponse["plucks"]> {
  const response = await api<MakeupClassPlucksResponse>("/makeup-classes/plucks");
  return response.plucks;
}

export async function getStudentMakeupSummary(
  studentId: number
): Promise<MakeupClassSummary> {
  const response = await api<{ summary: MakeupClassSummary }>(
    `/makeup-classes/student-summary/${studentId}`
  );
  return response.summary;
}

export async function getMakeupClass(id: number | string): Promise<MakeupClass> {
  const response = await api<ApiItemResponse<"makeupClass", MakeupClass>>(
    `/makeup-classes/${id}`
  );
  return response.makeupClass;
}

export async function createMakeupClass(
  data: MakeupClassPayload
): Promise<MakeupClass> {
  const response = await api<ApiItemResponse<"makeupClass", MakeupClass>>(
    "/makeup-classes/create",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  return response.makeupClass;
}

export async function updateMakeupClass(
  id: number | string,
  data: Partial<MakeupClassPayload>
): Promise<MakeupClass> {
  const response = await api<ApiItemResponse<"makeupClass", MakeupClass>>(
    `/makeup-classes/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
  return response.makeupClass;
}

export async function deleteMakeupClass(
  id: number | string
): Promise<MakeupClass> {
  const response = await api<ApiItemResponse<"makeupClass", MakeupClass>>(
    `/makeup-classes/${id}`,
    {
      method: "DELETE",
    }
  );
  return response.makeupClass;
}
