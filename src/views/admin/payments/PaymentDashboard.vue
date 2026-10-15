<script lang="ts" setup>
import {
  computed,
  ref,
  watch,
} from "vue";
import { RouterLink } from "vue-router";
import PaymentDashboardMonthlyChart from "@/components/admin/PaymentDashboardMonthlyChart.vue";
import PaymentDashboardPlanChart from "@/components/admin/PaymentDashboardPlanChart.vue";
import PaymentDashboardRecordsTable from "@/components/admin/PaymentDashboardRecordsTable.vue";
import PaymentDashboardSummaryCards from "@/components/admin/PaymentDashboardSummaryCards.vue";
import PaymentDashboardTopStudents from "@/components/admin/PaymentDashboardTopStudents.vue";
import FilterField from "@/components/ui/FilterField.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePaymentDashboard } from "@/composables/usePaymentDashboard";
import { usePermissions } from "@/composables/usePermissions";
import type {
  PaymentDashboardParams,
  PaymentDashboardPlanCommitment,
} from "@/lib/paymentDashboard";

const {
  canViewPayments,
  canCreatePayments,
} = usePermissions();

const {
  summary,
  records,
  filters,
  search,
  summaryLoading,
  recordsLoading,
  loading,
  summaryError,
  recordsError,
  lastSummaryUpdated,
  lastRecordsUpdated,
  refresh,
  applyFilters,
  applySearch,
  goToPage,
} = usePaymentDashboard({
  enabled: () => canViewPayments.value,
});

const yearFilter = ref<string | number | null>(null);
const monthFilter = ref<string | number | null>(null);
const planFilter = ref<string | number | null>(null);

const currentYear = Number(
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    timeZone: "America/Fortaleza",
  }).format(new Date())
);

const knownYears = ref<number[]>([
  currentYear,
  currentYear - 1,
  currentYear - 2,
]);

watch(summary, (value) => {
  if (!value) {
    return;
  }

  knownYears.value = [
    ...new Set([
      ...knownYears.value,
      ...value.monthly_revenue.map((month) => month.year),
    ]),
  ];
});

const yearOptions = computed<SelectOption[]>(
  () => [...knownYears.value]
    .sort((first, second) => second - first)
    .map((year) => ({
      value: year,
      label: String(year),
    }))
);

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const monthOptions: SelectOption[] = monthNames.map(
  (label, index) => ({
    value: index + 1,
    label,
  })
);

const planOptions: SelectOption[] = [
  { value: "monthly", label: "Mensal" },
  { value: "quarterly", label: "Trimestral" },
  { value: "semiannual", label: "Semestral" },
  { value: "other", label: "Outros" },
];

const appliedScope = computed(() => {
  const selected = filters.value;

  const year = selected.year
    ? String(selected.year)
    : "todos os anos";

  const month = selected.month
    ? monthNames[selected.month - 1]
    : "todos os meses";

  const plan = planOptions.find(
    (option) => option.value === selected.planCommitment
  )?.label ?? "todos os planos";

  return `${month} · ${year} · ${plan}`;
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "medium",
  timeZone: "America/Fortaleza",
});

