<script lang="ts" setup>
import { computed } from "vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";
import type { ChartOptions } from "chart.js";
import type { DueDashboardSummary } from "@/lib/dueDashboard";
import { formatCurrency } from "@/lib/finance/format";
import { studentStatusLabel, paymentMethodLabel, workloadLabel, visualPercentage } from "@/lib/dueDashboardFormat";

ChartJS.register(ArcElement, Tooltip, Legend);
const props = defineProps<{ summary: DueDashboardSummary | null; loading: boolean }>();
const colors = ["#149f78", "#8953d9", "#377cf6", "#dc8d14", "#98a2b3"];
const statuses = computed(() => (props.summary?.students_by_status ?? []).filter((row) => row.students_count > 0));
const statusTotal = computed(() => statuses.value.reduce((total, row) => total + row.students_count, 0));
const chart = computed(() => ({
  labels: statuses.value.map((row) => studentStatusLabel(row.status)),
  datasets: [{ data: statuses.value.map((row) => row.students_count), backgroundColor: colors, borderWidth: 2, hoverOffset: 3 }],
}));
const chartOptions: ChartOptions<"doughnut"> = { responsive: true, maintainAspectRatio: false, cutout: "75%", plugins: { legend: { display: false } } };
const totalMrr = computed(() => props.summary?.contract_totals.mrr_amount ?? "0");
</script>

<template>
  <section class="due-distributions" aria-label="Distribuições dos contratos conhecidos" :aria-busy="loading">
    <article class="card">
      <div class="card-header"><h2 class="card-title"><i class="la la-chart-pie me-1" aria-hidden="true"></i>Alunos por status</h2></div>
      <div class="card-body">
        <p class="due-distributions__note">Alunos com ciclos vigentes conhecidos</p>
        <div v-if="loading && !summary" class="due-distributions__empty">Carregando distribuição…</div>
        <p v-else-if="!summary" class="due-distributions__empty">Distribuição indisponível.</p>
        <template v-else-if="statusTotal > 0">
          <div class="due-distributions__donut">
            <Doughnut :data="chart" :options="chartOptions" aria-label="Distribuição de alunos por status" />
            <div class="due-distributions__center" aria-hidden="true"><strong>{{ statusTotal }}</strong><span>aluno(s)</span></div>
          </div>
          <ul class="due-distributions__list">
            <li v-for="(row, index) in statuses" :key="row.status">
              <span><i class="due-distributions__dot" :style="{ background: colors[index % colors.length] }" aria-hidden="true"></i>{{ studentStatusLabel(row.status) }}</span>
              <strong>{{ row.students_count }}</strong>
            </li>
          </ul>
        </template>
        <p v-else class="due-distributions__empty">Nenhum ciclo vigente conhecido neste plano.</p>
      </div>
    </article>
    <article class="card">
      <div class="card-header"><h2 class="card-title"><i class="la la-chart-bar me-1" aria-hidden="true"></i>Contratos por plano</h2><span class="badge badge-primary light">MRR</span></div>
      <div class="card-body">
        <p class="due-distributions__note">Base contratual atual, não receita recebida</p>
        <p v-if="!summary" class="due-distributions__empty">{{ loading ? 'Carregando planos…' : 'Indicadores indisponíveis.' }}</p>
        <div v-for="(row, index) in summary?.contracts_by_plan ?? []" :key="row.plan_commitment" class="due-distributions__plan">
          <div class="due-distributions__plan-heading"><span>{{ row.label }}</span><strong>{{ formatCurrency(row.mrr_amount) }}</strong></div>
          <div class="progress" role="progressbar" :aria-label="`${row.label}: participação no MRR`" :aria-valuenow="visualPercentage(row.mrr_amount, totalMrr)" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar" :style="{ width: `${visualPercentage(row.mrr_amount, totalMrr)}%`, background: colors[index % colors.length] }"></div>
          </div>
          <p>{{ row.students_count }} aluno(s) · {{ row.contracts_count }} matrícula(s)</p>
        </div>
      </div>
    </article>
    <article class="card">
      <div class="card-header"><h2 class="card-title"><i class="la la-credit-card me-1" aria-hidden="true"></i>Formas de pagamento</h2></div>
      <div class="card-body">
        <p class="due-distributions__note">Meio contratado por matrícula ativa</p>
        <p v-if="!summary" class="due-distributions__empty">{{ loading ? 'Carregando meios…' : 'Meios de pagamento indisponíveis.' }}</p>
        <p v-else-if="!summary.contracts_by_payment_method.length" class="due-distributions__empty">Sem contratos elegíveis neste plano.</p>
        <ul v-else class="due-distributions__list">
          <li v-for="row in summary.contracts_by_payment_method" :key="row.payment_method ?? 'unknown'">
            <span>{{ paymentMethodLabel(row.payment_method) }}</span><span class="due-distributions__method-count"><strong>{{ row.contracts_count }}</strong><small>{{ row.percentage }}%</small></span>
          </li>
        </ul>
        <div class="due-distributions__workload">
          <h3>Carga horária dominante</h3>
          <p>{{ !summary ? 'Base indisponível' : summary.dominant_workloads.length ? summary.dominant_workloads.map(workloadLabel).join(' · ') : 'Sem base para calcular' }}</p>
          <ul class="due-distributions__list">
            <li v-for="row in summary?.contracts_by_workload ?? []" :key="row.hours_per_week ?? 'unknown'"><span>{{ workloadLabel(row.hours_per_week) }}</span><small>{{ row.contracts_count }} matrícula(s)</small></li>
          </ul>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
