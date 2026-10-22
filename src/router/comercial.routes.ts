import type { RouteRecordRaw } from "vue-router";
import { PERMISSIONS } from "@/lib/permissions/access";

/**
 * Domínio: Comercial
 * Módulos: Interessados (leads), Aulas Experimentais, Matrículas, Perguntas de Matrícula
 *
 * Aliases legados registrados neste módulo:
 *   /matriculas  → /enrollments  (redirect direto para listagem)
 */
export const comercialRoutes: RouteRecordRaw[] = [
  // ─── Leads ───────────────────────────────────────────────────────────────
  {
    path: "/leads",
    name: "Leads",
    component: () => import("../views/admin/leads/LeadList.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.leads.view },
  },
  {
    path: "/leads/create",
    name: "LeadCreate",
    component: () => import("../views/admin/leads/LeadForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.leads.create },
  },
  {
    path: "/leads/:id",
    name: "LeadView",
    component: () => import("../views/admin/leads/LeadView.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.leads.view },
  },
  {
    path: "/leads/:id/edit",
    name: "LeadEdit",
    component: () => import("../views/admin/leads/LeadForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.leads.update },
  },

  // ─── Aulas Experimentais ─────────────────────────────────────────────────
  {
    path: "/experimental-classes",
    name: "ExperimentalClasses",
    component: () =>
      import(
        "../views/admin/experimental-classes/ExperimentalClassList.vue"
      ),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.experimentalClasses.view,
    },
  },
  {
    path: "/experimental-classes/create",
    name: "ExperimentalClassCreate",
    component: () =>
      import(
        "../views/admin/experimental-classes/ExperimentalClassForm.vue"
      ),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.experimentalClasses.create,
    },
  },
  {
    path: "/experimental-classes/:id/edit",
    name: "ExperimentalClassEdit",
    component: () =>
      import(
        "../views/admin/experimental-classes/ExperimentalClassForm.vue"
      ),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.experimentalClasses.update,
    },
  },

  // ─── Matrículas ───────────────────────────────────────────────────────────
  // Legacy path: /matriculas → redirect direto para listagem em /enrollments
  {
    path: "/matriculas",
    redirect: "/enrollments",
  },
  {
    path: "/enrollments",
    name: "Enrollments",
    component: () =>
      import("../views/admin/enrollments/EnrollmentList.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.enrollments.view },
  },
  {
    path: "/enrollments/create",
    name: "EnrollmentCreate",
    component: () =>
      import("../views/admin/enrollments/EnrollmentForm.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.enrollments.create,
    },
  },
  {
    path: "/enrollments/:id/edit",
    name: "EnrollmentEdit",
    component: () =>
      import("../views/admin/enrollments/EnrollmentForm.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.enrollments.update,
    },
  },
  {
    path: "/enrollments/:id",
    name: "EnrollmentView",
    component: () =>
      import("../views/admin/enrollments/EnrollmentView.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.enrollments.view },
  },

  // ─── Perguntas de Matrícula ───────────────────────────────────────────────
  {
    path: "/enrollment-questions",
    name: "EnrollmentQuestions",
    component: () =>
      import(
        "../views/admin/enrollment-questions/EnrollmentQuestionList.vue"
      ),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.enrollmentQuestions.view,
    },
  },
  {
    path: "/enrollment-questions/create",
    name: "EnrollmentQuestionCreate",
    component: () =>
      import(
        "../views/admin/enrollment-questions/EnrollmentQuestionForm.vue"
      ),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.enrollmentQuestions.create,
    },
  },
  {
    path: "/enrollment-questions/:id/edit",
    name: "EnrollmentQuestionEdit",
    component: () =>
      import(
        "../views/admin/enrollment-questions/EnrollmentQuestionForm.vue"
      ),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.enrollmentQuestions.update,
    },
  },
];
