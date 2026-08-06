<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDelete } from "@/lib/confirm";
import { deletePlan, listPlans } from "@/lib/plans";
import {
  countActiveVariants,
  formatCommitmentLabel,
  formatDurationLabel,
  formatPriceRange,
} from "@/lib/plans/format";
import type { Plan } from "@/lib/types";

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
const search = ref("");
const activeFilter = ref<boolean | "">("");

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
      search: search.value.trim() || undefined,
      active:
        activeFilter.value === ""
          ? undefined
          : activeFilter.value,
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

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div
            class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"
          >
            <h4 class="card-title mb-0">
              Lista de planos ({{ total }})
            </h4>

            <div class="d-flex align-items-center gap-2">
              <input
                v-model="search"
                type="text"
                class="form-control form-control-sm"
                placeholder="Buscar por nome..."
                aria-label="Buscar plano por nome"
                style="max-width: 200px;"
                @keyup.enter="handleSearch"
              />

              <select
                v-model="activeFilter"
                class="form-select form-select-sm"
                aria-label="Filtrar planos por status"
                style="max-width: 140px;"
                @change="handleSearch"
              >
                <option value="">Todos os status</option>
                <option :value="true">Ativo</option>
                <option :value="false">Inativo</option>
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
