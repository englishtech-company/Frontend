import { EMPTY_DATE_LABEL } from "@/lib/datetime/format";

export type MakeupClassStatusBadge = {
  label: string;
  class: string;
};

export function formatMakeupClassStatusBadge(
  status: string
): MakeupClassStatusBadge {
  switch (status) {
    case "available":
      return { label: "Disponível", class: "badge-info" };
    case "scheduled":
      return { label: "Agendada", class: "badge-primary" };
    case "concluded":
      return { label: "Concluída", class: "badge-success" };
    case "expired":
      return { label: "Expirada", class: "badge-danger" };
    default:
      return {
        label: status || EMPTY_DATE_LABEL,
        class: "badge-secondary",
      };
  }
}
