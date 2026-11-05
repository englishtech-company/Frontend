<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import AppDatePicker from "@/components/ui/AppDatePicker.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import FilterField from "@/components/ui/FilterField.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import FinancialDashboardNavigation from "@/components/admin/FinancialDashboardNavigation.vue";
import DueDashboardSummaryCards from "@/components/admin/DueDashboardSummaryCards.vue";
import DueDashboardDistributions from "@/components/admin/DueDashboardDistributions.vue";
import DueDashboardRecordsTable from "@/components/admin/DueDashboardRecordsTable.vue";
import { useDueDashboard } from "@/composables/useDueDashboard";
import { usePermissions } from "@/composables/usePermissions";
import { useAuthStore } from "@/stores/auth";
import { getFinancialDashboardNavigation } from "@/lib/financialDashboardNavigation";
import { dueStatusLabels, planCommitmentLabels, formatDueTimestamp } from "@/lib/dueDashboardFormat";
import { formatDate } from "@/lib/finance/format";
import type { DueDashboardParams } from "@/lib/dueDashboard";
import type { SelectOption } from "@/components/ui/select.types";

const { canViewCharges, canCreateStudents, canViewEnrollments } = usePermissions();
const auth = useAuthStore();
const navigation = computed(() => getFinancialDashboardNavigation(auth.hasPermission));
const { summary, charges, renewals, filters, today, loading, accessError, referenceNotice, refresh, retry, applyFilters } = useDueDashboard({ enabled: () => canViewCharges.value });
const data = computed(() => summary.data.value);
const referenceDraft = ref<string | null>(null);
const planDraft = ref<string | number | null>(null);
const statusDraft = ref<string | number | null>(null);
const filterError = ref("");
const planOptions: SelectOption[] = Object.entries(planCommitmentLabels).map(([value, label]) => ({ value, label }));
const statusOptions: SelectOption[] = Object.entries(dueStatusLabels).map(([value, label]) => ({ value, label }));
const filterCount = computed(() => [filters.value.referenceDate, filters.value.planCommitment, filters.value.dueStatus].filter(Boolean).length);
const referenceLabel = computed(() => formatDate(data.value?.filters.reference_date ?? filters.value.referenceDate ?? today.value));
const contractLabel = computed(() => formatDate(data.value?.contract_reference_date ?? today.value));
const appliedPlan = computed(() => filters.value.planCommitment ? planCommitmentLabels[filters.value.planCommitment] : "Todos os planos");
const appliedStatus = computed(() => filters.value.dueStatus ? dueStatusLabels[filters.value.dueStatus] : "Todas as situações");
const isProjection = computed(() => (data.value?.filters.reference_date ?? filters.value.referenceDate ?? today.value) > (data.value?.contract_reference_date ?? today.value));

watch(filters, (value) => {
  referenceDraft.value = value.referenceDate ?? null;
  planDraft.value = value.planCommitment ?? null;
  statusDraft.value = value.dueStatus ?? null;
}, { deep: true });

async function filter() {
  filterError.value = "";
  if (referenceDraft.value && referenceDraft.value < today.value) {
    filterError.value = "Escolha hoje ou uma data futura como referência.";
    return;
  }
  await applyFilters({
    referenceDate: referenceDraft.value,
    planCommitment: planOptions.some((option) => option.value === planDraft.value) ? planDraft.value as DueDashboardParams["planCommitment"] : null,
    dueStatus: statusOptions.some((option) => option.value === statusDraft.value) ? statusDraft.value as DueDashboardParams["dueStatus"] : null,
  });
}
async function clearFilters() {
  filterError.value = "";
  await applyFilters({ referenceDate: null, planCommitment: null, dueStatus: null });
}
async function useToday() { referenceDraft.value = null; await filter(); }
</script>

