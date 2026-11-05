<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { notify } from "@/lib/actionNotification";
import { countActiveFilters } from "@/lib/filters/query";
import {
  listTermAcceptances,
  listTerms,
  publishTerm,
  type AcceptanceStatus,
  type TermAcceptanceRow,
  type TermAcceptanceSummary,
  type TermVersion,
} from "@/lib/termAcceptances";

const { canPublishTerms } = usePermissions();

const rows = ref<TermAcceptanceRow[]>([]);
const versions = ref<TermVersion[]>([]);
const nextVersion = ref("1.0");
const summary = ref<TermAcceptanceSummary>({ total: 0, accepted: 0, pending: 0 });
const currentTerm = ref<{ id: number; version: string; title: string } | null>(null);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const nameFilter = ref("");
const emailFilter = ref("");
const statusFilter = ref<AcceptanceStatus | null>(null);
const versionFilter = ref<number | null>(null);
const expandedId = ref<number | null>(null);

const statusOptions: SelectOption[] = [
  { value: "accepted", label: "Aceitaram" },
  { value: "pending", label: "Pendentes" },
];

const versionOptions = computed<SelectOption[]>(() =>
  versions.value.map((term) => ({
    value: term.id,
    label: `v${term.version}${term.is_active ? " (vigente)" : ""}`,
  }))
);

const activeFilterCount = computed(() =>
  countActiveFilters([nameFilter.value, emailFilter.value, statusFilter.value, versionFilter.value])
);

const acceptedPercent = computed(() =>
  summary.value.total ? Math.round((summary.value.accepted / summary.value.total) * 100) : 0
);

// Publicação de nova versão
const showPublish = ref(false);
const publishing = ref(false);
const publishError = ref("");
const form = ref({ title: "", content: "" });

function formatDateTime(value?: string | null) {
  return value ? new Date(value).toLocaleString("pt-BR") : "—";
}

async function load() {
  loading.value = true;
  error.value = "";

  try {
    const result = await listTermAcceptances({
      page: page.value,
      termId: versionFilter.value,
      status: statusFilter.value,
      name: nameFilter.value,
      email: emailFilter.value,
    });
    rows.value = result.acceptances.data;
    lastPage.value = result.acceptances.last_page;
    total.value = result.acceptances.total;
    summary.value = result.summary;
    currentTerm.value = result.term;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar aceites";
  } finally {
    loading.value = false;
  }
}

async function loadVersions() {
  try {
    const result = await listTerms();
    versions.value = result.terms;
    nextVersion.value = result.nextVersion;
  } catch {
    versions.value = [];
  }
}

function handleFilter() {
  page.value = 1;
  load();
}

function clearFilters() {
  nameFilter.value = "";
  emailFilter.value = "";
  statusFilter.value = null;
  versionFilter.value = null;
  handleFilter();
}

function goToPage(next: number) {
  if (next < 1 || next > lastPage.value) return;
  page.value = next;
  load();
}

async function submitPublish() {
  publishError.value = "";

  if (!window.confirm("Publicar nova versão? Todos os alunos precisarão aceitar novamente.")) {
    return;
  }

  publishing.value = true;

  try {
    await publishTerm({
      title: form.value.title,
      content: form.value.content,
    });
    notify.success("Nova versão dos termos publicada!");
    form.value = { title: "", content: "" };
    showPublish.value = false;
    versionFilter.value = null;
    page.value = 1;
    await Promise.all([loadVersions(), load()]);
  } catch (e) {
    publishError.value = e instanceof Error ? e.message : "Erro ao publicar os termos";
  } finally {
    publishing.value = false;
  }
}