function formatUpdatedAt(value: string | null): string {
  if (!value) {
    return "Ainda não atualizado";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Data indisponível"
    : dateFormatter.format(date);
}

function selectedCommitment(
  value: string | number | null
): PaymentDashboardPlanCommitment | null {
  if (
    value === "monthly" ||
    value === "quarterly" ||
    value === "semiannual" ||
    value === "other"
  ) {
    return value;
  }

  return null;
}

function syncFilterFields(params: PaymentDashboardParams): void {
  yearFilter.value = params.year ?? null;
  monthFilter.value = params.month ?? null;
  planFilter.value = params.planCommitment ?? null;
}

async function handleFilter(): Promise<void> {
  await applyFilters({
    year: yearFilter.value === null
      ? null
      : Number(yearFilter.value),
    month: monthFilter.value === null
      ? null
      : Number(monthFilter.value),
    planCommitment: selectedCommitment(planFilter.value),
  });
}

async function clearFilters(): Promise<void> {
  const nextFilters: PaymentDashboardParams = {
    year: null,
    month: null,
    planCommitment: null,
  };

  syncFilterFields(nextFilters);

  await applyFilters(nextFilters);
}

async function selectPeriod(
  year: number,
  month: number
): Promise<void> {
  const nextFilters = {
    ...filters.value,
    year,
    month,
  };

  syncFilterFields(nextFilters);

  await applyFilters(nextFilters);
}

async function selectPlan(
  planCommitment: PaymentDashboardPlanCommitment | null
): Promise<void> {
  const nextFilters = {
    ...filters.value,
    planCommitment,
  };

  syncFilterFields(nextFilters);

  await applyFilters(nextFilters);
}
</script>

<template>
  <div class="container-fluid payment-dashboard">
    <header class="payment-dashboard__header">
      <div class="payment-dashboard__intro">
        <div class="payment-dashboard__title-row">
          <h1>Dashboard de pagamentos</h1>

        </div>

        <p>Faturamento recebido, planos e histórico financeiro.</p>
      </div>

      <div
        v-if="canViewPayments"
        class="payment-dashboard__actions"
      >
        <button
          type="button"
          class="btn btn-sm btn-outline-primary"
          :disabled="loading"
          @click="refresh"
        >
          Atualizar
        </button>

        <RouterLink
          to="/payments"
          class="btn btn-sm btn-outline-primary"
        >
          Gerenciar pagamentos
        </RouterLink>

        <RouterLink
          v-if="canCreatePayments"
          to="/payments/create"
          class="btn btn-sm btn-primary"
        >
          <i class="la la-plus me-1" aria-hidden="true"></i>
          Novo pagamento
        </RouterLink>
      </div>
    </header>

    <div
      v-if="!canViewPayments"
      class="alert alert-warning"
      role="alert"
    >
      Você não tem permissão para consultar os pagamentos.
    </div>

    <template v-else>
      <section
        class="payment-dashboard__filters"
        aria-label="Filtros de período e plano"
      >
        <form
          class="payment-dashboard__filter-form"
          @submit.prevent="handleFilter"
        >
          <FilterField
            label="Ano"
            id="payment-dashboard-year"
          >
            <SingleSelect
              id="payment-dashboard-year"
              v-model="yearFilter"
              :options="yearOptions"
              placeholder="Todos os anos"
              aria-label="Filtrar pagamentos por ano"
            />
          </FilterField>

          <FilterField
            label="Mês"
            id="payment-dashboard-month"
          >
            <SingleSelect
              id="payment-dashboard-month"
              v-model="monthFilter"
              :options="monthOptions"
              placeholder="Todos os meses"
              :searchable="false"
              aria-label="Filtrar pagamentos por mês"
            />
          </FilterField>

          <FilterField
            label="Plano"
            id="payment-dashboard-plan"
          >
            <SingleSelect
              id="payment-dashboard-plan"
              v-model="planFilter"
              :options="planOptions"
              placeholder="Todos os planos"
              :searchable="false"
              aria-label="Filtrar pagamentos por plano"
            />
          </FilterField>

          <div class="payment-dashboard__filter-actions">
            <button
              type="submit"
              class="btn btn-sm btn-primary"
            >
              Filtrar
            </button>

            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              @click="clearFilters"
            >
              Limpar
            </button>
          </div>
        </form>

        <div class="payment-dashboard__filter-meta">
          <p>
            <strong>Recorte:</strong> {{ appliedScope }}.
          </p>

          <details class="payment-dashboard__help">
            <summary>Sobre filtros e atualização</summary>

            <div>
              <p>
                Período e plano afetam indicadores, gráficos,
                ranking e tabela. O faturamento do mês atual
                sempre usa o mês vigente, mantendo o plano.
              </p>

              <p>
                A busca dos registros afeta somente a tabela.
                A atualização automática ocorre a cada 30 segundos
                enquanto esta aba estiver visível e ao retornar a ela.
              </p>
            </div>
          </details>
        </div>
      </section>

      <div
        v-if="summaryError"
        class="alert alert-danger"
        role="alert"
      >
        <p class="mb-0">{{ summaryError }}</p>

        <p
          v-if="summary"
          class="small mt-2 mb-0"
        >
          Os indicadores abaixo são da última consulta
          bem-sucedida. Use “Atualizar” para tentar novamente.
        </p>
      </div>

      <template v-if="summary || !summaryError">
        <PaymentDashboardSummaryCards
          :summary="summary"
          :loading="summaryLoading"
        />

        <div class="row mb-3">
          <div class="col-lg-8 mb-3 mb-lg-0">
            <PaymentDashboardMonthlyChart
              :months="summary?.monthly_revenue ?? []"
              :loading="summaryLoading"
              @select-period="selectPeriod"
            />
          </div>

          <div class="col-lg-4">
            <PaymentDashboardPlanChart
              :categories="summary?.revenue_by_plan ?? []"
              :total-amount="summary?.totals.revenue_amount ?? null"
              :selected-plan="filters.planCommitment ?? null"
              :loading="summaryLoading"
              @select-plan="selectPlan"
            />
          </div>
        </div>

        <PaymentDashboardTopStudents
          :students="summary?.top_students ?? []"
          :loading="summaryLoading"
        />
      </template>

      <PaymentDashboardRecordsTable
        :result="records"
        :search="search"
        :loading="recordsLoading"
        :error="recordsError"
        @search="applySearch"
        @change-page="goToPage"
        @retry="refresh"
      />

      <footer class="payment-dashboard__timestamps">
        <span>
          Indicadores: {{ formatUpdatedAt(lastSummaryUpdated) }}
        </span>

        <span>
          Registros: {{ formatUpdatedAt(lastRecordsUpdated) }}
        </span>

        <span>Horário de Fortaleza.</span>
      </footer>
    </template>
  </div>
</template>

<style scoped>
.payment-dashboard.container-fluid {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.payment-dashboard__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  margin-bottom: 0.875rem;
}

.payment-dashboard__intro {
  min-width: 0;
}

.payment-dashboard__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
}

