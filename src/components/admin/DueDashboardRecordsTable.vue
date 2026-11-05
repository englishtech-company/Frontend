<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import ListPagination from "@/components/ui/ListPagination.vue";
import { formatCurrency, formatDate } from "@/lib/finance/format";
import { dueStatusLabels, planCommitmentLabels } from "@/lib/dueDashboardFormat";
import type { DueDashboardCharge, DueDashboardRecords, DueDashboardRenewal } from "@/lib/dueDashboard";

type Row = DueDashboardCharge | DueDashboardRenewal;
const props = defineProps<{
  kind: "charges" | "renewals";
  result: DueDashboardRecords<Row> | null;
  loading: boolean;
  error: string;
  search: string;
  canViewEnrollments: boolean;
}>();
const emit = defineEmits<{ search: [value: string]; page: [page: number]; retry: [] }>();
const draft = ref(props.search);
watch(() => props.search, (value) => { draft.value = value; });
const isCharges = computed(() => props.kind === "charges");
const title = computed(() => isCharges.value ? "Cobranças com saldo" : "Próximas renovações");
const pageData = computed(() => props.result?.records ?? null);
const isCharge = (row: Row): row is DueDashboardCharge => "charge_id" in row;
function badgeClass(row: DueDashboardCharge): string {
  return row.due_status === "overdue" ? "badge-danger" : row.due_status === "due_soon" ? "badge-warning" : "badge-success";
}
</script>

<template>
  <section class="card due-records" :aria-label="title" :aria-busy="loading">
    <div class="card-header">
      <h2 class="card-title">{{ title }}</h2>
      <span class="due-records__note">{{ isCharges ? 'Saldos na referência selecionada' : 'De zero a sete dias da referência' }}</span>
    </div>
    <div class="card-body">
      <form class="due-records__search" @submit.prevent="emit('search', draft)">
        <label class="visually-hidden" :for="`due-${kind}-search`">Buscar em {{ title.toLowerCase() }}</label>
        <input :id="`due-${kind}-search`" v-model="draft" type="search" maxlength="255" class="form-control" :placeholder="isCharges ? 'Buscar aluno, plano ou número da cobrança' : 'Buscar aluno, plano ou número da matrícula'" />
        <button type="submit" class="btn btn-sm btn-primary" :disabled="loading">Buscar</button>
        <button type="button" class="btn btn-sm btn-outline-primary" :disabled="loading || (!draft && !search)" @click="draft = ''; emit('search', '')">Limpar busca</button>
      </form>
      <div class="due-records__meta"><span>A busca afeta somente esta lista.</span><span v-if="pageData">Exibindo {{ pageData.from ?? 0 }} a {{ pageData.to ?? 0 }} de {{ pageData.total }} registros.</span></div>
      <div v-if="error" class="alert alert-danger py-2" role="alert">{{ error }} <button type="button" class="btn btn-sm btn-outline-danger ms-2" :disabled="loading" @click="emit('retry')">Tentar novamente</button></div>
      <p v-if="loading && !result" role="status" class="due-records__empty">Carregando {{ title.toLowerCase() }}…</p>
      <p v-else-if="!result && !error" class="due-records__empty">Registros indisponíveis.</p>
      <p v-else-if="pageData && !pageData.data.length" class="due-records__empty">{{ isCharges ? 'Nenhuma cobrança com saldo corresponde aos filtros e à busca.' : 'Nenhuma renovação conhecida na janela corresponde ao plano e à busca.' }}</p>
      <div v-else-if="pageData?.data.length" class="table-responsive" tabindex="0" :aria-label="`Tabela de ${title.toLowerCase()}; role horizontalmente se necessário`">
        <table class="table table-striped table-hover align-middle">
          <thead><tr><th scope="col">Aluno / plano</th><th scope="col">{{ isCharges ? 'Vencimento' : 'Renovação' }}</th><th scope="col">Situação</th><th scope="col" class="text-end">{{ isCharges ? 'Saldo principal' : 'MRR contratado' }}</th><th v-if="isCharges" scope="col" class="text-end">Multa</th><th v-if="isCharges" scope="col" class="text-end">Juros</th><th scope="col" class="text-end">{{ isCharges ? 'Total devido' : 'Volume do ciclo' }}</th><th scope="col">Detalhes</th></tr></thead>
          <tbody>
            <tr v-for="row in pageData.data" :key="isCharge(row) ? row.charge_id : row.schedule_id">
              <td><strong>{{ row.student_name || 'Aluno não informado' }}</strong><small class="due-records__secondary">{{ row.plan_name || planCommitmentLabels[row.plan_commitment] }} · Matrícula #{{ row.enrollment_id ?? '—' }}</small></td>
              <template v-if="isCharge(row)">
                <td>{{ formatDate(row.due_date) }}<small class="due-records__secondary">Cobrança #{{ row.charge_id }}</small></td>
                <td><span class="badge light" :class="badgeClass(row)">{{ dueStatusLabels[row.due_status] }}</span><small v-if="row.charge_status === 'partial' || row.charge_status === 'partial_overdue'" class="due-records__secondary">Pagamento parcial</small></td>
                <td class="text-end">{{ formatCurrency(row.principal_amount) }}</td><td class="text-end">{{ formatCurrency(row.late_fee_amount) }}</td><td class="text-end">{{ formatCurrency(row.interest_amount) }}</td><td class="text-end"><strong>{{ formatCurrency(row.total_due_amount) }}</strong></td>
                <td><RouterLink :to="`/charges/${row.charge_id}`" class="btn btn-xs btn-outline-primary" :aria-label="`Ver cobrança ${row.charge_id}`">Ver cobrança</RouterLink></td>
              </template>
              <template v-else>
                <td>{{ formatDate(row.renewal_date) }}<small class="due-records__secondary">Ciclo iniciado em {{ formatDate(row.cycle_start_date) }}</small></td>
                <td><span class="badge light badge-primary">{{ row.renews_automatically ? 'Automática' : 'Conversar sobre renovação' }}</span></td>
                <td class="text-end">{{ formatCurrency(row.mrr_amount) }}</td><td class="text-end"><strong>{{ formatCurrency(row.contracted_volume_amount) }}</strong></td>
                <td><RouterLink v-if="canViewEnrollments && row.enrollment_id" :to="`/enrollments/${row.enrollment_id}`" class="btn btn-xs btn-outline-primary">Ver matrícula</RouterLink><span v-else class="text-muted">Somente consulta</span></td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
      <ListPagination v-if="pageData && !loading" :page="pageData.current_page" :last-page="pageData.last_page" :total="pageData.total" @update:page="emit('page', $event)" />
    </div>
  </section>
