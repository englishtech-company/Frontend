<script lang="ts" setup>
/**
 * AulasReposicoesTab.vue
 *
 * Aba secundária de "Aulas" que exibe a lista de reposições inline
 * dentro do workspace AulasHostView.
 *
 * Não carrega os dados via onMounted automaticamente — espera o sinal
 * do host via `expose`, ou usa onActivated para refrescar quando a aba
 * volta ao foco (sem keep-alive neste caso, pois é fluxo de leitura).
 */
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import FilterField from "@/components/ui/FilterField.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import AppCombobox from "@/components/ui/AppCombobox.vue";
import AppDatePicker from "@/components/ui/AppDatePicker.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { countActiveFilters } from "@/lib/filters/query";
import { confirmDelete } from "@/lib/confirm";
import { notifyRemoved, notify } from "@/lib/actionNotification";
import {
  listMakeupClasses,
  deleteMakeupClass,
  updateMakeupClass,
} from "@/lib/makeupClasses";
import { getTeacherOptions } from "@/lib/teachers";
import { formatMakeupClassStatusBadge } from "@/lib/makeupClasses/format";
import type { MakeupClass, MakeupClassStatus } from "@/lib/types";

const {
  canViewMakeupClasses,
  canCreateMakeupClasses,
  canUpdateMakeupClasses,
  canDeleteMakeupClasses,
} = usePermissions();

// ── State ───────────────────────────────────────────────────────────────────
const loading = ref(false);
const error = ref("");
const makeupClasses = ref<MakeupClass[]>([]);
const total = ref(0);
const page = ref(1);
const lastPage = ref(1);

// Filters
const idFilter = ref("");
const teacherIdFilter = ref<string | number | null>(null);
const statusFilter = ref<string | number | null>(null);
const dateFromFilter = ref("");
const dateToFilter = ref("");

// Options
const teacherOptions = ref<SelectOption[]>([]);

const statusOptions: SelectOption[] = [
  { value: "available", label: "Disponível" },
  { value: "scheduled", label: "Agendada" },
  { value: "concluded", label: "Concluída" },
  { value: "expired", label: "Expirada" },
];

// Scheduling modal
const schedulingItem = ref<MakeupClass | null>(null);
const modalNewDateISO = ref<string | null>(null);
const modalTeacherId = ref<string | number | null>(null);
const modalSaving = ref(false);
const modalError = ref("");

// ── Computed ─────────────────────────────────────────────────────────────────
const showActions = computed(
  () => canUpdateMakeupClasses.value || canDeleteMakeupClasses.value
);

const activeFilterCount = computed(() =>
  countActiveFilters([
    idFilter.value,
    teacherIdFilter.value,
    statusFilter.value,
    dateFromFilter.value,
    dateToFilter.value,
  ])
);

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateString?: string | null, withTime = true) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("pt-BR", {
    dateStyle: "short",
    ...(withTime ? { timeStyle: "short" } : {}),
  });
}

function getStudentName(item: MakeupClass): string {
  return (
    item.relationships?.enrollment?.student?.name ??
    item.enrollment?.student?.name ??
    item.group_class?.name ??
    "—"
  );
}

function getStudentId(item: MakeupClass): number | null {
  return (
    item.relationships?.enrollment?.student?.id ??
    item.enrollment?.student?.id ??
    null
  );
}

function getTeacherName(item: MakeupClass): string {
  return (
    item.relationships?.teacher?.name ??
    item.teacher?.name ??
    "—"
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
async function load() {
  if (!canViewMakeupClasses.value) {
    error.value = "Você não tem permissão para visualizar reposições.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listMakeupClasses({
      page: page.value,
      id: idFilter.value.trim() ? Number(idFilter.value) : undefined,
      teacher_id: teacherIdFilter.value
        ? Number(teacherIdFilter.value)
        : undefined,
      status: statusFilter.value
        ? (String(statusFilter.value) as MakeupClassStatus)
        : undefined,
      original_date_from: dateFromFilter.value || undefined,
      original_date_to: dateToFilter.value || undefined,
    });

    makeupClasses.value = result.data;
    total.value = result.total;
    lastPage.value = result.last_page;
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar reposições.";
  } finally {
    loading.value = false;
  }
}

async function loadOptions() {
  try {
    const teachersMap = await getTeacherOptions();
    teacherOptions.value = Object.entries(teachersMap).map(([id, name]) => ({
      value: id,
      label: name,
    }));
  } catch (e) {
    console.warn("Erro ao carregar opções de professores:", e);
  }
}

function handleSearch() {
  page.value = 1;
  load();
}

