import { computed } from "vue";
import { PERMISSIONS } from "@/lib/permissions/access";
import { useAuthStore } from "@/stores/auth";

export function usePermissions() {
  const auth = useAuthStore();

  const can = (permission: string) => computed(() => auth.hasPermission(permission));

  return {
    auth,
    canViewUsers: computed(() => auth.hasPermission(PERMISSIONS.users.view)),
    canCreateUsers: computed(() => auth.hasPermission(PERMISSIONS.users.create)),
    canUpdateUsers: computed(() => auth.hasPermission(PERMISSIONS.users.update)),
    canDeleteUsers: computed(() => auth.hasPermission(PERMISSIONS.users.delete)),
    canViewRoles: computed(() => auth.hasPermission(PERMISSIONS.roles.view)),
    canCreateRoles: computed(() => auth.hasPermission(PERMISSIONS.roles.create)),
    canUpdateRoles: computed(() => auth.hasPermission(PERMISSIONS.roles.update)),
    canDeleteRoles: computed(() => auth.hasPermission(PERMISSIONS.roles.delete)),
    canViewStudents: computed(() => auth.hasPermission(PERMISSIONS.students.view)),
    canCreateStudents: computed(() => auth.hasPermission(PERMISSIONS.students.create)),
    canUpdateStudents: computed(() => auth.hasPermission(PERMISSIONS.students.update)),
    canDeleteStudents: computed(() => auth.hasPermission(PERMISSIONS.students.delete)),
    canViewTeachers: computed(() => auth.hasPermission(PERMISSIONS.teachers.view)),
    canCreateTeachers: computed(() => auth.hasPermission(PERMISSIONS.teachers.create)),
    canUpdateTeachers: computed(() => auth.hasPermission(PERMISSIONS.teachers.update)),
    canDeleteTeachers: computed(() => auth.hasPermission(PERMISSIONS.teachers.delete)),
    canViewPermissions: computed(() => auth.hasPermission(PERMISSIONS.permissions.view)),
    canViewAudits: computed(() => auth.hasPermission(PERMISSIONS.audits.view)),
    can,
  };
}
