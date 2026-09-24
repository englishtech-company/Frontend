<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import { countActiveFilters } from "@/lib/filters/query";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDelete } from "@/lib/confirm";
import { notifyRemoved } from "@/lib/actionNotification";
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
const nameFilter = ref("");

const showActions = computed(() => canUpdateRoles.value || canDeleteRoles.value);

const activeFilterCount = computed(() => countActiveFilters([nameFilter.value]));

async function loadRoles() {
  if (!canViewRoles.value) {
    error.value = "Você não tem permissão para listar perfis.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listRoles({
      page: page.value,
      name: nameFilter.value.trim() || undefined,
    });
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
  const confirmed = await confirmDelete({
    entityLabel: "perfil",
    itemName: role.name,
  });

  if (!confirmed) return;

  try {
    await deleteRole(role.id);
    notifyRemoved("Perfil");
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

function handleSearch() {
  page.value = 1;
  loadRoles();
}

function clearFilters() {
  nameFilter.value = "";
  page.value = 1;
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
        <FilterPanel
          :active-count="activeFilterCount"
          @filter="handleSearch"
          @clear="clearFilters"
        >
          <div class="row g-3">
            <div class="col-md-6 col-lg-4">
              <FilterField label="Nome" id="role-filter-name">
                <input
                  id="role-filter-name"
                  v-model="nameFilter"
                  type="text"
                  class="form-control"
                  @keyup.enter="handleSearch"
                />
              </FilterField>
            </div>
          </div>
        </FilterPanel>
      </div>
    </div>

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
                    <td v-if="showActions" class="text-end text-nowrap">
                      <RouterLink
                        v-if="canUpdateRoles"
                        :to="`/roles/${role.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar ${role.name}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>
                      <button
                        v-if="canDeleteRoles"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir ${role.name}`"
                        @click="removeRole(role)"
                      >
                        <i class="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ListPagination
              :page="page"
              :last-page="lastPage"
              :total="total"
              @update:page="goToPage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