function clearFilters() {
  idFilter.value = "";
  teacherIdFilter.value = null;
  statusFilter.value = null;
  dateFromFilter.value = "";
  dateToFilter.value = "";
  page.value = 1;
  load();
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;
  page.value = nextPage;
  load();
}

// ── Actions ───────────────────────────────────────────────────────────────────
async function removeMakeupClass(item: MakeupClass) {
  const confirmed = await confirmDelete({
    entityLabel: "aula de reposição",
    itemName: `#${item.id} (${getStudentName(item)})`,
  });
  if (!confirmed) return;

  try {
    await deleteMakeupClass(item.id);
    notifyRemoved("Aula de Reposição");
    await load();
  } catch (e) {
    notify.error(
      e instanceof Error ? e.message : "Erro ao excluir reposição."
    );
  }
}

async function markAsConcluded(item: MakeupClass) {
  try {
    await updateMakeupClass(item.id, { status: "concluded" });
    notify.success(`Reposição #${item.id} marcada como concluída!`);
    await load();
  } catch {
    notify.error("Erro ao concluir reposição.");
  }
}

async function copyPublicLink(item: MakeupClass) {
  if (!item.public_token) {
    notify.error("Token público indisponível.");
    return;
  }
  const url = `${window.location.origin}/public/makeup-classes/${item.public_token}`;
  try {
    await navigator.clipboard.writeText(url);
    notify.success("Link público copiado!");
  } catch {
    window.open(url, "_blank");
  }
}

function openSchedulingModal(item: MakeupClass) {
  schedulingItem.value = item;
  modalNewDateISO.value = item.new_date ? item.new_date.slice(0, 10) : null;
  modalTeacherId.value = item.teacher_id ? String(item.teacher_id) : null;
  modalError.value = "";
}

function closeSchedulingModal() {
  schedulingItem.value = null;
  modalError.value = "";
}

async function saveScheduling() {
  if (!schedulingItem.value) return;
  if (!modalNewDateISO.value) {
    modalError.value = "Informe a data do agendamento.";
    return;
  }

  modalSaving.value = true;
  modalError.value = "";
  try {
    await updateMakeupClass(schedulingItem.value.id, {
      new_date: modalNewDateISO.value,
      teacher_id: modalTeacherId.value
        ? Number(modalTeacherId.value)
        : undefined,
      status: "scheduled",
    });
    notify.success("Aula de reposição agendada com sucesso!");
    closeSchedulingModal();
    await load();
  } catch (e) {
    modalError.value =
      e instanceof Error ? e.message : "Erro ao agendar reposição.";
  } finally {
    modalSaving.value = false;
  }
}

onMounted(() => {
  loadOptions();
  load();
});
</script>

