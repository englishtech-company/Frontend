import { api } from "@/lib/api";
import {
  appendDateRange,
  appendExact,
  appendLike,
  createListQuery,
} from "@/lib/filters/query";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type { ApiItemResponse, ApiListResponse, ExperimentalClass, Paginated } from "@/lib/types";

const MODULE = "experimental-classes";

export type ListExperimentalClassesParams = {
  page?: number;
  limit?: number;
  id?: number;
  interestedName?: string;
  teacherName?: string;
  dateClassFrom?: string;
  dateClassTo?: string;
  status_class?: string;
  conversion?: boolean;
};

type ExperimentalClassPlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    interested: Record<string, string>;
    teachers: Record<string, string>;
  };
};

export type ExperimentalClassPayload = {
  interested_id: number;
  teacher_id?: number | null;
  date_class: string;
  status_class: string;
  conversao?: boolean;
  self_declared_level?: string | null;
  evaluation_listening?: string | null;
  evaluation_speaking?: string | null;
  evaluation_vocabulary?: string | null;
  evaluation_grammar?: string | null;
  observations_feedback?: string | null;
};

export async function getExperimentalClassPlucks(): Promise<{
  interested: Record<string, string>;
  teachers: Record<string, string>;
}> {
  const response = await api<ExperimentalClassPlucksResponse>(`/${MODULE}/plucks`);

  return response.plucks;
}

export async function listExperimentalClasses(
  params: ListExperimentalClassesParams = {}
): Promise<Paginated<ExperimentalClass>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  appendExact(query, "id", params.id);
  appendLike(query, "interested_name", params.interestedName);
  appendLike(query, "teacher_name", params.teacherName);
  appendDateRange(query, "date_class", params.dateClassFrom, params.dateClassTo);
  appendExact(query, "status_class", params.status_class);

  if (params.conversion !== undefined) {
    query.set("conversion", params.conversion ? "1" : "0");
  }

  const response = await api<ApiListResponse<"experimental-classes", ExperimentalClass>>(
    `/${MODULE}?${query.toString()}`
  );

  return response["experimental-classes"];
}

export async function getExperimentalClass(id: number): Promise<ExperimentalClass> {
  const response = await api<ApiItemResponse<"experimental-class", ExperimentalClass>>(
    `/${MODULE}/${id}`
  );

  return response["experimental-class"];
}

export async function createExperimentalClass(
  data: ExperimentalClassPayload
): Promise<ExperimentalClass> {
  const response = await api<ApiItemResponse<"experimental-class", ExperimentalClass>>(
    `/${MODULE}/create`,
    { method: "POST", body: data }
  );

  return response["experimental-class"];
}

export async function updateExperimentalClass(
  id: number,
  data: Partial<ExperimentalClassPayload>
): Promise<ExperimentalClass> {
  const response = await api<ApiItemResponse<"experimental-class", ExperimentalClass>>(
    `/${MODULE}/${id}`,
    { method: "PUT", body: data }
  );

  return response["experimental-class"];
}

export async function deleteExperimentalClass(id: number): Promise<void> {
  await api(`/${MODULE}/${id}`, { method: "DELETE" });
}
