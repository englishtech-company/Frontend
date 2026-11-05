import { createRouter, createWebHistory } from "vue-router";
import { PERMISSIONS } from "@/lib/permissions/access";
import { resolveRoutePermission } from "@/lib/permissions/access";

// ─── Domain route modules ────────────────────────────────────────────────────
import { comercialRoutes } from "./comercial.routes";
import { pedagogicoRoutes } from "./pedagogico.routes";
import { financeiroRoutes } from "./financeiro.routes";
import { administrativoRoutes } from "./administrativo.routes";

declare module "vue-router" {
  interface RouteMeta {
    layout?: string;
    layout3?: string;
    layout4?: string;
    permission?: string;
    permissions?: string[];
  }
}

const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { el: "#app", top: 0, behavior: "smooth" };
  },
  routes: [
    // ─── Rotas globais (sem domínio) ──────────────────────────────────────
    {
      path: "/",
      name: "Dashboard",
      component: () => import("../views/dashboard/Dashboard.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/profile",
      name: "MyProfile",
      component: () => import("../views/pages/MyProfile.vue"),
      meta: { layout3: "layout3" },
    },

    // ─── Módulos por domínio ──────────────────────────────────────────────
    ...pedagogicoRoutes,
    ...comercialRoutes,
    ...financeiroRoutes,
    ...administrativoRoutes,

    // ─── Matrícula pública (token) ────────────────────────────────────────
    {
      path: "/enrollment/:token",
      name: "PublicEnrollment",
      component: () => import("../views/pages/PublicEnrollmentForm.vue"),
      meta: { layout4: "layout4" },
    },
    // Legacy PT alias para matrícula pública (com token)
    {
      path: "/matricula/:token",
      redirect: (to) => ({
        path: `/enrollment/${String(to.params.token)}`,
      }),
    },

    // ─── Páginas de sistema ───────────────────────────────────────────────
    {
      path: "/page-login",
      name: "page_login",
      component: () => import("../views/pages/Login.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-error-403",
      name: "page_error_403",
      component: () => import("../views/pages/error/Error403.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not_found",
      component: () => import("../views/pages/error/Error404.vue"),
      meta: { layout3: "layout3" },
    },
  ],
});

// ─── Guard helpers ────────────────────────────────────────────────────────────

const publicPaths = new Set(["/page-login", "/page-error-403"]);

function isPublicPath(path: string): boolean {
  if (publicPaths.has(path)) {
    return true;
  }

  return path.startsWith("/enrollment/");
}

// ─── Global navigation guard ──────────────────────────────────────────────────

router.beforeEach(async (to) => {
  const { useAuthStore } = await import("@/stores/auth");
  const auth = useAuthStore();

  if (!auth.bootstrapped) {
    await auth.fetchMe();
  }

  const isPublic = isPublicPath(to.path);

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
      (requiredPermission && !auth.hasPermission(requiredPermission)) ||
      (to.meta.permissions?.some((permission) => !auth.hasPermission(permission)) ?? false)
    ) {
      return { path: "/page-error-403" };
    }
  }

  return true;
});

export default router;
