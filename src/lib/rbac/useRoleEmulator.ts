/**
 * useRoleEmulator.ts
 *
 * Dev-only composable for frontend RBAC emulation.
 *
 * ⚠️  NEVER imported in production code paths.
 *     Only used inside RbacAuditPanel.vue (which itself is only
 *     mounted when import.meta.env.DEV === true).
 *
 * How it works:
 *   - Stores the active persona key in localStorage under `__rbac_persona__`
 *   - Monkey-patches auth.user.permissions + auth.user.is_superadmin
 *     so that every reactive downstream consumer (usePermissions,
 *     useFilteredMenu, router guards) sees the emulated permission set
 *   - Restoring to null resets to the real authenticated user state
 *     by re-running auth.fetchMe()
 */
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import {
  PERSONAS,
  PERSONA_MAP,
  type PersonaKey,
  type Persona,
} from "@/lib/rbac/rbac.personas";

const STORAGE_KEY = "__rbac_persona__";

export function useRoleEmulator() {
  const auth = useAuthStore();

  // ── Active persona (persisted across hot reloads) ─────────────────────────
  const activePersonaKey = ref<PersonaKey | null>(
    (localStorage.getItem(STORAGE_KEY) as PersonaKey | null) ?? null
  );

  const activePersona = computed<Persona | null>(() =>
    activePersonaKey.value ? (PERSONA_MAP[activePersonaKey.value] ?? null) : null
  );

  // ── Emulation toggle ──────────────────────────────────────────────────────

  /**
   * Apply a persona: overrides the reactive auth.user permissions in-place.
   * The real token / API session is untouched — only the frontend view changes.
   */
  function emulate(key: PersonaKey) {
    const persona = PERSONA_MAP[key];
    if (!persona || !auth.user) return;

    localStorage.setItem(STORAGE_KEY, key);
    activePersonaKey.value = key;

    // Patch the reactive user object
    auth.user.is_superadmin = persona.permissions === null;
    auth.user.permissions = persona.permissions ?? [];
  }

  /**
   * Reset emulation: restore from the real /auth/me API response.
   * Useful after emulating a restricted persona to return to Superadmin view.
   */
  async function resetEmulation() {
    localStorage.removeItem(STORAGE_KEY);
    activePersonaKey.value = null;
    await auth.fetchMe();
  }

  // ── Permission matrix helper ───────────────────────────────────────────────

  /**
   * For a given route's meta.permission, returns whether the given persona
   * would be allowed through the router guard.
   */
  function personaCanRoute(persona: Persona, permission: string | undefined): boolean {
    if (!permission) return true; // public route
    if (persona.permissions === null) return true; // superadmin
    return persona.permissions.includes(permission);
  }

  return {
    personas: PERSONAS,
    activePersonaKey,
    activePersona,
    emulate,
    resetEmulation,
    personaCanRoute,
  };
}
