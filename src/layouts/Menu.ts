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
  },
  {
    icons: "la la-chalkboard-teacher",
    title: "Professores",
    to: "/teachers",
    permission: PERMISSIONS.teachers.view,
  },
  {
    icons: "la la-cog",
    title: "Administração",
    className: "sub-menu",
    subMenuItems: [
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
