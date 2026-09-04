import type { Permission } from "@/lib/types";

export type GroupedPermission = {
  name: string;
  label: string;
  action: string;
};

export type PermissionSubmodule = {
  key: string;
  label: string;
  permissions: GroupedPermission[];
};

export type PermissionModule = {
  key: string;
  label: string;
  permissions: GroupedPermission[];
  submodules?: PermissionSubmodule[];
};

const MODULE_LABELS: Record<string, string> = {
  users: "Usuários",
  students: "Alunos",
  teachers: "Professores",
  plans: "Planos",
  leads: "Interessados",
  clients: "Clientes",
  roles: "Perfis",
  permissions: "Permissões",
  audits: "Auditoria",
  "experimental-classes": "Aulas experimentais",
  charges: "Cobranças",
  payments: "Pagamentos",
  "student-documents": "Documentos de alunos",
  enrollments: "Matrículas",
  "enrollment-questions": "Perguntas de matrícula",
  "group-classes": "Turmas",
  lessons: "Aulas",
};

const MODULE_GROUP_MAP: Record<string, string> = {
  enrollments: "enrollments",
  "enrollment-questions": "enrollments",
};

const GROUP_LABELS: Record<string, string> = {
  enrollments: "Matrículas",
};

const GROUP_SUBMODULE_ORDER: Record<
  string,
  string[]
> = {
  enrollments: [
    "enrollments",
    "enrollment-questions",
  ],
};

const ACTION_LABELS: Record<string, string> = {
  view: "Listar",
  create: "Criar",
  update: "Editar",
  delete: "Excluir",
};

const ACTION_ORDER = [
  "view",
  "create",
  "update",
  "delete",
];

function formatLabel(value: string): string {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1).replace(/[-_]/g, " ")
  );
}

function sortPermissions(
  permissions: GroupedPermission[]
): GroupedPermission[] {
  return [...permissions].sort(
    (left, right) =>
      ACTION_ORDER.indexOf(left.action) -
      ACTION_ORDER.indexOf(right.action)
  );
}

function buildGroupedPermission(
  permission: Permission
): GroupedPermission | null {
  const [moduleKey, action] =
    permission.name.split(".");

  if (!moduleKey || !action) {
    return null;
  }

  return {
    name: permission.name,
    label:
      ACTION_LABELS[action] ??
      formatLabel(action),
    action,
  };
}

export function getModulePermissions(
  module: PermissionModule
): GroupedPermission[] {
  if (module.submodules?.length) {
    return module.submodules.flatMap(
      (submodule) => submodule.permissions
    );
  }

  return module.permissions;
}

export function groupPermissions(
  permissions: Permission[]
): PermissionModule[] {
  const standalone = new Map<
    string,
    PermissionModule
  >();
  const groupedSubmodules = new Map<
    string,
    Map<string, PermissionSubmodule>
  >();

  for (const permission of permissions) {
    const grouped =
      buildGroupedPermission(permission);

    if (!grouped) {
      continue;
    }

    const [moduleKey] =
      permission.name.split(".");
    const groupKey =
      MODULE_GROUP_MAP[moduleKey];

    if (groupKey) {
      if (!groupedSubmodules.has(groupKey)) {
        groupedSubmodules.set(
          groupKey,
          new Map()
        );
      }

      const submodules =
        groupedSubmodules.get(groupKey)!;

      if (!submodules.has(moduleKey)) {
        submodules.set(moduleKey, {
          key: moduleKey,
          label:
            MODULE_LABELS[moduleKey] ??
            formatLabel(moduleKey),
          permissions: [],
        });
      }

      submodules
        .get(moduleKey)!
        .permissions.push(grouped);

      continue;
    }

    if (!standalone.has(moduleKey)) {
      standalone.set(moduleKey, {
        key: moduleKey,
        label:
          MODULE_LABELS[moduleKey] ??
          formatLabel(moduleKey),
        permissions: [],
      });
    }

    standalone
      .get(moduleKey)!
      .permissions.push(grouped);
  }

  const modules: PermissionModule[] = [];

  for (
    const [groupKey, submodulesMap]
    of groupedSubmodules
  ) {
    const order =
      GROUP_SUBMODULE_ORDER[groupKey] ?? [];

    const submodules = Array.from(
      submodulesMap.values()
    ).sort((left, right) => {
      const leftIndex =
        order.indexOf(left.key);
      const rightIndex =
        order.indexOf(right.key);

      if (
        leftIndex === -1 &&
        rightIndex === -1
      ) {
        return left.label.localeCompare(
          right.label,
          "pt-BR"
        );
      }

      if (leftIndex === -1) {
        return 1;
      }

      if (rightIndex === -1) {
        return -1;
      }

      return leftIndex - rightIndex;
    });

    for (const submodule of submodules) {
      submodule.permissions =
        sortPermissions(
          submodule.permissions
        );
    }

    modules.push({
      key: groupKey,
      label:
        GROUP_LABELS[groupKey] ??
        formatLabel(groupKey),
      permissions: [],
      submodules,
    });
  }

  for (const module of standalone.values()) {
    module.permissions = sortPermissions(
      module.permissions
    );

    modules.push(module);
  }

  return modules.sort((left, right) =>
    left.label.localeCompare(
      right.label,
      "pt-BR"
    )
  );
}

export function countSelectedInModule(
  module: PermissionModule,
  selected: string[]
): number {
  return getModulePermissions(module).filter(
    (permission) =>
      selected.includes(permission.name)
  ).length;
}

export function isModuleFullySelected(
  module: PermissionModule,
  selected: string[]
): boolean {
  const permissions =
    getModulePermissions(module);

  return (
    permissions.length > 0 &&
    permissions.every((permission) =>
      selected.includes(permission.name)
    )
  );
}

export function countSelectedInSubmodule(
  submodule: PermissionSubmodule,
  selected: string[]
): number {
  return submodule.permissions.filter(
    (permission) =>
      selected.includes(permission.name)
  ).length;
}

export function isSubmoduleFullySelected(
  submodule: PermissionSubmodule,
  selected: string[]
): boolean {
  return (
    submodule.permissions.length > 0 &&
    submodule.permissions.every(
      (permission) =>
        selected.includes(permission.name)
    )
  );
}
