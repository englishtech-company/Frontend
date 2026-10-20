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
  Coupon,
  CouponDiscountType,
  Paginated,
} from "@/lib/types";

export type ListCouponsParams = {
  page?: number;
  limit?: number;
  id?: number;
  name?: string;
};

export type CouponPayload = {
  name: string;
  discount_type: CouponDiscountType;
  value: number;
  usage_limit?: number | null;
  unique_per_student?: boolean;
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

export async function getCouponOptions(): Promise<Record<string, string>> {
  const response = await api<CouponPlucksResponse>("/coupons/plucks");

  return response.plucks.coupons;
}
