import type { PermissionName } from "@/lib/permissions/access";

export type FinancialDashboardNavigationItem = {
  key: "payments" | "due-dates" | "revenue";
  label: string;
  path: string | null;
  permission: PermissionName | null;
};

const dashboards: readonly FinancialDashboardNavigationItem[] = [
  {
    key: "payments",
    label: "Pagamentos",
    path: "/payments/dashboard",
    permission: "payments.view",
  },
  {
    key: "due-dates",
    label: "Vencimentos e renovações",
    path: "/charges/dashboard",
    permission: "charges.view",
  },
  {
    key: "revenue",
    label: "Receita e LTV",
    path: null,
    permission: null,
  },
];

export function getFinancialDashboardNavigation(
  hasPermission: (permission: PermissionName) => boolean
): FinancialDashboardNavigationItem[] {
  return dashboards
    .filter((dashboard) =>
      dashboard.path === null ||
      (dashboard.permission !== null && hasPermission(dashboard.permission))
    )
    .map((dashboard) => ({ ...dashboard }));
}
