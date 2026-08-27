import { api } from "@/lib/api";
import {
  appendDateRange,
  appendExact,
  appendLike,
  createListQuery,
} from "@/lib/filters/query";
import type {
  ApiItemResponse,
  ApiListResponse,
  Paginated,
  Payment,
  StudentDocument,
} from "@/lib/types";

export type PaymentWithReceipt = Payment & {
  receipt_document?: StudentDocument | null;
  relationships?: Payment["relationships"] & {
    receipt_document?: StudentDocument | null;
  };
};

export type ListPaymentsParams = {
  page?: number;
  limit?: number;
  id?: number;
  chargeId?: number;
  studentId?: number;
  studentName?: string;
  amount?: string;
  paidAtFrom?: string;
  paidAtTo?: string;
  chargeStatus?: string;
  hasReceipt?: boolean;
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

export function getPaymentReceipt(
  payment: PaymentWithReceipt
): StudentDocument | null {
  return (
    payment.receipt_document ??
    payment.relationships?.receipt_document ??
    null
  );
}

export async function listPayments(
  params: ListPaymentsParams = {}
): Promise<Paginated<PaymentWithReceipt>> {
  const query = createListQuery(params.page, params.limit ?? 20);

  appendExact(query, "id", params.id);
  appendExact(query, "charge_id", params.chargeId);
  appendExact(query, "student_id", params.studentId);
  appendLike(query, "student_name", params.studentName);
  appendExact(query, "amount", params.amount);
  appendDateRange(query, "paid_at", params.paidAtFrom, params.paidAtTo);
  appendExact(query, "charge_status", params.chargeStatus);

  if (params.hasReceipt !== undefined) {
    query.set("has_receipt", params.hasReceipt ? "1" : "0");
  }

  const response = await api<
    ApiListResponse<
      "payments",
      PaymentWithReceipt
    >
  >(`/payments?${query.toString()}`);

  return response.payments;
}

export async function getPayment(
  id: number
): Promise<PaymentWithReceipt> {
  const response = await api<
    ApiItemResponse<
      "payment",
      PaymentWithReceipt
    >
  >(`/payments/${id}`);

  return response.payment;
}

export async function createPayment(
  data: CreatePaymentPayload
): Promise<PaymentWithReceipt> {
  const response = await api<
    ApiItemResponse<
      "payment",
      PaymentWithReceipt
    >
  >("/payments/create", {
    method: "POST",
    body: data,
  });

  return response.payment;
}

export async function updatePayment(
  id: number,
  data: UpdatePaymentPayload
): Promise<PaymentWithReceipt> {
  const response = await api<
    ApiItemResponse<
      "payment",
      PaymentWithReceipt
    >
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
