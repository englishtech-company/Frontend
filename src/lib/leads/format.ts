import { formatDatePt, formatDateTimePt } from "@/lib/datetime/format";
import { formatLinkTagLabel } from "@/lib/linkTag";
import { formatEnrollmentAnswer } from "@/lib/enrollments/format";
import type {
  EnrollmentQuestion,
  EnrollmentQuestionType,
  Lead,
  LeadRegistrationSource,
} from "@/lib/types";

export const LEAD_REGISTRATION_SOURCE_LABELS: Record<
  LeadRegistrationSource,
  { label: string; class: string }
> = {
  form: { label: "Formulário", class: "badge-primary" },
  webhook: { label: "Webhook", class: "badge-info" },
  manual: { label: "Manual", class: "badge-secondary" },
};

export function formatLeadRegistrationSource(
  registrationSource: LeadRegistrationSource
) {
  return (
    LEAD_REGISTRATION_SOURCE_LABELS[registrationSource] ??
    LEAD_REGISTRATION_SOURCE_LABELS.manual
  );
}

export function formatLeadNumber(id: number): string {
  return `#${String(id).padStart(6, "0")}`;
}

export function formatLeadDate(value?: string | null): string {
  return formatDatePt(value);
}

export function formatLeadDateTime(value?: string | null): string {
  return formatDateTimePt(value);
}

export function formatLeadPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  const local =
    digits.startsWith("55") && digits.length > 11
      ? digits.slice(2, 13)
      : digits.slice(0, 11);

  return local
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2");
}

export function getLeadFormQuestions(lead: Lead): EnrollmentQuestion[] {
  return lead.relationships?.form_questions ?? [];
}

export function getLeadAnswer(
  lead: Lead,
  questionId: number
): string | string[] | null {
  if (!lead.answers) {
    return null;
  }

  const key = String(questionId);
  const value = lead.answers[key];

  return value === undefined || value === null ? null : value;
}

export function formatLeadAnswer(
  value: string | string[] | null | undefined,
  type?: EnrollmentQuestionType
): string {
  return formatEnrollmentAnswer(value, type);
}

export function hasLeadAnswers(lead: Lead): boolean {
  return Boolean(lead.answers && Object.keys(lead.answers).length > 0);
}

export function formatLeadLinkTag(linkTag?: string | null): string {
  const label = formatLinkTagLabel(linkTag);

  return label || "—";
}
