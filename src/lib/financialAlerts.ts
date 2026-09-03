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
  FinancialAlert,
  FinancialAlertStatus,
  FinancialAlertType,
  Paginated,
} from "@/lib/types";

export type ListFinancialAlertsParams = {
  page?: number;
  limit?: number;
  status?: FinancialAlertStatus;
  type?: FinancialAlertType;
  studentName?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  triggeredOnFrom?: string;
  triggeredOnTo?: string;
};

export function getFinancialAlertCharge(
  financialAlert: FinancialAlert
): Charge | null {
  return (
    financialAlert.relationships?.charge ??
    financialAlert.charge ??
    null
  );
}

export async function listFinancialAlerts(
  params: ListFinancialAlertsParams = {}
): Promise<Paginated<FinancialAlert>> {
  const query = createListQuery(
    params.page,
    params.limit ?? 20
  );

  appendExact(query, "status", params.status);
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
      FinancialAlert
    >
  >(`/financial-alerts?${query.toString()}`);

  return response.financial_alerts;
}

export async function getFinancialAlert(
  id: number
): Promise<FinancialAlert> {
  const response = await api<
    ApiItemResponse<
      "financial_alert",
      FinancialAlert
    >
  >(`/financial-alerts/${id}`);

  return response.financial_alert;
}
