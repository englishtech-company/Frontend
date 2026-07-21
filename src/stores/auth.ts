import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { api, getToken, setToken } from "@/lib/api";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
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

  async function login(email: string, password: string) {
    loading.value = true;

    try {
      const response = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: { email, password },
        auth: false,
      });

      token.value = response.token;
      user.value = response.user;
      setToken(response.token);

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
      user.value = response.user;
      return response.user;
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
    login,
    fetchMe,
    logout,
  };
});
