<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDelete } from "@/lib/confirm";
import { notifyRemoved } from "@/lib/actionNotification";
import { countActiveFilters } from "@/lib/filters/query";
import { deletePlan, listPlans } from "@/lib/plans";
import {
  COMMITMENT_OPTIONS,
  countActiveVariants,
  formatCommitmentLabel,
  formatDurationLabel,
  formatPriceRange,
} from "@/lib/plans/format";
import type { Plan, PlanCommitment } from "@/lib/types";

const {
  canViewPlans,
  canCreatePlans,
  canUpdatePlans,
  canDeletePlans,
} = usePermissions();

const plans = ref<Plan[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);
const idFilter = ref("");
const nameFilter = ref("");
const commitmentFilter = ref<string | number | null>(null);
const durationMonthsFilter = ref("");
const activeFilter = ref<string | number | null>(null);

const commitmentOptions: SelectOption[] = COMMITMENT_OPTIONS.map((option) => ({
  value: option.value,
  label: formatCommitmentLabel(option.value),
}));

const activeOptions: SelectOption[] = [
  { value: "true", label: "Ativo" },
  { value: "false", label: "Inativo" },
];

const activeFilterCount = computed(() =>
  countActiveFilters([
    idFilter.value,
    nameFilter.value,
    commitmentFilter.value,
    durationMonthsFilter.value,
    activeFilter.value,
  ])
);

const showActions = computed(
  () => canUpdatePlans.value || canDeletePlans.value
);

async function loadPlans() {
  if (!canViewPlans.value) {
    error.value = "Você não tem permissão para listar planos.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listPlans({
      page: page.value,
      id: idFilter.value.trim() ? Number(idFilter.value) : undefined,
      name: nameFilter.value.trim() || undefined,
      commitment: commitmentFilter.value
        ? (String(commitmentFilter.value) as PlanCommitment)
        : undefined,
      durationMonths: durationMonthsFilter.value.trim()
        ? Number(durationMonthsFilter.value)
        : undefined,
      active:
        activeFilter.value === "true"
          ? true
          : activeFilter.value === "false"
            ? false
            : undefined,
    });

    plans.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao carregar planos";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  page.value = 1;
  loadPlans();
}

function clearFilters() {
  idFilter.value = "";
  nameFilter.value = "";
  commitmentFilter.value = null;
  durationMonthsFilter.value = "";
  activeFilter.value = null;
  page.value = 1;
  loadPlans();
}

async function removePlan(plan: Plan) {
  if (!canDeletePlans.value) {
    error.value = "Você não tem permissão para excluir planos.";
    return;
  }

  const confirmed = await confirmDelete({
    entityLabel: "plano",
    itemName: plan.name,
    message: `Deseja remover "${plan.name}" e todas as variações? Esta ação não pode ser desfeita.`,
  });

  if (!confirmed) return;

  try {
    await deletePlan(plan.id);
    notifyRemoved("Plano");
    await loadPlans();
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao remover plano";
  }
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;

  page.value = nextPage;
  loadPlans();
}

function formatStatusBadge(active: boolean) {
  if (active) {
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

onMounted(loadPlans);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Planos</h4>
          <p class="mb-0">
            Gerencie os planos comerciais e variações de carga horária
          </p>
        </div>
      </div>

      <div
        v-if="canCreatePlans"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink
          to="/plans/create"
          class="btn btn-primary"
        >
          <i class="la la-plus me-1"></i>
          Novo plano
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
          <FilterField label="#" id="plan-filter-id" hint="ID do plano">
            <input
              id="plan-filter-id"
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
          <FilterField label="Plano" id="plan-filter-name">
            <input
              id="plan-filter-name"
              v-model="nameFilter"
              type="text"
              class="form-control"
              placeholder="Digite o nome..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Vínculo" id="plan-filter-commitment">
            <SingleSelect
              id="plan-filter-commitment"
              v-model="commitmentFilter"
              :options="commitmentOptions"
              placeholder="Todos os vínculos"
              :searchable="false"
              aria-label="Filtrar planos por vínculo"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Duração" id="plan-filter-duration" hint="Duração em meses">
            <input
              id="plan-filter-duration"
              v-model="durationMonthsFilter"
              type="number"
              min="1"
              class="form-control"
              placeholder="Ex.: 3"
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Status" id="plan-filter-active">
            <SingleSelect
              id="plan-filter-active"
              v-model="activeFilter"
              :options="activeOptions"
              placeholder="Todos os status"
              :searchable="false"
              aria-label="Filtrar planos por status"
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
              Lista de planos ({{ total }})
            </h4>

            <span
              v-if="!showActions"
              class="badge bg-light text-dark"
            >
              Somente leitura
            </span>
          </div>

          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              Carregando...
            </div>

            <div v-else class="table-responsive">
              <table class="table table-striped table-responsive-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th class="text-nowrap">Plano</th>
                    <th class="text-nowrap">Vínculo</th>
                    <th class="text-nowrap">Duração</th>
                    <th class="text-nowrap">Faixa de preço</th>
                    <th class="text-nowrap">Variações ativas</th>
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
                  <tr v-if="plans.length === 0">
                    <td
                      :colspan="showActions ? 8 : 7"
                      class="text-center text-muted"
                    >
                      Nenhum plano encontrado
                    </td>
                  </tr>

                  <tr
                    v-for="plan in plans"
                    :key="plan.id"
                  >
                    <td>{{ plan.id }}</td>

                    <td>
                      <strong>{{ plan.name }}</strong>
                    </td>

                    <td class="text-nowrap">
                      {{ formatCommitmentLabel(plan.commitment) }}
                    </td>

                    <td class="text-nowrap">
                      {{ formatDurationLabel(plan.duration_months) }}
                    </td>

                    <td class="text-nowrap">
                      {{ formatPriceRange(plan) }}
                    </td>

                    <td class="text-nowrap">
                      {{ countActiveVariants(plan) }}/3
                    </td>

                    <td class="text-nowrap">
                      <span
                        class="badge"
                        :class="formatStatusBadge(plan.active).class"
                      >
                        {{ formatStatusBadge(plan.active).label }}
                      </span>
                    </td>

                    <td
                      v-if="showActions"
                      class="text-end text-nowrap"
                    >
                      <RouterLink
                        v-if="canUpdatePlans"
                        :to="`/plans/${plan.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar ${plan.name}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>

                      <button
                        v-if="canDeletePlans"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir ${plan.name}`"
                        @click="removePlan(plan)"
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
