<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDelete } from "@/lib/confirm";
import { deleteGroupClass, listGroupClasses } from "@/lib/groupClasses";
import type { GroupClass, GroupClassStatus } from "@/lib/types";

const {
  canViewGroupClasses,
  canCreateGroupClasses,
  canUpdateGroupClasses,
  canDeleteGroupClasses,
} = usePermissions();

const groupClasses = ref<GroupClass[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);
const search = ref("");
const statusFilter = ref<GroupClassStatus | "">("");

const showActions = computed(
  () => canViewGroupClasses.value || canUpdateGroupClasses.value || canDeleteGroupClasses.value
);

async function loadGroupClasses() {
  if (!canViewGroupClasses.value) {
    error.value = "Você não tem permissão para listar turmas.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listGroupClasses({
      page: page.value,
      search: search.value.trim() || undefined,
      status: statusFilter.value || undefined,
    });

    groupClasses.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao carregar turmas";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  page.value = 1;
  loadGroupClasses();
}

async function removeGroupClass(groupClass: GroupClass) {
  if (!canDeleteGroupClasses.value) {
    error.value = "Você não tem permissão para excluir turmas.";
    return;
  }

  const confirmed = await confirmDelete({
    entityLabel: "turma",
    itemName: groupClass.name,
  });

  if (!confirmed) return;

  try {
    await deleteGroupClass(groupClass.id);
    await loadGroupClasses();
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao remover turma";
  }
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;

  page.value = nextPage;
  loadGroupClasses();
}

function formatStatusBadge(status: GroupClassStatus) {
  if (status === "active") {
    return {
      label: "Ativo",
      class: "badge-success",
    };
  }

  return {
    label: "Inativo",
    class: "badge-secondary",
  };
}

onMounted(() => {
  loadGroupClasses();
});
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Turmas</h4>
          <p class="mb-0">
            Gerencie as turmas cadastradas no sistema
          </p>
        </div>
      </div>

      <div
        v-if="canCreateGroupClasses"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink
          to="/group-classes/create"
          class="btn btn-primary"
        >
          <i class="la la-plus me-1"></i>
          Nova turma
        </RouterLink>
      </div>
    </div>

    <div
      v-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div
            class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"
          >
            <h4 class="card-title mb-0">
              Lista de turmas ({{ total }})
            </h4>

            <div class="d-flex align-items-center gap-2">
              <input
                v-model="search"
                type="text"
                class="form-control form-control-sm"
                placeholder="Buscar por nome..."
                aria-label="Buscar turma por nome"
                style="max-width: 200px;"
                @keyup.enter="handleSearch"
              />

              <select
                v-model="statusFilter"
                class="form-select form-select-sm"
                aria-label="Filtrar turmas por status"
                style="max-width: 140px;"
                @change="handleSearch"
              >
                <option value="">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>

              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                @click="handleSearch"
              >
                Filtrar
              </button>

              <span
                v-if="!showActions"
                class="badge bg-light text-dark"
              >
                Somente leitura
              </span>
            </div>
          </div>

          <div class="card-body">
            <div
              v-if="loading"
              class="text-center py-4"
            >
              Carregando...
            </div>

            <div
              v-else
              class="table-responsive"
            >
              <table class="table table-striped table-responsive-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th class="text-nowrap">Nome</th>
                    <th class="text-nowrap">Professor</th>
                    <th class="text-nowrap">Plano</th>
                    <th class="text-nowrap">Horário</th>
                    <th class="text-nowrap">Nível</th>
                    <th class="text-nowrap">Alunos Máx</th>
                    <th class="text-nowrap">Status</th>
                    <th
                      v-if="showActions"
                      class="text-end text-nowrap"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-if="groupClasses.length === 0">
                    <td
                      :colspan="showActions ? 9 : 8"
                      class="text-center text-muted"
                    >
                      Nenhuma turma encontrada
                    </td>
                  </tr>

                  <tr
                    v-for="groupClass in groupClasses"
                    :key="groupClass.id"
                  >
                    <td>{{ groupClass.id }}</td>

                    <td class="text-nowrap">
                      <strong>{{ groupClass.name }}</strong>
                    </td>

                    <td class="text-nowrap">
                      {{ groupClass.relationships?.teacher?.name ?? "—" }}
                    </td>

                    <td class="text-nowrap">
                      {{ groupClass.relationships?.plan?.name ?? "—" }}
                    </td>

                    <td class="text-nowrap">
                      {{ groupClass.schedule || "—" }}
                    </td>

                    <td class="text-nowrap">
                      {{ groupClass.level || "—" }}
                    </td>

                    <td class="text-nowrap">
                      {{ groupClass.max_students || "—" }}
                    </td>

                    <td class="text-nowrap">
                      <span
                        class="badge"
                        :class="formatStatusBadge(groupClass.status).class"
                      >
                        {{ formatStatusBadge(groupClass.status).label }}
                      </span>
                    </td>

                    <td
                      v-if="showActions"
                      class="text-end text-nowrap"
                    >
                      <RouterLink
                        v-if="canUpdateGroupClasses"
                        :to="`/group-classes/${groupClass.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar ${groupClass.name}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>

                      <button
                        v-if="canDeleteGroupClasses"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir ${groupClass.name}`"
                        @click="removeGroupClass(groupClass)"
                      >
                        <i class="fa fa-trash"></i>
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

              <span>
                Página {{ page }} de {{ lastPage }}
              </span>

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
