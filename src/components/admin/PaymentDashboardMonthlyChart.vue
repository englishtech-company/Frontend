<script lang="ts" setup>
import { computed } from "vue";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from "chart.js";
import type {
  ChartData,
  ChartOptions,
} from "chart.js";
import { Bar } from "vue-chartjs";
import { useBodyThemeVersion } from "@/composables/useBodyThemeVersion";
import { formatCurrency } from "@/lib/finance/format";
import type {
  PaymentDashboardMonthlyRevenue,
} from "@/lib/paymentDashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
);

const props = withDefaults(
  defineProps<{
    months: PaymentDashboardMonthlyRevenue[];
    loading?: boolean;
  }>(),
  {
    loading: false,
  }
);

const emit = defineEmits<{
  selectPeriod: [year: number, month: number];
}>();

const { isDark } = useBodyThemeVersion();

const monthNames = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const countFormatter = new Intl.NumberFormat("pt-BR");

function periodLabel(
  month: PaymentDashboardMonthlyRevenue
): string {
  return `${monthNames[month.month - 1]} / ${month.year}`;
}

function selectMonth(index: number): void {
  const month = props.months[index];

  if (!month || props.loading) {
    return;
  }

  emit("selectPeriod", month.year, month.month);
}

const chartWidth = computed(
  () => `${Math.max(560, props.months.length * 48)}px`
);

const chartData = computed<ChartData<"bar">>(() => ({
  labels: props.months.map(periodLabel),
  datasets: [
    {
      label: "Receita recebida",
      // Conversão apenas para desenhar o gráfico, sem somar valores.
      data: props.months.map(
        (month) => Number(month.revenue_amount)
      ),
      backgroundColor: isDark.value ? "#bb96de" : "#600022",
      hoverBackgroundColor: isDark.value ? "#d1b5ed" : "#8b1e49",
      borderRadius: 4,
      maxBarThickness: 36,
    },
  ],
}));

const chartOptions = computed<ChartOptions<"bar">>(() => {
  const textColor = isDark.value ? "#d7d7df" : "#6c757d";
  const gridColor = isDark.value
    ? "rgba(255, 255, 255, 0.10)"
    : "rgba(0, 0, 0, 0.07)";

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    onClick: (_event, elements) => {
      const element = elements[0];

      if (element) {
        selectMonth(element.index);
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const month = props.months[context.dataIndex];

            return month
              ? `Receita: ${formatCurrency(month.revenue_amount)}`
              : "";
          },
          afterLabel: (context) => {
            const month = props.months[context.dataIndex];

            return month
              ? `Pagamentos: ${countFormatter.format(month.transactions_count)}`
              : "";
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: textColor,
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          maxTicksLimit: 6,
          callback: (value) => formatCurrency(Number(value)),
        },
      },
    },
  };
});
</script>

<template>
  <section
    class="card h-100 payment-monthly"
    :aria-busy="loading"
  >
    <div class="card-header payment-monthly__header">
      <h3 class="card-title">
        <i class="la la-chart-bar" aria-hidden="true"></i>
        Evolução do faturamento
      </h3>

      <span class="payment-monthly__caption">
        Recebimentos · horário de Fortaleza
      </span>
    </div>

    <div class="card-body payment-monthly__body">
      <p
        v-if="loading && months.length === 0"
        class="payment-monthly__empty text-muted"
        role="status"
      >
        Carregando evolução mensal…
      </p>

      <p
        v-else-if="months.length === 0"
        class="payment-monthly__empty text-muted"
      >
        Sem recebimentos para construir o histórico neste recorte.
      </p>

      <template v-else>
        <div class="payment-monthly__scroll">
          <div
            class="payment-monthly__canvas"
            :style="{ width: chartWidth }"
          >
            <Bar
              :data="chartData"
              :options="chartOptions"
              role="img"
              aria-label="Receita recebida por mês. Os valores também estão disponíveis na tabela acessível deste gráfico."
            />
          </div>
        </div>

        <div class="visually-hidden">
            <table class="table table-sm mb-0">
              <caption class="visually-hidden">
                Recebimentos mensais do período e plano selecionados.
              </caption>

              <thead>
                <tr>
                  <th scope="col">Mês</th>
                  <th scope="col" class="text-end">
                    Pagamentos
                  </th>
                  <th scope="col" class="text-end">
                    Receita recebida
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="month in months"
                  :key="month.period"
                >
                  <th scope="row">{{ periodLabel(month) }}</th>

                  <td class="text-end">
                    {{ countFormatter.format(month.transactions_count) }}
                  </td>

                  <td class="text-end">
                    {{ formatCurrency(month.revenue_amount) }}
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.payment-monthly {
  margin-bottom: 0;
}

.payment-monthly > .payment-monthly__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.375rem;
  margin: 0 0.875rem;
  padding: 0.625rem 0 0.5rem;
  border-bottom: 1px solid var(--border, #edf0f2);
}

.payment-monthly__header .card-title {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0;
  font-size: 0.9375rem !important;
  font-weight: 600;
  line-height: 1.4;
  text-transform: none;
}

.payment-monthly__header .card-title i {
  color: var(--primary, #600022);
  font-size: 1.125rem;
}

.payment-monthly__caption {
  color: var(--text-gray, #6c757d);
  font-size: 0.6875rem;
}

.payment-monthly > .payment-monthly__body {
  padding: 0.5rem 0.875rem 0.625rem;
}

.payment-monthly__scroll {
  overflow-x: auto;
}

.payment-monthly__canvas {
  position: relative;
  height: 210px;
  min-width: 100%;
}

.payment-monthly__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 210px;
  margin: 0;
  font-size: 0.8125rem;
  text-align: center;
}

</style>
