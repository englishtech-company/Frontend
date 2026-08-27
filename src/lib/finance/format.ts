import {
  getEnrollmentPlanVariant,
} from "@/lib/enrollments/format";
import {
  formatPrice,
} from "@/lib/plans/format";
import type {
  Charge,
  ChargeSchedule,
  ChargeStatus,
  Enrollment,
  Payment,
  Student,
} from "@/lib/types";

export function getEnrollmentStudent(
  enrollment: Enrollment
): Student | null {
  return (
    enrollment.relationships?.student ??
    enrollment.student ??
    null
  );
}

export function getChargeStudent(
  charge: Charge
): Student | null {
  return (
    charge.relationships?.student ??
    charge.student ??
    null
  );
}

export function getChargeEnrollment(
  charge: Charge
): Enrollment | null {
  return (
    charge.relationships?.enrollment ??
    charge.enrollment ??
    null
  );
}

export function getChargeSchedule(
  charge: Charge
): ChargeSchedule | null {
  return (
    charge.relationships?.charge_schedule ??
    charge.charge_schedule ??
    null
  );
}

export function getPaymentCharge(
  payment: Payment
): Charge | null {
  return (
    payment.relationships?.charge ??
    payment.charge ??
    null
  );
}

export function calculateEnrollmentExpectedAmount(
  enrollment: Enrollment
): number {
  const variant = getEnrollmentPlanVariant(
    enrollment
  );

  if (!variant) {
    return 0;
  }

  const monthlyPrice = Number(
    variant.monthly_price
  );

  const discountPercent = Number(
    enrollment.discount_percent ?? 0
  );

  if (!Number.isFinite(monthlyPrice)) {
    return 0;
  }

  const normalizedDiscount =
    Number.isFinite(discountPercent)
      ? Math.min(
          100,
          Math.max(0, discountPercent)
        )
      : 0;

  const amount =
    monthlyPrice *
    ((100 - normalizedDiscount) / 100);

  return Math.round(
    (amount + Number.EPSILON) * 100
  ) / 100;
}

export function formatChargeStatus(
  status: ChargeStatus
): {
  label: string;
  class: string;
} {
  const statuses: Record<
    ChargeStatus,
    { label: string; class: string }
  > = {
    open: {
      label: "Aberta",
      class: "badge-info",
    },
    paid: {
      label: "Paga",
      class: "badge-success",
    },
    partial: {
      label: "Parcial",
      class: "badge-warning",
    },
    overdue: {
      label: "Atrasada",
      class: "badge-danger",
    },
    cancelled: {
      label: "Cancelada",
      class: "badge-secondary",
    },
  };

  return statuses[status];
}

export function formatCurrency(
  value: string | number
): string {
  return formatPrice(value);
}

export function formatDate(
  value?: string | null
): string {
  if (!value) {
    return "—";
  }

  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-BR").format(
    new Date(year, month - 1, day)
  );
}

export function formatDateTime(
  value?: string | null
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
