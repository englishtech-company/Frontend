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
  enrollments: {
    view: "enrollments.view",
    create: "enrollments.create",
    update: "enrollments.update",
    delete: "enrollments.delete",
  },
  enrollmentQuestions: {
    view: "enrollment-questions.view",
    create: "enrollment-questions.create",
    update: "enrollment-questions.update",
    delete: "enrollment-questions.delete",
  },
  charges: {
    view: "charges.view",
    create: "charges.create",
    update: "charges.update",
    delete: "charges.delete",
  },
  payments: {
    view: "payments.view",
    create: "payments.create",
    update: "payments.update",
    delete: "payments.delete",
  },
  permissions: {
    view: "permissions.view",
  },
  audits: {
    view: "audits.view",
  },
  experimentalClasses: {
    view: "experimental-classes.view",
    create: "experimental-classes.create",
    update: "experimental-classes.update",
    delete: "experimental-classes.delete",
  },
  groupClasses: {
    view: "group_classes.view",
    create: "group_classes.create",
    update: "group_classes.update",
    delete: "group_classes.delete",
  },
  groupStudents: {
    view: "group_students.view",
    create: "group_students.create",
    update: "group_students.update",
    delete: "group_students.delete",
  },
} as const;

export type PermissionName =
  | (typeof PERMISSIONS.users)[keyof typeof PERMISSIONS.users]
  | (typeof PERMISSIONS.roles)[keyof typeof PERMISSIONS.roles]
  | (typeof PERMISSIONS.students)[keyof typeof PERMISSIONS.students]
  | (typeof PERMISSIONS.teachers)[keyof typeof PERMISSIONS.teachers]
  | (typeof PERMISSIONS.plans)[keyof typeof PERMISSIONS.plans]
  | (typeof PERMISSIONS.leads)[keyof typeof PERMISSIONS.leads]
  | (typeof PERMISSIONS.enrollments)[keyof typeof PERMISSIONS.enrollments]
  | (typeof PERMISSIONS.enrollmentQuestions)[keyof typeof PERMISSIONS.enrollmentQuestions]
  | (typeof PERMISSIONS.charges)[keyof typeof PERMISSIONS.charges]
  | (typeof PERMISSIONS.payments)[keyof typeof PERMISSIONS.payments]
  | (typeof PERMISSIONS.permissions)[keyof typeof PERMISSIONS.permissions]
  | (typeof PERMISSIONS.audits)[keyof typeof PERMISSIONS.audits]
  | (typeof PERMISSIONS.experimentalClasses)[keyof typeof PERMISSIONS.experimentalClasses]
  | (typeof PERMISSIONS.groupClasses)[keyof typeof PERMISSIONS.groupClasses]
  | (typeof PERMISSIONS.groupStudents)[keyof typeof PERMISSIONS.groupStudents];

