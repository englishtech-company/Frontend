<script lang="ts" setup>
import { computed } from "vue";
import {
  ArcElement,
  Chart as ChartJS,
  Tooltip,
} from "chart.js";
import type {
  ChartData,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "vue-chartjs";
import { useBodyThemeVersion } from "@/composables/useBodyThemeVersion";
import { formatCurrency } from "@/lib/finance/format";
import type {
  PaymentDashboardPlanCommitment,
  PaymentDashboardPlanRevenue,
} from "@/lib/paymentDashboard";

ChartJS.register(ArcElement, Tooltip);

const props = withDefaults(
  defineProps<{
    categories: PaymentDashboardPlanRevenue[];
    totalAmount?: string | null;
    selectedPlan?: PaymentDashboardPlanCommitment | null;
    loading?: boolean;
  }>(),
  {
    totalAmount: null,
    selectedPlan: null,
    loading: false,
  }
);

const emit = defineEmits<{
  selectPlan: [
    commitment: PaymentDashboardPlanCommitment | null
  ];
}>();

const { isDark } = useBodyThemeVersion();

const colors: Record<
  PaymentDashboardPlanCommitment,
  string
> = {
  monthly: "#387de3",
  quarterly: "#149b72",
  semiannual: "#8b55d8",
  other: "#d88a12",
};

const percentageFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});

const countFormatter = new Intl.NumberFormat("pt-BR");

const hasRevenue = computed(
  () => props.categories.some(
    (category) => Number(category.revenue_amount) > 0
  )
);

function percentage(amount: string): string {
  const total = Number(props.totalAmount ?? "0");
  const value = Number(amount);

  if (
    !Number.isFinite(total) ||
    total <= 0 ||
    !Number.isFinite(value)
  ) {
    return percentageFormatter.format(0);
  }

  // Percentual apenas visual; o total monetário vem da API.
  return percentageFormatter.format(value / total);
}

function selectCategory(index: number): void {
  const category = props.categories[index];

  if (!category || props.loading) {
    return;
  }

  emit(
    "selectPlan",
    props.selectedPlan === category.plan_commitment
      ? null
      : category.plan_commitment
  );
}

function categoryDescription(
  category: PaymentDashboardPlanRevenue
): string {
  const action = props.selectedPlan === category.plan_commitment
    ? "Remover o filtro deste plano"
    : "Filtrar o painel por este plano";

  return `${category.label}: ${formatCurrency(category.revenue_amount)}, ${percentage(category.revenue_amount)}, ${countFormatter.format(category.transactions_count)} pagamentos. ${action}.`;
}

const chartData = computed<ChartData<"doughnut">>(() => ({
  labels: props.categories.map(
    (category) => category.label
  ),
  datasets: [
    {
      data: props.categories.map(
        (category) => Number(category.revenue_amount)
      ),
      backgroundColor: props.categories.map(
        (category) => colors[category.plan_commitment]
      ),
      borderColor: isDark.value ? "#24242f" : "#ffffff",
      borderWidth: 2,
      hoverOffset: 4,
    },
  ],
}));

const chartOptions = computed<ChartOptions<"doughnut">>(
  () => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    cutout: "72%",
    onClick: (_event, elements) => {
      const element = elements[0];

      if (element) {
        selectCategory(element.index);
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const category = props.categories[context.dataIndex];

            return category
              ? `${category.label}: ${formatCurrency(category.revenue_amount)} (${percentage(category.revenue_amount)})`
              : "";
          },
          afterLabel: (context) => {
            const category = props.categories[context.dataIndex];

            return category
              ? `Pagamentos: ${countFormatter.format(category.transactions_count)}`
              : "";
          },
        },
      },
    },
  })
);
</script>

