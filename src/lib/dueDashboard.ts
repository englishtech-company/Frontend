import { api } from "@/lib/api";
import { appendExact, createListQuery } from "@/lib/filters/query";
import type { ApiItemResponse, Paginated, ChargeStatus } from "@/lib/types";
import type { PaymentDashboardPlanCommitment } from "@/lib/paymentDashboard";

export type DueStatus = "overdue" | "due_soon" | "on_time";
export type DueDashboardParams = {
  referenceDate?: string | null;
  planCommitment?: PaymentDashboardPlanCommitment | null;
  dueStatus?: DueStatus | null;
};
export type DueDashboardListParams = DueDashboardParams & {
  search?: string | null;
  page?: number;
  limit?: number;
};
export type DueDashboardBalance = {
  principal_amount: string;
  late_fee_amount: string;
  interest_amount: string;
  total_due_amount: string;
};
export type DueDashboardMetadata = {
  generated_at: string;
  timezone: string;
  contract_reference_date: string;
  filters: {
    reference_date: string;
    plan_commitment: PaymentDashboardPlanCommitment | null;
    due_status: DueStatus | null;
  };
  scope: Record<string, string>;
  windows: { due_soon_days: number; renewal_days: number };
};
export type DueDashboardSummary = DueDashboardMetadata & {
  debt_totals: Record<DueStatus, DueDashboardBalance & { charges_count: number }>;
  students_with_debt_count: number;
  overdue_students_count: number;
  contract_totals: {
    contracts_count: number;
    students_count: number;
    mrr_amount: string;
    contracted_volume_amount: string;
  };
  contracts_by_plan: {
    plan_commitment: PaymentDashboardPlanCommitment;
    label: string;
    contracts_count: number;
    students_count: number;
    mrr_amount: string;
    contracted_volume_amount: string;
  }[];
  students_by_status: { status: string; students_count: number }[];
  contracts_by_payment_method: {
    payment_method: string | null;
    contracts_count: number;
    percentage: string;
  }[];
  contracts_by_workload: {
    hours_per_week: string | number | null;
    contracts_count: number;
    percentage: string;
  }[];
  dominant_workloads: (string | number)[];
  upcoming_renewals_count: number;
  data_quality: {
    operational_state_per_enrollment_available: boolean;
    paused_contracted_volume_amount: string | null;
    overlapping_schedules_ignored_count: number;
    contract_eligibility: string;
    warnings: string[];
  };
};
type DueDashboardPerson = {
  student_id: number | null;
  student_name: string | null;
  enrollment_id: number | null;
  plan_name: string | null;
  plan_commitment: PaymentDashboardPlanCommitment;
};
export type DueDashboardCharge = DueDashboardPerson & DueDashboardBalance & {
  charge_id: number;
  due_date: string;
  due_status: DueStatus;
  charge_status: ChargeStatus;
  expected_amount: string;
};
export type DueDashboardRenewal = DueDashboardPerson & {
  schedule_id: number;
  student_status: string;
  payment_method: string | null;
  hours_per_week: number | null;
  renews_automatically: boolean;
  cycle_start_date: string;
  renewal_date: string;
  is_current: boolean;
  mrr_amount: string;
  contracted_volume_amount: string;
};
export type DueDashboardRecords<T> = DueDashboardMetadata & {
  records: Paginated<T> & { from: number | null; to: number | null; search: string | null };
};

export function createDueDashboardQuery(params: DueDashboardListParams = {}, paginated = false): URLSearchParams {
  const query = paginated ? createListQuery(params.page ?? 1, params.limit ?? 10) : new URLSearchParams();
  appendExact(query, "reference_date", params.referenceDate);
  appendExact(query, "plan_commitment", params.planCommitment);
  appendExact(query, "due_status", params.dueStatus);
  if (paginated && params.search?.trim()) query.set("search", params.search.trim());
  return query;
}

async function load<T>(action: string, params: DueDashboardListParams, paginated: boolean, signal?: AbortSignal): Promise<T> {
  const query = createDueDashboardQuery(params, paginated).toString();
  const response = await api<ApiItemResponse<"dashboard", T>>(
    `/charges/dashboard/${action}${query ? `?${query}` : ""}`, { signal }
  );
  return response.dashboard;
}

export function getDueDashboardSummary(params: DueDashboardParams = {}, signal?: AbortSignal) {
  return load<DueDashboardSummary>("summary", params, false, signal);
}
export function getDueDashboardRecords(params: DueDashboardListParams = {}, signal?: AbortSignal) {
  return load<DueDashboardRecords<DueDashboardCharge>>("records", params, true, signal);
}
export function getDueDashboardRenewals(params: DueDashboardListParams = {}, signal?: AbortSignal) {
  return load<DueDashboardRecords<DueDashboardRenewal>>("renewals", params, true, signal);
}
