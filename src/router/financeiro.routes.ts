import type { RouteRecordRaw } from "vue-router";
import { PERMISSIONS } from "@/lib/permissions/access";

/**
 * Domínio: Financeiro
 * Módulos: Cobranças, Pagamentos, Inadimplentes, Planos
 */
export const financeiroRoutes: RouteRecordRaw[] = [
  // ─── Cobranças ────────────────────────────────────────────────────────────
  {
    path: "/charges",
    name: "Charges",
    component: () => import("../views/admin/charges/ChargeList.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.charges.view },
  },
  {
    path: "/charges/create",
    name: "ChargeCreate",
    component: () => import("../views/admin/charges/ChargeForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.charges.create },
  },
  {
    path: "/charges/:id/edit",
    name: "ChargeEdit",
    component: () => import("../views/admin/charges/ChargeForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.charges.update },
  },
  {
    path: "/charges/:id",
    name: "ChargeView",
    component: () => import("../views/admin/charges/ChargeView.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.charges.view },
  },

  // ─── Pagamentos ───────────────────────────────────────────────────────────
  {
    path: "/payments",
    name: "Payments",
    component: () => import("../views/admin/payments/PaymentList.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.payments.view },
  },
  {
    path: "/payments/create",
    name: "PaymentCreate",
    component: () => import("../views/admin/payments/PaymentForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.payments.create },
  },
  // Edição de pagamento não permitida — redireciona para listagem
  {
    path: "/payments/:id/edit",
    name: "PaymentEdit",
    redirect: "/payments",
  },

  // ─── Inadimplentes ────────────────────────────────────────────────────────
  {
    path: "/financial-alerts",
    name: "FinancialAlerts",
    component: () =>
      import("../views/admin/financial-alerts/FinancialAlertList.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.financialAlerts.view,
    },
  },

  // ─── Planos ───────────────────────────────────────────────────────────────
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
];
