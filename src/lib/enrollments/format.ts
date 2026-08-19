import { formatPlanVariantOptionLabel, formatPrice } from "@/lib/plans/format";
import type {
  Enrollment,
  EnrollmentFormQuestion,
  EnrollmentPaymentMethod,
  EnrollmentQuestionType,
  EnrollmentStatus,
  Plan,
  PlanVariant,
  Student,
  StudentExtra,
} from "@/lib/types";

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  pending: "Pendente",
  submitted: "Preenchida",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};

export const ENROLLMENT_STATUS_CLASSES: Record<EnrollmentStatus, string> = {
  pending: "badge-warning",
  submitted: "badge-info",
  confirmed: "badge-success",
  cancelled: "badge-danger",
};

export const PAYMENT_METHOD_LABELS: Record<EnrollmentPaymentMethod, string> = {
  pix: "Pix",
  credit_card: "Cartão de crédito",
};

export function getEnrollmentPlanVariant(enrollment: Enrollment): PlanVariant | null {
  return enrollment.relationships?.plan_variant ?? enrollment.plan_variant ?? null;
}

export function getEnrollmentStudentName(enrollment: Enrollment): string {
  return (
    enrollment.relationships?.student?.name ??
    enrollment.student?.name ??
    "Sem aluno"
  );
}

export function getEnrollmentPublicUrl(enrollment: Enrollment): string {
  return enrollment.relationships?.public_url ?? "";
}

export function canCopyEnrollmentLink(enrollment: Enrollment): boolean {
  return enrollment.status === "pending" && Boolean(getEnrollmentPublicUrl(enrollment));
}

export function formatEnrollmentPlanLabel(
  enrollment: Enrollment,
  plans: Plan[] = []
): string {
  const variant = getEnrollmentPlanVariant(enrollment);

  if (!variant) {
    return "—";
  }

  const plan =
    variant.plan ??
    variant.relationships?.plan ??
    plans.find((item) => item.id === variant.plan_id);

  if (!plan) {
    return formatPrice(variant.monthly_price);
  }

  return formatPlanVariantOptionLabel(plan, variant);
}

export function formatEnrollmentNumber(id: number): string {
  return `#${String(id).padStart(6, "0")}`;
}

export const ENROLLMENT_QUESTION_TYPE_LABELS: Record<EnrollmentQuestionType, string> = {
  text: "Texto curto",
  textarea: "Texto livre",
  radio: "Múltipla escolha (uma opção)",
  checkbox: "Múltipla escolha (várias opções)",
  select: "Lista suspensa",
  number: "Número",
  date: "Data",
};

export function formatEnrollmentDate(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR");
}

export function formatEnrollmentDateTime(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR");
}

export function getEnrollmentStudent(enrollment: Enrollment): Student | null {
  return enrollment.relationships?.student ?? enrollment.student ?? null;
}

export function getEnrollmentFormQuestions(
  enrollment: Enrollment
): EnrollmentFormQuestion[] {
  return enrollment.relationships?.form_questions ?? [];
}

export function getEnrollmentStudentExtra(enrollment: Enrollment): StudentExtra | null {
  return enrollment.relationships?.student_extra ?? null;
}

export function getEnrollmentAnswer(
  enrollment: Enrollment,
  questionId: number
): string | string[] | null {
  const extra = getEnrollmentStudentExtra(enrollment);
  if (!extra?.answers) return null;

  const key = String(questionId);
  const value = extra.answers[key];
  return value === undefined || value === null ? null : value;
}

export function formatEnrollmentAnswer(
  value: string | string[] | null | undefined,
  type?: EnrollmentQuestionType
): string {
  if (value === null || value === undefined || value === "") return "—";

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "—";
  }

  if (type === "date" && value) {
    return new Date(value).toLocaleDateString("pt-BR");
  }

  return value;
}

export function hasEnrollmentAnswers(enrollment: Enrollment): boolean {
  const extra = getEnrollmentStudentExtra(enrollment);
  return Boolean(extra?.answers && Object.keys(extra.answers).length > 0);
}

export function formatDiscountedPrice(
  monthlyPrice: string | number,
  discountPercent?: string | number | null
): string {
  const price = Number(monthlyPrice);
  const discount = Number(discountPercent ?? 0);

  if (!Number.isFinite(price)) {
    return "—";
  }

  if (!Number.isFinite(discount) || discount <= 0) {
    return formatPrice(price);
  }

  return formatPrice(price * (1 - discount / 100));
}