</template>

<style scoped>
.due-records { height: auto; margin-bottom: .875rem; }
.due-records .card-header { margin: 0 .875rem; padding: .75rem 0; border-bottom: 1px solid var(--border); gap: .375rem 1rem; flex-wrap: wrap; }
.due-records .card-title { margin: 0; font-size: 1rem !important; font-weight: 600; text-transform: none; }
.due-records .card-body { padding: .75rem .875rem; }
.due-records__note, .due-records__meta { color: var(--text-gray); font-size: .6875rem; }
.due-records__search { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: .5rem; align-items: center; }
.due-records__search .form-control { min-width: 0; min-height: 2.25rem; font-size: .8125rem; }
.due-records__meta { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .25rem 1rem; margin: .5rem 0 .75rem; }
.due-records__secondary { display: block; color: var(--text-gray); font-size: .6875rem; margin-top: .125rem; }
.due-records .table { font-size: .8125rem; margin-bottom: .25rem; }
.due-records th { white-space: nowrap; font-size: .75rem; }
.due-records td { padding: .75rem; }
.due-records td.text-end { white-space: nowrap; font-variant-numeric: tabular-nums; }
.due-records .badge { white-space: normal; line-height: 1.5; }
.due-records__empty { margin: .75rem 0 0; color: var(--text-gray); font-size: .8125rem; }
@media (max-width: 575px) { .due-records__search { grid-template-columns: 1fr 1fr; } .due-records__search input { grid-column: 1 / -1; } }
</style>
