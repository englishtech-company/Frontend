export const PERMISSIONS = {
  users: {
    view: "users.view",
    create: "users.create",
    update: "users.update",
    delete: "users.delete",
  },
  roles: {
    view: "roles.view",
    create: "roles.create",
    update: "roles.update",
    delete: "roles.delete",
  },
  permissions: {
    view: "permissions.view",
  },
  audits: {
    view: "audits.view",
  },
} as const;

export type PermissionName =
  | (typeof PERMISSIONS.users)[keyof typeof PERMISSIONS.users]
  | (typeof PERMISSIONS.roles)[keyof typeof PERMISSIONS.roles]
  | (typeof PERMISSIONS.permissions)[keyof typeof PERMISSIONS.permissions]
  | (typeof PERMISSIONS.audits)[keyof typeof PERMISSIONS.audits];

export function canAccessPath(
  path: string,
  hasPermission: (permission: PermissionName | string) => boolean
): boolean {
  if (path === "/" || path === "") return true;

  if (path === "/users/create") return hasPermission(PERMISSIONS.users.create);
  if (/^\/users\/\d+\/edit$/.test(path)) return hasPermission(PERMISSIONS.users.update);
  if (path.startsWith("/users")) return hasPermission(PERMISSIONS.users.view);

  if (path === "/roles/create") return hasPermission(PERMISSIONS.roles.create);
  if (/^\/roles\/\d+\/edit$/.test(path)) return hasPermission(PERMISSIONS.roles.update);
  if (path.startsWith("/roles")) return hasPermission(PERMISSIONS.roles.view);

  if (path.startsWith("/permissions")) return hasPermission(PERMISSIONS.permissions.view);
  if (path.startsWith("/audits")) return hasPermission(PERMISSIONS.audits.view);

  return true;
}

export function resolveRoutePermission(path: string): PermissionName | null {
  if (path === "/" || path === "") return null;
  if (path === "/users/create") return PERMISSIONS.users.create;
  if (/^\/users\/\d+\/edit$/.test(path)) return PERMISSIONS.users.update;
  if (path.startsWith("/users")) return PERMISSIONS.users.view;
  if (path === "/roles/create") return PERMISSIONS.roles.create;
  if (/^\/roles\/\d+\/edit$/.test(path)) return PERMISSIONS.roles.update;
  if (path.startsWith("/roles")) return PERMISSIONS.roles.view;
  if (path.startsWith("/permissions")) return PERMISSIONS.permissions.view;
  if (path.startsWith("/audits")) return PERMISSIONS.audits.view;
  return null;
}
