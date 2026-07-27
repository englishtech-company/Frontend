import type { AuditLog } from "@/lib/types";

const EVENT_LABELS: Record<string, string> = {
  created: "Criado",
  updated: "Atualizado",
  deleted: "Excluído",
  restored: "Restaurado",
};

const MODEL_LABELS: Record<string, string> = {
  "App\\Models\\User": "Usuário",
  "App\Models\User": "Usuário",
  "App\\Models\\Role": "Perfil",
  "App\Models\Role": "Perfil",
};

export function formatAuditEvent(event: string): string {
  return EVENT_LABELS[event] ?? event;
}

export function formatAuditableType(type: string): string {
  return MODEL_LABELS[type] ?? type.split("\\").pop() ?? type;
}

export function getAuditUser(audit: AuditLog) {
  return audit.relationships?.user ?? audit.user ?? null;
}

export function formatAuditUser(audit: AuditLog): string {
  const user = getAuditUser(audit);
  if (!user) return "Sistema";
  return `${user.name} (#${user.id})`;
}

export function getAuditUserEditPath(audit: AuditLog): string | null {
  const user = getAuditUser(audit);
  return user ? `/users/${user.id}/edit` : null;
}

export function summarizeAuditChanges(audit: AuditLog): string {
  const values = audit.event === "deleted" ? audit.old_values : audit.new_values;
  if (!values || Object.keys(values).length === 0) return "—";

  const parts = Object.entries(values)
    .filter(([key]) => !["password", "remember_token"].includes(key))
    .slice(0, 3)
    .map(([key, value]) => `${key}: ${String(value)}`);

  return parts.join(" · ") || "—";
}

export function formatAuditValues(values: Record<string, unknown> | null): string {
  if (!values) return "—";

  const sanitized = Object.fromEntries(
    Object.entries(values).filter(([key]) => !["password", "remember_token"].includes(key))
  );

  if (Object.keys(sanitized).length === 0) return "—";

  return JSON.stringify(sanitized, null, 2);
}