<template>
  <section
    class="card h-100 payment-plans"
    :aria-busy="loading"
  >
    <div class="card-header payment-plans__header">
      <h3 class="card-title">
        <i class="la la-chart-pie" aria-hidden="true"></i>
        Planos de assinatura
      </h3>
      <span class="payment-plans__caption">Por receita</span>
    </div>

    <div class="card-body payment-plans__body">
      <p
        v-if="loading && categories.length === 0"
        class="payment-plans__empty text-muted"
        role="status"
      >
        Carregando distribuição…
      </p>

      <div
        v-else-if="hasRevenue"
        class="payment-plans__chart"
      >
        <Doughnut
          :data="chartData"
          :options="chartOptions"
          role="img"
          aria-label="Receita por plano. Consulte os valores e selecione os filtros na legenda abaixo."
        />

        <div class="payment-plans__center">
          <span>Total recebido</span>

          <strong>
            {{
              totalAmount !== null
                ? formatCurrency(totalAmount)
                : "—"
            }}
          </strong>
        </div>
      </div>

      <p
        v-else
        class="payment-plans__empty text-muted"
      >
        Sem receita recebida neste recorte.
      </p>

      <div
        v-if="categories.length > 0"
        class="payment-plans__legend"
        role="group"
        aria-label="Filtrar o painel por plano"
      >
        <button
          v-for="(category, index) in categories"
          :key="category.plan_commitment"
          type="button"
          class="payment-plans__item"
          :class="{
            'payment-plans__item--selected':
              selectedPlan === category.plan_commitment,
          }"
          :aria-label="categoryDescription(category)"
          :aria-pressed="selectedPlan === category.plan_commitment"
          :title="categoryDescription(category)"
          :disabled="loading"
          @click="selectCategory(index)"
        >
          <span class="payment-plans__name">
            <span
              class="payment-plans__dot"
              :style="{
                backgroundColor: colors[category.plan_commitment],
              }"
              aria-hidden="true"
            ></span>

            <span>{{ category.label }}</span>

            <small>
              {{ countFormatter.format(category.transactions_count) }} pg.
            </small>
          </span>

          <strong class="payment-plans__amount">
            {{ formatCurrency(category.revenue_amount) }}
          </strong>

          <span class="payment-plans__percentage">
            {{ percentage(category.revenue_amount) }}
          </span>
        </button>
      </div>

    </div>
  </section>
</template>

<style scoped>
.payment-plans {
  margin-bottom: 0;
}

.payment-plans > .payment-plans__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.375rem;
  margin: 0 0.875rem;
  padding: 0.625rem 0 0.5rem;
  border-bottom: 1px solid var(--border, #edf0f2);
}

.payment-plans__header .card-title {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0;
  font-size: 0.9375rem !important;
  font-weight: 600;
  line-height: 1.4;
  text-transform: none;
}

.payment-plans__header .card-title i {
  color: var(--primary, #600022);
  font-size: 1.125rem;
}

.payment-plans__caption {
  padding: 0.1875rem 0.5rem;
  border-radius: 4px;
  color: var(--primary, #600022);
  background: color-mix(in srgb, var(--primary, #600022) 8%, transparent);
  font-size: 0.6875rem;
  font-weight: 600;
}

.payment-plans > .payment-plans__body {
  padding: 0.5rem 0.875rem 0.625rem;
}

.payment-plans__chart {
  position: relative;
  width: 148px;
  max-width: 100%;
  height: 148px;
  margin: 0 auto 0.375rem;
}

.payment-plans__center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.125rem;
  pointer-events: none;
}

.payment-plans__center span {
  font-size: 0.625rem;
  color: var(--text-gray, #6c757d);
}

.payment-plans__center strong {
  font-size: 0.75rem;
  color: var(--text-dark, #212529);
}

.payment-plans__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 148px;
  margin-bottom: 0.375rem;
  font-size: 0.8125rem;
  text-align: center;
}

.payment-plans__legend {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.payment-plans__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 3rem;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  min-height: 1.875rem;
  padding: 0.25rem 0.375rem;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--text-dark, #212529);
  text-align: left;
}

.payment-plans__item:hover:not(:disabled),
.payment-plans__item--selected {
  border-color: var(--border, #edf0f2);
  background: color-mix(
    in srgb,
    var(--primary, #600022) 6%,
    transparent
  );
}

.payment-plans__item--selected {
  border-color: var(--primary, #600022);
}

.payment-plans__item:focus-visible {
  outline: 2px solid var(--primary, #600022);
  outline-offset: 1px;
}

.payment-plans__item:disabled {
  cursor: wait;
  opacity: 0.65;
}

.payment-plans__name {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.375rem;
  min-width: 0;
  font-size: 0.75rem;
}

.payment-plans__name small {
  color: var(--text-gray, #6c757d);
  font-size: 0.625rem;
}

.payment-plans__dot {
  flex-shrink: 0;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.payment-plans__amount {
  font-size: 0.75rem;
  text-align: right;
}

.payment-plans__percentage {
  color: var(--text-gray, #6c757d);
  font-size: 0.6875rem;
  text-align: right;
}

@media (max-width: 1199px) {
  .payment-plans__item {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .payment-plans__percentage {
    grid-column: 2;
  }
}
</style>
