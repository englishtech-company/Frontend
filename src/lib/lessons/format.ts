import { EMPTY_DATE_LABEL } from "@/lib/datetime/format";

export type LessonStatusBadge = {
  label: string;
  class: string;
};

export function formatLessonStatusBadge(status: string): LessonStatusBadge {
  switch (status) {
    case "completed":
    case "concluded":
      return { label: "Concluída", class: "badge-success" };
    case "scheduled":
      return { label: "Agendada", class: "badge-primary" };
    case "cancelled":
      return { label: "Cancelada", class: "badge-danger" };
    case "postponed":
      return { label: "Adiada", class: "badge-warning" };
    case "makeup":
      return { label: "Reposição", class: "badge-info" };
    default:
      return {
        label: status || EMPTY_DATE_LABEL,
        class: "badge-light text-dark",
      };
  }
}
