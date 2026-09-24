import { api } from "@/lib/api";
import { appendLike, createListQuery } from "@/lib/filters/query";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type { ApiItemResponse, ApiListResponse, Paginated, User } from "@/lib/types";

type ListParams = {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
};

export async function listUsers(params: ListParams = {}): Promise<Paginated<User>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);
  appendLike(query, "name", params.name);
  appendLike(query, "email", params.email);

  const response = await api<ApiListResponse<"users", User>>(`/users?${query.toString()}`);
  return response.users;
}

export async function getUser(id: number): Promise<User> {
  const response = await api<ApiItemResponse<"user", User>>(`/users/${id}`);
  return response.user;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  roles: string[];
}): Promise<User> {
  const response = await api<ApiItemResponse<"user", User>>("/users/create", {
    method: "POST",
    body: data,
  });
  return response.user;
}

export async function updateUser(
  id: number,
  data: Partial<{ name: string; email: string; password: string; roles: string[] }>
): Promise<User> {
  const response = await api<ApiItemResponse<"user", User>>(`/users/${id}`, {
    method: "PUT",
    body: data,
  });
  return response.user;
}

export async function deleteUser(id: number): Promise<void> {
  await api(`/users/${id}`, { method: "DELETE" });
}
