<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import {
  listExperimentalClasses,
  deleteExperimentalClass,
} from "@/lib/experimentalClasses";
import type { ExperimentalClass } from "@/lib/types";

const {
  canViewExperimentalClasses,
  canCreateExperimentalClasses,
  canUpdateExperimentalClasses,
  canDeleteExperimentalClasses,
} = usePermissions();

const experimentalClasses = ref<ExperimentalClass[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const statusFilter = ref("");

const showActions = computed(
  () => canUpdateExperimentalClasses.value || canDeleteExperimentalClasses.value
);

async function loadList() {
  if (!canViewExperimentalClasses.value) {
    error.value = "Você não tem permissão para listar aulas experimentais.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listExperimentalClasses({
      page: page.value,
      status_class: statusFilter.value || undefined,
    });

    experimentalClasses.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar aulas experimentais";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  page.value = 1;
  loadList();
}

async function removeExperimentalClass(item: ExperimentalClass) {
  if (!canDeleteExperimentalClasses.value) {
    error.value = "Você não tem permissão para excluir aulas experimentais.";
    return;
  }

  const confirmed = confirm(`Remover a aula experimental #${item.id}?`);
  if (!confirmed) return;

  try {
    await deleteExperimentalClass(item.id);
    await loadList();
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao remover aula experimental";
  }
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;
  page.value = nextPage;
  loadList();
}

function formatDate(value: string | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR");
}

function formatStatus(status: string): { label: string; cls: string } {
  const map: Record<string, { label: string; cls: string }> = {
    agendada: { label: "Agendada", cls: "badge-warning" },
    realizada: { label: "Realizada", cls: "badge-success" },
    cancelada: { label: "Cancelada", cls: "badge-danger" },
  };
  return (
    map[status?.toLowerCase()] ?? { label: status, cls: "badge-secondary" }
  );
}

onMounted(loadList);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Aulas Experimentais</h4>
          <p class="mb-0">Gerencie as aulas experimentais agendadas e realizadas</p>
        </div>
      </div>

      <div
        v-if="canCreateExperimentalClasses"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/experimental-classes/create" class="btn btn-primary">
          <i class="la la-plus me-1"></i>
          Nova aula experimental
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div
            class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"
          >
            <h4 class="card-title mb-0">
              Lista de aulas experimentais ({{ total }})
            </h4>

            <div class="exp-filters">
              <select
                v-model="statusFilter"
                class="form-select form-select-sm"
                aria-label="Filtrar por status da aula"
                @change="handleSearch"
              >
                <option value="">Todos os status</option>
                <option value="agendada">Agendada</option>
                <option value="realizada">Realizada</option>
                <option value="cancelada">Cancelada</option>
              </select>

              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                @click="handleSearch"
              >
                Filtrar
              </button>

              <span v-if="!showActions" class="badge bg-light text-dark">
                Somente leitura
              </span>
            </div>
          </div>

          <div class="card-body">
            <div v-if="loading" class="text-center py-4">Carregando...</div>

            <div v-else class="table-responsive">
              <table class="table table-striped table-responsive-sm exp-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th class="text-nowrap">Interessado</th>
                    <th class="text-nowrap">Professor</th>
                    <th class="text-nowrap">Data</th>
                    <th class="text-nowrap">Status</th>
                    <th class="text-nowrap">Conversão</th>
                    <th v-if="showActions" class="text-end text-nowrap">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-if="experimentalClasses.length === 0">
                    <td
                      :colspan="showActions ? 7 : 6"
                      class="text-center text-muted"
                    >
                      Nenhuma aula experimental encontrada
                    </td>
                  </tr>

                  <tr v-for="item in experimentalClasses" :key="item.id">
                    <td>{{ item.id }}</td>

                    <td class="text-nowrap">
                      <strong>
                        {{
                          item.relationships?.interested?.name ??
                          item.interested?.name ??
                          `Lead #${item.interested_id}`
                        }}
                      </strong>
                    </td>

                    <td class="text-nowrap">
                      {{
                        item.relationships?.teacher?.name ??
                        item.teacher?.name ??
                        "—"
                      }}
                    </td>

                    <td class="text-nowrap">{{ formatDate(item.date_class) }}</td>

                    <td class="text-nowrap">
                      <span
                        class="badge"
                        :class="formatStatus(item.status_class).cls"
                      >
                        {{ formatStatus(item.status_class).label }}
                      </span>
                    </td>

                    <td class="text-nowrap">
                      <i
                        :class="
                          item.conversao
                            ? 'la la-check-circle text-success'
                            : 'la la-times-circle text-muted'
                        "
                        :aria-label="item.conversao ? 'Sim' : 'Não'"
                      ></i>
                    </td>

                    <td v-if="showActions" class="text-end text-nowrap">
                      <RouterLink
                        v-if="canUpdateExperimentalClasses"
                        :to="`/experimental-classes/${item.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar aula experimental #${item.id}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>

                      <button
                        v-if="canDeleteExperimentalClasses"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir aula experimental #${item.id}`"
                        @click="removeExperimentalClass(item)"
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

<style scoped>
.exp-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.exp-filters .form-select {
  width: 160px;
}

.exp-table {
  font-size: 0.88rem;
}

.exp-table th,
.exp-table td {
  padding-right: 0.65rem;
  padding-left: 0.65rem;
  vertical-align: middle;
}

.exp-table th {
  font-size: 0.9rem;
}

.exp-table .badge {
  font-size: 0.72rem;
}

@media (max-width: 767.98px) {
  .exp-filters {
    width: 100%;
  }

  .exp-filters .form-select,
  .exp-filters .btn {
    width: 100%;
  }
}
</style>
