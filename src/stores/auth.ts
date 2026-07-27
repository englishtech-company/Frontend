import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { normalizeAuthUser } from "@/lib/auth/normalizeUser";
import { api, getToken, setToken } from "@/lib/api";
import type { PermissionName } from "@/lib/permissions/access";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
  is_superadmin?: boolean;
};

type LoginResponse = {
  action: string;
  status: number;
  msg: string;
  token: string;
  token_type: string;
  user: AuthUser;
};

type MeResponse = {
  user: AuthUser;
};

export const useAuthStore = defineStore("auth", () => {
  const user = ref<AuthUser | null>(null);
  const token = ref<string | null>(getToken());
  const loading = ref(false);
  const bootstrapped = ref(false);

  const isAuthenticated = computed(() => Boolean(token.value));
  const isSuperadmin = computed(() => Boolean(user.value?.is_superadmin));
  const permissions = computed(() => user.value?.permissions ?? []);

  function hasPermission(permission: PermissionName | string): boolean {
    if (isSuperadmin.value) return true;
    return permissions.value.includes(permission);
  }

  function hasAnyPermission(required: Array<PermissionName | string>): boolean {
    if (isSuperadmin.value) return true;
    return required.some((permission) => permissions.value.includes(permission));
  }

  async function login(email: string, password: string) {
    loading.value = true;

    try {
      const response = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: { email, password },
        auth: false,
      });

      token.value = response.token;
      setToken(response.token);
      await fetchMe();

      return response;
    } finally {
      loading.value = false;
    }
  }

  async function fetchMe() {
    if (!token.value) {
      user.value = null;
      bootstrapped.value = true;
      return null;
    }

    try {
      const response = await api<MeResponse>("/auth/me");
      user.value = normalizeAuthUser(response.user);
      return user.value;
    } catch {
      token.value = null;
      user.value = null;
      setToken(null);
      return null;
    } finally {
      bootstrapped.value = true;
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await api("/auth/logout", { method: "POST" });
      }
    } catch {
      // ignore network errors on logout
    } finally {
      token.value = null;
      user.value = null;
      setToken(null);
    }
  }

  return {
    user,
    token,
    loading,
    bootstrapped,
    isAuthenticated,
    isSuperadmin,
    permissions,
    hasPermission,
    hasAnyPermission,
    login,
    fetchMe,
    logout,
  };
});