.payment-dashboard__title-row h1 {
  margin: 0;
  color: var(--primary, #600022);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.35;
}

.payment-dashboard__intro > p {
  margin: 0.25rem 0 0;
  color: var(--text-gray, #6c757d);
  font-size: 0.8125rem;
}

.payment-dashboard__actions,
.payment-dashboard__filter-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.payment-dashboard__actions .btn,
.payment-dashboard__filter-actions .btn {
  padding: 0.4375rem 0.75rem;
  line-height: 1.4;
}

.payment-dashboard__filters {
  margin-bottom: 0.875rem;
  padding: 0.75rem 0.875rem;
  border: 1px solid var(--border, #edf0f2);
  border-radius: 5px;
  background: var(--card, #fff);
}

.payment-dashboard__filter-form {
  display: grid;
  grid-template-columns: repeat(3, minmax(140px, 1fr)) auto;
  align-items: end;
  gap: 0.75rem;
}

.payment-dashboard__filters :deep(.form-label) {
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
}

.payment-dashboard__filters :deep(.single-select__trigger) {
  min-height: 2.125rem;
  padding: 0.375rem 0.625rem;
}

.payment-dashboard__filters :deep(.single-select__value) {
  font-size: 0.8125rem;
}

.payment-dashboard__filter-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.375rem 1rem;
  margin-top: 0.5rem;
  color: var(--text-gray, #6c757d);
  font-size: 0.75rem;
}

.payment-dashboard__filter-meta > p {
  margin: 0;
}

.payment-dashboard__help summary {
  cursor: pointer;
  color: var(--primary, #600022);
}

.payment-dashboard__help[open] {
  flex-basis: 100%;
}

.payment-dashboard__help > div {
  max-width: 900px;
  margin-top: 0.5rem;
  line-height: 1.5;
}

.payment-dashboard__help p {
  margin: 0 0 0.375rem;
}

.payment-dashboard__timestamps {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem 1rem;
  margin-bottom: 0.5rem;
  color: var(--text-gray, #6c757d);
  font-size: 0.75rem;
}

@media (max-width: 991px) {
  .payment-dashboard__filter-form {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 575px) {
  .payment-dashboard__filter-form {
    grid-template-columns: minmax(0, 1fr);
  }

  .payment-dashboard__actions {
    width: 100%;
  }
}
</style>
