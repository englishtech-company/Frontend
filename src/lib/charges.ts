import { api } from "@/lib/api";
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
  studentId?: number;
  enrollmentId?: number;
  dueDate?: string;
  status?: ChargeStatus;
};

export type CreateChargePayload = {
  enrollment_id: number;
  due_date: string;
};

export type UpdateChargePayload = {
  due_date?: string;
  status?: Extract<
    ChargeStatus,
    "open" | "overdue" | "cancelled"
  >;
};

type ChargePlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    charges: Record<string, string>;
  };
};

export async function listCharges(
  params: ListChargesParams = {}
): Promise<Paginated<Charge>> {
  const query = new URLSearchParams({
    "pagination[page]": String(params.page ?? 1),
    "pagination[limit]": String(params.limit ?? 20),
  });

  if (params.studentId !== undefined) {
    query.set("student_id", String(params.studentId));
  }

  if (params.enrollmentId !== undefined) {
    query.set("enrollment_id", String(params.enrollmentId));
  }

  if (params.dueDate) {
    query.set("due_date", params.dueDate);
  }

  if (params.status) {
    query.set("status", params.status);
  }

  const response = await api<
    ApiListResponse<"charges", Charge>
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
