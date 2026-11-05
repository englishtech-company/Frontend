<script lang="ts" setup>
import { computed, nextTick, ref } from "vue";
import { RouterLink } from "vue-router";
import FinancialDashboardNavigation from "@/components/admin/FinancialDashboardNavigation.vue";
import RevenueDashboardSummaryCards from "@/components/admin/RevenueDashboardSummaryCards.vue";
import RevenueDashboardCharts from "@/components/admin/RevenueDashboardCharts.vue";
import RevenueDashboardHighlights from "@/components/admin/RevenueDashboardHighlights.vue";
import RevenueDashboardStudentsTable from "@/components/admin/RevenueDashboardStudentsTable.vue";
import { useRevenueDashboard } from "@/composables/useRevenueDashboard";
import { useAuthStore } from "@/stores/auth";
import { canViewRevenueDashboard } from "@/lib/permissions/access";
import { getFinancialDashboardNavigation } from "@/lib/financialDashboardNavigation";
import { formatDate } from "@/lib/finance/format";
import { formatDueTimestamp } from "@/lib/dueDashboardFormat";

const auth = useAuthStore();
const canView = computed(() => canViewRevenueDashboard(auth.hasPermission));
const canCreateStudents = computed(() => auth.hasPermission("students.create"));
const navigation = computed(() => getFinancialDashboardNavigation(auth.hasPermission));
const { summary, records, search, loading, accessError, refresh, retry, applySearch, goToPage, loadRecords } = useRevenueDashboard({ enabled: () => canView.value });
const data = computed(() => summary.data.value);
const tab = ref<"overview" | "students">("overview");
async function showStudents() {
  tab.value = "students";
  await nextTick();
  document.getElementById("revenue-student-search")?.focus();
}
</script>

<template>
  <div class="container-fluid revenue-dashboard">
    <header class="revenue-dashboard__header"><div><h1>Receita e LTV</h1><p>Alunos, contratos atuais e receita histórica recebida.</p></div><div v-if="canView" class="revenue-dashboard__actions"><button type="button" class="btn btn-sm btn-outline-primary" :disabled="loading" @click="retry">Atualizar</button><RouterLink to="/students" class="btn btn-sm btn-outline-primary">Gerenciar alunos</RouterLink><RouterLink v-if="canCreateStudents" to="/students/create" class="btn btn-sm btn-primary"><i class="la la-plus me-1" aria-hidden="true"></i>Novo aluno</RouterLink></div></header>
    <FinancialDashboardNavigation :items="navigation" />
    <div v-if="!canView" class="alert alert-warning" role="alert">Você não tem todas as permissões necessárias para consultar este painel: alunos, pagamentos, cobranças e matrículas.</div>
    <div v-else-if="accessError" class="alert alert-danger" role="alert">{{ accessError }}</div>
    <template v-else>
      <div v-if="summary.error.value" class="alert alert-danger" role="alert">Indicadores: {{ summary.error.value }} <span v-if="data">Exibindo a última consulta bem-sucedida.</span><button type="button" class="btn btn-sm btn-outline-danger ms-2" :disabled="loading" @click="refresh">Tentar novamente</button></div>
      <div class="revenue-dashboard__toolbar"><div class="nav nav-pills" role="tablist" aria-label="Seções de receita e LTV"><button id="revenue-overview-tab" type="button" role="tab" class="nav-link" :class="{ active: tab === 'overview' }" :aria-selected="tab === 'overview'" aria-controls="revenue-overview-panel" @click="tab = 'overview'">Visão geral</button><button id="revenue-students-tab" type="button" role="tab" class="nav-link" :class="{ active: tab === 'students' }" :aria-selected="tab === 'students'" aria-controls="revenue-students-panel" @click="tab = 'students'">Alunos</button></div><p>Contratos em {{ data ? formatDate(data.contract_reference_date) : '—' }} · LTV de todo o histórico recebido</p></div>
      <RevenueDashboardSummaryCards :summary="data" :loading="summary.loading.value" />
      <details v-if="data?.data_quality.warnings.length" class="revenue-dashboard__quality"><summary><i class="la la-info-circle me-1" aria-hidden="true"></i>Dados e critérios dos indicadores</summary><ul><li v-for="warning in data.data_quality.warnings" :key="warning">{{ warning }}</li><li v-if="data.data_quality.students_without_confirmation_date_count">{{ data.data_quality.students_without_confirmation_date_count }} aluno(s) com matrícula confirmada sem data de confirmação; não é possível posicioná-los no gráfico com segurança.</li><li v-if="data.data_quality.overlapping_schedules_ignored_count">{{ data.data_quality.overlapping_schedules_ignored_count }} agenda(s) sobreposta(s) ignorada(s) para evitar dupla contagem.</li></ul></details>
      <div v-if="tab === 'overview'" id="revenue-overview-panel" role="tabpanel" aria-labelledby="revenue-overview-tab"><RevenueDashboardCharts :summary="data" :loading="summary.loading.value" /><RevenueDashboardHighlights :summary="data" :loading="summary.loading.value" :can-view-students="canView" @students="showStudents" /><p v-if="records.error.value" class="alert alert-warning mt-3" role="alert">A lista de alunos não foi atualizada. Abra a aba Alunos para consultar o aviso e tentar novamente.</p></div>
      <div v-else id="revenue-students-panel" role="tabpanel" aria-labelledby="revenue-students-tab"><RevenueDashboardStudentsTable :result="records.data.value" :loading="records.loading.value" :error="records.error.value" :search="search" :can-view-students="canView" @search="applySearch" @page="goToPage" @retry="loadRecords" /></div>
      <footer class="revenue-dashboard__timestamps"><span>Indicadores: {{ formatDueTimestamp(data?.generated_at) }}</span><span>Alunos: {{ formatDueTimestamp(records.data.value?.generated_at) }}</span><span>Horário de Fortaleza · atualização a cada 30 s com a aba visível.</span></footer>
    </template>
  </div>
