import type { GroupClassStatus } from "@/lib/types";

export type GroupClassStatusBadge = {
  label: string;
  class: string;
};

export function formatGroupClassStatusBadge(
  status: GroupClassStatus | string
): GroupClassStatusBadge {
  if (status === "active") {
    return { label: "Ativo", class: "badge-success" };
  }

  return { label: "Inativo", class: "badge-secondary" };
}
