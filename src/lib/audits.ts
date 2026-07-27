import { api } from "@/lib/api";
import type { ApiItemResponse, ApiListResponse, AuditLog, Paginated } from "@/lib/types";

type ListParams = {
  page?: number;
  limit?: number;
  event?: string;
};

export async function listAudits(params: ListParams = {}): Promise<Paginated<AuditLog>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  let url = `/audits?pagination[page]=${page}&pagination[limit]=${limit}`;

  if (params.event) {
    url += `&event=${encodeURIComponent(params.event)}`;
  }

  const response = await api<ApiListResponse<"audits", AuditLog>>(url);
  return response.audits;
}

export async function getAudit(id: number): Promise<AuditLog> {
  const response = await api<ApiItemResponse<"audit", AuditLog>>(`/audits/${id}`);
  return response.audit;
}

export async function getAuditFilterOptions(): Promise<{
  events: string[];
}> {
  const response = await api<{
    plucks: {
      events: Record<string, string>;
    };
  }>("/audits/plucks");

  return {
    events: Object.values(response.plucks.events ?? {}),
  };
}
