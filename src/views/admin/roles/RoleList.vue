<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { deleteRole, isProtectedRole, listRoles } from "@/lib/roles";
import type { Role } from "@/lib/types";

const {
  canViewRoles,
  canCreateRoles,
  canUpdateRoles,
  canDeleteRoles,
} = usePermissions();

const roles = ref<Role[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const showActions = computed(() => canUpdateRoles.value || canDeleteRoles.value);

async function loadRoles() {
  if (!canViewRoles.value) {
    error.value = "Você não tem permissão para listar perfis.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listRoles({ page: page.value });
    roles.value = result.data.filter((role) => !isProtectedRole(role.name));
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar perfis";
  } finally {
    loading.value = false;
  }
}

async function removeRole(role: Role) {
  if (!confirm(`Remover o perfil "${role.name}"?`)) return;

  try {
    await deleteRole(role.id);
    await loadRoles();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao remover perfil";
  }
}

function goToPage(next: number) {
  if (next < 1 || next > lastPage.value) return;
  page.value = next;
  loadRoles();
}

onMounted(loadRoles);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Perfis</h4>
          <p class="mb-0">Gerencie perfis de acesso e permissões</p>
        </div>
      </div>
      <div
        v-if="canCreateRoles"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/roles/create" class="btn btn-primary">
          <i class="la la-plus me-1"></i> Novo perfil
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h4 class="card-title mb-0">Lista de perfis ({{ total }})</h4>
            <span v-if="!showActions" class="badge bg-light text-dark">Somente leitura</span>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">Carregando...</div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-responsive-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Guard</th>
                    <th v-if="showActions" class="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="roles.length === 0">
                    <td :colspan="showActions ? 4 : 3" class="text-center text-muted">
                      Nenhum perfil encontrado
                    </td>
                  </tr>
                  <tr v-for="role in roles" :key="role.id">
                    <td>{{ role.id }}</td>
                    <td>{{ role.name }}</td>
                    <td>{{ role.guard_name }}</td>
                    <td v-if="showActions" class="text-end">
                      <RouterLink
                        v-if="canUpdateRoles"
                        :to="`/roles/${role.id}/edit`"
                        class="btn btn-sm btn-primary me-1"
                      >
                        Editar
                      </RouterLink>
                      <button
                        v-if="canDeleteRoles"
                        type="button"
                        class="btn btn-sm btn-danger"
                        @click="removeRole(role)"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              v-if="lastPage > 1"
              class="d-flex justify-content-between align-items-center mt-3"
            >
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                :disabled="page <= 1"
                @click="goToPage(page - 1)"
              >
                Anterior
              </button>
              <span>Página {{ page }} de {{ lastPage }}</span>
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                :disabled="page >= lastPage"
                @click="goToPage(page + 1)"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