onMounted(async () => {
  await loadVersions();
  await load();
});
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-8 p-md-0">
        <div class="welcome-text">
          <h4>Aceites</h4>
          <p class="mb-0">
            Termos de uso da Área do Aluno
            <template v-if="currentTerm">· versão {{ currentTerm.version }}</template>
          </p>
        </div>
      </div>
      <div v-if="canPublishTerms" class="col-sm-4 d-flex justify-content-sm-end align-items-center">
        <button type="button" class="btn btn-primary" @click="showPublish = !showPublish">
          <i class="fa fa-file-contract me-2"></i>Publicar nova versão
        </button>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="showPublish" class="card">
      <div class="card-header"><h4 class="card-title mb-0">Nova versão dos termos</h4></div>
      <div class="card-body">
        <div class="alert alert-warning">
          Ao publicar, esta versão passa a ser a vigente e <strong>todos os alunos</strong> precisarão
          aceitar novamente. Use <code>## Título</code> em uma linha para criar seções.
        </div>
        <div v-if="publishError" class="alert alert-danger">{{ publishError }}</div>
        <form class="row g-3" @submit.prevent="submitPublish">
          <div class="col-md-3">
            <label class="form-label" for="term-version">Versão</label>
            <input id="term-version" :value="`v${nextVersion}`" class="form-control" disabled readonly aria-describedby="term-version-hint" />
            <small id="term-version-hint" class="text-muted">Gerada automaticamente.</small>
          </div>
          <div class="col-md-9">
            <label class="form-label" for="term-title">Título</label>
            <input id="term-title" v-model="form.title" class="form-control" required maxlength="255" />
          </div>
          <div class="col-12">
            <label class="form-label" for="term-content">Texto</label>
            <textarea id="term-content" v-model="form.content" class="form-control" rows="12" required minlength="20"></textarea>
          </div>
          <div class="col-12 d-flex gap-2">
            <button type="submit" class="btn btn-primary" :disabled="publishing">
              {{ publishing ? "Publicando..." : "Publicar" }}
            </button>
            <button type="button" class="btn btn-light" @click="showPublish = false">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-4">
        <div class="card"><div class="card-body">
          <p class="mb-1 text-muted">Alunos</p>
          <h3 class="mb-0">{{ summary.total }}</h3>
        </div></div>
      </div>
      <div class="col-sm-4">
        <div class="card"><div class="card-body">
          <p class="mb-1 text-muted">Aceitaram</p>
          <h3 class="mb-0 text-success">{{ summary.accepted }} <small class="text-muted fs-6">({{ acceptedPercent }}%)</small></h3>
        </div></div>
      </div>
      <div class="col-sm-4">
        <div class="card"><div class="card-body">
          <p class="mb-1 text-muted">Pendentes</p>
          <h3 class="mb-0 text-warning">{{ summary.pending }}</h3>
        </div></div>
      </div>
    </div>

    <FilterPanel :active-count="activeFilterCount" @filter="handleFilter" @clear="clearFilters">
      <div class="row g-3">
        <div class="col-md-6 col-lg-3">
          <FilterField label="Aluno" id="acc-filter-name">
            <input id="acc-filter-name" v-model="nameFilter" class="form-control" placeholder="Nome..." @keyup.enter="handleFilter" />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="E-mail" id="acc-filter-email">
            <input id="acc-filter-email" v-model="emailFilter" class="form-control" placeholder="E-mail..." @keyup.enter="handleFilter" />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Situação" id="acc-filter-status">
            <SingleSelect id="acc-filter-status" v-model="statusFilter" :options="statusOptions" placeholder="Todas" :searchable="false" aria-label="Filtrar por situação" />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Versão dos termos" id="acc-filter-version">
            <SingleSelect id="acc-filter-version" v-model="versionFilter" :options="versionOptions" placeholder="Vigente" :searchable="false" aria-label="Filtrar por versão" />
          </FilterField>
        </div>
      </div>
    </FilterPanel>

    <div class="card">
      <div class="card-header">
        <h4 class="card-title mb-0">Alunos ({{ total }})</h4>
      </div>
      <div class="card-body">
        <div v-if="!loading && !currentTerm" class="alert alert-info mb-0">
          Nenhuma versão dos termos publicada ainda.
        </div>
        <div v-else-if="loading" class="text-center py-4">Carregando...</div>
        <div v-else class="table-responsive">
          <table class="table table-striped table-responsive-sm">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>E-mail</th>
                <th>Situação</th>
                <th>Aceito em</th>
                <th class="text-end">Comprovante</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="rows.length === 0">
                <td colspan="5" class="text-center text-muted">Nenhum aluno encontrado</td>
              </tr>
              <template v-for="row in rows" :key="row.student_id">
                <tr>
                  <td>{{ row.name }}</td>
                  <td>{{ row.email ?? "—" }}</td>
                  <td>
                    <span class="badge" :class="row.accepted ? 'badge-success' : 'badge-warning'">
                      {{ row.accepted ? "Aceitou" : "Pendente" }}
                    </span>
                  </td>
                  <td>{{ formatDateTime(row.accepted_at) }}</td>
                  <td class="text-end">
                    <button
                      v-if="row.accepted"
                      type="button"
                      class="btn btn-xs sharp btn-primary"
                      aria-label="Ver comprovante do aceite"
                      @click="expandedId = expandedId === row.student_id ? null : row.student_id"
                    >
                      <i :class="expandedId === row.student_id ? 'fa fa-times' : 'fa fa-eye'"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="expandedId === row.student_id">
                  <td colspan="5">
                    <div class="row g-3">
                      <div class="col-md-4"><strong>IP</strong><p class="mb-0">{{ row.ip_address ?? "—" }}</p></div>
                      <div class="col-md-8"><strong>Dispositivo</strong><p class="mb-0 text-break">{{ row.user_agent ?? "—" }}</p></div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <ListPagination :page="page" :last-page="lastPage" :total="total" @update:page="goToPage" />
      </div>
    </div>

    <div v-if="versions.length" class="card">
      <div class="card-header"><h4 class="card-title mb-0">Versões publicadas</h4></div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-responsive-sm">
            <thead>
              <tr><th>Versão</th><th>Título</th><th>Publicada em</th><th>Por</th><th>Aceites</th><th>Situação</th></tr>
            </thead>
            <tbody>
              <tr v-for="term in versions" :key="term.id">
                <td>v{{ term.version }}</td>
                <td>{{ term.title }}</td>
                <td>{{ formatDateTime(term.published_at) }}</td>
                <td>{{ term.publisher?.name ?? "—" }}</td>
                <td>{{ term.acceptances_count ?? 0 }}</td>
                <td>
                  <span class="badge" :class="term.is_active ? 'badge-success' : 'badge-light text-dark'">
                    {{ term.is_active ? "Vigente" : "Anterior" }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
