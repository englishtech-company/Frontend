import { api } from "@/lib/api";
import { createListQuery } from "@/lib/filters/query";
import type { ApiItemResponse, Paginated } from "@/lib/types";
import type { PaymentDashboardPlanCommitment } from "@/lib/paymentDashboard";

export type RevenueDashboardListParams = { search?: string | null; page?: number; limit?: number };
export type RevenueDashboardMetadata = {
  generated_at: string; timezone: string; contract_reference_date: string; scope: Record<string, string>;
};
export type RevenueDashboardStudent = {
  student_id: number; student_name: string; student_status: string; archived: boolean;
  transactions_count: number; ltv_amount: string; principal_amount: string; late_fee_amount: string;
  interest_amount: string; last_paid_at: string | null; mrr_amount: string; active_contracts_count: number;
};
export type RevenueDashboardPackage = {
  duration_months: number; plan_commitment: PaymentDashboardPlanCommitment; hours_per_week: number | null;
  students_count: number; contracts_count: number; mrr_amount: string; contracted_volume_amount: string;
};
export type RevenueDashboardSummary = RevenueDashboardMetadata & {
  student_totals: { students_count: number; active_students_count: number; active_percentage: string | null };
  students_by_status: { status: string; students_count: number }[];
  ltv_totals: {
    paying_students_count: number; transactions_count: number; revenue_amount: string;
    principal_amount: string; late_fee_amount: string; interest_amount: string; average_ltv_amount: string | null;
  };
  contract_totals: {
    contracts_count: number; students_count: number; mrr_amount: string; contracted_volume_amount: string;
    average_monthly_contract_amount: string | null;
  };
  packages: RevenueDashboardPackage[];
  top_students: (RevenueDashboardStudent & { position: number })[];
  enrollment_evolution: { period: string; new_students_count: number }[];
  data_quality: {
    operational_state_per_enrollment_available: boolean; paused_contracted_volume_amount: string | null;
    overlapping_schedules_ignored_count: number; students_without_confirmation_date_count: number; warnings: string[];
  };
};
export type RevenueDashboardRecords = RevenueDashboardMetadata & {
  filters: { search: string | null };
  records: Paginated<RevenueDashboardStudent> & { from: number | null; to: number | null };
};

export function createRevenueDashboardQuery(params: RevenueDashboardListParams = {}): URLSearchParams {
  const query = createListQuery(params.page ?? 1, params.limit ?? 10);
  if (params.search?.trim()) query.set("search", params.search.trim());
  return query;
}
export async function getRevenueDashboardSummary(signal?: AbortSignal): Promise<RevenueDashboardSummary> {
  const response = await api<ApiItemResponse<"dashboard", RevenueDashboardSummary>>(
    "/students/revenue-dashboard/summary", { signal }
  );
  return response.dashboard;
}
export async function getRevenueDashboardRecords(params: RevenueDashboardListParams = {}, signal?: AbortSignal): Promise<RevenueDashboardRecords> {
  const query = createRevenueDashboardQuery(params).toString();
  const response = await api<ApiItemResponse<"dashboard", RevenueDashboardRecords>>(
    `/students/revenue-dashboard/records?${query}`, { signal }
  );
  return response.dashboard;
}
