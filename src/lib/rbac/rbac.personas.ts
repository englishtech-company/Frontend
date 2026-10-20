/**
 * rbac.personas.ts
 *
 * Canonical permission sets for EnglishTech's five internal personas.
 * Used by:
 *   - useRoleEmulator (dev-only) for frontend role emulation
 *   - RbacAuditPanel for live matrix verification
 *   - RoleSeeder (backend) as the authoritative source for db:seed
 *
 * Persona mapping to backend roles:
 *   superadmin          → role: superadmin   (bypasses all permission checks)
 *   agenteComercial     → role: agente_comercial
 *   coordenadorAcademico→ role: coordenador_academico
 *   professor           → role: teacher       (pre-existing)
 *   oficialFinanceiro   → role: oficial_financeiro
 */

export type PersonaKey =
  | "superadmin"
  | "agenteComercial"
  | "coordenadorAcademico"
  | "professor"
  | "oficialFinanceiro";

export interface Persona {
  key: PersonaKey;
  label: string;
  /** Backend role name */
  backendRole: string;
  /** null = superadmin bypass (all permissions granted) */
  permissions: string[] | null;
}

// ─── All backend permissions (for superadmin completeness check) ──────────────
const ALL_PERMISSIONS: string[] = [
  "users.view", "users.create", "users.update", "users.delete",
  "roles.view", "roles.create", "roles.update", "roles.delete",
  "permissions.view",
  "audits.view",
  "teachers.view", "teachers.create", "teachers.update", "teachers.delete",
  "students.view", "students.create", "students.update", "students.delete",
  "student-documents.view", "student-documents.create", "student-documents.update", "student-documents.delete",
  "group-classes.view", "group-classes.create", "group-classes.update", "group-classes.delete",
  "group-class-student.view", "group-class-student.create", "group-class-student.update", "group-class-student.delete",
  "lessons.view", "lessons.create", "lessons.update", "lessons.delete",
  "makeup-classes.view", "makeup-classes.create", "makeup-classes.update", "makeup-classes.delete",
  "leads.view", "leads.create", "leads.update", "leads.delete",
  "experimental-classes.view", "experimental-classes.create", "experimental-classes.update", "experimental-classes.delete",
  "enrollments.view", "enrollments.create", "enrollments.update", "enrollments.delete",
  "enrollment-questions.view", "enrollment-questions.create", "enrollment-questions.update", "enrollment-questions.delete",
  "plans.view", "plans.create", "plans.update", "plans.delete",
  "charges.view", "charges.create", "charges.update", "charges.delete",
  "payments.view", "payments.create", "payments.update", "payments.delete", "payments.reverse",
  "financial-alerts.view",
  "library-categories.view", "library-categories.create", "library-categories.update", "library-categories.delete",
  "library-materials.view", "library-materials.create", "library-materials.update", "library-materials.delete",
  "google-calendar.view", "google-calendar.update",
];

// ─── Personas ─────────────────────────────────────────────────────────────────

export const PERSONAS: Persona[] = [
  {
    key: "superadmin",
    label: "Superadmin",
    backendRole: "superadmin",
    permissions: null, // bypass — all permissions
  },

  {
    key: "agenteComercial",
    label: "Agente Comercial",
    backendRole: "agente_comercial",
    permissions: [
      // Leads (CRM)
      "leads.view", "leads.create", "leads.update", "leads.delete",
      // Aulas experimentais
      "experimental-classes.view", "experimental-classes.create",
      "experimental-classes.update", "experimental-classes.delete",
      // Matrículas
      "enrollments.view", "enrollments.create", "enrollments.update",
      "enrollment-questions.view",
      // Alunos (leitura para qualificação)
      "students.view",
      // Planos (leitura para cotação)
      "plans.view",
    ],
  },

  {
    key: "coordenadorAcademico",
    label: "Coordenador Acadêmico",
    backendRole: "coordenador_academico",
    permissions: [
      // Pedagógico completo
      "students.view", "students.create", "students.update", "students.delete",
      "student-documents.view", "student-documents.create", "student-documents.update",
      "teachers.view", "teachers.create", "teachers.update",
      "group-classes.view", "group-classes.create", "group-classes.update", "group-classes.delete",
      "group-class-student.view", "group-class-student.create", "group-class-student.update",
      "lessons.view", "lessons.create", "lessons.update", "lessons.delete",
      "makeup-classes.view", "makeup-classes.create", "makeup-classes.update",
      "google-calendar.view", "google-calendar.update",
      // Biblioteca
      "library-categories.view", "library-categories.create", "library-categories.update",
      "library-materials.view", "library-materials.create", "library-materials.update",
      // Matrículas (leitura)
      "enrollments.view",
      "enrollment-questions.view", "enrollment-questions.create", "enrollment-questions.update",
      // Permissões de leitura para contexto
      "plans.view",
    ],
  },

  {
    key: "professor",
    label: "Professor",
    backendRole: "teacher",
    permissions: [
      // Matches RoleSeeder teacher role exactly
      "lessons.view",
      "lessons.create",
      "lessons.update",
      "students.view",
      "group-classes.view",
      "teachers.view",
      "google-calendar.view",
    ],
  },

  {
    key: "oficialFinanceiro",
    label: "Oficial Financeiro",
    backendRole: "oficial_financeiro",
    permissions: [
      // Financeiro completo
      "charges.view", "charges.create", "charges.update", "charges.delete",
      "payments.view", "payments.create", "payments.reverse",
      "financial-alerts.view",
      "plans.view", "plans.create", "plans.update", "plans.delete",
      // Matrículas (leitura para contexto de cobrança)
      "enrollments.view",
      // Alunos (leitura para contexto de cobrança)
      "students.view",
    ],
  },
];

export const PERSONA_MAP: Record<PersonaKey, Persona> = Object.fromEntries(
  PERSONAS.map((p) => [p.key, p])
) as Record<PersonaKey, Persona>;

/** Returns true if the given persona has the given permission */
export function personaHas(persona: Persona, permission: string): boolean {
  if (persona.permissions === null) return true; // superadmin
  return persona.permissions.includes(permission);
}
