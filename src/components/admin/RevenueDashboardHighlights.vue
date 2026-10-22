<script lang="ts" setup>
import { RouterLink } from "vue-router";
import type { RevenueDashboardSummary } from "@/lib/revenueDashboard";
import { revenueMoney, packageLabel } from "@/lib/revenueDashboardFormat";
import { studentStatusLabel, visualPercentage } from "@/lib/dueDashboardFormat";
defineProps<{ summary: RevenueDashboardSummary | null; loading: boolean; canViewStudents: boolean }>();
const emit = defineEmits<{ students: [] }>();
</script>

<template>
  <section class="revenue-highlights" aria-label="Ranking de LTV e pacotes contratados" :aria-busy="loading">
    <article class="card revenue-card">
      <div class="card-header"><h2 class="card-title"><i class="la la-award me-1" aria-hidden="true"></i>Top 6 alunos por LTV</h2><button type="button" class="btn btn-sm btn-outline-primary" @click="emit('students')">Ver todos</button></div>
      <div class="card-body"><p class="revenue-note">Receita histórica recebida, incluindo ex-alunos pagantes.</p>
        <p v-if="!summary" class="revenue-highlights__empty">{{ loading ? 'Carregando ranking…' : 'Ranking indisponível.' }}</p>
        <ol v-else-if="summary.top_students.length" class="revenue-highlights__ranking">
          <li v-for="row in summary.top_students" :key="row.student_id">
            <span class="revenue-highlights__rank">{{ row.position }}</span>
            <div class="revenue-highlights__person"><RouterLink v-if="canViewStudents && !row.archived" :to="`/students/${row.student_id}`">{{ row.student_name }}</RouterLink><strong v-else>{{ row.student_name }}</strong><small>{{ row.archived ? 'Arquivado' : studentStatusLabel(row.student_status) }} · {{ row.transactions_count }} pagamento(s)</small></div>
            <div class="revenue-highlights__amount"><strong>{{ revenueMoney(row.ltv_amount) }}</strong><small>MRR atual {{ revenueMoney(row.mrr_amount) }}</small></div>
          </li>
        </ol>
        <p v-else class="revenue-highlights__empty">Nenhum aluno com recebimentos válidos.</p>
      </div>
    </article>
    <article class="card revenue-card">
      <div class="card-header"><h2 class="card-title"><i class="la la-book-open me-1" aria-hidden="true"></i>MRR e alunos por pacote</h2><span class="badge badge-primary light">Base contratual</span></div>
      <div class="card-body"><p class="revenue-note">Valores mensais dos contratos atuais, não pagamentos recebidos.</p>
        <p v-if="!summary" class="revenue-highlights__empty">{{ loading ? 'Carregando pacotes…' : 'Pacotes indisponíveis.' }}</p>
        <div v-for="(row,index) in summary?.packages ?? []" :key="`${row.duration_months}-${row.hours_per_week}`" class="revenue-highlights__package">
          <div><span>{{ packageLabel(row) }}</span><strong>{{ revenueMoney(row.mrr_amount) }}</strong></div>
          <div class="progress" aria-hidden="true"><div class="progress-bar" :style="{ width: `${visualPercentage(row.mrr_amount, summary?.contract_totals.mrr_amount ?? '0')}%`, background: ['var(--primary)', '#149f78', '#8953d9', '#377cf6'][index % 4] }"></div></div>
          <small>{{ row.students_count }} aluno(s) · {{ row.contracts_count }} matrícula(s)</small>
        </div>
        <p v-if="summary && !summary.packages.length" class="revenue-highlights__empty">Nenhum ciclo contratual vigente conhecido.</p>
        <p v-if="summary?.packages.length" class="revenue-note mb-0 mt-2">Carga horária conforme o cadastro do pacote.</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.revenue-highlights { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.875rem; margin-top:.875rem; }
.revenue-highlights__ranking { list-style:none; padding:0; margin:0; }
.revenue-highlights__ranking li { display:flex; align-items:center; gap:.625rem; padding:.625rem 0; border-bottom:1px solid var(--border); }
.revenue-highlights__ranking li:last-child { border:0; padding-bottom:0; }
.revenue-highlights__rank { display:grid; place-items:center; width:1.5rem; height:1.5rem; flex:none; background:var(--rgba-primary-1); color:var(--primary); font-size:.75rem; border-radius:50%; font-weight:700; }
.revenue-highlights__person { flex:1; min-width:0; font-size:.75rem; }
.revenue-highlights__person a,.revenue-highlights__person strong { font-weight:600; color:var(--text-dark); overflow-wrap:anywhere; }
.revenue-highlights__person a:hover { color:var(--primary); }
.revenue-highlights__ranking small { display:block; color:var(--text-gray); font-size:.625rem; margin-top:.125rem; }
.revenue-highlights__amount { text-align:right; font-size:.75rem; font-variant-numeric:tabular-nums; }
.revenue-highlights__package { margin-top:.75rem; font-size:.75rem; }
.revenue-highlights__package > div:first-child { display:flex; justify-content:space-between; gap:.5rem; }
.revenue-highlights__package strong { white-space:nowrap; font-variant-numeric:tabular-nums; }
.revenue-highlights__package .progress { height:5px; background:var(--rgba-primary-1); margin:.375rem 0 .125rem; }
.revenue-highlights__package small { color:var(--text-gray); font-size:.625rem; }
.revenue-highlights__empty { margin:2rem 0; text-align:center; color:var(--text-gray); font-size:.8125rem; }
@media(max-width:991px) { .revenue-highlights { grid-template-columns:minmax(0,1fr); } }
@media(max-width:575px) { .revenue-highlights__ranking li { flex-wrap:wrap; } .revenue-highlights__amount { margin-left:2.125rem; text-align:left; } }
</style>
