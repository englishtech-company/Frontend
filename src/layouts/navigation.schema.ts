/**
 * navigation.schema.ts
 *
 * Fonte única de verdade para a navegação lateral do EnglishTech.
 * Estruturado estritamente pelos 4 Domínios Operacionais:
 *   💼 Comercial (Dropdown)
 *   🎓 Pedagógico (Dropdown)
 *   💰 Financeiro (Dropdown)
 *   ⚙️ Administrativo (Dropdown)
 */

import { PERMISSIONS } from "@/lib/permissions/access";
import type { PermissionName } from "@/lib/permissions/access";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavChild {
  /** Label exibido no menu */
  label: string;
  /** Rota alvo */
  to: string;
  /** Permissão Spatie necessária (ausente = sempre visível) */
  permission?: PermissionName;
}

export interface NavGroup {
  kind: "group";
  /** Chave única para controle de accordion */
  key: string;
  label: string;
  icon: string;
  children: NavChild[];
  /**
   * Permissões avaliadas por canAny: o grupo aparece se o usuário tiver
   * pelo menos UMA das permissões listadas aqui.
   */
  anyPermission?: PermissionName[];
}

export interface NavItem {
  kind: "item";
  label: string;
  icon: string;
  to: string;
  permission?: PermissionName;
}

export type NavEntry = NavGroup | NavItem;

// ─── canAny helper ────────────────────────────────────────────────────────────

/**
 * Retorna true se o usuário tiver QUALQUER uma das permissões listadas.
 * Usado pelo Sidebar para desmontar grupos vazios antes de renderizar.
 */
export function canAny(
  permissions: PermissionName[],
  hasPermission: (p: PermissionName | string) => boolean
): boolean {
  return permissions.some((p) => hasPermission(p));
}

// ─── Schema ───────────────────────────────────────────────────────────────────

export const navigationSchema: NavEntry[] = [
  // ── Dashboard ────────────────────────────────────────────────────────────
  {
    kind: "item",
    label: "Dashboard",
    icon: "la la-home",
    to: "/",
  },

  // ── 💼 Comercial (Dropdown) ──────────────────────────────────────────────
  {
    kind: "group",
    key: "comercial",
    label: "Comercial",
    icon: "la la-briefcase",
    anyPermission: [
      PERMISSIONS.leads.view,
      PERMISSIONS.experimentalClasses.view,
      PERMISSIONS.enrollments.view,
    ],
    children: [
      {
        label: "Interessados",
        to: "/leads",
        permission: PERMISSIONS.leads.view,
      },
      {
        label: "Aulas Experimentais",
        to: "/experimental-classes",
        permission: PERMISSIONS.experimentalClasses.view,
      },
      {
        label: "Matrículas",
        to: "/enrollments",
        permission: PERMISSIONS.enrollments.view,
      },
    ],
  },

  // ── 🎓 Pedagógico (Dropdown) ─────────────────────────────────────────────
  {
    kind: "group",
    key: "pedagogico",
    label: "Pedagógico",
    icon: "la la-graduation-cap",
    anyPermission: [
      PERMISSIONS.groupClasses.view,
      PERMISSIONS.lessons.view,
      PERMISSIONS.teachers.view,
      PERMISSIONS.libraryMaterials.view,
      PERMISSIONS.libraryCategories.view,
    ],
    children: [
      {
        label: "Turmas",
        to: "/group-classes",
        permission: PERMISSIONS.groupClasses.view,
      },
      {
        label: "Aulas",
        to: "/aulas-workspace",
        permission: PERMISSIONS.lessons.view,
      },
      {
        label: "Calendário",
        to: "/calendar",
        permission: PERMISSIONS.lessons.view,
      },
      {
        label: "Professores",
        to: "/teachers",
        permission: PERMISSIONS.teachers.view,
      },
      {
        label: "Biblioteca",
        to: "/library/materials",
        permission: PERMISSIONS.libraryMaterials.view,
      },
    ],
  },

  // ── 💰 Financeiro (Dropdown) ─────────────────────────────────────────────
  {
    kind: "group",
    key: "financeiro",
    label: "Financeiro",
    icon: "la la-wallet",
    anyPermission: [
      PERMISSIONS.charges.view,
      PERMISSIONS.payments.view,
      PERMISSIONS.financialAlerts.view,
    ],
    children: [
      {
        label: "Cobranças",
        to: "/charges",
        permission: PERMISSIONS.charges.view,
      },
      {
        label: "Pagamentos",
        to: "/payments",
        permission: PERMISSIONS.payments.view,
      },
      {
        label: "Inadimplentes",
        to: "/financial-alerts",
        permission: PERMISSIONS.financialAlerts.view,
      },
    ],
  },

  // ── ⚙️ Administrativo (Dropdown) ──────────────────────────────────────────
  {
    kind: "group",
    key: "administrativo",
    label: "Administrativo",
    icon: "la la-cog",
    anyPermission: [
      PERMISSIONS.students.view,
      PERMISSIONS.plans.view,
      PERMISSIONS.users.view,
      PERMISSIONS.roles.view,
      PERMISSIONS.permissions.view,
      PERMISSIONS.audits.view,
    ],
    children: [
      {
        label: "Alunos",
        to: "/students",
        permission: PERMISSIONS.students.view,
      },
      {
        label: "Planos",
        to: "/plans",
        permission: PERMISSIONS.plans.view,
      },
      {
        label: "Configurações",
        to: "/configuracoes",
        permission: PERMISSIONS.users.view,
      },
    ],
  },
];
