import type { DueStatus } from "@/lib/dueDashboard";

export const dueStatusLabels: Record<DueStatus, string> = {
  overdue: "Em atraso", due_soon: "Até 3 dias", on_time: "Em dia",
};
export const planCommitmentLabels = {
  monthly: "Mensal", quarterly: "Trimestral", semiannual: "Semestral", other: "Outros",
};

export function fortalezaToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Fortaleza", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (name: string) => parts.find((value) => value.type === name)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function formatDueTimestamp(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Fortaleza", dateStyle: "short", timeStyle: "medium",
  }).format(date);
}

export function studentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: "Ativo", inactive: "Inativo", pending: "Pendente",
    paused: "Pausado", suspended: "Suspenso", completed: "Concluído",
  };
  return labels[status] ?? status;
}

export function paymentMethodLabel(method: string | null): string {
  return method === "pix" ? "Pix" : method === "credit_card" ? "Cartão de crédito" : method || "Não informado";
}

export function workloadLabel(value: string | number | null): string {
  if (value === null || value === "unknown") return "Não informada";
  return `${value} h/semana`;
}

export function visualPercentage(value: string | number, total: string | number = 100): number {
  const result = Number(value) / Number(total) * 100;
  return Number.isFinite(result) ? Math.min(100, Math.max(0, result)) : 0;
}
