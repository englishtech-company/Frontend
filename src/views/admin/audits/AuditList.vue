<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { countActiveFilters } from "@/lib/filters/query";
import { getAuditFilterOptions, listAudits } from "@/lib/audits";
import {
  formatAuditEvent,
  formatAuditUser,
  formatAuditValues,
  formatAuditableType,
  getAuditUserEditPath,
  summarizeAuditChanges,
} from "@/lib/audits/format";
import type { AuditLog } from "@/lib/types";

const { canViewAudits, canUpdateUsers } = usePermissions();

const audits = ref<AuditLog[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);
const idFilter = ref("");
const createdAtFrom = ref("");
const createdAtTo = ref("");
const userNameFilter = ref("");
const selectedEvent = ref<string | null>(null);
const auditableTypeFilter = ref<string | null>(null);
const eventOptions = ref<SelectOption[]>([]);
const auditableTypeOptions = ref<SelectOption[]>([]);
const expandedId = ref<number | null>(null);

const eventFilterOptions = computed<SelectOption[]>(() =>
  eventOptions.value.map((event) => ({
    value: event.value,
    label: formatAuditEvent(String(event.label)),
  }))
);

const auditableTypeFilterOptions = computed<SelectOption[]>(() =>
  auditableTypeOptions.value.map((type) => ({
    value: type.value,
    label: formatAuditableType(String(type.label)),
  }))
);

const activeFilterCount = computed(() =>
  countActiveFilters([
    idFilter.value,
    createdAtFrom.value,
    createdAtTo.value,
    userNameFilter.value,
    selectedEvent.value,
    auditableTypeFilter.value,
  ])
);

async function loadFilters() {
  try {
    const options = await getAuditFilterOptions();
    eventOptions.value = options.events.map((event) => ({
      value: event,
      label: event,
    }));
    auditableTypeOptions.value = options.auditableTypes.map((type) => ({
      value: type,
      label: type,
    }));
  } catch {
    eventOptions.value = [];
    auditableTypeOptions.value = [];
  }
}

async function loadAudits() {
  if (!canViewAudits.value) {
    error.value = "Você não tem permissão para visualizar auditoria.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listAudits({
      page: page.value,
      id: idFilter.value.trim() ? Number(idFilter.value) : undefined,
      createdAtFrom: createdAtFrom.value || undefined,
      createdAtTo: createdAtTo.value || undefined,
      userName: userNameFilter.value.trim() || undefined,
      event: selectedEvent.value ? String(selectedEvent.value) : undefined,
      auditableType: auditableTypeFilter.value
        ? String(auditableTypeFilter.value)
        : undefined,
    });
    audits.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar auditoria";
  } finally {
    loading.value = false;
  }
}

function goToPage(next: number) {
  if (next < 1 || next > lastPage.value) return;
  page.value = next;
  loadAudits();
}

function handleFilter() {
  page.value = 1;
  loadAudits();
}

function clearFilters() {
  idFilter.value = "";
  createdAtFrom.value = "";
  createdAtTo.value = "";
  userNameFilter.value = "";
  selectedEvent.value = null;
  auditableTypeFilter.value = null;
  page.value = 1;
  loadAudits();
}

function toggleDetails(id: number) {
  expandedId.value = expandedId.value === id ? null : id;
}

