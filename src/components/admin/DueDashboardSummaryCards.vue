<script lang="ts" setup>
import { computed } from "vue";
import { formatCurrency, formatDate } from "@/lib/finance/format";
import type { DueDashboardSummary } from "@/lib/dueDashboard";

const props = defineProps<{ summary: DueDashboardSummary | null; loading: boolean }>();
const count = new Intl.NumberFormat("pt-BR");
const cards = computed(() => {
  const data = props.summary;
  const empty = props.loading ? "Carregando…" : "—";
  return [
    { key: "overdue", title: "Cobranças em atraso", icon: "la la-exclamation-circle", tone: "danger",
      value: data ? count.format(data.debt_totals.overdue.charges_count) : empty,
      detail: data ? `${count.format(data.overdue_students_count)} aluno(s) · ${formatCurrency(data.debt_totals.overdue.total_due_amount)}` : "Saldo com multa e juros",
      hint: "Cobranças com saldo e vencimento anterior à referência selecionada." },
    { key: "soon", title: "Vencem em até 3 dias", icon: "la la-clock", tone: "warning",
      value: data ? count.format(data.debt_totals.due_soon.charges_count) : empty,
      detail: data ? `${formatCurrency(data.debt_totals.due_soon.total_due_amount)} a receber` : "Inclui o dia da referência",
      hint: "Da referência até três dias depois, inclusive. Não inclui as já atrasadas." },
    { key: "mrr", title: "MRR dos contratos", icon: "la la-dollar-sign", tone: "success",
      value: data ? formatCurrency(data.contract_totals.mrr_amount) : empty,
      detail: data ? `${count.format(data.contract_totals.students_count)} aluno(s) · ${count.format(data.contract_totals.contracts_count)} matrícula(s)` : "Mensal equivalente contratado",
      hint: "Mensal equivalente dos ciclos atuais conhecidos, com desconto. Não é receita recebida; pausa/suspensão por matrícula ainda não é registrada." },
    { key: "volume", title: "Volume contratado", icon: "la la-chart-line", tone: "primary",
      value: data ? formatCurrency(data.contract_totals.contracted_volume_amount) : empty,
      detail: data ? `Ciclos atuais em ${formatDate(data.contract_reference_date)}` : "Valor integral do ciclo atual",
      hint: "Valor completo dos ciclos atuais, incluindo a parte paga, sem acumular renovações anteriores." },
  ];
});
</script>

<template>
  <section class="due-summary" aria-label="Indicadores de vencimentos e contratos" :aria-busy="loading">
    <article v-for="card in cards" :key="card.key" class="card due-summary__card" :class="`due-summary__card--${card.tone}`">
      <div class="card-body">
        <div class="due-summary__heading">
          <h2 :title="card.hint">{{ card.title }}</h2>
          <span class="due-summary__icon" :class="`text-${card.tone}`"><i :class="card.icon" aria-hidden="true"></i></span>
        </div>
        <p class="due-summary__value">{{ card.value }}</p>
        <p class="due-summary__detail">{{ card.detail }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.due-summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .75rem; margin-bottom: .875rem; }
.due-summary__card { height: auto; margin: 0; border: 1px solid var(--border); box-shadow: none; }
.due-summary__card .card-body { padding: .875rem; min-width: 0; }
.due-summary__card--danger { border-top: 2px solid var(--danger, #f72b50); }
.due-summary__card--warning { border-top: 2px solid var(--warning, #ffa755); }
.due-summary__heading { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
.due-summary__heading h2 { margin: 0; color: var(--text-gray); font-size: .8125rem; font-weight: 600; }
.due-summary__icon { display: grid; place-items: center; width: 1.75rem; height: 1.75rem; border-radius: 5px; background: var(--rgba-primary-1, rgba(96,0,34,.07)); flex-shrink: 0; }
.due-summary__value { margin: .375rem 0 .125rem; font-size: clamp(1.25rem, 1.8vw, 1.75rem); line-height: 1.3; font-weight: 700; color: var(--text-dark, #343434); overflow-wrap: anywhere; }
.due-summary__detail { margin: 0; font-size: .75rem; color: var(--text-gray); }
@media (max-width: 1199px) { .due-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 575px) { .due-summary { grid-template-columns: minmax(0, 1fr); } }
</style>
