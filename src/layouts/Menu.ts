/** @format */

import { reactive } from "vue";
import { PERMISSIONS } from "@/lib/permissions/access";
import type { PermissionName } from "@/lib/permissions/access";

interface sumMenuDownType {
  child?: string;
  to?: string;
  permission?: PermissionName;
}

interface subMenuType {
  menu?: string;
  to?: string;
  className?: string;
  permission?: PermissionName;
  subMenuDownItems?: sumMenuDownType[];
}

interface menuType {
  icons?: string;
  title?: string;
  className?: string;
  to?: string;
  permission?: PermissionName;
  subMenuItems?: subMenuType[];
}

const MenuItems = reactive<menuType[]>([
  {
    icons: "la la-home",
    title: "Dashboard",
    to: "/",
  },
  {
    icons: "la la-user",
    title: "Alunos",
    to: "/students",
    permission: PERMISSIONS.students.view,
  },
  {
    icons: "la la-chalkboard-teacher",
    title: "Professores",
    to: "/teachers",
    permission: PERMISSIONS.teachers.view,
  },
  {
    icons: "la la-users",
    title: "Turmas",
    to: "/group-classes",
    permission: PERMISSIONS.groupClasses.view,
  },
  {
    icons: "la la-chalkboard",
    title: "Aulas",
    to: "/lessons",
    permission: PERMISSIONS.lessons.view,
  },
  {
    icons: "la la-user-plus",
    title: "Interessados",
    to: "/leads",
    permission: PERMISSIONS.leads.view,
  },
  {
    icons: "la la-flask",
    title: "Aulas Experimentais",
    to: "/experimental-classes",
    permission: PERMISSIONS.experimentalClasses.view,
  },
  {
    icons: "la la-file-alt",
    title: "Matrículas",
    className: "sub-menu",
    subMenuItems: [
      {
        menu: "Listagem",
        to: "/enrollments",
        permission: PERMISSIONS.enrollments.view,
      },
      {
        menu: "Perguntas de matrícula",
        to: "/enrollment-questions",
        permission: PERMISSIONS.enrollmentQuestions.view,
      },
    ],
  },
  {
    icons: "la la-wallet",
    title: "Financeiro",
    className: "sub-menu",
    subMenuItems: [
      {
        menu: "Cobranças",
        to: "/charges",
        permission: PERMISSIONS.charges.view,
      },
      {
        menu: "Pagamentos",
        to: "/payments",
        permission: PERMISSIONS.payments.view,
      },
      {
        menu: "Alertas",
        to: "/financial-alerts",
        permission: PERMISSIONS.financialAlerts.view,
      },
    ],
  },
  {
    icons: "la la-cog",
    title: "Administração",
    className: "sub-menu",
    subMenuItems: [
      {
        menu: "Planos",
        to: "/plans",
        permission: PERMISSIONS.plans.view,
      },
      {
        menu: "Usuários",
        to: "/users",
        permission: PERMISSIONS.users.view,
      },
      {
        menu: "Perfis",
        to: "/roles",
        permission: PERMISSIONS.roles.view,
      },
      {
        menu: "Permissões",
        to: "/permissions",
        permission: PERMISSIONS.permissions.view,
      },
      {
        menu: "Auditoria",
        to: "/audits",
        permission: PERMISSIONS.audits.view,
      },
    ],
  },
]);

export default MenuItems;
