import type { RouteRecordRaw } from "vue-router";
import { PERMISSIONS } from "@/lib/permissions/access";

/**
 * Domínio: Administrativo
 * Módulos: Usuários, Perfis, Permissões, Auditoria, Biblioteca
 *
 * Workspaces (Fase 2):
 *   /configuracoes → ConfiguracoesHostView (Usuários + Perfis + Permissões + Auditoria)
 *
 * Aliases legados registrados neste módulo:
 *   /auditoria  → /configuracoes  (agora aponta para o workspace)
 *   /biblioteca → /library/materials  (redirect direto para listagem de materiais)
 */
export const administrativoRoutes: RouteRecordRaw[] = [
  // ─── Workspace: Configurações ─────────────────────────────────────────────
  // ConfiguracoesHostView consolida Usuários, Perfis, Permissões e Auditoria.
  // O redirect guard do host redireciona para a primeira aba autorizada.
  {
    path: "/configuracoes",
    name: "Configuracoes",
    component: () =>
      import("../views/admin/configuracoes/ConfiguracoesHostView.vue"),
    meta: {
      layout3: "layout3",
      // Permissão mínima para entrar no workspace; o host resolve a aba correta.
      permission: PERMISSIONS.users.view,
    },
  },

  // ─── Usuários ─────────────────────────────────────────────────────────────
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

  // ─── Perfis (Roles) ───────────────────────────────────────────────────────
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

  // ─── Permissões ───────────────────────────────────────────────────────────
  {
    path: "/permissions",
    name: "Permissions",
    component: () =>
      import("../views/admin/permissions/PermissionList.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.permissions.view },
  },

  // ─── Auditoria ────────────────────────────────────────────────────────────
  // Legacy alias: /auditoria → workspace de Configurações
  {
    path: "/auditoria",
    redirect: "/configuracoes",
  },
  {
    path: "/audits",
    name: "Audits",
    component: () => import("../views/admin/audits/AuditList.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.audits.view },
  },

  // ─── Biblioteca ───────────────────────────────────────────────────────────
  // Legacy alias: /biblioteca → /library/materials (redirect direto para materiais)
  {
    path: "/biblioteca",
    redirect: "/library/materials",
  },
  {
    path: "/library/categories",
    name: "LibraryCategories",
    component: () =>
      import("../views/admin/library/LibraryCategoryList.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.libraryCategories.view,
    },
  },
  {
    path: "/library/categories/create",
    name: "LibraryCategoryCreate",
    component: () =>
      import("../views/admin/library/LibraryCategoryForm.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.libraryCategories.create,
    },
  },
  {
    path: "/library/categories/:id",
    name: "LibraryCategoryView",
    component: () =>
      import("../views/admin/library/LibraryCategoryView.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.libraryCategories.view,
    },
  },
  {
    path: "/library/categories/:id/edit",
    name: "LibraryCategoryEdit",
    component: () =>
      import("../views/admin/library/LibraryCategoryForm.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.libraryCategories.update,
    },
  },
  {
    path: "/library/materials",
    name: "LibraryMaterials",
    component: () =>
      import("../views/admin/library/LibraryMaterialList.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.libraryMaterials.view,
    },
  },
  {
    path: "/library/materials/create",
    name: "LibraryMaterialCreate",
    component: () =>
      import("../views/admin/library/LibraryMaterialForm.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.libraryMaterials.create,
    },
  },
  {
    path: "/library/materials/:id/edit",
    name: "LibraryMaterialEdit",
    component: () =>
      import("../views/admin/library/LibraryMaterialForm.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.libraryMaterials.update,
    },
  },
];