<template>
  <div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Filtros -->
    <FilterPanel
      :active-count="activeFilterCount"
      @filter="handleSearch"
      @clear="clearFilters"
    >
      <div class="row g-3">
        <div class="col-md-6 col-lg-2">
          <FilterField label="#" id="reposicoes-tab-filter-id" hint="ID da reposição">
            <input
              id="reposicoes-tab-filter-id"
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
          <FilterField label="Status" id="reposicoes-tab-filter-status">
            <SingleSelect
              id="reposicoes-tab-filter-status"
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Todos os status"
              :searchable="false"
            />
          </FilterField>
        </div>

        <div class="col-md-6 col-lg-3">
          <AppCombobox
            id="reposicoes-tab-filter-teacher"
            v-model="teacherIdFilter"
            :options="teacherOptions"
            label="Professor"
            placeholder="Todos os professores"
          />
        </div>

        <div class="col-md-6 col-lg-2">
          <AppDatePicker
            id="reposicoes-tab-filter-date-from"
            v-model="dateFromFilter"
            label="Data Falta (De)"
            placeholder="DD/MM/AAAA"
          />
        </div>

        <div class="col-md-6 col-lg-2">
          <AppDatePicker
            id="reposicoes-tab-filter-date-to"
            v-model="dateToFilter"
            label="Data Falta (Até)"
            placeholder="DD/MM/AAAA"
          />
        </div>
      </div>
    </FilterPanel>

    <!-- Tabela -->
    <div class="card">
      <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
        <h4 class="card-title mb-0">Lista de reposições ({{ total }})</h4>
        <RouterLink
          v-if="canCreateMakeupClasses"
          to="/makeup-classes/create"
          class="btn btn-sm btn-primary"
        >
          <i class="la la-plus me-1"></i>Nova reposição
        </RouterLink>
      </div>

      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Aluno / Origem</th>
                <th>Professor</th>
                <th>Data da Falta</th>
                <th>Data Limite</th>
                <th>Data Agendada</th>
                <th>Status</th>
                <th v-if="showActions" class="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="makeupClasses.length === 0">
                <td :colspan="showActions ? 8 : 7" class="text-center text-muted py-4">
                  Nenhuma reposição encontrada.
                </td>
              </tr>

              <tr v-for="item in makeupClasses" :key="item.id">
                <td>{{ item.id }}</td>
                <td>
                  <RouterLink
                    v-if="getStudentId(item)"
                    :to="`/students/${getStudentId(item)}`"
                    class="text-primary fw-semibold"
                  >
                    {{ getStudentName(item) }}
                  </RouterLink>
                  <span v-else class="fw-semibold">{{ getStudentName(item) }}</span>
                  <div class="small text-muted" v-if="item.enrollment_id">
                    Matrícula #{{ item.enrollment_id }}
                  </div>
                </td>
                <td>{{ getTeacherName(item) }}</td>
                <td>{{ formatDate(item.original_date) }}</td>
                <td>{{ formatDate(item.expired_date, false) }}</td>
                <td>
                  <span v-if="item.new_date" class="text-success fw-semibold">
                    {{ formatDate(item.new_date) }}
                  </span>
                  <span v-else class="text-muted small fst-italic">Não agendada</span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="formatMakeupClassStatusBadge(item.status).class"
                  >
                    {{ formatMakeupClassStatusBadge(item.status).label }}
                  </span>
                </td>
                <td v-if="showActions" class="text-end text-nowrap">
                  <button
                    v-if="canUpdateMakeupClasses && (item.status === 'available' || item.status === 'scheduled')"
                    type="button"
                    class="btn btn-xs sharp btn-info me-1"
                    :title="item.status === 'available' ? 'Agendar reposição' : 'Reagendar reposição'"
                    @click="openSchedulingModal(item)"
                  >
                    <i class="fa fa-calendar-plus-o"></i>
                  </button>

                  <button
                    v-if="canUpdateMakeupClasses && item.status === 'scheduled'"
                    type="button"
                    class="btn btn-xs sharp btn-success me-1"
                    title="Marcar como concluída"
                    @click="markAsConcluded(item)"
                  >
                    <i class="fa fa-check"></i>
                  </button>

                  <button
                    v-if="item.public_token"
                    type="button"
                    class="btn btn-xs sharp btn-secondary me-1"
                    title="Copiar link público"
                    @click="copyPublicLink(item)"
                  >
                    <i class="fa fa-link"></i>
                  </button>

                  <RouterLink
                    v-if="canUpdateMakeupClasses"
                    :to="`/makeup-classes/${item.id}/edit`"
                    class="btn btn-xs sharp btn-primary me-1"
                    :aria-label="`Editar reposição ${item.id}`"
                  >
                    <i class="fa fa-pencil"></i>
                  </RouterLink>

                  <button
                    v-if="canDeleteMakeupClasses"
                    type="button"
                    class="btn btn-xs sharp btn-danger"
                    :aria-label="`Excluir reposição ${item.id}`"
                    @click="removeMakeupClass(item)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-end pt-3">
          <ListPagination
            :page="page"
            :last-page="lastPage"
            :total="total"
            @update:page="goToPage"
          />
        </div>
      </div>
    </div>

    <!-- Modal de Agendamento -->
    <Teleport to="body">
      <div
        v-if="schedulingItem"
        class="modal fade show d-block"
        tabindex="-1"
        role="dialog"
        style="background: rgba(0, 0, 0, 0.5);"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Agendar Reposição #{{ schedulingItem.id }}</h5>
              <button
                type="button"
                class="btn-close"
                aria-label="Fechar"
                :disabled="modalSaving"
                @click="closeSchedulingModal"
              ></button>
            </div>

            <div class="modal-body">
              <div v-if="modalError" class="alert alert-danger py-2 mb-3">
                {{ modalError }}
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Aluno / Origem</label>
                <div class="form-control bg-light">
                  {{ getStudentName(schedulingItem) }}
                </div>
              </div>

              <div class="mb-3">
                <AppDatePicker
                  id="reposicoes-tab-modal-new-date"
                  v-model="modalNewDateISO"
                  label="Data do agendamento *"
                  placeholder="DD/MM/AAAA"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Professor Responsável</label>
                <SingleSelect
                  v-model="modalTeacherId"
                  :options="teacherOptions"
                  placeholder="Selecione um professor (opcional)"
                  :searchable="true"
                />
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-outline-secondary"
                :disabled="modalSaving"
                @click="closeSchedulingModal"
              >
                Cancelar
              </button>
              <button
                type="button"
                class="btn btn-primary"
                :disabled="modalSaving"
                @click="saveScheduling"
              >
                <span
                  v-if="modalSaving"
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                ></span>
                {{ modalSaving ? "Salvando..." : "Salvar agendamento" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
