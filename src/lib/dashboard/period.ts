export type DashboardPeriod = "7d" | "30d" | "90d" | "month" | "year" | "all";

export type PeriodRange = {
  start: Date | null;
  end: Date;
};

export const DASHBOARD_PERIOD_OPTIONS: Array<{
  value: DashboardPeriod;
  label: string;
}> = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "month", label: "Este mês" },
  { value: "year", label: "Este ano" },
  { value: "all", label: "Todo o período" },
];

export function getDashboardPeriodLabel(period: DashboardPeriod): string {
  return DASHBOARD_PERIOD_OPTIONS.find((option) => option.value === period)?.label ?? "Período";
}

function startOfDay(date: Date): Date {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function endOfDay(date: Date): Date {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
}

export function getDashboardPeriodRange(period: DashboardPeriod, now = new Date()): PeriodRange {
  const end = endOfDay(now);

  if (period === "all") {
    return { start: null, end };
  }

  if (period === "month") {
    return {
      start: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
      end,
    };
  }

  if (period === "year") {
    return {
      start: startOfDay(new Date(now.getFullYear(), 0, 1)),
      end,
    };
  }

  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
  const start = startOfDay(new Date(now));
  start.setDate(start.getDate() - (days - 1));

  return { start, end };
}

export function isDateWithinPeriod(
  value: string | Date | null | undefined,
  range: PeriodRange
): boolean {
  if (!range.start || !value) {
    return Boolean(value) || !range.start;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date >= range.start && date <= range.end;
}

export function filterByCreatedAt<T extends { created_at?: string | null }>(
  items: T[],
  range: PeriodRange
): T[] {
  if (!range.start) {
    return items;
  }

  return items.filter((item) => isDateWithinPeriod(item.created_at, range));
}
