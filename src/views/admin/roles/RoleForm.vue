<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import PermissionModulePicker from "@/components/admin/PermissionModulePicker.vue";
import { listPermissions } from "@/lib/permissions";
import { createRole, getRole, isProtectedRole, updateRole } from "@/lib/roles";
import type { Permission } from "@/lib/types";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => Boolean(route.params.id));
const roleId = computed(() => Number(route.params.id));

const name = ref("");
const guardName = ref("web");
const selectedPermissions = ref<string[]>([]);
const allPermissions = ref<Permission[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref("");

async function loadData() {
  loading.value = true;
  error.value = "";

  try {
    const permissionsResult = await listPermissions({ limit: 100 });
    allPermissions.value = permissionsResult.data;

    if (isEdit.value) {
      const role = await getRole(roleId.value);

      if (isProtectedRole(role.name)) {
        router.replace("/roles");
        return;
      }

      name.value = role.name;
      guardName.value = role.guard_name;
      selectedPermissions.value =
        role.relationships?.permissions?.map((p) => p.name) ?? [];
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar dados";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  saving.value = true;
  error.value = "";

  try {
    const payload = {
      name: name.value,
      guard_name: guardName.value,
      permissions: selectedPermissions.value,
    };

    if (isEdit.value) {
      await updateRole(roleId.value, payload);
    } else {
      await createRole(payload);
    }
    router.push("/roles");
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao salvar perfil";
  } finally {
    saving.value = false;
  }
}

onMounted(loadData);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>{{ isEdit ? "Editar perfil" : "Novo perfil" }}</h4>
          <p class="mb-0">Configure o nome e as permissões de acesso</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <RouterLink to="/roles" class="btn btn-outline-primary">Voltar</RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row">
      <div class="col-12">
        <div class="card role-form__card">
          <div class="card-body role-form__body">
            <div v-if="loading" class="text-center py-5">Carregando...</div>
            <form v-else @submit.prevent="submit">
              <div class="mb-4">
                <label class="form-label role-form__label" for="name">Nome do perfil</label>
                <input
                  id="name"
                  v-model.trim="name"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Ex.: coordenador, recepcionista..."
                  required
                />
              </div>

              <PermissionModulePicker
                v-model="selectedPermissions"
                :permissions="allPermissions"
              />

              <div class="role-form__actions">
                <RouterLink to="/roles" class="btn btn-light">Cancelar</RouterLink>
                <button type="submit" class="btn btn-primary" :disabled="saving">
                  {{ saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar perfil" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.role-form__card {
  width: 100%;
}

.role-form__body {
  padding: 1.75rem 2rem;
}

@media (max-width: 767px) {
  .role-form__body {
    padding: 1.25rem 1rem;
  }
}

.role-form__label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6c757d;
}

.role-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #edf0f2;
}
</style>
