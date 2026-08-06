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

export type TeacherModuleTab = TeacherFutureSection & {
  label: string;
  examples?: {
    title: string;
    subtitle?: string;
    badge?: string;
    badgeClass?: string;
  }[];
};

export const TEACHER_MODULE_TABS: TeacherModuleTab[] = [
  {
    id: "classes",
    label: "Aulas",
    title: "Agenda de aulas",
    description:
      "Horários, turmas, calendário semanal e sessões ministradas pelo professor.",
    icon: "la la-calendar-check",
    examples: [
      {
        title: "Seg 19:00 · Lucas Silva",
        subtitle: "Conversation · 50 min",
        badge: "Recorrente",
        badgeClass: "badge-primary",
      },
      {
        title: "Seg 20:00 · Gabriel Almeida",
        subtitle: "Conversation · 50 min",
        badge: "Recorrente",
        badgeClass: "badge-primary",
      },
      {
        title: "Qua 18:30 · Mariana Costa",
        subtitle: "Business English · 50 min",
        badge: "Avulsa",
        badgeClass: "badge-secondary",
      },
    ],
  },
  {
    id: "reports",
    label: "Relatórios",
    title: "Relatórios",
    description:
      "Desempenho dos alunos, frequência, aulas ministradas e indicadores do professor.",
    icon: "la la-chart-bar",
    examples: [
      {
        title: "Aulas ministradas em jul/2026",
        subtitle: "Total de sessões concluídas no mês",
        badge: "42",
        badgeClass: "badge-primary",
      },
      {
        title: "Frequência média dos alunos",
        subtitle: "Presença nas aulas do professor",
        badge: "92%",
        badgeClass: "badge-success",
      },
      {
        title: "Alunos com reposição pendente",
        subtitle: "Sessões a remarcar",
        badge: "2",
        badgeClass: "badge-warning",
      },
    ],
  },
  {
    id: "documents",
    label: "Documentos",
    title: "Documentos",
    description: "Contratos, certificados, anexos e documentos do professor.",
    icon: "la la-folder-open",
    examples: [
      {
        title: "Contrato de prestação de serviços.pdf",
        subtitle: "Vigência 2026",
        badge: "Ativo",
        badgeClass: "badge-success",
      },
      {
        title: "Certificado CELTA.pdf",
        subtitle: "Certificação de ensino",
        badge: "Anexo",
        badgeClass: "badge-secondary",
      },
      {
        title: "Documento de identificação.pdf",
        subtitle: "Atualizado em jan/2026",
        badge: "Anexo",
        badgeClass: "badge-secondary",
      },
    ],
  },
  {
    id: "availability",
    label: "Disponibilidade",
    title: "Disponibilidade",
    description: "Horários livres, bloqueios de agenda e janelas para novos alunos.",
    icon: "la la-clock",
    examples: [
      {
        title: "Segunda-feira",
        subtitle: "19:00 – 22:00",
        badge: "Disponível",
        badgeClass: "badge-success",
      },
      {
        title: "Quarta-feira",
        subtitle: "18:00 – 21:00",
        badge: "Disponível",
        badgeClass: "badge-success",
      },
      {
        title: "15/08/2026",
        subtitle: "Férias · indisponível o dia todo",
        badge: "Bloqueado",
        badgeClass: "badge-danger",
      },
    ],
  },
];

export const TEACHER_FUTURE_SECTIONS: TeacherFutureSection[] = TEACHER_MODULE_TABS.map(
  ({ id, title, description, icon }) => ({ id, title, description, icon })
);
