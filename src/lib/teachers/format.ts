import type { Student, StudentTeacherAssignment, Teacher, TeacherStatus } from "@/lib/types";
import { formatStudentStatusBadge } from "@/lib/students/format";

export type TeacherStatusBadge = {
  label: string;
  class: string;
};

const STATUS_MAP: Record<TeacherStatus, TeacherStatusBadge> = {
  active: { label: "Ativo", class: "badge-success" },
  inactive: { label: "Inativo", class: "badge-secondary" },
};

export function formatTeacherStatusBadge(status: TeacherStatus | string): TeacherStatusBadge {
  const normalized = status?.toLowerCase() ?? "";
  return (
    STATUS_MAP[normalized as TeacherStatus] ?? {
      label: status || "—",
      class: "badge-light text-dark",
    }
  );
}

export function formatTeacherDate(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR");
}

export function formatTeacherDateTime(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR");
}

export function getTeacherStudentAssignments(teacher: Teacher): StudentTeacherAssignment[] {
  return teacher.relationships?.student_assignments ?? [];
}

export function getTeacherCurrentStudents(teacher: Teacher): Student[] {
  return teacher.relationships?.current_students ?? [];
}

export function getTeacherActiveStudentCount(teacher: Teacher): number {
  return getTeacherCurrentStudents(teacher).length;
}

export function getTeacherAssignmentSince(teacher: Teacher, studentId: number): string {
  const assignment = getTeacherStudentAssignments(teacher).find(
    (item) => item.student_id === studentId
  );

  return formatTeacherDate(assignment?.created_at);
}

export function getTeacherDaysInSystem(teacher: Teacher): string {
  if (!teacher.created_at) return "—";

  const start = new Date(teacher.created_at);
  if (Number.isNaN(start.getTime())) return "—";

  const diffMs = Date.now() - start.getTime();
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  return String(days);
}

export function formatStudentStatusForTeacher(status: string) {
  return formatStudentStatusBadge(status);
}

export type TeacherFutureSection = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const TEACHER_FUTURE_SECTIONS: TeacherFutureSection[] = [
  {
    id: "schedule",
    title: "Agenda de aulas",
    description: "Horários, turmas e calendário do professor.",
    icon: "la la-calendar-check",
  },
  {
    id: "reports",
    title: "Relatórios",
    description: "Desempenho dos alunos e frequência.",
    icon: "la la-chart-bar",
  },
  {
    id: "availability",
    title: "Disponibilidade",
    description: "Slots livres e bloqueios de agenda.",
    icon: "la la-clock",
  },
  {
    id: "documents",
    title: "Documentos",
    description: "Contratos, certificados e anexos.",
    icon: "la la-folder-open",
  },
];
