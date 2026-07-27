import { api } from "@/lib/api";
import type { ApiListResponse, Paginated, Permission } from "@/lib/types";

type ListParams = {
  page?: number;
  limit?: number;
};

export async function listPermissions(
  params: ListParams = {}
): Promise<Paginated<Permission>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;
  const response = await api<ApiListResponse<"permissions", Permission>>(
    `/permissions?pagination[page]=${page}&pagination[limit]=${limit}`
  );
  return response.permissions;
}
