import { api } from "@/lib/api";
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
  chargeId?: number;
  studentId?: number;
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
  const query = new URLSearchParams({
    "pagination[page]": String(params.page ?? 1),
    "pagination[limit]": String(params.limit ?? 20),
  });

  if (params.chargeId !== undefined) {
    query.set("charge_id", String(params.chargeId));
  }

  if (params.studentId !== undefined) {
    query.set("student_id", String(params.studentId));
  }

  if (params.paidAt) {
    query.set("paid_at", params.paidAt);
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
