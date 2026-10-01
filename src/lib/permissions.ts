import { api } from "@/lib/api";
import { appendLike, createListQuery } from "@/lib/filters/query";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type { ApiListResponse, Paginated, Permission } from "@/lib/types";

type ListParams = {
  page?: number;
  limit?: number;
  name?: string;
};

export async function listPermissions(
  params: ListParams = {}
): Promise<Paginated<Permission>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);
  appendLike(query, "name", params.name);

  const response = await api<ApiListResponse<"permissions", Permission>>(
    `/permissions?${query.toString()}`
  );
  return response.permissions;
}
