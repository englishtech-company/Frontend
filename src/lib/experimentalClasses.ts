import { api } from "@/lib/api";
import type { ApiItemResponse, ApiListResponse, ExperimentalClass, Paginated } from "@/lib/types";

const MODULE = "experimental-classes";

type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status_class?: string;
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

export async function listExperimentalClasses(
  params: ListParams = {}
): Promise<Paginated<ExperimentalClass>> {
  const query = new URLSearchParams({
    "pagination[page]": String(params.page ?? 1),
    "pagination[limit]": String(params.limit ?? 20),
  });

  if (params.status_class) {
    query.set("status_class", params.status_class);
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