<template>
  <div class="container-fluid due-dashboard">
    <header class="due-dashboard__header">
      <div><h1>Vencimentos e renovações</h1><p>Saldos a receber, contratos e próximos prazos.</p></div>
      <div v-if="canViewCharges" class="due-dashboard__actions">
        <button type="button" class="btn btn-sm btn-outline-primary" :disabled="loading" @click="retry">Atualizar</button>
        <RouterLink to="/charges" class="btn btn-sm btn-outline-primary">Gerenciar cobranças</RouterLink>
        <RouterLink v-if="canCreateStudents" to="/students/create" class="btn btn-sm btn-primary"><i class="la la-plus me-1" aria-hidden="true"></i>Novo aluno</RouterLink>
      </div>
    </header>
    <div v-if="!canViewCharges" class="alert alert-warning" role="alert">Você não tem permissão para consultar cobranças e vencimentos.</div>
    <template v-else>
      <FinancialDashboardNavigation :items="navigation" />
      <div v-if="accessError" class="alert alert-danger" role="alert">{{ accessError }}</div>
      <div v-if="summary.error.value" class="alert alert-danger" role="alert">Indicadores: {{ summary.error.value }} <span v-if="data">Os valores exibidos são da última consulta bem-sucedida.</span><button type="button" class="btn btn-sm btn-outline-danger ms-2" :disabled="loading" @click="refresh">Tentar novamente</button></div>
      <div v-if="referenceNotice" class="alert alert-info py-2" role="status">{{ referenceNotice }}</div>
      <FilterPanel title="Referência e filtros" :default-open="true" :active-count="filterCount" @filter="filter" @clear="clearFilters">
        <form class="due-dashboard__filters" @submit.prevent="filter">
          <FilterField id="due-reference-input" label="Data de referência">
            <div class="due-dashboard__reference"><AppDatePicker id="due-reference" v-model="referenceDraft" :min="today" placeholder="Hoje" /><button type="button" class="btn btn-sm btn-outline-primary" @click="useToday">Hoje</button></div>
          </FilterField>
          <FilterField id="due-plan" label="Plano"><SingleSelect id="due-plan" v-model="planDraft" :options="planOptions" :searchable="false" placeholder="Todos os planos" /></FilterField>
          <FilterField id="due-status" label="Situação da cobrança"><SingleSelect id="due-status" v-model="statusDraft" :options="statusOptions" :searchable="false" placeholder="Todas as situações" /></FilterField>
          <button type="submit" class="visually-hidden" tabindex="-1">Aplicar filtros</button>
        </form>
        <p v-if="filterError" class="text-danger small mt-2 mb-0" role="alert">{{ filterError }}</p>
        <p class="due-dashboard__scope">Dívidas em <strong>{{ referenceLabel }}</strong> · {{ appliedPlan }} · {{ appliedStatus }}.</p>
      </FilterPanel>
      <p class="due-dashboard__contract-scope"><i class="la la-info-circle me-1" aria-hidden="true"></i>Contratos existentes em <strong>{{ contractLabel }}</strong>. {{ isProjection ? 'A data futura projeta prazos e encargos, sem presumir pagamentos ou renovações.' : 'O filtro de situação afeta somente as dívidas, não o MRR e o volume contratado.' }}</p>
      <DueDashboardSummaryCards :summary="data" :loading="summary.loading.value" />
      <details v-if="data?.data_quality.warnings.length" class="due-dashboard__quality">
        <summary><i class="la la-exclamation-circle me-1" aria-hidden="true"></i>Base contratual parcial: pausa e suspensão por matrícula ainda não registradas.</summary>
        <ul><li v-for="warning in data.data_quality.warnings" :key="warning">{{ warning }}</li><li v-if="data.data_quality.overlapping_schedules_ignored_count">{{ data.data_quality.overlapping_schedules_ignored_count }} agenda(s) sobreposta(s) ignorada(s) para evitar dupla contagem.</li></ul>
      </details>
      <DueDashboardDistributions :summary="data" :loading="summary.loading.value" />
      <DueDashboardRecordsTable kind="charges" :result="charges.data.value" :loading="charges.loading.value" :error="charges.error.value" :search="charges.search.value" :can-view-enrollments="canViewEnrollments" @search="charges.applySearch" @page="charges.goToPage" @retry="charges.load" />
      <DueDashboardRecordsTable kind="renewals" :result="renewals.data.value" :loading="renewals.loading.value" :error="renewals.error.value" :search="renewals.search.value" :can-view-enrollments="canViewEnrollments" @search="renewals.applySearch" @page="renewals.goToPage" @retry="renewals.load" />
      <footer class="due-dashboard__timestamps">
        <span>Indicadores: {{ formatDueTimestamp(data?.generated_at) }}</span><span>Cobranças: {{ formatDueTimestamp(charges.data.value?.generated_at) }}</span><span>Renovações: {{ formatDueTimestamp(renewals.data.value?.generated_at) }}</span><span>Horário de Fortaleza · atualização a cada 30 s com a aba visível.</span>
      </footer>
    </template>
  </div>
</template>

<style scoped>
.due-dashboard { min-width: 0; }
.due-dashboard__header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .75rem 1rem; margin-bottom: .875rem; }
.due-dashboard__header h1 { font-size: 1.25rem; color: var(--primary); font-weight: 700; line-height: 1.35; margin: 0; }
.due-dashboard__header p { color: var(--text-gray); font-size: .8125rem; margin: .25rem 0 0; }
.due-dashboard__actions { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.due-dashboard__filters { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .75rem; }
.due-dashboard__reference { display: flex; gap: .5rem; align-items: center; }
.due-dashboard__reference > :first-child { flex: 1; min-width: 0; }
.due-dashboard__scope, .due-dashboard__contract-scope { margin: .5rem 0 0; color: var(--text-gray); font-size: .75rem; }
.due-dashboard__contract-scope { margin: 0 0 .75rem; }
.due-dashboard :deep(.filter-panel) { margin-bottom: .625rem; }
.due-dashboard :deep(.filter-panel .card-body) { padding: .75rem .875rem; }
.due-dashboard :deep(.filter-panel .content-title) { padding: .5rem .875rem; }
.due-dashboard :deep(.filter-panel .filter-panel__actions) { margin-top: .625rem !important; }
.due-dashboard :deep(.form-label) { margin-bottom: .25rem; font-size: .75rem; }
.due-dashboard :deep(.single-select__trigger), .due-dashboard :deep(.app-date-picker__input) { min-height: 2.25rem; font-size: .8125rem; }
.due-dashboard :deep(.app-date-picker__input) { color: var(--text-dark); background: var(--card); border-color: var(--border); }
.due-dashboard :deep(.app-date-picker__popup), .due-dashboard :deep(.app-date-picker__nav-btn) { background: var(--card); border-color: var(--border); }
.due-dashboard :deep(.app-date-picker__day), .due-dashboard :deep(.app-date-picker__nav-title) { color: var(--text-dark); }
.due-dashboard :deep(.app-date-picker__day--disabled) { color: var(--text-gray); }
.due-dashboard__quality { border: 1px solid var(--border); border-radius: 5px; padding: .5rem .75rem; margin-bottom: .875rem; font-size: .75rem; color: var(--text-gray); background: var(--card); }
.due-dashboard__quality summary { cursor: pointer; }
.due-dashboard__quality ul { margin: .5rem 0 0; padding-left: 1.25rem; }
.due-dashboard__timestamps { display: flex; flex-wrap: wrap; gap: .25rem 1rem; margin-bottom: .5rem; font-size: .6875rem; color: var(--text-gray); }
@media (max-width: 991px) { .due-dashboard__filters { grid-template-columns: minmax(0, 1fr); } }
</style>
