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
  students: {
    view: "students.view",
    create: "students.create",
    update: "students.update",
    delete: "students.delete",
  },
  teachers: {
    view: "teachers.view",
    create: "teachers.create",
    update: "teachers.update",
    delete: "teachers.delete",
  },
  plans: {
    view: "plans.view",
    create: "plans.create",
    update: "plans.update",
    delete: "plans.delete",
  },
  leads: {
    view: "leads.view",
    create: "leads.create",
    update: "leads.update",
    delete: "leads.delete",
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
  | (typeof PERMISSIONS.students)[keyof typeof PERMISSIONS.students]
  | (typeof PERMISSIONS.teachers)[keyof typeof PERMISSIONS.teachers]
  | (typeof PERMISSIONS.plans)[keyof typeof PERMISSIONS.plans]
  | (typeof PERMISSIONS.leads)[keyof typeof PERMISSIONS.leads]
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

  if (path === "/students/create") return hasPermission(PERMISSIONS.students.create);
  if (/^\/students\/\d+\/edit$/.test(path)) return hasPermission(PERMISSIONS.students.update);
  if (path.startsWith("/students")) return hasPermission(PERMISSIONS.students.view);

  if (path === "/teachers/create") return hasPermission(PERMISSIONS.teachers.create);
  if (/^\/teachers\/\d+\/edit$/.test(path)) return hasPermission(PERMISSIONS.teachers.update);
  if (path.startsWith("/teachers")) return hasPermission(PERMISSIONS.teachers.view);

  if (path === "/plans/create") return hasPermission(PERMISSIONS.plans.create);
  if (/^\/plans\/\d+\/edit$/.test(path)) return hasPermission(PERMISSIONS.plans.update);
  if (path.startsWith("/plans")) return hasPermission(PERMISSIONS.plans.view);

  if (path === "/leads/create") return hasPermission(PERMISSIONS.leads.create);
  if (/^\/leads\/\d+\/edit$/.test(path)) return hasPermission(PERMISSIONS.leads.update);
  if (path.startsWith("/leads")) return hasPermission(PERMISSIONS.leads.view);

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

  if (path === "/students/create") return PERMISSIONS.students.create;
  if (/^\/students\/\d+\/edit$/.test(path)) return PERMISSIONS.students.update;
  if (path.startsWith("/students")) return PERMISSIONS.students.view;

  if (path === "/teachers/create") return PERMISSIONS.teachers.create;
  if (/^\/teachers\/\d+\/edit$/.test(path)) return PERMISSIONS.teachers.update;
  if (path.startsWith("/teachers")) return PERMISSIONS.teachers.view;

  if (path === "/plans/create") return PERMISSIONS.plans.create;
  if (/^\/plans\/\d+\/edit$/.test(path)) return PERMISSIONS.plans.update;
  if (path.startsWith("/plans")) return PERMISSIONS.plans.view;

  if (path === "/leads/create") return PERMISSIONS.leads.create;
  if (/^\/leads\/\d+\/edit$/.test(path)) return PERMISSIONS.leads.update;
  if (path.startsWith("/leads")) return PERMISSIONS.leads.view;

  if (path.startsWith("/permissions")) return PERMISSIONS.permissions.view;
  if (path.startsWith("/audits")) return PERMISSIONS.audits.view;

  return null;
}
