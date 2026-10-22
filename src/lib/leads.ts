import { api } from "@/lib/api";
import {
  appendExact,
  appendLike,
  createListQuery,
} from "@/lib/filters/query";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type {
  ApiItemResponse,
  ApiListResponse,
  Lead,
  LeadRegistrationSource,
  Paginated,
} from "@/lib/types";

export type ListLeadsParams = {
  page?: number;
  limit?: number;
  id?: number;
  name?: string;
  email?: string;
  whatsappPhone?: string;
  source?: string;
  selfDeclaredLevel?: string;
  registrationSource?: LeadRegistrationSource;
  objective?: string;
  linkTag?: string;
};

type LeadPlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    leads: Record<string, string>;
    link_tags?: string[];
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
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  appendExact(query, "id", params.id);
  appendLike(query, "name", params.name);
  appendLike(query, "email", params.email);
  appendLike(query, "whatsapp_phone", params.whatsappPhone);
  appendLike(query, "source", params.source);
  appendLike(query, "self_declared_level", params.selfDeclaredLevel);
  appendExact(query, "registration_source", params.registrationSource);
  appendLike(query, "objective", params.objective);
  appendExact(query, "link_tag", params.linkTag);

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

export async function getLeadLinkTags(): Promise<string[]> {
  const response = await api<LeadPlucksResponse>("/leads/plucks");

  return response.plucks.link_tags ?? [];
}

export async function issuePublicLeadLink(
  tag: string
): Promise<{ tag: string; code: string }> {
  const response = await api<{
    source: { tag: string; code: string };
  }>("/leads/public-link", {
    method: "POST",
    body: { tag },
  });

  return response.source;
}