export function canAccessPath(
  path: string,
  hasPermission: (
    permission: PermissionName | string
  ) => boolean
): boolean {
  if (path === "/" || path === "") {
    return true;
  }

  if (path === "/users/create") {
    return hasPermission(
      PERMISSIONS.users.create
    );
  }

  if (/^\/users\/\d+\/edit$/.test(path)) {
    return hasPermission(
      PERMISSIONS.users.update
    );
  }

  if (path.startsWith("/users")) {
    return hasPermission(
      PERMISSIONS.users.view
    );
  }

  if (path === "/roles/create") {
    return hasPermission(
      PERMISSIONS.roles.create
    );
  }

  if (/^\/roles\/\d+\/edit$/.test(path)) {
    return hasPermission(
      PERMISSIONS.roles.update
    );
  }

  if (path.startsWith("/roles")) {
    return hasPermission(
      PERMISSIONS.roles.view
    );
  }

  if (path === "/students/create") {
    return hasPermission(
      PERMISSIONS.students.create
    );
  }

  if (/^\/students\/\d+\/edit$/.test(path)) {
    return hasPermission(
      PERMISSIONS.students.update
    );
  }

  if (path.startsWith("/students")) {
    return hasPermission(
      PERMISSIONS.students.view
    );
  }

  if (path === "/teachers/create") {
    return hasPermission(
      PERMISSIONS.teachers.create
    );
  }

  if (/^\/teachers\/\d+\/edit$/.test(path)) {
    return hasPermission(
      PERMISSIONS.teachers.update
    );
  }

  if (path.startsWith("/teachers")) {
    return hasPermission(
      PERMISSIONS.teachers.view
    );
  }

  if (path === "/plans/create") {
    return hasPermission(
      PERMISSIONS.plans.create
    );
  }

  if (/^\/plans\/\d+\/edit$/.test(path)) {
    return hasPermission(
      PERMISSIONS.plans.update
    );
  }

  if (path.startsWith("/plans")) {
    return hasPermission(
      PERMISSIONS.plans.view
    );
  }

  if (path === "/leads/create") {
    return hasPermission(
      PERMISSIONS.leads.create
    );
  }

  if (/^\/leads\/\d+\/edit$/.test(path)) {
    return hasPermission(
      PERMISSIONS.leads.update
    );
  }

  if (path.startsWith("/leads")) {
    return hasPermission(
      PERMISSIONS.leads.view
    );
  }

  if (path === "/enrollments/create") {
    return hasPermission(
      PERMISSIONS.enrollments.create
    );
  }

  if (
    /^\/enrollments\/\d+\/edit$/.test(path)
  ) {
    return hasPermission(
      PERMISSIONS.enrollments.update
    );
  }

  if (path.startsWith("/enrollments")) {
    return hasPermission(
      PERMISSIONS.enrollments.view
    );
  }

  if (
    path === "/enrollment-questions/create"
  ) {
    return hasPermission(
      PERMISSIONS.enrollmentQuestions.create
    );
  }

  if (
    /^\/enrollment-questions\/\d+\/edit$/.test(
      path
    )
  ) {
    return hasPermission(
      PERMISSIONS.enrollmentQuestions.update
    );
  }

  if (
    path.startsWith("/enrollment-questions")
  ) {
    return hasPermission(
      PERMISSIONS.enrollmentQuestions.view
    );
  }

  if (path === "/charges/create") {
    return hasPermission(
      PERMISSIONS.charges.create
    );
  }

  if (/^\/charges\/\d+\/edit$/.test(path)) {
    return hasPermission(
      PERMISSIONS.charges.update
    );
  }

  if (path.startsWith("/charges")) {
    return hasPermission(
      PERMISSIONS.charges.view
    );
  }

  if (path === "/payments/create") {
    return hasPermission(
      PERMISSIONS.payments.create
    );
  }

  if (/^\/payments\/\d+\/edit$/.test(path)) {
    return hasPermission(
      PERMISSIONS.payments.update
    );
  }

  if (path.startsWith("/payments")) {
    return hasPermission(
      PERMISSIONS.payments.view
    );
  }

  if (path.startsWith("/permissions")) {
    return hasPermission(
      PERMISSIONS.permissions.view
    );
  }

  if (path.startsWith("/audits")) {
    return hasPermission(
      PERMISSIONS.audits.view
    );
  }

  if (path === "/experimental-classes/create") return hasPermission(PERMISSIONS.experimentalClasses.create);
  if (/^\/experimental-classes\/\d+\/edit$/.test(path)) return hasPermission(PERMISSIONS.experimentalClasses.update);
  if (path.startsWith("/experimental-classes")) return hasPermission(PERMISSIONS.experimentalClasses.view);

  if (path === "/group-classes/create") return hasPermission(PERMISSIONS.groupClasses.create);
  if (/^\/group-classes\/\d+\/edit$/.test(path)) return hasPermission(PERMISSIONS.groupClasses.update);
  if (path.startsWith("/group-classes")) return hasPermission(PERMISSIONS.groupClasses.view);

  if (path === "/group-students/create") return hasPermission(PERMISSIONS.groupStudents.create);
  if (/^\/group-students\/\d+\/edit$/.test(path)) return hasPermission(PERMISSIONS.groupStudents.update);
  if (path.startsWith("/group-students")) return hasPermission(PERMISSIONS.groupStudents.view);

  return true;
}

