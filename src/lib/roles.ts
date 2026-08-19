import { api } from "@/lib/api";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type { ApiItemResponse, ApiListResponse, Paginated, Role, User } from "@/lib/types";

type ListParams = {
  page?: number;
  limit?: number;
};

type RoleOption = {
  id: number;
  name: string;
};

type RolePlucksResponse = {
  plucks: {
    roles: Record<string, string>;
  };
};

export const SUPERADMIN_ROLE = "superadmin";

export function isProtectedRole(name: string): boolean {
  return name === SUPERADMIN_ROLE;
}

export function getUserRoles(user: {
  roles?: Role[];
  relationships?: { roles?: Role[] };
}): Role[] {
  return user.relationships?.roles ?? user.roles ?? [];
}

export function formatUserRoleLabel(user: {
  roles?: Role[];
  relationships?: { roles?: Role[] };
}): string {
  const roles = getUserRoles(user);
  return roles.length ? roles.map((role) => role.name).join(", ") : "—";
}

export async function getRoleOptions(): Promise<RoleOption[]> {
  const response = await api<RolePlucksResponse>("/roles/plucks");
  return Object.entries(response.plucks.roles).map(([id, name]) => ({
    id: Number(id),
    name,
  }));
}

export async function listRoles(params: ListParams = {}): Promise<Paginated<Role>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_LIST_LIMIT;
  const response = await api<ApiListResponse<"roles", Role>>(
    `/roles?pagination[page]=${page}&pagination[limit]=${limit}`
  );
  return response.roles;
}

export async function getRole(id: number): Promise<Role> {
  const response = await api<ApiItemResponse<"role", Role>>(`/roles/${id}`);
  return response.role;
}

export async function createRole(data: {
  name: string;
  guard_name?: string;
  permissions?: string[];
}): Promise<Role> {
  const response = await api<ApiItemResponse<"role", Role>>("/roles/create", {
    method: "POST",
    body: data,
  });
  return response.role;
}

export async function updateRole(
  id: number,
  data: Partial<{ name: string; guard_name: string; permissions: string[] }>
): Promise<Role> {
  const response = await api<ApiItemResponse<"role", Role>>(`/roles/${id}`, {
    method: "PUT",
    body: data,
  });
  return response.role;
}

export async function deleteRole(id: number): Promise<void> {
  await api(`/roles/${id}`, { method: "DELETE" });
}
