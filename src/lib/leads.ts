import { api } from "@/lib/api";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type {
  ApiItemResponse,
  ApiListResponse,
  Lead,
  LeadRegistrationSource,
  Paginated,
} from "@/lib/types";

type ListLeadsParams = {
  page?: number;
  limit?: number;
  search?: string;
  source?: string;
  self_declared_level?: string;
  registration_source?: LeadRegistrationSource;
};

type LeadPlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    leads: Record<string, string>;
  };
};

export type LeadPayload = {
  name: string;
  whatsapp_phone: string;
  email?: string | null;
  source: string;
  objective: string;
  self_declared_level: string;
};

export async function listLeads(
  params: ListLeadsParams = {}
): Promise<Paginated<Lead>> {
  const query = new URLSearchParams({
    "pagination[page]": String(params.page ?? 1),
    "pagination[limit]": String(params.limit ?? DEFAULT_LIST_LIMIT),
  });

  const search = params.search?.trim();
  const source = params.source?.trim();
  const selfDeclaredLevel = params.self_declared_level?.trim();

  if (search) {
    query.set("name", `%${search}%`);
  }

  if (source) {
    query.set("source", `%${source}%`);
  }

  if (selfDeclaredLevel) {
    query.set("self_declared_level", selfDeclaredLevel);
  }

  if (params.registration_source) {
    query.set("registration_source", params.registration_source);
  }

  const response = await api<ApiListResponse<"leads", Lead>>(
    `/leads?${query.toString()}`
  );

  return response.leads;
}

export async function getLead(id: number): Promise<Lead> {
  const response = await api<ApiItemResponse<"lead", Lead>>(
    `/leads/${id}`
  );

  return response.lead;
}

export async function createLead(data: LeadPayload): Promise<Lead> {
  const response = await api<ApiItemResponse<"lead", Lead>>(
    "/leads/create",
    {
      method: "POST",
      body: data,
    }
  );

  return response.lead;
}

export async function updateLead(
  id: number,
  data: Partial<LeadPayload>
): Promise<Lead> {
  const response = await api<ApiItemResponse<"lead", Lead>>(
    `/leads/${id}`,
    {
      method: "PUT",
      body: data,
    }
  );

  return response.lead;
}

export async function deleteLead(id: number): Promise<void> {
  await api(`/leads/${id}`, {
    method: "DELETE",
  });
}

export async function getLeadOptions(): Promise<Record<string, string>> {
  const response = await api<LeadPlucksResponse>("/leads/plucks");

  return response.plucks.leads;
}
