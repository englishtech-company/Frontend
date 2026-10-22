<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { RouterLink } from "vue-router";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import {
  deleteLead,
  getLeadLinkTags,
  issuePublicLeadLink,
  listLeads,
} from "@/lib/leads";
import { notifyRemoved } from "@/lib/actionNotification";
import { countActiveFilters } from "@/lib/filters/query";
import {
  buildPublicLeadFormUrl,
  formatLinkTagLabel,
  normalizeLinkTag,
  PUBLIC_LEAD_LINK_TAG_PRESETS,
} from "@/lib/linkTag";
import type {
  Lead,
  LeadRegistrationSource,
} from "@/lib/types";

const {
  canViewLeads,
  canCreateLeads,
  canUpdateLeads,
  canDeleteLeads,
} = usePermissions();

const leads = ref<Lead[]>([]);
const selectedLead = ref<Lead | null>(null);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const idFilter = ref("");
const nameFilter = ref("");
const emailFilter = ref("");
const whatsappPhoneFilter = ref("");
const sourceFilter = ref("");
const selfDeclaredLevelFilter = ref("");
const registrationSourceFilter = ref<string | number | null>(null);
const objectiveFilter = ref("");
const linkTagFilter = ref<string | number | null>(null);
const usedLinkTags = ref<string[]>([]);

const showLinkModal = ref(false);
const selectedLinkTag = ref<string | number | null>("instagram");
const customLinkTag = ref("");
const publicLinkCode = ref("");
const publicLinkLoading = ref(false);
const linkCopied = ref(false);
let publicLinkRequest = 0;

const registrationSourceOptions: SelectOption[] = [
  { value: "manual", label: "Manual" },
  { value: "webhook", label: "Webhook" },
  { value: "form", label: "Formulário" },
];

const linkTagFilterOptions = computed<SelectOption[]>(() => {
  const values = new Set<string>([
    ...PUBLIC_LEAD_LINK_TAG_PRESETS.map((item) => item.value),
    ...usedLinkTags.value,
  ]);

  return [...values].map((value) => ({
    value,
    label: formatLinkTagLabel(value) || value,
  }));
});

const resolvedLinkTag = computed(() => {
  if (selectedLinkTag.value === "__custom__") {
    return normalizeLinkTag(customLinkTag.value);
  }

  return normalizeLinkTag(String(selectedLinkTag.value ?? ""));
});

const generatedPublicLeadUrl = computed(() =>
  buildPublicLeadFormUrl(publicLinkCode.value)
);

const canCopyPublicLink = computed(
  () => Boolean(publicLinkCode.value) && !publicLinkLoading.value
);

const linkTagPresetOptions = computed<SelectOption[]>(() => [
  ...PUBLIC_LEAD_LINK_TAG_PRESETS.map((item) => ({
    value: item.value,
    label: item.label,
  })),
  { value: "__custom__", label: "Outra tag..." },
]);

const activeFilterCount = computed(() =>
  countActiveFilters([
    idFilter.value,
    nameFilter.value,
    emailFilter.value,
    whatsappPhoneFilter.value,
    sourceFilter.value,
    selfDeclaredLevelFilter.value,
    registrationSourceFilter.value,
    objectiveFilter.value,
    linkTagFilter.value,
  ])
);

const showActions = computed(
  () =>
    canViewLeads.value ||
    canUpdateLeads.value ||
    canDeleteLeads.value
);

async function loadLeads() {
  if (!canViewLeads.value) {
    error.value = "Você não tem permissão para listar interessados.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listLeads({
      page: page.value,
      id: idFilter.value.trim() ? Number(idFilter.value) : undefined,
      name: nameFilter.value.trim() || undefined,
      email: emailFilter.value.trim() || undefined,
      whatsappPhone: whatsappPhoneFilter.value.trim() || undefined,
      source: sourceFilter.value.trim() || undefined,
      selfDeclaredLevel: selfDeclaredLevelFilter.value.trim() || undefined,
      registrationSource: registrationSourceFilter.value
        ? (String(registrationSourceFilter.value) as LeadRegistrationSource)
        : undefined,
      objective: objectiveFilter.value.trim() || undefined,
      linkTag: linkTagFilter.value
        ? String(linkTagFilter.value)
        : undefined,
    });

    leads.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao carregar interessados";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  page.value = 1;
  loadLeads();
}

