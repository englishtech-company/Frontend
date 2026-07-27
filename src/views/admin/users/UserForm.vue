<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { SUPERADMIN_ROLE, getRoleOptions, getUserRoles } from "@/lib/roles";
import { createUser, getUser, updateUser } from "@/lib/users";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => Boolean(route.params.id));
const userId = computed(() => Number(route.params.id));

const name = ref("");
const email = ref("");
const password = ref("");
const selectedRole = ref("");
const roleOptions = ref<SelectOption[]>([]);
const isSuperadminUser = ref(false);
const loading = ref(false);
const saving = ref(false);
const error = ref("");

async function loadForm() {
  loading.value = true;
  error.value = "";

  try {
    roleOptions.value = (await getRoleOptions()).map((role) => ({
      value: role.name,
      label: role.name,
    }));

    if (!isEdit.value) return;

    const user = await getUser(userId.value);
    name.value = user.name;
    email.value = user.email;

    const roles = getUserRoles(user);
    isSuperadminUser.value = roles.some((role) => role.name === SUPERADMIN_ROLE);
    selectedRole.value = roles[0]?.name ?? "";
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar usuário";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!selectedRole.value && !isSuperadminUser.value) {
    error.value = "Selecione um perfil para o usuário.";
    return;
  }

  saving.value = true;
  error.value = "";

  try {
    if (isEdit.value) {
      const payload: {
        name: string;
        email: string;
        password?: string;
        roles?: string[];
      } = {
        name: name.value,
        email: email.value,
      };
      if (password.value) payload.password = password.value;
      if (!isSuperadminUser.value) payload.roles = [selectedRole.value];
      await updateUser(userId.value, payload);
    } else {
      await createUser({
        name: name.value,
        email: email.value,
        password: password.value,
        roles: [selectedRole.value],
      });
    }
    router.push("/users");
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao salvar usuário";
  } finally {
    saving.value = false;
  }
}

onMounted(loadForm);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>{{ isEdit ? "Editar usuário" : "Novo usuário" }}</h4>
          <p class="mb-0">Defina os dados de acesso e o perfil do usuário</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <RouterLink to="/users" class="btn btn-outline-primary">Voltar</RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">Carregando...</div>
            <form v-else @submit.prevent="submit">
              <div class="row">
                <div class="col-lg-6 mb-3">
                  <label class="form-label user-form__label" for="name">Nome</label>
                  <input
                    id="name"
                    v-model.trim="name"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col-lg-6 mb-3">
                  <label class="form-label user-form__label" for="email">E-mail</label>
                  <input
                    id="email"
                    v-model.trim="email"
                    type="email"
                    class="form-control"
                    required
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-lg-6 mb-3">
                  <SingleSelect
                    id="role"
                    v-model="selectedRole"
                    label="Perfil"
                    :options="roleOptions"
                    placeholder="Selecione um perfil"
                    :disabled="isSuperadminUser"
                    :required="!isSuperadminUser"
                    :hint="
                      isSuperadminUser
                        ? 'Usuários superadmin mantêm acesso total e não podem ter o perfil alterado.'
                        : undefined
                    "
                  />
                </div>
                <div class="col-lg-6 mb-4">
                  <label class="form-label user-form__label" for="password">
                    Senha
                    <span v-if="isEdit" class="text-muted">(deixe em branco para manter)</span>
                  </label>
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    class="form-control"
                    :required="!isEdit"
                    autocomplete="new-password"
                  />
                </div>
              </div>

              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? "Salvando..." : "Salvar" }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-form__label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6c757d;
}
</style>