onMounted(async () => {
  await loadFilters();
  await loadAudits();
});
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Auditoria</h4>
          <p class="mb-0">Histórico de alterações no sistema</p>
        </div>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <FilterPanel
      :active-count="activeFilterCount"
      @filter="handleFilter"
      @clear="clearFilters"
    >
      <div class="row g-3">
        <div class="col-md-6 col-lg-3">
          <FilterField label="#" id="audit-filter-id" hint="ID do registro">
            <input
              id="audit-filter-id"
              v-model="idFilter"
              type="number"
              min="1"
              class="form-control"
              placeholder="Ex.: 12"
              @keyup.enter="handleFilter"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Data desde" id="audit-filter-date-from">
            <input
              id="audit-filter-date-from"
              v-model="createdAtFrom"
              type="date"
              class="form-control"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Data até" id="audit-filter-date-to">
            <input
              id="audit-filter-date-to"
              v-model="createdAtTo"
              type="date"
              class="form-control"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Usuário" id="audit-filter-user">
            <input
              id="audit-filter-user"
              v-model="userNameFilter"
              type="text"
              class="form-control"
              placeholder="Nome do usuário..."
              @keyup.enter="handleFilter"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Ação" id="audit-filter-event">
            <SingleSelect
              id="audit-filter-event"
              v-model="selectedEvent"
              :options="eventFilterOptions"
              placeholder="Todas as ações"
              :searchable="false"
              aria-label="Filtrar por ação"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Recurso" id="audit-filter-type">
            <SingleSelect
              id="audit-filter-type"
              v-model="auditableTypeFilter"
              :options="auditableTypeFilterOptions"
              placeholder="Todos os recursos"
              :searchable="false"
              aria-label="Filtrar por recurso"
            />
          </FilterField>
        </div>
      </div>
    </FilterPanel>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-3">
            <h4 class="card-title mb-0">Registros ({{ total }})</h4>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">Carregando...</div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-responsive-sm audit-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Data</th>
                    <th>Usuário</th>
                    <th>Ação</th>
                    <th>Recurso</th>
                    <th>Resumo</th>
                    <th class="text-end">Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="audits.length === 0">
                    <td colspan="7" class="text-center text-muted">
                      Nenhum registro encontrado
                    </td>
                  </tr>
                  <template v-for="audit in audits" :key="audit.id">
                    <tr>
                      <td>{{ audit.id }}</td>
                      <td>
                        {{
                          audit.created_at
                            ? new Date(audit.created_at).toLocaleString("pt-BR")
                            : "—"
                        }}
                      </td>
                      <td>
                        <RouterLink
                          v-if="canUpdateUsers && getAuditUserEditPath(audit)"
                          :to="getAuditUserEditPath(audit)!"
                          class="audit-table__user-link"
                        >
                          {{ formatAuditUser(audit) }}
                        </RouterLink>
                        <span v-else>{{ formatAuditUser(audit) }}</span>
                      </td>
                      <td>
                        <span
                          class="badge"
                          :class="{
                            'badge-success': audit.event === 'created',
                            'badge-primary': audit.event === 'updated',
                            'badge-danger': audit.event === 'deleted',
                            'badge-light text-dark':
                              !['created', 'updated', 'deleted'].includes(audit.event),
                          }"
                        >
                          {{ formatAuditEvent(audit.event) }}
                        </span>
                      </td>
                      <td>
                        {{ formatAuditableType(audit.auditable_type) }}
                        #{{ audit.auditable_id }}
                      </td>
                      <td class="audit-table__summary">{{ summarizeAuditChanges(audit) }}</td>
                      <td class="text-end text-nowrap">
                        <button
                          type="button"
                          class="btn btn-xs sharp btn-primary"
                          :aria-label="
                            expandedId === audit.id
                              ? 'Fechar detalhes da auditoria'
                              : 'Ver detalhes da auditoria'
                          "
                          @click="toggleDetails(audit.id)"
                        >
                          <i
                            :class="expandedId === audit.id ? 'fa fa-times' : 'fa fa-eye'"
                          ></i>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="expandedId === audit.id">
                      <td colspan="7" class="audit-table__details">
                        <div class="row g-3">
                          <div class="col-md-4">
                            <strong>IP</strong>
                            <p class="mb-0">{{ audit.ip_address ?? "—" }}</p>
                          </div>
                          <div class="col-md-8">
                            <strong>URL</strong>
                            <p class="mb-0 text-break">{{ audit.url ?? "—" }}</p>
                          </div>
                          <div class="col-md-6">
                            <strong>Valores anteriores</strong>
                            <pre class="audit-table__json">{{ formatAuditValues(audit.old_values) }}</pre>
                          </div>
                          <div class="col-md-6">
                            <strong>Valores novos</strong>
                            <pre class="audit-table__json">{{ formatAuditValues(audit.new_values) }}</pre>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>

            <ListPagination
              :page="page"
              :last-page="lastPage"
              :total="total"
              @update:page="goToPage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.audit-table__user-link {
  color: inherit;
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.audit-table__user-link:hover {
  color: var(--primary, #452b90);
}

.audit-table__summary {
  max-width: 280px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.audit-table__details {
  background: #fcfcfd;
}

.audit-table__json {
  margin: 0.5rem 0 0;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: #f8f9fa;
  font-size: 0.8125rem;
  max-height: 220px;
  overflow: auto;
}
</style>