async function loadLinkTags() {
  if (!canViewLeads.value) {
    return;
  }

  try {
    usedLinkTags.value = await getLeadLinkTags();
  } catch {
    usedLinkTags.value = [];
  }
}

watch(
  () => [showLinkModal.value, resolvedLinkTag.value] as const,
  async ([open, tag]) => {
    if (!open) {
      return;
    }

    publicLinkCode.value = "";
    linkCopied.value = false;

    if (!tag) {
      publicLinkLoading.value = false;
      return;
    }

    const requestId = ++publicLinkRequest;
    publicLinkLoading.value = true;

    try {
      const source = await issuePublicLeadLink(tag);

      if (requestId === publicLinkRequest) {
        publicLinkCode.value = source.code;
      }
    } catch {
      if (requestId === publicLinkRequest) {
        error.value = "Não foi possível gerar o código do link.";
      }
    } finally {
      if (requestId === publicLinkRequest) {
        publicLinkLoading.value = false;
      }
    }
  }
);

function openLinkModal() {
  showLinkModal.value = true;
  linkCopied.value = false;
}

function closeLinkModal() {
  showLinkModal.value = false;
  linkCopied.value = false;
}

async function copyPublicFormLink() {
  if (!canCopyPublicLink.value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(generatedPublicLeadUrl.value);
    linkCopied.value = true;
    window.setTimeout(() => {
      linkCopied.value = false;
    }, 2000);
  } catch {
    error.value = "Não foi possível copiar o link.";
  }
}

function clearFilters() {
  idFilter.value = "";
  nameFilter.value = "";
  emailFilter.value = "";
  whatsappPhoneFilter.value = "";
  sourceFilter.value = "";
  selfDeclaredLevelFilter.value = "";
  registrationSourceFilter.value = null;
  objectiveFilter.value = "";
  linkTagFilter.value = null;
  page.value = 1;
  loadLeads();
}

function openLeadObjective(lead: Lead) {
  selectedLead.value = lead;
}

function closeLeadObjective() {
  selectedLead.value = null;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape") {
    return;
  }

  if (showLinkModal.value) {
    closeLinkModal();
    return;
  }

  if (selectedLead.value) {
    closeLeadObjective();
  }
}

async function removeLead(lead: Lead) {
  if (!canDeleteLeads.value) {
    error.value = "Você não tem permissão para excluir interessados.";
    return;
  }

  const confirmed = confirm(
    `Remover o interessado "${lead.name}"?`
  );

  if (!confirmed) return;

  try {
    await deleteLead(lead.id);
    notifyRemoved("Interessado");
    await loadLeads();
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao remover interessado";
  }
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;

  page.value = nextPage;
  loadLeads();
}

function getLocalPhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("55") && digits.length > 11) {
    return digits.slice(2, 13);
  }

  return digits.slice(0, 11);
}

function formatPhone(value: string): string {
  const digits = getLocalPhoneDigits(value);

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2");
}

function formatRegistrationSource(
  registrationSource: LeadRegistrationSource
) {
  if (registrationSource === "form") {
    return {
      label: "Formulário",
      class: "badge-primary",
    };
  }

  if (registrationSource === "webhook") {
    return {
      label: "Webhook",
      class: "badge-info",
    };
  }

  return {
    label: "Manual",
    class: "badge-secondary",
  };
}

function formatObjectivePreview(objective: string): string {
  const normalizedObjective = objective.trim();
  const maximumLength = 28;

  if (normalizedObjective.length <= maximumLength) {
    return normalizedObjective;
  }

  return `${normalizedObjective
    .slice(0, maximumLength)
    .trimEnd()}...`;
}

