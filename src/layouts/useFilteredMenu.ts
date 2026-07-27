import { computed } from "vue";
import menuConfig from "@/layouts/Menu";
import { useAuthStore } from "@/stores/auth";
import type { PermissionName } from "@/lib/permissions/access";

export type FilteredMenuItem = {
  icons?: string;
  title?: string;
  className?: string;
  to?: string;
  subMenuItems?: {
    menu?: string;
    to?: string;
    className?: string;
    subMenuDownItems?: {
      child?: string;
      to?: string;
    }[];
  }[];
};

function canSeeMenuPermission(
  permission: PermissionName | undefined,
  hasPermission: (permission: PermissionName | string) => boolean
): boolean {
  if (!permission) return true;
  return hasPermission(permission);
}

export function useFilteredMenu() {
  const auth = useAuthStore();

  const menuItems = computed<FilteredMenuItem[]>(() => {
    void auth.permissions;

    return menuConfig
      .map((item) => {
        if (item.className === "sub-menu" && item.subMenuItems) {
          const subMenuItems = item.subMenuItems.filter((subItem) =>
            canSeeMenuPermission(subItem.permission, auth.hasPermission)
          );

          if (subMenuItems.length === 0) return null;

          return {
            ...item,
            subMenuItems,
          };
        }

        if (!canSeeMenuPermission(item.permission, auth.hasPermission)) {
          return null;
        }

        return item;
      })
      .filter(Boolean) as FilteredMenuItem[];
  });

  return { menuItems };
}