</template>

<style scoped>
.revenue-dashboard { min-width:0; }
.revenue-dashboard__header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:.75rem 1rem; margin-bottom:.875rem; }
.revenue-dashboard__header h1 { color:var(--primary); font-size:1.25rem; font-weight:700; margin:0; line-height:1.35; }
.revenue-dashboard__header p { color:var(--text-gray); font-size:.8125rem; margin:.25rem 0 0; }
.revenue-dashboard__actions { display:flex; gap:.5rem; flex-wrap:wrap; }
.revenue-dashboard__toolbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:.5rem; margin-bottom:.75rem; }
.revenue-dashboard__toolbar p { font-size:.6875rem; color:var(--text-gray); margin:0; }
.revenue-dashboard__toolbar .nav { gap:.25rem; }
.revenue-dashboard__toolbar .nav-link { font-size:.75rem; padding:.375rem .625rem; border:0; color:var(--primary); background:var(--rgba-primary-1); border-radius:5px; }
.revenue-dashboard__toolbar .nav-link.active { color:var(--primary-text-color,#fff); background:var(--primary); }
.revenue-dashboard :deep(.revenue-card) { height:auto; min-width:0; margin-bottom:0; }
.revenue-dashboard :deep(.revenue-card .card-header) { margin:0 .875rem; padding:.75rem 0; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:.5rem; }
.revenue-dashboard :deep(.revenue-card .card-title) { font-size:.9375rem !important; font-weight:600; text-transform:none; margin:0; }
.revenue-dashboard :deep(.revenue-card .card-title i) { color:var(--primary); }
.revenue-dashboard :deep(.revenue-card .card-body) { padding:.75rem .875rem; }
.revenue-dashboard :deep(.revenue-note) { font-size:.6875rem; color:var(--text-gray); margin-bottom:.625rem; }
.revenue-dashboard :deep(.filter-panel) { margin-bottom:.875rem; }
.revenue-dashboard :deep(.filter-panel .card-body) { padding:.75rem .875rem; }
.revenue-dashboard :deep(.filter-panel .form-control) { font-size:.8125rem; }
.revenue-dashboard__quality { padding:.5rem .75rem; border:1px solid var(--border); border-radius:5px; background:var(--card); color:var(--text-gray); font-size:.6875rem; margin-bottom:.875rem; }
.revenue-dashboard__quality summary { cursor:pointer; }
.revenue-dashboard__quality ul { margin:.5rem 0 0; padding-left:1.25rem; }
.revenue-dashboard__timestamps { display:flex; flex-wrap:wrap; gap:.25rem 1rem; margin:.75rem 0 .5rem; color:var(--text-gray); font-size:.6875rem; }
</style>
