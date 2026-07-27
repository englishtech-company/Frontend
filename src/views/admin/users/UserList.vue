<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { deleteUser, listUsers } from "@/lib/users";
import { formatUserRoleLabel } from "@/lib/roles";
import type { User } from "@/lib/types";

const {
  canViewUsers,
  canCreateUsers,
  canUpdateUsers,
  canDeleteUsers,
} = usePermissions();

const users = ref<User[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const showActions = computed(() => canUpdateUsers.value || canDeleteUsers.value);

async function loadUsers() {
  if (!canViewUsers.value) {
    error.value = "Você não tem permissão para listar usuários.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listUsers({ page: page.value });
    users.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar usuários";
  } finally {
    loading.value = false;
  }
}

async function removeUser(user: User) {
  if (!confirm(`Remover o usuário "${user.name}"?`)) return;

  try {
    await deleteUser(user.id);
    await loadUsers();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao remover usuário";
  }
}

function goToPage(next: number) {
  if (next < 1 || next > lastPage.value) return;
  page.value = next;
  loadUsers();
}

onMounted(loadUsers);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Usuários</h4>
          <p class="mb-0">Gerencie os usuários do sistema</p>
        </div>
      </div>
      <div
        v-if="canCreateUsers"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/users/create" class="btn btn-primary">
          <i class="la la-plus me-1"></i> Novo usuário
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h4 class="card-title mb-0">Lista de usuários ({{ total }})</h4>
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
                    <th>E-mail</th>
                    <th>Perfil</th>
                    <th>Criado em</th>
                    <th v-if="showActions" class="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="users.length === 0">
                    <td :colspan="showActions ? 6 : 5" class="text-center text-muted">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                      <span class="badge badge-primary light">{{ formatUserRoleLabel(user) }}</span>
                    </td>
                    <td>
                      {{
                        user.created_at
                          ? new Date(user.created_at).toLocaleDateString("pt-BR")
                          : "—"
                      }}
                    </td>
                    <td v-if="showActions" class="text-end">
                      <RouterLink
                        v-if="canUpdateUsers"
                        :to="`/users/${user.id}/edit`"
                        class="btn btn-sm btn-primary me-1"
                      >
                        Editar
                      </RouterLink>
                      <button
                        v-if="canDeleteUsers"
                        type="button"
                        class="btn btn-sm btn-danger"
                        @click="removeUser(user)"
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
