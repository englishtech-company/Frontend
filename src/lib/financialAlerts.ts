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
  FinancialAlert,
  FinancialAlertStatus,
  FinancialAlertType,
  Paginated,
} from "@/lib/types";

export type CurrentChargeBalance = {
  reference_date: string;
  total_due_amount: string;
};

export type ChargeWithCurrentBalance = Charge & {
  current_balance?: CurrentChargeBalance;
};

export type FinancialAlertWithCurrentBalance =
  FinancialAlert & {
    charge?: ChargeWithCurrentBalance | null;
    relationships?: FinancialAlert["relationships"] & {
      charge?: ChargeWithCurrentBalance | null;
    };
  };

export type ListFinancialAlertsParams = {
  page?: number;
  limit?: number;
  status?: FinancialAlertStatus;
  chargeStatus?: Extract<
    ChargeStatus,
    "overdue" | "partial_overdue"
  >;
  type?: FinancialAlertType;
  studentName?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  triggeredOnFrom?: string;
  triggeredOnTo?: string;
};

export function getFinancialAlertCharge(
  financialAlert: FinancialAlertWithCurrentBalance
): ChargeWithCurrentBalance | null {
  return (
    financialAlert.relationships?.charge ??
    financialAlert.charge ??
    null
  );
}

export async function listFinancialAlerts(
  params: ListFinancialAlertsParams = {}
): Promise<
  Paginated<FinancialAlertWithCurrentBalance>
> {
  const query = createListQuery(
    params.page,
    params.limit ?? 20
  );

  appendExact(query, "status", params.status);
  appendExact(
    query,
    "charge_status",
    params.chargeStatus
  );
  appendExact(query, "type", params.type);
  appendLike(
    query,
    "student_name",
    params.studentName
  );
  appendDateRange(
    query,
    "due_date",
    params.dueDateFrom,
    params.dueDateTo
  );
  appendDateRange(
    query,
    "triggered_on",
    params.triggeredOnFrom,
    params.triggeredOnTo
  );

  const response = await api<
    ApiListResponse<
      "financial_alerts",
      FinancialAlertWithCurrentBalance
    >
  >(`/financial-alerts?${query.toString()}`);

  return response.financial_alerts;
}

export async function getFinancialAlert(
  id: number
): Promise<FinancialAlertWithCurrentBalance> {
  const response = await api<
    ApiItemResponse<
      "financial_alert",
      FinancialAlertWithCurrentBalance
    >
  >(`/financial-alerts/${id}`);

  return response.financial_alert;
}
