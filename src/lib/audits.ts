import { api } from "@/lib/api";
import {
  appendDateRange,
  appendExact,
  appendLike,
  createListQuery,
} from "@/lib/filters/query";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type { ApiItemResponse, ApiListResponse, AuditLog, Paginated } from "@/lib/types";

export type ListAuditsParams = {
  page?: number;
  limit?: number;
  id?: number;
  event?: string;
  userName?: string;
  auditableType?: string;
  auditableId?: number;
  createdAtFrom?: string;
  createdAtTo?: string;
};

export async function listAudits(
  params: ListAuditsParams = {}
): Promise<Paginated<AuditLog>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  appendExact(query, "id", params.id);
  appendExact(query, "event", params.event);
  appendLike(query, "user_name", params.userName);
  appendLike(query, "auditable_type", params.auditableType);
  appendExact(query, "auditable_id", params.auditableId);
  appendDateRange(query, "created_at", params.createdAtFrom, params.createdAtTo);

  const response = await api<ApiListResponse<"audits", AuditLog>>(
    `/audits?${query.toString()}`
  );
  return response.audits;
}

export async function getAudit(id: number): Promise<AuditLog> {
  const response = await api<ApiItemResponse<"audit", AuditLog>>(`/audits/${id}`);
  return response.audit;
}

export async function getAuditFilterOptions(): Promise<{
  events: string[];
  auditableTypes: string[];
}> {
  const response = await api<{
    plucks: {
      events: Record<string, string>;
      auditable_types: Record<string, string>;
    };
  }>("/audits/plucks");

  return {
    events: Object.values(response.plucks.events ?? {}),
    auditableTypes: Object.values(response.plucks.auditable_types ?? {}),
  };
}
