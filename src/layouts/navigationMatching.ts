import type { NavChild } from "@/layouts/navigation.schema";
import type { PermissionName } from "@/lib/permissions/access";

/** Match the most specific visible destination, respecting path boundaries. */
export function getActiveNavigationPath(
  currentPath: string,
  destinations: readonly string[]
): string | null {
  return destinations
    .filter((destination) =>
      currentPath === destination ||
      (destination !== "/" && currentPath.startsWith(`${destination}/`))
    )
    .reduce<string | null>((active, destination) =>
      active === null || destination.length > active.length ? destination : active,
    null);
}

/** A shared menu item opens the current authorized panel, or its first allowed destination. */
export function resolveNavigationChild(
  child: NavChild,
  currentPath: string,
  hasPermission: (permission: PermissionName) => boolean
): NavChild | null {
  const allowed = [child, ...(child.alternatives ?? [])]
    .filter((candidate) => !candidate.permission || hasPermission(candidate.permission));
  const active = getActiveNavigationPath(currentPath, allowed.map((candidate) => candidate.to));
  const destination = allowed.find((candidate) => candidate.to === active) ?? allowed[0];
  return destination ? { ...child, to: destination.to, permission: destination.permission } : null;
}
