import { api } from "@/lib/api";
import {
  appendExact,
  appendLike,
  createListQuery,
} from "@/lib/filters/query";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type {
  ApiItemResponse,
  ApiListResponse,
  ChargeStatus,
  Coupon,
  CouponDiscountType,
  EnrollmentStatus,
  Paginated,
} from "@/lib/types";

export type ListCouponsParams = {
  page?: number;
  limit?: number;
  id?: number;
  name?: string;
  active?: boolean;
};

export type CouponUsageSummary = {
  students_count: number;
  enrollments_count: number;
  charges_count: number;
  payments_count: number;
  original_amount: string;
  billed_amount: string;
  discount_amount: string;
  paid_amount: string;
  open_amount: string;
};

export type CouponUsageEnrollment = {
  id: number;
  status: EnrollmentStatus;
  discount_percent?: string | number | null;
  created_at?: string | null;
  confirmed_at?: string | null;
  student?: {
    id: number;
    name: string;
    email?: string | null;
  } | null;
  plan_name?: string | null;
  monthly_price?: string;
  charges_count: number;
  billed_amount: string;
  paid_amount: string;
  open_amount: string;
};

export type CouponUsagePayment = {
  id: number;
  amount: string;
  paid_at?: string | null;
  charge_id: number;
  charge_status?: ChargeStatus | null;
  enrollment_id?: number | null;
  student?: {
    id: number;
    name: string;
  } | null;
};

export type CouponUsage = {
  coupon: Coupon;
  summary: CouponUsageSummary;
  enrollments: Paginated<CouponUsageEnrollment>;
  payments: Paginated<CouponUsagePayment>;
};

export type ListCouponUsageParams = {
  enrollmentsPage?: number;
  paymentsPage?: number;
  limit?: number;
};

export type CouponPayload = {
  name: string;
  discount_type: CouponDiscountType;
  value: number;
  usage_limit?: number | null;
  unique_per_student?: boolean;
  active?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
};

type CouponPlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    coupons: Record<string, string>;
  };
};

export async function listCoupons(
  params: ListCouponsParams = {}
): Promise<Paginated<Coupon>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  appendExact(query, "id", params.id);
  appendLike(query, "name", params.name);

  if (params.active !== undefined) {
    query.set("active", params.active ? "1" : "0");
  }

  const response = await api<ApiListResponse<"coupons", Coupon>>(
    `/coupons?${query.toString()}`
  );

  return response.coupons;
}

export async function getCoupon(id: number): Promise<Coupon> {
  const response = await api<ApiItemResponse<"coupon", Coupon>>(
    `/coupons/${id}`
  );

  return response.coupon;
}

export async function createCoupon(data: CouponPayload): Promise<Coupon> {
  const response = await api<ApiItemResponse<"coupon", Coupon>>(
    "/coupons/create",
    {
      method: "POST",
      body: data,
    }
  );

  return response.coupon;
}

export async function updateCoupon(
  id: number,
  data: Partial<CouponPayload>
): Promise<Coupon> {
  const response = await api<ApiItemResponse<"coupon", Coupon>>(
    `/coupons/${id}`,
    {
      method: "PUT",
      body: data,
    }
  );

  return response.coupon;
}

export async function deleteCoupon(id: number): Promise<void> {
  await api(`/coupons/${id}`, {
    method: "DELETE",
  });
}

export async function getCouponUsage(
  id: number,
  params: ListCouponUsageParams = {}
): Promise<CouponUsage> {
  const query = new URLSearchParams();

  query.set(
    "enrollments_page",
    String(params.enrollmentsPage ?? 1)
  );
  query.set(
    "payments_page",
    String(params.paymentsPage ?? 1)
  );
  query.set(
    "limit",
    String(params.limit ?? DEFAULT_LIST_LIMIT)
  );

  const response = await api<
    CouponUsage & { action: string; status: number; msg: string }
  >(`/coupons/${id}/usage?${query.toString()}`);

  return {
    coupon: response.coupon,
    summary: response.summary,
    enrollments: response.enrollments,
    payments: response.payments,
  };
}

export async function getCouponOptions(): Promise<Record<string, string>> {
  const response = await api<CouponPlucksResponse>("/coupons/plucks");

  return response.plucks.coupons;
}
