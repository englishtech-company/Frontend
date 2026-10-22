import { api } from "@/lib/api";
import type {
  ApiItemResponse,
  EnrollmentFormQuestion,
  Lead,
} from "@/lib/types";

export type PublicLeadQuestion = Pick<
  EnrollmentFormQuestion,
  "id" | "label" | "help_text" | "type" | "required" | "options" | "sort_order"
>;

export type PublicLeadPayload = {
  name: string;
  whatsapp_phone: string;
  email?: string | null;
  birthdate: string;
  answers?: Record<string, string | string[]>;
  link_code?: string | null;
};

export async function getPublicLeadQuestions(): Promise<PublicLeadQuestion[]> {
  const response = await api<{ questions: PublicLeadQuestion[] }>(
    "/public/leads/questions",
    { auth: false }
  );

  return response.questions;
}

export async function submitPublicLead(
  data: PublicLeadPayload
): Promise<{ lead: Pick<Lead, "id" | "name" | "whatsapp_phone" | "email">; message?: string }> {
  const response = await api<
    ApiItemResponse<"lead", Pick<Lead, "id" | "name" | "whatsapp_phone" | "email">> & {
      message?: string;
    }
  >("/public/leads", {
    method: "POST",
    body: data,
    auth: false,
  });

  return {
    lead: response.lead,
    message: response.message,
  };
}
