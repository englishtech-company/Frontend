import { api } from "@/lib/api";
import { appendExact, createListQuery } from "@/lib/filters/query";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type { ApiItemResponse, Paginated } from "@/lib/types";

export type AcceptanceStatus = "accepted" | "pending";

export type TermVersion = {
  id: number;
  version: string;
  title: string;
  content?: string;
  is_active: boolean;
  published_at: string | null;
  acceptances_count?: number;
  publisher?: { id: number; name: string } | null;
};

export type TermAcceptanceRow = {
  student_id: number;
  name: string;
  email: string | null;
  accepted: boolean;
  accepted_at: string | null;
  ip_address: string | null;
  user_agent: string | null;
};

export type TermAcceptanceSummary = {
  total: number;
  accepted: number;
  pending: number;
};

export type ListTermAcceptancesParams = {
  page?: number;
  limit?: number;
  termId?: number | null;
  status?: AcceptanceStatus | null;
  name?: string;
  email?: string;
};

export async function listTermAcceptances(params: ListTermAcceptancesParams = {}) {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  appendExact(query, "term_id", params.termId);
  appendExact(query, "status", params.status);
  appendExact(query, "name", params.name?.trim());
  appendExact(query, "email", params.email?.trim());

  const response = await api<{
    term: Pick<TermVersion, "id" | "version" | "title" | "published_at"> | null;
    summary: TermAcceptanceSummary;
    acceptances: Paginated<TermAcceptanceRow>;
  }>(`/term-acceptances?${query.toString()}`);

  return {
    term: response.term,
    summary: response.summary,
    acceptances: response.acceptances,
  };
}

export async function listTerms(): Promise<{ terms: TermVersion[]; nextVersion: string }> {
  const response = await api<{ terms: TermVersion[]; next_version: string }>("/terms");
  return { terms: response.terms, nextVersion: response.next_version };
}

export async function publishTerm(data: {
  title: string;
  content: string;
}): Promise<TermVersion> {
  const response = await api<ApiItemResponse<"term", TermVersion>>("/terms/create", {
    method: "POST",
    body: data,
  });
  return response.term;
}
