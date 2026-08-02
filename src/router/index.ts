import { createRouter, createWebHistory } from "vue-router";
import { PERMISSIONS } from "@/lib/permissions/access";
import { resolveRoutePermission } from "@/lib/permissions/access";

declare module "vue-router" {
  interface RouteMeta {
    layout?: string;
    layout3?: string;
    layout4?: string;
    permission?: string;
  }
}

const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { el: "#app", top: 0, behavior: "smooth" };
  },
  routes: [
    {
      path: "/",
      name: "Dashboard",
      component: () => import("../views/dashboard/Dashboard.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/users",
      name: "Users",
      component: () => import("../views/admin/users/UserList.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.users.view },
    },
    {
      path: "/users/create",
      name: "UserCreate",
      component: () => import("../views/admin/users/UserForm.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.users.create },
    },
    {
      path: "/users/:id/edit",
      name: "UserEdit",
      component: () => import("../views/admin/users/UserForm.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.users.update },
    },
    {
      path: "/roles",
      name: "Roles",
      component: () => import("../views/admin/roles/RoleList.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.roles.view },
    },
    {
      path: "/roles/create",
      name: "RoleCreate",
      component: () => import("../views/admin/roles/RoleForm.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.roles.create },
    },
    {
      path: "/roles/:id/edit",
      name: "RoleEdit",
      component: () => import("../views/admin/roles/RoleForm.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.roles.update },
    },
    {
      path: "/students",
      name: "Students",
      component: () => import("../views/admin/students/StudentList.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.students.view },
    },
    {
      path: "/students/create",
      name: "StudentCreate",
      component: () => import("../views/admin/students/StudentForm.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.students.create },
    },
    {
      path: "/students/:id/edit",
      name: "StudentEdit",
      component: () => import("../views/admin/students/StudentForm.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.students.update },
    },
    {
      path: "/teachers",
      name: "Teachers",
      component: () => import("../views/admin/teachers/TeacherList.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.teachers.view },
    },
    {
      path: "/teachers/create",
      name: "TeacherCreate",
      component: () => import("../views/admin/teachers/TeacherForm.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.teachers.create },
    },
    {
      path: "/teachers/:id/edit",
      name: "TeacherEdit",
      component: () => import("../views/admin/teachers/TeacherForm.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.teachers.update },
    },
    {
      path: "/plans",
      name: "Plans",
      component: () => import("../views/admin/plans/PlanList.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.plans.view },
    },
    {
      path: "/plans/create",
      name: "PlanCreate",
      component: () => import("../views/admin/plans/PlanForm.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.plans.create },
    },
    {
      path: "/plans/:id/edit",
      name: "PlanEdit",
      component: () => import("../views/admin/plans/PlanForm.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.plans.update },
    },
    {
      path: "/permissions",
      name: "Permissions",
      component: () => import("../views/admin/permissions/PermissionList.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.permissions.view },
    },
    {
      path: "/audits",
      name: "Audits",
      component: () => import("../views/admin/audits/AuditList.vue"),
      meta: { layout3: "layout3", permission: PERMISSIONS.audits.view },
    },
    {
      path: "/page-login",
      name: "page_login",
      component: () => import("../views/pages/Login.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-register",
      name: "page_register",
      component: () => import("../views/pages/Register.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-forgot-password",
      name: "page_forgot_password",
      component: () => import("../views/pages/ForgetPassword.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-error-400",
      name: "page_error_400",
      component: () => import("../views/pages/error/Error400.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-error-403",
      name: "page_error_403",
      component: () => import("../views/pages/error/Error403.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-error-404",
      name: "page_error_404",
      component: () => import("../views/pages/error/Error404.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-error-500",
      name: "page_error_500",
      component: () => import("../views/pages/error/Error500.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-error-503",
      name: "page_error_503",
      component: () => import("../views/pages/error/Error503.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-lock-screen",
      name: "page_lock_screen",
      component: () => import("../views/pages/LockScreen.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

const publicPaths = new Set([
  "/page-login",
  "/page-register",
  "/page-forgot-password",
  "/page-error-400",
  "/page-error-403",
  "/page-error-404",
  "/page-error-500",
  "/page-error-503",
  "/page-lock-screen",
]);

router.beforeEach(async (to) => {
  const { useAuthStore } = await import("@/stores/auth");
  const auth = useAuthStore();

  if (!auth.bootstrapped) {
    await auth.fetchMe();
  }

  const isPublic = publicPaths.has(to.path);

  if (!isPublic && !auth.isAuthenticated) {
    return {
      path: "/page-login",
      query: { redirect: to.fullPath },
    };
  }

  if (to.path === "/page-login" && auth.isAuthenticated) {
    return { path: "/" };
  }

  if (!isPublic && auth.isAuthenticated) {
    const requiredPermission =
      (to.meta.permission as string | undefined) ??
      resolveRoutePermission(to.path);

    if (
      requiredPermission &&
      !auth.hasPermission(requiredPermission)
    ) {
      return { path: "/page-error-403" };
    }
  }

  return true;
});

export default router;
