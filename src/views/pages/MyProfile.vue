<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import ProfileAvatar from "@/components/admin/ProfileAvatar.vue";
import { notify } from "@/lib/actionNotification";
import { updateProfile } from "@/lib/auth/profile";
import { normalizeAuthUser } from "@/lib/auth/normalizeUser";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const saving = ref(false);
const error = ref("");

const roles = computed(() => auth.user?.roles ?? []);
const isSuperadmin = computed(() => Boolean(auth.user?.is_superadmin));

function loadFromAuth() {
  if (!auth.user) return;
  name.value = auth.user.name;
  email.value = auth.user.email;
  password.value = "";
}

async function ensureUser() {
  loading.value = true;
  error.value = "";

  try {
    if (!auth.user) {
      await auth.fetchMe();
    }
    loadFromAuth();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar perfil";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  saving.value = true;
  error.value = "";

  try {
    const payload: {
      name: string;
      email: string;
      password?: string;
    } = {
      name: name.value.trim(),
      email: email.value.trim(),
    };

    if (password.value) {
      payload.password = password.value;
    }

    const updated = await updateProfile(payload);
    auth.user = normalizeAuthUser(updated);
    password.value = "";
    notify.success("Perfil atualizado com sucesso.");
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao salvar perfil";
  } finally {
    saving.value = false;
  }
}

onMounted(ensureUser);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Meu perfil</h4>
          <p class="mb-0">Gerencie seus dados de acesso</p>
        </div>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row">
      <div class="col-xl-4 col-lg-5 mb-4">
        <div class="card text-center h-100">
          <div class="card-body py-5">
            <div v-if="loading" class="text-muted py-4">Carregando...</div>
            <template v-else>
              <div class="mb-3">
                <ProfileAvatar :size="100" aria-label="Avatar do usuário" />
              </div>
              <h5 class="mb-1">{{ name || "—" }}</h5>
              <p class="text-muted mb-3">{{ email }}</p>
              <div v-if="roles.length" class="d-flex flex-wrap justify-content-center gap-2">
                <span
                  v-for="role in roles"
                  :key="role"
                  class="badge badge-primary light"
                >
                  {{ role }}
                </span>
              </div>
              <p v-if="isSuperadmin" class="text-muted small mt-3 mb-0">
                Acesso total ao sistema
              </p>
            </template>
          </div>
        </div>
      </div>

      <div class="col-xl-8 col-lg-7">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Dados da conta</h4>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">Carregando...</div>
            <form v-else @submit.prevent="submit">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label profile-form__label" for="profile-name">Nome</label>
                  <input
                    id="profile-name"
                    v-model.trim="name"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label profile-form__label" for="profile-email">E-mail</label>
                  <input
                    id="profile-email"
                    v-model.trim="email"
                    type="email"
                    class="form-control"
                    required
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-4">
                  <label class="form-label profile-form__label" for="profile-password">
                    Nova senha
                    <span class="text-muted">(opcional)</span>
                  </label>
                  <input
                    id="profile-password"
                    v-model="password"
                    type="password"
                    class="form-control"
                    autocomplete="new-password"
                    placeholder="Deixe em branco para manter"
                  />
                </div>
              </div>

              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? "Salvando..." : "Salvar alterações" }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-form__label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6c757d;
}
</style>
