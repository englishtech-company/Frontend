<script lang="ts" setup>
import type { RevenueDashboardSummary } from "@/lib/revenueDashboard";
import { revenueMoney, revenuePercentage } from "@/lib/revenueDashboardFormat";
defineProps<{ summary: RevenueDashboardSummary | null; loading: boolean }>();
</script>

<template>
  <section class="revenue-cards" aria-label="Indicadores de alunos, contratos e receita histórica" :aria-busy="loading">
    <article class="card"><div class="revenue-cards__label">Total de alunos<i class="la la-users" aria-hidden="true"></i></div><strong>{{ summary?.student_totals.students_count ?? '—' }}</strong><p>Cadastros atuais, sem arquivados</p></article>
    <article class="card"><div class="revenue-cards__label">Alunos ativos<i class="la la-user-check" aria-hidden="true"></i></div><strong>{{ summary?.student_totals.active_students_count ?? '—' }}</strong><p>{{ revenuePercentage(summary?.student_totals.active_percentage) }} da base atual</p></article>
    <article class="card"><div class="revenue-cards__label">MRR dos contratos<i class="la la-chart-line" aria-hidden="true"></i></div><strong>{{ revenueMoney(summary?.contract_totals.mrr_amount) }}</strong><p>{{ summary?.contract_totals.contracts_count ?? '—' }} matrícula(s) · média {{ revenueMoney(summary?.contract_totals.average_monthly_contract_amount) }}/contrato</p></article>
    <article class="card"><div class="revenue-cards__label">LTV total recebido<i class="la la-award" aria-hidden="true"></i></div><strong>{{ revenueMoney(summary?.ltv_totals.revenue_amount) }}</strong><p>{{ summary?.ltv_totals.paying_students_count ?? '—' }} aluno(s) pagante(s) · média {{ revenueMoney(summary?.ltv_totals.average_ltv_amount) }}</p></article>
    <div class="revenue-cards__composition">
      <span><i class="la la-layer-group me-1" aria-hidden="true"></i>Receita histórica recebida</span>
      <span>Principal <b>{{ revenueMoney(summary?.ltv_totals.principal_amount) }}</b></span><span>Multa <b>{{ revenueMoney(summary?.ltv_totals.late_fee_amount) }}</b></span><span>Juros <b>{{ revenueMoney(summary?.ltv_totals.interest_amount) }}</b></span>
    </div>
  </section>
</template>

<style scoped>
.revenue-cards { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: .75rem; margin-bottom: .875rem; }
.revenue-cards .card { height: auto; min-width: 0; margin: 0; padding: .75rem .875rem; border: 1px solid var(--border); }
.revenue-cards__label { display: flex; align-items: center; justify-content: space-between; gap: .5rem; color: var(--text-gray); font-size: .75rem; font-weight: 600; }
.revenue-cards__label i { background: var(--rgba-primary-1); color: var(--primary); border-radius: 5px; padding: .375rem; font-size: 1rem; }
.revenue-cards strong { font-size: clamp(1.1rem,1.8vw,1.65rem); line-height: 1.35; color: var(--text-dark); font-weight: 700; margin: .375rem 0; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.revenue-cards p { margin: 0; font-size: .6875rem; color: var(--text-gray); }
.revenue-cards__composition { grid-column: 1/-1; display: flex; align-items: center; flex-wrap: wrap; gap: .375rem 1rem; background: var(--card); border: 1px solid var(--border); border-radius: 5px; padding: .625rem .875rem; font-size: .75rem; color: var(--text-gray); }
.revenue-cards__composition > span:first-child { font-weight: 600; }
.revenue-cards__composition i { color: var(--primary); }
.revenue-cards__composition b { color: var(--text-dark); margin-left: .25rem; }
@media(max-width:1199px) { .revenue-cards { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media(max-width:575px) { .revenue-cards { grid-template-columns:minmax(0,1fr); } }
</style>
