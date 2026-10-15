import { api } from "@/lib/api";
import {
  appendExact,
  createListQuery,
} from "@/lib/filters/query";
import type {
  ApiItemResponse,
  Paginated,
  PlanCommitment,
} from "@/lib/types";

export type PaymentDashboardPlanCommitment =
  | PlanCommitment
  | "other";

export type PaymentDashboardParams = {
  year?: number | null;
  month?: number | null;
  planCommitment?: PaymentDashboardPlanCommitment | null;
};

export type PaymentDashboardRecordsParams =
  PaymentDashboardParams & {
    search?: string | null;
    page?: number;
    limit?: number;
  };

export type PaymentDashboardFilters = {
  year: number | null;
  month: number | null;
  plan_commitment: PaymentDashboardPlanCommitment | null;
};

export type PaymentDashboardTotals = {
  transactions_count: number;
  revenue_amount: string;
  principal_amount: string;
  late_fee_amount: string;
  interest_amount: string;
  average_ticket_amount: string | null;
};

export type PaymentDashboardPlanRevenue = {
  plan_commitment: PaymentDashboardPlanCommitment;
  label: string;
  transactions_count: number;
  revenue_amount: string;
};

export type PaymentDashboardMonthlyRevenue = {
  period: string;
  year: number;
  month: number;
  transactions_count: number;
  revenue_amount: string;
};

export type PaymentDashboardTopStudent = {
  position: number;
  student_id: number;
  student_name: string;
  transactions_count: number;
  revenue_amount: string;
};

export type PaymentDashboardSummary = {
  generated_at: string;
  timezone: string;
  filters: PaymentDashboardFilters;
  totals: PaymentDashboardTotals;
  current_month: {
    filters: {
      year: number;
      month: number;
      plan_commitment: PaymentDashboardPlanCommitment | null;
    };
    totals: PaymentDashboardTotals;
  };
  revenue_by_plan: PaymentDashboardPlanRevenue[];
  monthly_revenue: PaymentDashboardMonthlyRevenue[];
  top_students: PaymentDashboardTopStudent[];
};

export type PaymentDashboardRecord = {
  id: number;
  charge_id: number | null;
  enrollment_id: number | null;
  student_id: number | null;
  student_name: string;
  plan_name: string | null;
  plan_commitment: PaymentDashboardPlanCommitment;
  plan_label: string;
  paid_at: string | null;
  amount: string;
  principal_amount: string;
  late_fee_amount: string;
  interest_amount: string;
};

export type PaymentDashboardRecords = {
  generated_at: string;
  timezone: string;
  filters: PaymentDashboardFilters & {
    search: string | null;
    pagination: {
      page: number;
      limit: number;
    };
  };
  records: Paginated<PaymentDashboardRecord> & {
    from: number | null;
    to: number | null;
  };
};

function appendDashboardFilters(
  query: URLSearchParams,
  params: PaymentDashboardParams
): void {
  appendExact(query, "year", params.year);
  appendExact(query, "month", params.month);
  appendExact(
    query,
    "plan_commitment",
    params.planCommitment
  );
}

export async function getPaymentDashboardSummary(
  params: PaymentDashboardParams = {},
  signal?: AbortSignal
): Promise<PaymentDashboardSummary> {
  const query = new URLSearchParams();

  appendDashboardFilters(query, params);

  const queryString = query.toString();
  const path = queryString
    ? `/payments/dashboard/summary?${queryString}`
    : "/payments/dashboard/summary";

  const response = await api<
    ApiItemResponse<"dashboard", PaymentDashboardSummary>
  >(path, { signal });

  return response.dashboard;
}

export async function getPaymentDashboardRecords(
  params: PaymentDashboardRecordsParams = {},
  signal?: AbortSignal
): Promise<PaymentDashboardRecords> {
  const query = createListQuery(
    params.page ?? 1,
    params.limit ?? 10
  );

  appendDashboardFilters(query, params);

  const search = params.search?.trim();

  if (search) {
    query.set("search", search);
  }

  const response = await api<
    ApiItemResponse<"dashboard", PaymentDashboardRecords>
  >(`/payments/dashboard/records?${query.toString()}`, {
    signal,
  });

  return response.dashboard;
}
