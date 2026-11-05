<script lang="ts" setup>
import { computed } from "vue";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import type { ChartOptions } from "chart.js";
import { Doughnut, Line } from "vue-chartjs";
import { useBodyThemeVersion } from "@/composables/useBodyThemeVersion";
import { studentStatusLabel } from "@/lib/dueDashboardFormat";
import { enrollmentMonth } from "@/lib/revenueDashboardFormat";
import type { RevenueDashboardSummary } from "@/lib/revenueDashboard";

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
const props = defineProps<{ summary: RevenueDashboardSummary | null; loading: boolean }>();
const { isDark } = useBodyThemeVersion();
const text = computed(() => isDark.value ? "#c6c6d0" : "#737b8b");
const primary = computed(() => isDark.value ? "#9993f4" : "#660026");
const evolution = computed(() => props.summary?.enrollment_evolution ?? []);
const statuses = computed(() => (props.summary?.students_by_status ?? []).filter((row) => row.students_count > 0));
const color = (status: string) => ({ active: "#149f78", inactive: "#98a2b3", pending: "#dc8d14", paused: "#8953d9", suspended: "#e34d59", completed: "#377cf6" }[status] ?? "#737b8b");
const lineData = computed(() => ({ labels: evolution.value.map((row) => enrollmentMonth(row.period)), datasets: [{
  label: "Novos alunos", data: evolution.value.map((row) => row.new_students_count),
  borderColor: primary.value, backgroundColor: isDark.value ? "rgba(153,147,244,.12)" : "rgba(102,0,38,.08)",
  borderWidth: 2, fill: true, tension: .25, pointRadius: 3, pointHoverRadius: 5,
}] }));
const lineOptions = computed<ChartOptions<"line">>(() => ({ responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } }, scales: {
    x: { ticks: { color: text.value, maxTicksLimit: 12, maxRotation: 0 }, grid: { display: false } },
    y: { beginAtZero: true, ticks: { color: text.value, precision: 0 }, grid: { color: isDark.value ? "rgba(255,255,255,.09)" : "rgba(0,0,0,.06)" } },
  },
}));
const donutData = computed(() => ({ labels: statuses.value.map((row) => studentStatusLabel(row.status)), datasets: [{
  data: statuses.value.map((row) => row.students_count), backgroundColor: statuses.value.map((row) => color(row.status)),
  borderColor: isDark.value ? "#232334" : "#ffffff", borderWidth: 2, hoverOffset: 3,
}] }));
const donutOptions: ChartOptions<"doughnut"> = { responsive: true, maintainAspectRatio: false, cutout: "76%", plugins: { legend: { display: false } } };
</script>

<template>
  <section class="revenue-charts" aria-label="Evolução e status dos alunos" :aria-busy="loading">
    <article class="card revenue-card">
      <div class="card-header"><h2 class="card-title"><i class="la la-chart-line me-1" aria-hidden="true"></i>Evolução das matrículas</h2><span class="badge badge-primary light">Base histórica</span></div>
      <div class="card-body"><p class="revenue-note">Novos alunos pela primeira matrícula confirmada, sem contar renovações.</p>
        <div v-if="!summary" class="revenue-charts__empty">{{ loading ? 'Carregando evolução…' : 'Evolução indisponível.' }}</div>
        <template v-else-if="evolution.length">
          <div class="revenue-charts__line"><Line :data="lineData" :options="lineOptions" aria-label="Novos alunos por mês da primeira confirmação" role="img" /></div>
          <details class="revenue-charts__values"><summary>Consultar valores do gráfico</summary><div class="table-responsive"><table class="table table-sm"><caption class="visually-hidden">Primeiras matrículas confirmadas por mês</caption><thead><tr><th scope="col">Mês</th><th scope="col">Novos alunos</th></tr></thead><tbody><tr v-for="row in evolution" :key="row.period"><td>{{ enrollmentMonth(row.period) }}</td><td>{{ row.new_students_count }}</td></tr></tbody></table></div></details>
        </template>
        <p v-else class="revenue-charts__empty">Sem confirmações datadas para construir o histórico.</p>
      </div>
    </article>
    <article class="card revenue-card">
      <div class="card-header"><h2 class="card-title"><i class="la la-chart-pie me-1" aria-hidden="true"></i>Status dos alunos</h2></div>
      <div class="card-body"><p class="revenue-note">Cadastro atual, sem alunos arquivados.</p>
        <p v-if="!summary" class="revenue-charts__empty">{{ loading ? 'Carregando status…' : 'Distribuição indisponível.' }}</p>
        <template v-else-if="statuses.length">
          <div class="revenue-charts__donut"><Doughnut :data="donutData" :options="donutOptions" aria-label="Alunos por status cadastrado" role="img" /><div class="revenue-charts__center" aria-hidden="true"><strong>{{ summary.student_totals.students_count }}</strong><span>aluno(s)</span></div></div>
          <ul class="revenue-charts__legend"><li v-for="row in statuses" :key="row.status"><span><i :style="{ background: color(row.status) }" aria-hidden="true"></i>{{ studentStatusLabel(row.status) }}</span><b>{{ row.students_count }}</b></li></ul>
        </template>
        <p v-else class="revenue-charts__empty">Nenhum aluno na base atual.</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.revenue-charts { display:grid; grid-template-columns:minmax(0,2fr) minmax(0,1fr); gap:.875rem; }
.revenue-charts__line { height:220px; position:relative; min-width:0; }
.revenue-charts__donut { height:190px; max-width:215px; margin:0 auto .75rem; position:relative; }
.revenue-charts__center { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; flex-direction:column; pointer-events:none; }
.revenue-charts__center strong { color:var(--text-dark); font-size:1.375rem; }
.revenue-charts__center span { color:var(--text-gray); font-size:.6875rem; }
.revenue-charts__legend { list-style:none; margin:0; padding:0; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.5rem 1rem; font-size:.75rem; }
.revenue-charts__legend li { display:flex; justify-content:space-between; align-items:center; gap:.5rem; }
.revenue-charts__legend i { display:inline-block; height:8px; width:8px; border-radius:50%; margin-right:.375rem; }
.revenue-charts__empty { display:flex; align-items:center; justify-content:center; text-align:center; min-height:220px; margin:0; color:var(--text-gray); font-size:.8125rem; }
.revenue-charts__values { color:var(--text-gray); font-size:.6875rem; margin-top:.5rem; }
.revenue-charts__values summary { cursor:pointer; }
@media(max-width:991px) { .revenue-charts { grid-template-columns:minmax(0,1fr); } }
</style>
