/**
 * useFilteredMenu.ts  (v2 — Phase 3)
 *
 * Composable that reads navigation.schema.ts and produces the filtered
 * menu for the current user's permissions.
 *
 * Key additions over v1:
 *  - Driven by navigationSchema instead of the old Menu.ts array
 *  - canAny() applied to groups: empty groups are unmounted entirely
 *  - openGroupKey: computed from route.matched so dropdowns expand
 *    automatically when the user lands on a deep child route or follows
 *    a legacy alias redirect
 */
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import {
  navigationSchema,
  canAny,
} from "@/layouts/navigation.schema";
import type {
  NavEntry,
  NavGroup,
  NavItem,
  NavChild,
} from "@/layouts/navigation.schema";
import type { PermissionName } from "@/lib/permissions/access";
import { resolveNavigationChild } from "@/layouts/navigationMatching";

// ─── Re-export legacy type so Sidebar.vue needs no extra imports ──────────────
export type { NavEntry, NavGroup, NavItem, NavChild };

// ─── Filtered types (returned by composable) ─────────────────────────────────

export interface FilteredNavGroup {
  kind: "group";
  key: string;
  label: string;
  icon: string;
  children: NavChild[];
}

export interface FilteredNavItem {
  kind: "item";
  label: string;
  icon: string;
  to: string;
}

export type FilteredEntry = FilteredNavGroup | FilteredNavItem;

// ─── Composable ───────────────────────────────────────────────────────────────

export function useFilteredMenu() {
  const auth = useAuthStore();
  const route = useRoute();

  /**
   * Check if a single permission is satisfied.
   * Absence of permission → always visible (public item).
   */
  function allowed(permission: PermissionName | undefined): boolean {
    if (!permission) return true;
    return auth.hasPermission(permission);
  }

  /** Filtered, permission-gated menu entries */
  const menuEntries = computed<FilteredEntry[]>(() => {
    // Touch auth.permissions so Vue tracks reactivity
    void auth.permissions;

    const result: FilteredEntry[] = [];

    for (const entry of navigationSchema) {
      if (entry.kind === "item") {
        if (!allowed(entry.permission)) continue;
        result.push({ kind: "item", label: entry.label, icon: entry.icon, to: entry.to });
        continue;
      }

      // Group: fast-path rejection via canAny
      if (
        entry.anyPermission &&
        !canAny(entry.anyPermission, auth.hasPermission)
      ) {
        continue;
      }

      // Filter children individually
      const visibleChildren = entry.children.flatMap((child) => {
        const resolved = resolveNavigationChild(child, route.path, auth.hasPermission);
        return resolved ? [resolved] : [];
      });

      // Unmount group entirely if no children survive
      if (visibleChildren.length === 0) continue;

      result.push({
        kind: "group",
        key: entry.key,
        label: entry.label,
        icon: entry.icon,
        children: visibleChildren,
      });
    }

    return result;
  });

  /**
   * openGroupKey — the key of the group whose dropdown should be open.
   *
   * Determined by walking route.matched paths and finding which group's
   * children prefix-match the current route. This handles:
   *   • Direct navigation to a child path
   *   • Alias redirects (/auditoria → /configuracoes → matched group)
   *   • Deep child routes (/enrollments/create → "matriculas" group)
   */
  const openGroupKey = computed<string | null>(() => {
    const currentPath = route.path;

    for (const entry of menuEntries.value) {
      if (entry.kind !== "group") continue;

      const matches = entry.children.some((child) => {
        if (!child.to) return false;
        if (child.to === "/") return currentPath === "/";
        return (
          currentPath === child.to ||
          currentPath.startsWith(child.to + "/") ||
          currentPath.startsWith(child.to)
        );
      });

      if (matches) return entry.key;
    }

    return null;
  });

  /**
   * canAccessSettings — true if the user can see the gear icon in the header.
   * Requires at least ONE of the four configurações module permissions.
   */
  const canAccessSettings = computed(() =>
    canAny(
      [
        "users.view" as PermissionName,
        "roles.view" as PermissionName,
        "permissions.view" as PermissionName,
        "audits.view" as PermissionName,
      ],
      auth.hasPermission
    )
  );

  return { menuEntries, openGroupKey, canAccessSettings };
}
