import type {
  Plan,
  PlanVariant,
  Student,
  StudentEnrollmentAssignment,
  StudentTeacherAssignment,
  Teacher,
} from "@/lib/types";
import {
  formatCommitmentLabel,
  formatDurationLabel,
  formatHoursLabel,
  formatPrice,
  getVariantHoursPerWeek,
  getVariantWorkload,
} from "@/lib/plans/format";

export type StudentStatusBadge = {
  label: string;
  class: string;
};

const STATUS_MAP: Record<string, StudentStatusBadge> = {
  active: { label: "Ativo", class: "badge-success" },
  ativo: { label: "Ativo", class: "badge-success" },
  inactive: { label: "Inativo", class: "badge-secondary" },
  inativo: { label: "Inativo", class: "badge-secondary" },
  pending: { label: "Pendente", class: "badge-warning" },
  pendente: { label: "Pendente", class: "badge-warning" },
};

export function formatStudentStatusBadge(status: string): StudentStatusBadge {
  const normalized = status?.toLowerCase() ?? "";
  return (
    STATUS_MAP[normalized] ?? {
      label: status || "—",
      class: "badge-light text-dark",
    }
  );
}

export function formatStudentDate(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR");
}

export function formatStudentDateTime(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR");
}

export function getStudentAge(birthdate?: string | null): string {
  if (!birthdate) return "—";

  const birth = new Date(birthdate);
  if (Number.isNaN(birth.getTime())) return "—";

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age >= 0 ? String(age) : "—";
}

export function getStudentInitials(name?: string | null): string {
  if (!name?.trim()) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function getStudentEnrollmentDays(student: Student): string {
  if (!student.start_date) return "—";

  const start = new Date(student.start_date);
  if (Number.isNaN(start.getTime())) return "—";

  const end = student.end_date ? new Date(student.end_date) : new Date();
  if (Number.isNaN(end.getTime())) return "—";

  const diffMs = end.getTime() - start.getTime();
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  return String(days);
}

export type StudentFutureSection = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export function getStudentCurrentTeacher(student: Student): Teacher | null {
  return (
    student.relationships?.current_teacher ??
    student.current_teacher_assignment?.teacher ??
    null
  );
}

export function getStudentTeacherHistory(student: Student): StudentTeacherAssignment[] {
  return student.relationships?.teacher_assignments ?? [];
}

export function getStudentCurrentPlanVariant(student: Student): PlanVariant | null {
  const fromRelationships = student.relationships?.current_plan_variant;
  if (fromRelationships) {
    return fromRelationships;
  }

  const assignment = student.current_enrollment_assignment;
  if (!assignment?.plan_variant_id) {
    return null;
  }

  return assignment.plan_variant ?? null;
}

export function getStudentEnrollmentHistory(student: Student): StudentEnrollmentAssignment[] {
  return student.relationships?.enrollment_assignments ?? [];
}

export function formatStudentPlanVariantLabel(variant: PlanVariant | null | undefined): string {
  if (!variant) return "—";

  const plan = variant.plan ?? variant.relationships?.plan;
  const hours = getVariantHoursPerWeek(variant) ?? getVariantWorkload(variant)?.hours_per_week;
  const planName = plan?.name ?? "Plano";
  const hoursLabel = hours ? formatHoursLabel(hours) : "";
  const priceLabel = formatPrice(variant.monthly_price);

  return [planName, hoursLabel, priceLabel].filter(Boolean).join(" · ");
}

export function formatStudentPlanShortLabel(variant: PlanVariant | null | undefined): string {
  if (!variant) return "—";

  const plan = variant.plan ?? variant.relationships?.plan;
  const hours = getVariantHoursPerWeek(variant) ?? getVariantWorkload(variant)?.hours_per_week;
  const planName = plan?.name ?? "Plano";
  const hoursLabel = hours ? formatHoursLabel(hours) : "";

  return [planName, hoursLabel].filter(Boolean).join(" · ");
}

export function formatStudentPlanSummary(variant: PlanVariant | null | undefined): {
  planName: string;
  commitment: string;
  duration: string;
  hours: string;
  price: string;
} {
  const plan = variant?.plan ?? variant?.relationships?.plan;

  return {
    planName: plan?.name ?? "—",
    commitment: plan ? formatCommitmentLabel(plan.commitment) : "—",
    duration: plan ? formatDurationLabel(plan.duration_months) : "—",
    hours:
      variant && getVariantHoursPerWeek(variant) !== undefined
        ? formatHoursLabel(getVariantHoursPerWeek(variant)!)
        : "—",
    price: variant ? formatPrice(variant.monthly_price) : "—",
  };
}

export const STUDENT_FUTURE_SECTIONS: StudentFutureSection[] = [
  {
    id: "classes",
    title: "Aulas e agenda",
    description: "Calendário, frequência e reposições.",
    icon: "la la-calendar-check",
  },
  {
    id: "payments",
    title: "Pagamentos",
    description: "Mensalidades, boletos e inadimplência.",
    icon: "la la-money-bill-wave",
  },
  {
    id: "documents",
    title: "Documentos",
    description: "Contratos, termos e anexos do aluno.",
    icon: "la la-folder-open",
  },
  {
    id: "notes",
    title: "Observações internas",
    description: "Anotações da equipe sobre o aluno.",
    icon: "la la-sticky-note",
  },
];
