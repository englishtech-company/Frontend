import type { AuthUser } from "@/stores/auth";

export function normalizeAuthUser(user: AuthUser): AuthUser {
  const permissions = (user.permissions ?? [])
    .map((item) =>
      typeof item === "string" ? item : String((item as { name?: string }).name ?? "")
    )
    .filter(Boolean);

  const roles = (user.roles ?? [])
    .map((item) =>
      typeof item === "string" ? item : String((item as { name?: string }).name ?? "")
    )
    .filter(Boolean);

  return {
    ...user,
    roles,
    permissions,
    is_superadmin: Boolean(user.is_superadmin),
  };
}
