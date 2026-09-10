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
  Charge,
  ChargeStatus,
  Paginated,
} from "@/lib/types";

export type ListChargesParams = {
  page?: number;
  limit?: number;
  id?: number;
  studentId?: number;
  studentName?: string;
  enrollmentId?: number;
  expectedAmount?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  status?: ChargeStatus;
};

export type CreateChargePayload = {
  enrollment_id: number;
  due_date: string;
  generate_recurrence?: boolean;
};

export type UpdateChargePayload = {
  due_date?: string;
  status?: Extract<
    ChargeStatus,
    "open" | "overdue" | "cancelled"
  >;
  cancel_recurrence?: boolean;
};

export type ChargeFinancialSummaryPayment = {
  id: number;
  amount: string;
  principal_amount: string;
  late_fee_amount: string;
  interest_amount: string;
  paid_at?: string | null;
};

export type ChargeFinancialSummaryComponent = {
  paid_amount: string;
  remaining_amount: string;
};

export type ChargeFinancialSummary = {
  charge_id: number;
  reference_date: string;
  expected_amount: string;
  principal: ChargeFinancialSummaryComponent;
  late_fee: ChargeFinancialSummaryComponent;
  interest: ChargeFinancialSummaryComponent;
  total_due_amount: string;
  payments: ChargeFinancialSummaryPayment[];
};

export type CurrentChargeBalance = {
  reference_date: string;
  total_due_amount: string;
};

export type ChargeWithCurrentBalance = Charge & {
  current_balance?: CurrentChargeBalance;
};

type ChargePlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    charges: Record<string, string>;
    students: Record<string, string>;
  };
};

export async function listCharges(
  params: ListChargesParams = {}
): Promise<Paginated<ChargeWithCurrentBalance>> {
  const query = createListQuery(params.page, params.limit ?? 20);

  appendExact(query, "id", params.id);
  appendExact(query, "student_id", params.studentId);
  appendLike(query, "student_name", params.studentName);
  appendExact(query, "enrollment_id", params.enrollmentId);
  appendExact(query, "expected_amount", params.expectedAmount);
  appendDateRange(query, "due_date", params.dueDateFrom, params.dueDateTo);
  appendExact(query, "status", params.status);

  const response = await api<
    ApiListResponse<"charges", ChargeWithCurrentBalance>
  >(`/charges?${query.toString()}`);

  return response.charges;
}

export async function getCharge(
  id: number
): Promise<Charge> {
  const response = await api<
    ApiItemResponse<"charge", Charge>
  >(`/charges/${id}`);

  return response.charge;
}

export async function getChargeFinancialSummary(
  id: number,
  referenceDate: string
): Promise<ChargeFinancialSummary> {
  const query = new URLSearchParams({
    reference_date: referenceDate,
  });

  const response = await api<
    ApiItemResponse<
      "financial_summary",
      ChargeFinancialSummary
    >
  >(
    `/charges/${id}/financial-summary?${query.toString()}`
  );

  return response.financial_summary;
}

export async function createCharge(
  data: CreateChargePayload
): Promise<Charge> {
  const response = await api<
    ApiItemResponse<"charge", Charge>
  >("/charges/create", {
    method: "POST",
    body: data,
  });

  return response.charge;
}

export async function updateCharge(
  id: number,
  data: UpdateChargePayload
): Promise<Charge> {
  const response = await api<
    ApiItemResponse<"charge", Charge>
  >(`/charges/${id}`, {
    method: "PUT",
    body: data,
  });

  return response.charge;
}

export async function cancelChargeRecurrence(
  id: number
): Promise<Charge> {
  return updateCharge(id, {
    cancel_recurrence: true,
  });
}

export async function deleteCharge(
  id: number
): Promise<void> {
  await api(`/charges/${id}`, {
    method: "DELETE",
  });
}

export async function getChargeOptions(): Promise<
  Record<string, string>
> {
  const response = await api<ChargePlucksResponse>(
    "/charges/plucks"
  );

  return response.plucks.charges;
}

export async function getChargeStudentOptions(): Promise<
  Record<string, string>
> {
  const response = await api<ChargePlucksResponse>(
    "/charges/plucks"
  );

  return response.plucks.students;
}
