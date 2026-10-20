<script lang="ts" setup>
import { computed } from "vue";
import { formatCurrency } from "@/lib/finance/format";
import type {
  PaymentDashboardSummary,
} from "@/lib/paymentDashboard";

const props = withDefaults(
  defineProps<{
    summary: PaymentDashboardSummary | null;
    loading?: boolean;
  }>(),
  {
    loading: false,
  }
);

const countFormatter = new Intl.NumberFormat("pt-BR");

const currentMonthLabel = computed(() => {
  const period = props.summary?.current_month.filters;

  if (!period) {
    return "Mês vigente";
  }

  return `${String(period.month).padStart(2, "0")}/${period.year}`;
});

const cards = computed(() => {
  const summary = props.summary;
  const unavailable = props.loading ? "Carregando…" : "—";

  return [
    {
      key: "revenue",
      label: "Receita total",
      value: summary
        ? formatCurrency(summary.totals.revenue_amount)
        : unavailable,
      subtitle: "Recebido no recorte selecionado",
      description: "Total recebido no período e plano selecionados, incluindo principal, multa e juros.",
      icon: "la la-chart-line",
      tone: "success",
    },
    {
      key: "transactions",
      label: "Total de transações",
      value: summary
        ? countFormatter.format(summary.totals.transactions_count)
        : unavailable,
      subtitle: "Pagamentos válidos, sem estornos",
      description: "Quantidade de pagamentos recebidos no recorte, não de contratos ou renovações.",
      icon: "la la-credit-card",
      tone: "info",
    },
    {
      key: "ticket",
      label: "Ticket médio",
      value: summary?.totals.average_ticket_amount != null
        ? formatCurrency(summary.totals.average_ticket_amount)
        : summary
          ? "—"
          : unavailable,
      subtitle: summary &&
        summary.totals.average_ticket_amount === null
        ? "Sem pagamentos para calcular"
        : "Média por recebimento",
      description: "Média por pagamento recebido no período e plano selecionados.",
      icon: "la la-money-bill",
      tone: "primary",
    },
    {
      key: "current-month",
      label: "Faturamento do mês atual",
      value: summary
        ? formatCurrency(
            summary.current_month.totals.revenue_amount
          )
        : unavailable,
      subtitle: `${currentMonthLabel.value} · filtro de plano`,
      description: "Usa sempre o mês vigente, independentemente do período selecionado, mantendo o filtro de plano.",
      icon: "la la-calendar",
      tone: "warning",
    },
  ];
});

const revenueComponents = computed(() => {
  const totals = props.summary?.totals;

  if (!totals) {
    return [];
  }

  return [
    {
      label: "Principal",
      value: totals.principal_amount,
      icon: "la la-wallet",
      tone: "principal",
    },
    {
      label: "Multa",
      value: totals.late_fee_amount,
      icon: "la la-file-invoice-dollar",
      tone: "fee",
    },
    {
      label: "Juros",
      value: totals.interest_amount,
      icon: "la la-percentage",
      tone: "interest",
    },
  ];
});
</script>

<template>
  <section
    class="payment-summary"
    aria-label="Indicadores de pagamentos"
    :aria-busy="loading"
  >
    <div class="payment-summary__grid">
      <article
        v-for="card in cards"
        :key="card.key"
        class="payment-summary__card"
      >
        <div class="payment-summary__heading">
          <h3
            class="payment-summary__label"
            :title="card.description"
          >
            {{ card.label }}
          </h3>

          <span
            class="payment-summary__icon"
            :class="`payment-summary__icon--${card.tone}`"
            aria-hidden="true"
          >
            <i :class="card.icon"></i>
          </span>
        </div>

        <p class="payment-summary__value">
          {{ card.value }}
        </p>

        <p
          class="payment-summary__subtitle"
          :title="card.description"
        >
          {{ card.subtitle }}
        </p>
      </article>
    </div>

    <div
      v-if="summary"
      class="payment-summary__composition"
      aria-label="Composição da receita recebida no recorte selecionado"
    >
      <strong class="payment-summary__composition-title">
        <i class="la la-layer-group" aria-hidden="true"></i>
        Composição da receita
      </strong>

      <dl class="payment-summary__components">
        <div
          v-for="component in revenueComponents"
          :key="component.label"
          class="payment-summary__component"
          :class="`payment-summary__component--${component.tone}`"
        >
          <dt>
            <i :class="component.icon" aria-hidden="true"></i>
            {{ component.label }}
          </dt>
          <dd>{{ formatCurrency(component.value) }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.payment-summary {
  margin-bottom: 0.875rem;
}

.payment-summary__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.payment-summary__card {
  min-width: 0;
  padding: 0.75rem 0.875rem;
  border: 1px solid var(--border, #edf0f2);
  border-radius: 5px;
  background: var(--card, #fff);
}

.payment-summary__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.payment-summary__label {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-gray, #6c757d);
}

.payment-summary__icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 5px;
  font-size: 1rem;
}

.payment-summary__icon--success {
  color: #198754;
  background: rgba(25, 135, 84, 0.1);
}

.payment-summary__icon--info {
  color: #2672c9;
  background: rgba(38, 114, 201, 0.1);
}

.payment-summary__icon--primary {
  color: var(--primary, #600022);
  background: color-mix(
    in srgb,
    var(--primary, #600022) 10%,
    transparent
  );
}

.payment-summary__icon--warning {
  color: #b87100;
  background: rgba(184, 113, 0, 0.1);
}

.payment-summary__value {
  margin: 0;
  font-size: clamp(1.25rem, 1.6vw, 1.625rem);
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: anywhere;
  color: var(--text-dark, #212529);
}

.payment-summary__subtitle {
  margin: 0.375rem 0 0;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--text-gray, #6c757d);
}

.payment-summary__composition {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  margin-top: 0.5rem;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--border, #edf0f2);
  border-radius: 5px;
  background: var(--card, #fff);
  font-size: 0.75rem;
}

.payment-summary__composition-title {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-gray, #6c757d);
  font-weight: 600;
}

.payment-summary__composition-title > i {
  color: var(--primary, #600022);
  font-size: 1rem;
}

.payment-summary__components {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem 0.5rem;
  margin: 0;
}

.payment-summary__components > div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3125rem 0.625rem;
  border: 1px solid var(--border, #edf0f2);
  border-radius: 5px;
  background: color-mix(in srgb, var(--primary, #600022) 3%, transparent);
}

.payment-summary__components dt {
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  margin: 0;
  font-size: inherit;
  font-weight: 400;
  color: var(--text-gray, #6c757d);
}

.payment-summary__components dt i {
  font-size: 0.9375rem;
}

.payment-summary__component--principal dt i {
  color: #198754;
}

.payment-summary__component--fee dt i {
  color: #b87100;
}

.payment-summary__component--interest dt i {
  color: var(--primary, #600022);
}

.payment-summary__components dd {
  margin: 0;
  font-size: inherit;
  font-weight: 600;
  color: var(--text-dark, #212529);
}

@media (max-width: 991px) {
  .payment-summary__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 479px) {
  .payment-summary__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
