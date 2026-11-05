import { formatCurrency } from "@/lib/finance/format";
import { planCommitmentLabels, workloadLabel } from "@/lib/dueDashboardFormat";
import type { RevenueDashboardPackage } from "@/lib/revenueDashboard";

export function revenueMoney(value: string | null | undefined): string {
  return value === null || value === undefined ? "—" : formatCurrency(value);
}
export function revenuePercentage(value: string | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return "—";
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(Number(value))}%`;
}
export function enrollmentMonth(period: string): string {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(period);
  if (!match) return period;
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", month: "short", year: "2-digit" })
    .format(new Date(`${period}-01T12:00:00Z`)).replace(" de ", "/");
}
export function packageLabel(row: RevenueDashboardPackage): string {
  return `${workloadLabel(row.hours_per_week)} · ${planCommitmentLabels[row.plan_commitment] ?? "Outros"}`;
}
