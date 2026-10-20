import { formatPrice } from "@/lib/plans/format";
import type { Coupon, CouponDiscountType } from "@/lib/types";

export type CouponStatus = {
  label: string;
  class: string;
};

function toDateOnly(value?: string | null): string | null {
  if (!value) return null;

  return value.slice(0, 10);
}

export function formatCouponDate(value?: string | null): string {
  const date = toDateOnly(value);

  if (!date) return "—";

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) return "—";

  return `${day}/${month}/${year}`;
}

export function formatCouponValue(
  value: string | number,
  type: CouponDiscountType = "percent"
): string {
  const amount = Number(value);

  if (Number.isNaN(amount)) return "—";

  if (type === "amount") {
    return formatPrice(amount);
  }

  return `${amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}%`;
}

export function formatCouponLimit(coupon: Coupon): string {
  if (coupon.usage_limit == null) {
    return `${coupon.used_count ?? 0} / Ilimitado`;
  }

  return `${coupon.used_count ?? 0} / ${coupon.usage_limit}`;
}

export function formatCouponStatus(coupon: Coupon): CouponStatus {
  const today = new Date().toISOString().slice(0, 10);
  const startsAt = toDateOnly(coupon.starts_at);
  const endsAt = toDateOnly(coupon.ends_at);

  if (startsAt && startsAt > today) {
    return { label: "Agendado", class: "badge-info" };
  }

  if (endsAt && endsAt < today) {
    return { label: "Expirado", class: "badge-danger" };
  }

  if (
    coupon.usage_limit != null &&
    (coupon.used_count ?? 0) >= coupon.usage_limit
  ) {
    return { label: "Esgotado", class: "badge-warning" };
  }

  return { label: "Vigente", class: "badge-success" };
}
