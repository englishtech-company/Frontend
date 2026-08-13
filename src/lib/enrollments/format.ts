import { formatPlanVariantOptionLabel, formatPrice } from "@/lib/plans/format";
import type {
  Enrollment,
  EnrollmentPaymentMethod,
  EnrollmentStatus,
  Plan,
  PlanVariant,
} from "@/lib/types";

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  pending: "Pendente",
  submitted: "Preenchida",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};

export const ENROLLMENT_STATUS_CLASSES: Record<EnrollmentStatus, string> = {
  pending: "badge-warning",
  submitted: "badge-info",
  confirmed: "badge-success",
  cancelled: "badge-danger",
};

export const PAYMENT_METHOD_LABELS: Record<EnrollmentPaymentMethod, string> = {
  pix: "Pix",
  credit_card: "Cartão de crédito",
};

export function getEnrollmentPlanVariant(enrollment: Enrollment): PlanVariant | null {
  return enrollment.relationships?.plan_variant ?? enrollment.plan_variant ?? null;
}

export function getEnrollmentStudentName(enrollment: Enrollment): string {
  return (
    enrollment.relationships?.student?.name ??
    enrollment.student?.name ??
    "Sem aluno"
  );
}

export function getEnrollmentPublicUrl(enrollment: Enrollment): string {
  return enrollment.relationships?.public_url ?? "";
}

export function canCopyEnrollmentLink(enrollment: Enrollment): boolean {
  return enrollment.status === "pending" && Boolean(getEnrollmentPublicUrl(enrollment));
}

export function formatEnrollmentPlanLabel(
  enrollment: Enrollment,
  plans: Plan[] = []
): string {
  const variant = getEnrollmentPlanVariant(enrollment);

  if (!variant) {
    return "—";
  }

  const plan =
    variant.plan ??
    variant.relationships?.plan ??
    plans.find((item) => item.id === variant.plan_id);

  if (!plan) {
    return formatPrice(variant.monthly_price);
  }

  return formatPlanVariantOptionLabel(plan, variant);
}

export function formatEnrollmentNumber(id: number): string {
  return `#${String(id).padStart(6, "0")}`;
}

export function formatDiscountedPrice(
  monthlyPrice: string | number,
  discountPercent?: string | number | null
): string {
  const price = Number(monthlyPrice);
  const discount = Number(discountPercent ?? 0);

  if (!Number.isFinite(price)) {
    return "—";
  }

  if (!Number.isFinite(discount) || discount <= 0) {
    return formatPrice(price);
  }

  return formatPrice(price * (1 - discount / 100));
}