export function resolveRoutePermission(
  path: string
): PermissionName | null {
  if (path === "/" || path === "") {
    return null;
  }

  if (path === "/users/create") {
    return PERMISSIONS.users.create;
  }

  if (/^\/users\/\d+\/edit$/.test(path)) {
    return PERMISSIONS.users.update;
  }

  if (path.startsWith("/users")) {
    return PERMISSIONS.users.view;
  }

  if (path === "/roles/create") {
    return PERMISSIONS.roles.create;
  }

  if (/^\/roles\/\d+\/edit$/.test(path)) {
    return PERMISSIONS.roles.update;
  }

  if (path.startsWith("/roles")) {
    return PERMISSIONS.roles.view;
  }

  if (path === "/students/create") {
    return PERMISSIONS.students.create;
  }

  if (
    /^\/students\/\d+\/edit$/.test(path)
  ) {
    return PERMISSIONS.students.update;
  }

  if (path.startsWith("/students")) {
    return PERMISSIONS.students.view;
  }

  if (path === "/teachers/create") {
    return PERMISSIONS.teachers.create;
  }

  if (
    /^\/teachers\/\d+\/edit$/.test(path)
  ) {
    return PERMISSIONS.teachers.update;
  }

  if (path.startsWith("/teachers")) {
    return PERMISSIONS.teachers.view;
  }

  if (path === "/plans/create") {
    return PERMISSIONS.plans.create;
  }

  if (/^\/plans\/\d+\/edit$/.test(path)) {
    return PERMISSIONS.plans.update;
  }

  if (path.startsWith("/plans")) {
    return PERMISSIONS.plans.view;
  }

  if (path === "/leads/create") {
    return PERMISSIONS.leads.create;
  }

  if (/^\/leads\/\d+\/edit$/.test(path)) {
    return PERMISSIONS.leads.update;
  }

  if (path.startsWith("/leads")) {
    return PERMISSIONS.leads.view;
  }

  if (path === "/enrollments/create") {
    return PERMISSIONS.enrollments.create;
  }

  if (
    /^\/enrollments\/\d+\/edit$/.test(path)
  ) {
    return PERMISSIONS.enrollments.update;
  }

  if (path.startsWith("/enrollments")) {
    return PERMISSIONS.enrollments.view;
  }

  if (
    path === "/enrollment-questions/create"
  ) {
    return PERMISSIONS.enrollmentQuestions.create;
  }

  if (
    /^\/enrollment-questions\/\d+\/edit$/.test(
      path
    )
  ) {
    return PERMISSIONS.enrollmentQuestions.update;
  }

  if (
    path.startsWith("/enrollment-questions")
  ) {
    return PERMISSIONS.enrollmentQuestions.view;
  }

  if (path === "/charges/create") {
    return PERMISSIONS.charges.create;
  }

  if (/^\/charges\/\d+\/edit$/.test(path)) {
    return PERMISSIONS.charges.update;
  }

  if (path.startsWith("/charges")) {
    return PERMISSIONS.charges.view;
  }

  if (path === "/payments/create") {
    return PERMISSIONS.payments.create;
  }

  if (
    /^\/payments\/\d+\/edit$/.test(path)
  ) {
    return PERMISSIONS.payments.update;
  }

  if (path.startsWith("/payments")) {
    return PERMISSIONS.payments.view;
  }

  if (path.startsWith("/permissions")) {
    return PERMISSIONS.permissions.view;
  }

  if (path.startsWith("/audits")) {
    return PERMISSIONS.audits.view;
  }

  if (path === "/experimental-classes/create") return PERMISSIONS.experimentalClasses.create;
  if (/^\/experimental-classes\/\d+\/edit$/.test(path)) return PERMISSIONS.experimentalClasses.update;
  if (path.startsWith("/experimental-classes")) return PERMISSIONS.experimentalClasses.view;

  if (path === "/group-classes/create") return PERMISSIONS.groupClasses.create;
  if (/^\/group-classes\/\d+\/edit$/.test(path)) return PERMISSIONS.groupClasses.update;
  if (path.startsWith("/group-classes")) return PERMISSIONS.groupClasses.view;

  if (path === "/group-students/create") return PERMISSIONS.groupStudents.create;
  if (/^\/group-students\/\d+\/edit$/.test(path)) return PERMISSIONS.groupStudents.update;
  if (path.startsWith("/group-students")) return PERMISSIONS.groupStudents.view;

  return null;
}