onMounted(() => {
  loadLeads();
  loadLinkTags();
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Interessados</h4>
          <p class="mb-0">
            Gerencie os possíveis alunos e seus objetivos
          </p>
        </div>
      </div>

      <div
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex gap-2"
      >
        <button
          type="button"
          class="btn btn-outline-primary"
          @click="openLinkModal"
        >
          Gerar link público
        </button>
        <RouterLink
          v-if="canCreateLeads"
          to="/leads/create"
          class="btn btn-primary"
        >
          <i class="la la-plus me-1"></i>
          Novo interessado
        </RouterLink>
      </div>
    </div>

    <div
      v-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>

    <FilterPanel
      :active-count="activeFilterCount"
      @filter="handleSearch"
      @clear="clearFilters"
    >
      <div class="row g-3">
        <div class="col-md-6 col-lg-3">
          <FilterField label="#" id="lead-filter-id" hint="ID do interessado">
            <input
              id="lead-filter-id"
              v-model="idFilter"
              type="number"
              min="1"
              class="form-control"
              placeholder="Ex.: 12"
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Nome" id="lead-filter-name">
            <input
              id="lead-filter-name"
              v-model="nameFilter"
              type="text"
              class="form-control"
              placeholder="Digite o nome..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="E-mail" id="lead-filter-email">
            <input
              id="lead-filter-email"
              v-model="emailFilter"
              type="text"
              class="form-control"
              placeholder="Digite o e-mail..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Telefone" id="lead-filter-phone">
            <input
              id="lead-filter-phone"
              v-model="whatsappPhoneFilter"
              type="text"
              class="form-control"
              placeholder="Digite o telefone..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Origem" id="lead-filter-source">
            <input
              id="lead-filter-source"
              v-model="sourceFilter"
              type="text"
              class="form-control"
              placeholder="Ex.: Instagram, site..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Nível" id="lead-filter-level">
            <input
              id="lead-filter-level"
              v-model="selfDeclaredLevelFilter"
              type="text"
              class="form-control"
              placeholder="Ex.: Intermediário..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Entrada" id="lead-filter-registration">
            <SingleSelect
              id="lead-filter-registration"
              v-model="registrationSourceFilter"
              :options="registrationSourceOptions"
              placeholder="Todas as entradas"
              :searchable="false"
              aria-label="Filtrar pela origem do registro"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Objetivo" id="lead-filter-objective">
            <input
              id="lead-filter-objective"
              v-model="objectiveFilter"
              type="text"
              class="form-control"
              placeholder="Digite o objetivo..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Tag do link" id="lead-filter-tag">
            <SingleSelect
              id="lead-filter-tag"
              v-model="linkTagFilter"
              :options="linkTagFilterOptions"
              placeholder="Todas as tags"
              :searchable="true"
              aria-label="Filtrar pela tag do link público"
            />
          </FilterField>
        </div>
      </div>
    </FilterPanel>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div
            class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"
          >
            <h4 class="card-title mb-0">
              Lista de interessados ({{ total }})
            </h4>

            <span
              v-if="!showActions"
              class="badge bg-light text-dark"
            >
              Somente leitura
            </span>
          </div>

          <div class="card-body">
            <div
              v-if="loading"
              class="text-center py-4"
            >
              Carregando...
            </div>

            <div
              v-else
              class="table-responsive"
            >
              <table
                class="table table-striped table-responsive-sm lead-table"
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th class="text-nowrap">Nome</th>
                    <th class="text-nowrap">Contato</th>
                    <th class="text-nowrap">Origem</th>
                    <th class="text-nowrap">Nível</th>
                    <th class="text-nowrap">Entrada</th>
                    <th class="lead-objective-cell">
                      Objetivo
                    </th>
                    <th
                      v-if="showActions"
                      class="text-end text-nowrap"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-if="leads.length === 0">
                    <td
                      :colspan="showActions ? 8 : 7"
                      class="text-center text-muted"
                    >
                      Nenhum interessado encontrado
                    </td>
                  </tr>

                  <tr
                    v-for="lead in leads"
                    :key="lead.id"
                  >
                    <td>{{ lead.id }}</td>

                    <td class="text-nowrap">
                      <strong>{{ lead.name }}</strong>
                    </td>

                    <td>
                      <div class="lead-contact">
                        <span class="text-nowrap">
                          {{ formatPhone(lead.whatsapp_phone) }}
                        </span>

                        <small
                          v-if="lead.email"
                          class="text-muted"
                        >
                          {{ lead.email }}
                        </small>
                      </div>
                    </td>

                    <td class="text-nowrap">
                      {{ lead.source }}
                    </td>

                    <td class="text-nowrap">
                      {{ lead.self_declared_level }}
                    </td>

                    <td class="text-nowrap">
                      <div class="lead-entry">
                        <span
                          class="badge"
                          :class="
                            formatRegistrationSource(
                              lead.registration_source
                            ).class
                          "
                        >
                          {{
                            formatRegistrationSource(
                              lead.registration_source
                            ).label
                          }}
                        </span>
                        <span
                          v-if="lead.link_tag"
                          class="badge badge-light"
                        >
                          {{ formatLinkTagLabel(lead.link_tag) }}
                        </span>
                      </div>
                    </td>

                    <td class="lead-objective-cell">
                      <button
                        type="button"
                        class="lead-objective-button"
                        :aria-label="`Ver objetivo de ${lead.name}`"
                        @click="openLeadObjective(lead)"
                      >
                        <span class="lead-objective-preview">
                          {{ formatObjectivePreview(lead.objective) }}
                        </span>

                        <i
                          class="la la-eye lead-objective-button__icon"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </td>

                    <td
                      v-if="showActions"
                      class="text-end text-nowrap"
                    >
                      <RouterLink
                        v-if="canViewLeads"
                        :to="`/leads/${lead.id}`"
                        class="btn btn-xs sharp btn-info me-1"
                        :aria-label="`Ver ${lead.name}`"
                      >
                        <i class="fa fa-eye"></i>
                      </RouterLink>

                      <RouterLink
                        v-if="canUpdateLeads"
                        :to="`/leads/${lead.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar ${lead.name}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>

                      <button
                        v-if="canDeleteLeads"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir ${lead.name}`"
                        @click="removeLead(lead)"
                      >
                        <i class="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
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

  <Teleport to="body">
    <Transition name="lead-objective-modal">
      <div
        v-if="selectedLead"
        class="lead-objective-overlay"
        @click.self="closeLeadObjective"
      >
        <section
          class="lead-objective-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-objective-title"
        >
          <header class="lead-objective-dialog__header">
            <div>
              <h5
                id="lead-objective-title"
                class="lead-objective-dialog__title"
              >
                Objetivo do interessado
              </h5>

              <p class="lead-objective-dialog__lead">
                {{ selectedLead.name }}
              </p>
            </div>

            <button
              type="button"
              class="lead-objective-dialog__close"
              aria-label="Fechar objetivo"
              @click="closeLeadObjective"
            >
              <i
                class="la la-times"
                aria-hidden="true"
              ></i>
            </button>
          </header>

          <div class="lead-objective-dialog__body">
            {{ selectedLead.objective }}
          </div>

          <footer class="lead-objective-dialog__footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="closeLeadObjective"
            >
              Fechar
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <Transition name="lead-objective-modal">
      <div
        v-if="showLinkModal"
        class="lead-objective-overlay"
        @click.self="closeLinkModal"
      >
        <section
          class="lead-objective-dialog lead-link-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-link-title"
        >
          <header class="lead-objective-dialog__header">
            <div>
              <h5
                id="lead-link-title"
                class="lead-objective-dialog__title"
              >
                Link público com tag
              </h5>
              <p class="lead-objective-dialog__lead">
                A tag é só para uso interno: indica se o interessado veio do site, Instagram etc.
              </p>
            </div>

            <button
              type="button"
              class="lead-objective-dialog__close"
              aria-label="Fechar gerador de link"
              @click="closeLinkModal"
            >
              <i
                class="la la-times"
                aria-hidden="true"
              ></i>
            </button>
          </header>

          <div class="lead-objective-dialog__body lead-link-dialog__body">
            <div class="mb-3">
              <p class="form-label mb-2" id="lead-link-tag-label">
                Origem do link
              </p>
              <div
                class="lead-link-tags"
                role="listbox"
                aria-labelledby="lead-link-tag-label"
              >
                <button
                  v-for="option in linkTagPresetOptions"
                  :key="String(option.value)"
                  type="button"
                  class="lead-link-tag"
                  role="option"
                  :aria-selected="selectedLinkTag === option.value"
                  :class="{
                    'lead-link-tag--active': selectedLinkTag === option.value,
                  }"
                  @click="selectedLinkTag = option.value"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div
              v-if="selectedLinkTag === '__custom__'"
              class="mb-3"
            >
              <label class="form-label" for="lead-link-custom">
                Tag personalizada
              </label>
              <input
                id="lead-link-custom"
                v-model="customLinkTag"
                type="text"
                class="form-control"
                maxlength="40"
                placeholder="Ex.: google-ads"
              />
            </div>

            <label class="form-label" for="lead-link-url">
              Link para copiar
            </label>
            <input
              id="lead-link-url"
              :value="generatedPublicLeadUrl"
              type="text"
              class="form-control"
              readonly
            />
            <p class="text-muted small mt-2 mb-0">
              O número no link é só um código interno. A origem (Instagram, site etc.) aparece apenas nesta listagem.
            </p>
          </div>

          <footer class="lead-objective-dialog__footer lead-link-dialog__footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="closeLinkModal"
            >
              Fechar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="!canCopyPublicLink"
              @click="copyPublicFormLink"
            >
              {{
                publicLinkLoading
                  ? "Gerando..."
                  : linkCopied
                    ? "Link copiado"
                    : "Copiar link"
              }}
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lead-table {
  font-size: 0.88rem;
}

.lead-table th,
.lead-table td {
  padding-right: 0.65rem;
  padding-left: 0.65rem;
  vertical-align: middle;
}

.lead-table th {
  font-size: 0.9rem;
}

.lead-table .badge {
  font-size: 0.72rem;
}

.lead-contact {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.lead-contact small {
  max-width: 185px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lead-entry {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.lead-objective-cell {
  width: 190px;
  max-width: 190px;
}

.lead-objective-button {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  width: 100%;
  max-width: 180px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.lead-objective-preview {
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lead-objective-button__icon {
  flex-shrink: 0;
  color: var(--primary);
  font-size: 0.95rem;
}

.lead-objective-button:hover .lead-objective-preview,
.lead-objective-button:focus .lead-objective-preview {
  color: var(--primary);
}

.lead-objective-button:focus-visible {
  border-radius: 0.2rem;
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

.lead-objective-overlay {
  position: fixed;
  z-index: 2000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(20, 24, 31, 0.55);
}

.lead-objective-dialog {
  width: 100%;
  max-width: 560px;
  max-height: calc(100vh - 2rem);
  overflow: hidden;
  border-radius: 0.75rem;
  background: #ffffff;
  box-shadow: 0 1.25rem 3rem rgba(20, 24, 31, 0.24);
}

.lead-objective-dialog__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.lead-objective-dialog__title {
  margin: 0;
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.lead-objective-dialog__lead {
  margin: 0.35rem 0 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.lead-objective-dialog__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #f3f4f6;
  color: #495057;
  font-size: 1.25rem;
  cursor: pointer;
}

.lead-objective-dialog__close:hover {
  background: #e9ecef;
  color: var(--primary);
}

.lead-objective-dialog__body {
  max-height: 50vh;
  overflow-y: auto;
  padding: 1.5rem;
  color: #495057;
  line-height: 1.6;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.lead-objective-dialog__footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
}

.lead-objective-modal-enter-active,
.lead-objective-modal-leave-active {
  transition: opacity 0.15s ease;
}

.lead-objective-modal-enter-active .lead-objective-dialog,
.lead-objective-modal-leave-active .lead-objective-dialog {
  transition: transform 0.15s ease;
}

.lead-objective-modal-enter-from,
.lead-objective-modal-leave-to {
  opacity: 0;
}

.lead-objective-modal-enter-from .lead-objective-dialog,
.lead-objective-modal-leave-to .lead-objective-dialog {
  transform: translateY(0.5rem) scale(0.98);
}

.lead-link-dialog {
  max-width: 720px;
  overflow: visible;
}

.lead-link-dialog__body {
  max-height: min(70vh, 36rem);
  overflow: visible;
  white-space: normal;
}

.lead-link-tags {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

@media (min-width: 576px) {
  .lead-link-tags {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.lead-link-tag {
  min-height: 2.75rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid #dfe3e8;
  border-radius: 0.6rem;
  background: #fff;
  color: #343a40;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
}

.lead-link-tag:hover {
  border-color: color-mix(in srgb, var(--primary) 40%, #dfe3e8);
  color: var(--primary);
}

.lead-link-tag--active {
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 10%, #fff);
  color: var(--primary);
  box-shadow: 0 0 0 0.15rem color-mix(in srgb, var(--primary) 16%, transparent);
}

.lead-link-dialog__footer {
  gap: 0.5rem;
}
</style>
