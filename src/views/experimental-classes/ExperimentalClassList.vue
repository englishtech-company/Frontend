<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import {
  listExperimentalClasses,
  deleteExperimentalClass,
} from "@/lib/experimentalClasses";
import { notifyRemoved } from "@/lib/actionNotification";
import { countActiveFilters } from "@/lib/filters/query";
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

const idFilter = ref("");
const interestedNameFilter = ref("");
const teacherNameFilter = ref("");
const dateClassFrom = ref("");
const dateClassTo = ref("");
const statusFilter = ref<string | number | null>(null);
const conversionFilter = ref<string | number | null>(null);

const statusOptions: SelectOption[] = [
  { value: "agendada", label: "Agendada" },
  { value: "realizada", label: "Realizada" },
  { value: "cancelada", label: "Cancelada" },
];

const conversionOptions: SelectOption[] = [
  { value: "true", label: "Sim" },
  { value: "false", label: "Não" },
];

const activeFilterCount = computed(() =>
  countActiveFilters([
    idFilter.value,
    interestedNameFilter.value,
    teacherNameFilter.value,
    dateClassFrom.value,
    dateClassTo.value,
    statusFilter.value,
    conversionFilter.value,
  ])
);

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
      id: idFilter.value.trim() ? Number(idFilter.value) : undefined,
      interestedName: interestedNameFilter.value.trim() || undefined,
      teacherName: teacherNameFilter.value.trim() || undefined,
      dateClassFrom: dateClassFrom.value || undefined,
      dateClassTo: dateClassTo.value || undefined,
      status_class: statusFilter.value ? String(statusFilter.value) : undefined,
      conversion:
        conversionFilter.value === "true"
          ? true
          : conversionFilter.value === "false"
            ? false
            : undefined,
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

function clearFilters() {
  idFilter.value = "";
  interestedNameFilter.value = "";
  teacherNameFilter.value = "";
  dateClassFrom.value = "";
  dateClassTo.value = "";
  statusFilter.value = null;
  conversionFilter.value = null;
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
    notifyRemoved("Aula experimental");
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

    <FilterPanel
      :active-count="activeFilterCount"
      @filter="handleSearch"
      @clear="clearFilters"
    >
      <div class="row g-3">
        <div class="col-md-6 col-lg-3">
          <FilterField label="#" id="experimental-class-filter-id" hint="ID da aula">
            <input
              id="experimental-class-filter-id"
              v-model="idFilter"
              type="number"
              min="1"
              class="form-control"
              placeholder="Ex.: 12"
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Interessado" id="experimental-class-filter-interested">
            <input
              id="experimental-class-filter-interested"
              v-model="interestedNameFilter"
              type="text"
              class="form-control"
              placeholder="Nome do interessado..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Professor" id="experimental-class-filter-teacher">
            <input
              id="experimental-class-filter-teacher"
              v-model="teacherNameFilter"
              type="text"
              class="form-control"
              placeholder="Nome do professor..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Data desde" id="experimental-class-filter-date-from">
            <input
              id="experimental-class-filter-date-from"
              v-model="dateClassFrom"
              type="date"
              class="form-control"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Data até" id="experimental-class-filter-date-to">
            <input
              id="experimental-class-filter-date-to"
              v-model="dateClassTo"
              type="date"
              class="form-control"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Status" id="experimental-class-filter-status">
            <SingleSelect
              id="experimental-class-filter-status"
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Todos os status"
              :searchable="false"
              aria-label="Filtrar por status da aula"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Conversão" id="experimental-class-filter-conversion">
            <SingleSelect
              id="experimental-class-filter-conversion"
              v-model="conversionFilter"
              :options="conversionOptions"
              placeholder="Todas"
              :searchable="false"
              aria-label="Filtrar por conversão"
            />
          </FilterField>
        </div>
      </div>
    </FilterPanel>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div
            class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"
          >
            <h4 class="card-title mb-0">
              Lista de aulas experimentais ({{ total }})
            </h4>

            <span v-if="!showActions" class="badge bg-light text-dark">
              Somente leitura
            </span>
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

<style scoped>
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
</style>
