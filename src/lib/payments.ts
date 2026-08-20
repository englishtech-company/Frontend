import { api } from "@/lib/api";
import type {
  ApiItemResponse,
  ApiListResponse,
  Paginated,
  Payment,
} from "@/lib/types";

export type ListPaymentsParams = {
  page?: number;
  limit?: number;
  chargeId?: number;
  paidAt?: string;
};

export type CreatePaymentPayload = {
  charge_id: number;
  amount: number;
  paid_at: string;
  receipt_url?: string | null;
};

export type UpdatePaymentPayload = {
  amount?: number;
  paid_at?: string;
  receipt_url?: string | null;
};

type PaymentPlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    payments: Record<string, string>;
  };
};

export async function listPayments(
  params: ListPaymentsParams = {}
): Promise<Paginated<Payment>> {
  const query = new URLSearchParams({
    "pagination[page]": String(params.page ?? 1),
    "pagination[limit]": String(params.limit ?? 20),
  });

  if (params.chargeId !== undefined) {
    query.set("charge_id", String(params.chargeId));
  }

  if (params.paidAt) {
    query.set("paid_at", params.paidAt);
  }

  const response = await api<
    ApiListResponse<"payments", Payment>
  >(`/payments?${query.toString()}`);

  return response.payments;
}

export async function getPayment(
  id: number
): Promise<Payment> {
  const response = await api<
    ApiItemResponse<"payment", Payment>
  >(`/payments/${id}`);

  return response.payment;
}

export async function createPayment(
  data: CreatePaymentPayload
): Promise<Payment> {
  const response = await api<
    ApiItemResponse<"payment", Payment>
  >("/payments/create", {
    method: "POST",
    body: data,
  });

  return response.payment;
}

export async function updatePayment(
  id: number,
  data: UpdatePaymentPayload
): Promise<Payment> {
  const response = await api<
    ApiItemResponse<"payment", Payment>
  >(`/payments/${id}`, {
    method: "PUT",
    body: data,
  });

  return response.payment;
}

export async function deletePayment(
  id: number
): Promise<void> {
  await api(`/payments/${id}`, {
    method: "DELETE",
  });
}

export async function getPaymentOptions(): Promise<
  Record<string, string>
> {
  const response = await api<PaymentPlucksResponse>(
    "/payments/plucks"
  );

  return response.plucks.payments;
}
