import { computed } from "vue";
import { PERMISSIONS } from "@/lib/permissions/access";
import { useAuthStore } from "@/stores/auth";

export function usePermissions() {
  const auth = useAuthStore();

  const can = (permission: string) =>
    computed(() =>
      auth.hasPermission(permission)
    );

  return {
    auth,

    canViewUsers: computed(() =>
      auth.hasPermission(PERMISSIONS.users.view)
    ),
    canCreateUsers: computed(() =>
      auth.hasPermission(
        PERMISSIONS.users.create
      )
    ),
    canUpdateUsers: computed(() =>
      auth.hasPermission(
        PERMISSIONS.users.update
      )
    ),
    canDeleteUsers: computed(() =>
      auth.hasPermission(
        PERMISSIONS.users.delete
      )
    ),

    canViewRoles: computed(() =>
      auth.hasPermission(PERMISSIONS.roles.view)
    ),
    canCreateRoles: computed(() =>
      auth.hasPermission(
        PERMISSIONS.roles.create
      )
    ),
    canUpdateRoles: computed(() =>
      auth.hasPermission(
        PERMISSIONS.roles.update
      )
    ),
    canDeleteRoles: computed(() =>
      auth.hasPermission(
        PERMISSIONS.roles.delete
      )
    ),

    canViewStudents: computed(() =>
      auth.hasPermission(
        PERMISSIONS.students.view
      )
    ),
    canCreateStudents: computed(() =>
      auth.hasPermission(
        PERMISSIONS.students.create
      )
    ),
    canUpdateStudents: computed(() =>
      auth.hasPermission(
        PERMISSIONS.students.update
      )
    ),
    canDeleteStudents: computed(() =>
      auth.hasPermission(
        PERMISSIONS.students.delete
      )
    ),

    canViewTeachers: computed(() =>
      auth.hasPermission(
        PERMISSIONS.teachers.view
      )
    ),
    canCreateTeachers: computed(() =>
      auth.hasPermission(
        PERMISSIONS.teachers.create
      )
    ),
    canUpdateTeachers: computed(() =>
      auth.hasPermission(
        PERMISSIONS.teachers.update
      )
    ),
    canDeleteTeachers: computed(() =>
      auth.hasPermission(
        PERMISSIONS.teachers.delete
      )
    ),

    canViewPlans: computed(() =>
      auth.hasPermission(PERMISSIONS.plans.view)
    ),
    canCreatePlans: computed(() =>
      auth.hasPermission(
        PERMISSIONS.plans.create
      )
    ),
    canUpdatePlans: computed(() =>
      auth.hasPermission(
        PERMISSIONS.plans.update
      )
    ),
    canDeletePlans: computed(() =>
      auth.hasPermission(
        PERMISSIONS.plans.delete
      )
    ),

    canViewLeads: computed(() =>
      auth.hasPermission(PERMISSIONS.leads.view)
    ),
    canCreateLeads: computed(() =>
      auth.hasPermission(
        PERMISSIONS.leads.create
      )
    ),
    canUpdateLeads: computed(() =>
      auth.hasPermission(
        PERMISSIONS.leads.update
      )
    ),
    canDeleteLeads: computed(() =>
      auth.hasPermission(
        PERMISSIONS.leads.delete
      )
    ),

    canViewEnrollments: computed(() =>
      auth.hasPermission(
        PERMISSIONS.enrollments.view
      )
    ),
    canCreateEnrollments: computed(() =>
      auth.hasPermission(
        PERMISSIONS.enrollments.create
      )
    ),
    canUpdateEnrollments: computed(() =>
      auth.hasPermission(
        PERMISSIONS.enrollments.update
      )
    ),
    canDeleteEnrollments: computed(() =>
      auth.hasPermission(
        PERMISSIONS.enrollments.delete
      )
    ),

    canViewEnrollmentQuestions: computed(() =>
      auth.hasPermission(
        PERMISSIONS.enrollmentQuestions.view
      )
    ),
    canCreateEnrollmentQuestions: computed(
      () =>
        auth.hasPermission(
          PERMISSIONS.enrollmentQuestions.create
        )
    ),
    canUpdateEnrollmentQuestions: computed(
      () =>
        auth.hasPermission(
          PERMISSIONS.enrollmentQuestions.update
        )
    ),
    canDeleteEnrollmentQuestions: computed(
      () =>
        auth.hasPermission(
          PERMISSIONS.enrollmentQuestions.delete
        )
    ),

    canViewCharges: computed(() =>
      auth.hasPermission(
        PERMISSIONS.charges.view
      )
    ),
    canCreateCharges: computed(() =>
      auth.hasPermission(
        PERMISSIONS.charges.create
      )
    ),
    canUpdateCharges: computed(() =>
      auth.hasPermission(
        PERMISSIONS.charges.update
      )
    ),
    canDeleteCharges: computed(() =>
      auth.hasPermission(
        PERMISSIONS.charges.delete
      )
    ),

    canViewPayments: computed(() =>
      auth.hasPermission(
        PERMISSIONS.payments.view
      )
    ),
    canCreatePayments: computed(() =>
      auth.hasPermission(
        PERMISSIONS.payments.create
      )
    ),
    canUpdatePayments: computed(() =>
      auth.hasPermission(
        PERMISSIONS.payments.update
      )
    ),
    canDeletePayments: computed(() =>
      auth.hasPermission(
        PERMISSIONS.payments.delete
      )
    ),

    canViewStudentDocuments: computed(() =>
      auth.hasPermission(
        PERMISSIONS.studentDocuments.view
      )
    ),
    canCreateStudentDocuments: computed(() =>
      auth.hasPermission(
        PERMISSIONS.studentDocuments.create
      )
    ),
    canUpdateStudentDocuments: computed(() =>
      auth.hasPermission(
        PERMISSIONS.studentDocuments.update
      )
    ),
    canDeleteStudentDocuments: computed(() =>
      auth.hasPermission(
        PERMISSIONS.studentDocuments.delete
      )
    ),

    canViewExperimentalClasses: computed(() =>
      auth.hasPermission(
        PERMISSIONS.experimentalClasses.view
      )
    ),
    canCreateExperimentalClasses: computed(() =>
      auth.hasPermission(
        PERMISSIONS.experimentalClasses.create
      )
    ),
    canUpdateExperimentalClasses: computed(() =>
      auth.hasPermission(
        PERMISSIONS.experimentalClasses.update
      )
    ),
    canDeleteExperimentalClasses: computed(() =>
      auth.hasPermission(
        PERMISSIONS.experimentalClasses.delete
      )
    ),

    canViewPermissions: computed(() =>
      auth.hasPermission(
        PERMISSIONS.permissions.view
      )
    ),
    canViewAudits: computed(() =>
      auth.hasPermission(PERMISSIONS.audits.view)
    ),

    can,
  };
}
