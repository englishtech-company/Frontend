import type { Plan, PlanCommitment, PlanVariant, PlanWorkload } from "@/lib/types";

export const COMMITMENT_OPTIONS: Array<{
  value: PlanCommitment;
  label: string;
  durationMonths: number;
}> = [
  {
    value: "monthly",
    label: "Mensal — renovação mensal",
    durationMonths: 1,
  },
  {
    value: "quarterly",
    label: "Trimestral — contrato de 3 meses",
    durationMonths: 3,
  },
  {
    value: "semiannual",
    label: "Semestral — contrato de 6 meses",
    durationMonths: 6,
  },
];

export const DEFAULT_VARIANT_HOURS = [1, 2, 3] as const;

export function getVariantWorkload(variant: PlanVariant): PlanWorkload | null {
  return (
    variant.plan_workload ??
    variant.relationships?.plan_workload ??
    null
  );
}

export function getVariantHoursPerWeek(variant: PlanVariant): number | undefined {
  return getVariantWorkload(variant)?.hours_per_week;
}

export function getPlanVariants(plan: Plan): PlanVariant[] {
  return [...(plan.relationships?.variants ?? plan.variants ?? [])].sort(
    (left, right) => {
      const leftHours = getVariantHoursPerWeek(left) ?? 0;
      const rightHours = getVariantHoursPerWeek(right) ?? 0;
      return leftHours - rightHours;
    }
  );
}

export function formatCommitmentLabel(commitment: PlanCommitment): string {
  return (
    COMMITMENT_OPTIONS.find((option) => option.value === commitment)?.label ??
    commitment
  );
}

export function formatDurationLabel(months: number): string {
  if (months === 1) return "1 mês";
  return `${months} meses`;
}

export function formatHoursLabel(hours: number): string {
  return `${hours}h/semana`;
}

export function formatPrice(value: string | number): string {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return "—";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export function formatPriceRange(plan: Plan): string {
  const activeVariants = getPlanVariants(plan).filter(
    (variant) => variant.active
  );

  if (activeVariants.length === 0) {
    return "—";
  }

  const prices = activeVariants.map((variant) =>
    Number(variant.monthly_price)
  );
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) {
    return formatPrice(min);
  }

  return `${formatPrice(min)} – ${formatPrice(max)}`;
}

export function countActiveVariants(plan: Plan): number {
  return getPlanVariants(plan).filter((variant) => variant.active).length;
}

export function formatPlanVariantOptionLabel(plan: Plan, variant: PlanVariant): string {
  const hours = getVariantHoursPerWeek(variant) ?? getVariantWorkload(variant)?.hours_per_week;
  const hoursLabel = hours ? formatHoursLabel(hours) : "";
  const priceLabel = formatPrice(variant.monthly_price);

  return [plan.name, hoursLabel, priceLabel].filter(Boolean).join(" · ");
}

export function buildActivePlanVariantOptions(plans: Plan[]): Array<{
  value: string;
  label: string;
}> {
  return plans.flatMap((plan) =>
    getPlanVariants(plan)
      .filter((variant) => variant.active && variant.id)
      .map((variant) => ({
        value: String(variant.id),
        label: formatPlanVariantOptionLabel(plan, variant),
      }))
  );
}

export function createEmptyVariants(): Array<{
  plan_workload_id: number;
  hours_per_week: number;
  monthly_price: string;
  active: boolean;
}> {
  return DEFAULT_VARIANT_HOURS.map((hours, index) => ({
    plan_workload_id: index + 1,
    hours_per_week: hours,
    monthly_price: "",
    active: true,
  }));
}

export function formatPriceInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (!digits) {
    return "";
  }

  return (Number(digits) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  });
}

export function parsePriceInput(value: string): number {
  return Number(value.replace(",", "."));
}

export function formatPriceForInput(value: string | number): string {
  return formatPriceInput(String(Math.round(Number(value) * 100)));
}