.due-distributions { display: grid; grid-template-columns: .9fr 1.15fr 1fr; gap: .875rem; margin-bottom: .875rem; }
.due-distributions .card { height: auto; margin: 0; min-width: 0; }
.due-distributions .card-header { margin: 0 .875rem; padding: .75rem 0; border-bottom: 1px solid var(--border); gap: .5rem; flex-wrap: wrap; }
.due-distributions .card-title { margin: 0; font-size: .9375rem !important; font-weight: 600; text-transform: none; }
.due-distributions .card-title i { color: var(--primary); }
.due-distributions .card-body { padding: .75rem .875rem; }
.due-distributions__note { color: var(--text-gray); font-size: .6875rem; margin: 0 0 .75rem; }
.due-distributions__donut { position: relative; width: 175px; height: 175px; margin: 0 auto .75rem; }
.due-distributions__center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
.due-distributions__center strong { font-size: 1.375rem; }
.due-distributions__center span { font-size: .6875rem; color: var(--text-gray); }
.due-distributions__list { list-style: none; margin: 0; padding: 0; }
.due-distributions__list li { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .375rem 0; font-size: .75rem; }
.due-distributions__dot { display: inline-block; width: .5rem; height: .5rem; margin-right: .375rem; border-radius: 50%; }
.due-distributions__plan { margin: 0 0 .875rem; }
.due-distributions__plan:last-child { margin-bottom: 0; }
.due-distributions__plan-heading { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .25rem .5rem; font-size: .75rem; }
.due-distributions__plan .progress { height: 5px; margin: .375rem 0; background: var(--rgba-primary-1, #f1f1f5); }
.due-distributions__plan p { margin: 0; color: var(--text-gray); font-size: .6875rem; }
.due-distributions__method-count { display: flex; align-items: center; gap: .5rem; }
.due-distributions__method-count small { color: var(--text-gray); }
.due-distributions__workload { margin-top: .875rem; padding-top: .75rem; border-top: 1px solid var(--border); }
.due-distributions__workload h3 { font-size: .75rem; color: var(--text-gray); margin-bottom: .375rem; }
.due-distributions__workload > p { font-size: .8125rem; font-weight: 600; margin-bottom: .375rem; }
.due-distributions__empty { display: grid; place-items: center; min-height: 150px; margin: 0; text-align: center; color: var(--text-gray); font-size: .8125rem; }
@media (max-width: 1199px) { .due-distributions { grid-template-columns: repeat(2, minmax(0, 1fr)); } .due-distributions > :last-child { grid-column: 1 / -1; } }
@media (max-width: 767px) { .due-distributions { grid-template-columns: minmax(0, 1fr); } }
</style>
