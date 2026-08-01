import type { Permission } from "@/lib/types";

export type GroupedPermission = {
  name: string;
  label: string;
  action: string;
};

export type PermissionModule = {
  key: string;
  label: string;
  permissions: GroupedPermission[];
};

const MODULE_LABELS: Record<string, string> = {
  users: "Usuários",
  students: "Alunos",
  teachers: "Professores",
  clients: "Clientes",
  roles: "Perfis",
  permissions: "Permissões",
  audits: "Auditoria",
};

const ACTION_LABELS: Record<string, string> = {
  view: "Listar",
  create: "Criar",
  update: "Editar",
  delete: "Excluir",
};

const ACTION_ORDER = ["view", "create", "update", "delete"];

function formatLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/[-_]/g, " ");
}

export function groupPermissions(permissions: Permission[]): PermissionModule[] {
  const groups = new Map<string, PermissionModule>();

  for (const permission of permissions) {
    const [moduleKey, action] = permission.name.split(".");
    if (!moduleKey || !action) continue;

    if (!groups.has(moduleKey)) {
      groups.set(moduleKey, {
        key: moduleKey,
        label: MODULE_LABELS[moduleKey] ?? formatLabel(moduleKey),
        permissions: [],
      });
    }

    groups.get(moduleKey)!.permissions.push({
      name: permission.name,
      label: ACTION_LABELS[action] ?? formatLabel(action),
      action,
    });
  }

  for (const group of groups.values()) {
    group.permissions.sort(
      (a, b) => ACTION_ORDER.indexOf(a.action) - ACTION_ORDER.indexOf(b.action)
    );
  }

  return Array.from(groups.values()).sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}

export function countSelectedInModule(
  module: PermissionModule,
  selected: string[]
): number {
  return module.permissions.filter((permission) =>
    selected.includes(permission.name)
  ).length;
}

export function isModuleFullySelected(
  module: PermissionModule,
  selected: string[]
): boolean {
  return (
    module.permissions.length > 0 &&
    module.permissions.every((permission) => selected.includes(permission.name))
  );
}
