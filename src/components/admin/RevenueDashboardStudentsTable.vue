<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import FilterField from "@/components/ui/FilterField.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import type { RevenueDashboardRecords } from "@/lib/revenueDashboard";
import { revenueMoney } from "@/lib/revenueDashboardFormat";
import { studentStatusLabel, formatDueTimestamp } from "@/lib/dueDashboardFormat";

const props = defineProps<{ result: RevenueDashboardRecords | null; loading: boolean; error: string; search: string; canViewStudents: boolean }>();
const emit = defineEmits<{ search: [value: string]; page: [value: number]; retry: [] }>();
const draft = ref(props.search);
watch(() => props.search, (value) => { draft.value = value; });
const page = computed(() => props.result?.records);
function clear() { draft.value = ""; emit("search", ""); }
</script>

<template>
  <section aria-label="Alunos e receita histórica" :aria-busy="loading">
    <div v-if="error" class="alert alert-danger" role="alert">Lista de alunos: {{ error }} <span v-if="result">Exibindo a última consulta bem-sucedida.</span><button type="button" class="btn btn-sm btn-outline-danger ms-2" :disabled="loading" @click="emit('retry')">Tentar novamente</button></div>
    <FilterPanel title="Buscar alunos" :default-open="true" :active-count="search ? 1 : 0" filter-label="Buscar" clear-label="Limpar busca" @filter="emit('search', draft)" @clear="clear">
      <form @submit.prevent="emit('search', draft)"><FilterField id="revenue-student-search" label="Nome ou número do aluno"><input id="revenue-student-search" v-model="draft" class="form-control" type="search" maxlength="255" placeholder="Buscar aluno pelo nome ou número" /><button type="submit" class="visually-hidden" tabindex="-1">Buscar</button></FilterField></form>
      <p class="revenue-note mt-2 mb-0">A busca afeta somente esta lista. Os indicadores e o ranking continuam históricos.</p>
    </FilterPanel>
    <article class="card revenue-card revenue-students">
      <div class="card-header"><h2 class="card-title">Alunos e LTV <span v-if="page">({{ page.total }})</span></h2><span class="revenue-note">Ordem: maior LTV, depois número do aluno</span></div>
      <div class="card-body">
        <p class="revenue-note">Cadastros atuais e alunos arquivados com recebimentos válidos. MRR atual separado do LTV histórico.</p>
        <p v-if="loading && !result" class="revenue-note" role="status">Carregando alunos…</p>
        <p v-else-if="!result" class="revenue-note">Lista indisponível.</p>
        <p v-else-if="!page?.data.length" class="revenue-note">Nenhum aluno corresponde à busca.</p>
        <template v-else>
          <p class="revenue-note">Exibindo {{ page.from ?? 0 }} a {{ page.to ?? 0 }} de {{ page.total }} registros.</p>
          <div class="table-responsive"><table class="table table-striped align-middle"><caption class="visually-hidden">Receita recebida e MRR por aluno</caption><thead><tr><th scope="col">Aluno</th><th scope="col">Status</th><th scope="col" class="text-end">LTV recebido</th><th scope="col" class="text-end">Principal</th><th scope="col" class="text-end">Multa</th><th scope="col" class="text-end">Juros</th><th scope="col" class="text-end">MRR atual</th><th scope="col">Último pagamento</th><th scope="col">Detalhes</th></tr></thead>
            <tbody><tr v-for="row in page.data" :key="row.student_id"><td><strong>{{ row.student_name }}</strong><small>#{{ row.student_id }} · {{ row.transactions_count }} pagamento(s)</small></td><td><span class="badge badge-primary light">{{ row.archived ? 'Arquivado' : studentStatusLabel(row.student_status) }}</span></td><td class="text-end"><strong>{{ revenueMoney(row.ltv_amount) }}</strong></td><td class="text-end">{{ revenueMoney(row.principal_amount) }}</td><td class="text-end">{{ revenueMoney(row.late_fee_amount) }}</td><td class="text-end">{{ revenueMoney(row.interest_amount) }}</td><td class="text-end">{{ revenueMoney(row.mrr_amount) }}<small>{{ row.active_contracts_count }} contrato(s)</small></td><td class="revenue-students__date">{{ formatDueTimestamp(row.last_paid_at) }}</td><td><RouterLink v-if="canViewStudents && !row.archived" :to="`/students/${row.student_id}`" class="btn btn-xs btn-outline-primary">Ver aluno</RouterLink><span v-else class="revenue-note">Histórico</span></td></tr></tbody>
          </table></div>
          <ListPagination :page="page.current_page" :last-page="page.last_page" :total="page.total" @update:page="emit('page', $event)" />
        </template>
      </div>
    </article>
  </section>
</template>

<style scoped>
.revenue-students .table { margin-bottom:.25rem; font-size:.75rem; }
.revenue-students th { font-size:.6875rem; white-space:nowrap; }
.revenue-students td { padding:.75rem; }
.revenue-students td:first-child { min-width:160px; }
.revenue-students small { display:block; color:var(--text-gray); font-size:.625rem; margin-top:.125rem; }
.revenue-students .text-end,.revenue-students__date { white-space:nowrap; font-variant-numeric:tabular-nums; }
.revenue-students .badge { white-space:nowrap; }
</style>
