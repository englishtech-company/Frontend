<template>
  <div class="auth-login" :class="{ 'auth-login--dark': isDark }">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-6 col-lg-7 col-md-8">
          <div class="card mb-0 h-auto login-card">
            <div class="card-body login-card-body">
              <div class="text-center mb-3">
                <RouterLink to="/page-login">
                  <img
                    :src="logoSrc"
                    :alt="appName"
                    class="login-logo"
                    width="280"
                    height="70"
                  />
                </RouterLink>
              </div>

              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <form @submit.prevent="submitHandler">
                <div class="form-group mb-3">
                  <label class="form-label" for="email">E-mail</label>
                  <input
                    id="email"
                    v-model.trim="email"
                    type="email"
                    class="form-control"
                    placeholder="Seu Email"
                    autocomplete="username"
                    required
                  />
                </div>
                <div class="mb-4 position-relative">
                  <label class="form-label" for="password">Senha</label>
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    placeholder="Senha"
                    autocomplete="current-password"
                    required
                  />
                  <span
                    :class="`show-pass eye ${showPassword ? 'active' : ''}`"
                    @click="showPassword = !showPassword"
                  >
                    <i class="fa fa-eye-slash"></i>
                    <i class="fa fa-eye"></i>
                  </span>
                </div>
                <div class="text-center">
                  <button
                    type="submit"
                    class="btn btn-primary btn-block"
                    :disabled="loading"
                  >
                    {{ loading ? "Entrando..." : "Entrar" }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const appName = import.meta.env.VITE_APP_NAME || "EnglishTech";
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const error = ref("");
const loading = ref(false);
const isDark = ref(false);

const logoSrc = computed(() =>
  isDark.value ? "/utils/logodark.png" : "/utils/logowhite.png"
);

const updateTheme = () => {
  isDark.value = document.body.getAttribute("data-theme-version") === "dark";
};

let observer: MutationObserver | null = null;

onMounted(() => {
  updateTheme();
  observer = new MutationObserver(updateTheme);
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-theme-version"],
  });
});

onUnmounted(() => {
  observer?.disconnect();
});

async function submitHandler() {
  error.value = "";
  loading.value = true;

  try {
    await auth.login(email.value, password.value);
    const redirect =
      typeof router.currentRoute.value.query.redirect === "string"
        ? router.currentRoute.value.query.redirect
        : "/";
    await router.push(redirect);
  } catch (err) {
    error.value =
      err instanceof Error && err.message === "unauthorized"
        ? "E-mail ou senha inválidos."
        : err instanceof Error
          ? err.message
          : "Não foi possível entrar.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background:
    radial-gradient(circle at top left, var(--rgba-primary-2), transparent 45%),
    radial-gradient(circle at bottom right, rgba(149, 150, 246, 0.18), transparent 40%),
    var(--body-bg);
}

.auth-login--dark {
  background:
    radial-gradient(circle at top left, rgba(149, 150, 246, 0.22), transparent 45%),
    radial-gradient(circle at bottom right, rgba(94, 95, 206, 0.16), transparent 40%),
    var(--body-bg);
}

.login-card {
  max-width: 560px;
  margin-inline: auto;
  border: 1px solid var(--border);
  box-shadow: 0 12px 40px var(--rgba-primary-1);
}

.login-card-body {
  padding: 1.5rem 2.5rem 1.75rem !important;
}

.login-logo {
  max-width: 280px;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.form-control:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 0.2rem var(--rgba-primary-2);
}
</style>
