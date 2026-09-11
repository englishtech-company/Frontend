<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, RouterLink } from "vue-router";
import {
  listMakeupClasses,
  deleteMakeupClass,
  updateMakeupClass,
} from "@/lib/makeupClasses";
import { getTeacherOptions } from "@/lib/teachers";
import type { MakeupClass, MakeupClassStatus } from "@/lib/types";
import { usePermissions } from "@/composables/usePermissions";
import { notifyRemoved, notify } from "@/lib/actionNotification";
import { confirmDelete } from "@/lib/confirm";
import { countActiveFilters } from "@/lib/filters/query";

import FilterPanel from "@/components/ui/FilterPanel.vue";
import FilterField from "@/components/ui/FilterField.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import type { SelectOption } from "@/components/ui/select.types";

const router = useRouter();
const {
  canViewMakeupClasses,
  canCreateMakeupClasses,
  canUpdateMakeupClasses,
  canDeleteMakeupClasses,
} = usePermissions();

// ── State ──────────────────────────────────────────────────────────────────
const loading = ref(false);
const error = ref("");
const makeupClasses = ref<MakeupClass[]>([]);
const total = ref(0);
const page = ref(1);
const lastPage = ref(1);

// Filter states
const idFilter = ref("");
const studentNameFilter = ref("");
const teacherIdFilter = ref<string | number | null>(null);
const statusFilter = ref<string | number | null>(null);
const dateFromFilter = ref("");
const dateToFilter = ref("");

// Options
const statusOptions: SelectOption[] = [
  { value: "available", label: "Disponível" },
  { value: "scheduled", label: "Agendada" },
  { value: "concluded", label: "Concluída" },
  { value: "expired", label: "Expirada" },
];

const teacherOptions = ref<SelectOption[]>([]);

// Scheduling Modal state
const schedulingItem = ref<MakeupClass | null>(null);
const modalNewDate = ref("");
const modalTeacherId = ref<string | number | null>(null);
const modalSaving = ref(false);
const modalError = ref("");

// ── Computed ───────────────────────────────────────────────────────────────
const showActions = computed(
  () => canUpdateMakeupClasses.value || canDeleteMakeupClasses.value
);

const activeFilterCount = computed(() =>
  countActiveFilters([
    idFilter.value,
    studentNameFilter.value,
    teacherIdFilter.value,
    statusFilter.value,
    dateFromFilter.value,
    dateToFilter.value,
  ])
);

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(dateString?: string | null, withTime = true) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("pt-BR", {
    dateStyle: "short",
    ...(withTime ? { timeStyle: "short" } : {}),
  });
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "available": return "badge-info";
    case "scheduled": return "badge-primary";
    case "concluded": return "badge-success";
    case "expired":   return "badge-danger";
    default:          return "badge-secondary";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "available": return "Disponível";
    case "scheduled": return "Agendada";
    case "concluded": return "Concluída";
    case "expired":   return "Expirada";
    default:          return status;
  }
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

// ── Data Fetching ──────────────────────────────────────────────────────────
async function loadMakeupClasses() {
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
      teacher_id: teacherIdFilter.value ? Number(teacherIdFilter.value) : undefined,
      status: statusFilter.value ? (String(statusFilter.value) as MakeupClassStatus) : undefined,
      original_date_from: dateFromFilter.value || undefined,
      original_date_to: dateToFilter.value || undefined,
    });

    makeupClasses.value = result.data;
    total.value = result.total;
    lastPage.value = result.last_page;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar reposições.";
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
  loadMakeupClasses();
}

function clearFilters() {
  idFilter.value = "";
  studentNameFilter.value = "";
  teacherIdFilter.value = null;
  statusFilter.value = null;
  dateFromFilter.value = "";
  dateToFilter.value = "";
  page.value = 1;
  loadMakeupClasses();
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;
  page.value = nextPage;
  loadMakeupClasses();
}

// ── Actions ────────────────────────────────────────────────────────────────
async function removeMakeupClass(item: MakeupClass) {
  const confirmed = await confirmDelete({
    entityLabel: "aula de reposição",
    itemName: `#${item.id} (${getStudentName(item)})`,
  });
  if (!confirmed) return;

  try {
    await deleteMakeupClass(item.id);
    notifyRemoved("Aula de Reposição");
    await loadMakeupClasses();
  } catch (e) {
    notify.error(e instanceof Error ? e.message : "Erro ao excluir reposição.");
  }
}

async function markAsConcluded(item: MakeupClass) {
  try {
    await updateMakeupClass(item.id, { status: "concluded" });
    notify.success(`Reposição #${item.id} marcada como concluída!`);
    await loadMakeupClasses();
  } catch (e) {
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
    notify.success("Link público copiado para a área de transferência!");
  } catch {
    window.open(url, "_blank");
  }
}

function openSchedulingModal(item: MakeupClass) {
  schedulingItem.value = item;
  modalNewDate.value = item.new_date ? item.new_date.slice(0, 16) : "";
  modalTeacherId.value = item.teacher_id ? String(item.teacher_id) : null;
  modalError.value = "";
}

function closeSchedulingModal() {
  schedulingItem.value = null;
  modalError.value = "";
}

async function saveScheduling() {
  if (!schedulingItem.value) return;
  if (!modalNewDate.value) {
    modalError.value = "Informe a data e horário do agendamento.";
    return;
  }

  modalSaving.value = true;
  modalError.value = "";
  try {
    await updateMakeupClass(schedulingItem.value.id, {
      new_date: modalNewDate.value,
      teacher_id: modalTeacherId.value ? Number(modalTeacherId.value) : undefined,
      status: "scheduled",
    });
    notify.success("Aula de reposição agendada com sucesso!");
    closeSchedulingModal();
    await loadMakeupClasses();
  } catch (e) {
    modalError.value = e instanceof Error ? e.message : "Erro ao agendar reposição.";
  } finally {
    modalSaving.value = false;
  }
}

onMounted(() => {
  loadOptions();
  loadMakeupClasses();
});
</script>

<template>
  <div class="container-fluid">
    <!-- Page Header -->
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Aulas de Reposição</h4>
          <p class="mb-0">Gerencie os créditos e o agendamento de reposições de aula</p>
        </div>
      </div>
      <div
        v-if="canCreateMakeupClasses"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/makeup-classes/create" class="btn btn-primary">
          <i class="la la-plus me-1"></i> Nova reposição
        </RouterLink>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Filter Panel -->
    <FilterPanel
      :active-count="activeFilterCount"
      @filter="handleSearch"
      @clear="clearFilters"
    >
      <div class="row g-3">
        <div class="col-md-6 col-lg-2">
          <FilterField label="#" id="makeup-filter-id" hint="ID da reposição">
            <input
              id="makeup-filter-id"
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
          <FilterField label="Status" id="makeup-filter-status">
            <SingleSelect
              id="makeup-filter-status"
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Todos os status"
              :searchable="false"
            />
          </FilterField>
        </div>

        <div class="col-md-6 col-lg-3">
          <FilterField label="Professor" id="makeup-filter-teacher">
            <SingleSelect
              id="makeup-filter-teacher"
              v-model="teacherIdFilter"
              :options="teacherOptions"
              placeholder="Todos os professores"
              :searchable="true"
            />
          </FilterField>
        </div>

        <div class="col-md-6 col-lg-2">
          <FilterField label="Data Falta (De)" id="makeup-filter-date-from">
            <input
              id="makeup-filter-date-from"
              v-model="dateFromFilter"
              type="date"
              class="form-control"
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>

        <div class="col-md-6 col-lg-2">
          <FilterField label="Data Falta (Até)" id="makeup-filter-date-to">
            <input
              id="makeup-filter-date-to"
              v-model="dateToFilter"
              type="date"
              class="form-control"
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
      </div>
    </FilterPanel>

    <!-- Table Card -->
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">Lista de reposições ({{ total }})</h4>
      </div>

      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="text-muted mt-2 mb-0">Carregando reposições...</p>
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
                  <span class="badge" :class="getStatusBadgeClass(item.status)">
                    {{ getStatusLabel(item.status) }}
                  </span>
                </td>
                <td v-if="showActions" class="text-end text-nowrap">
                  <!-- Agendar / Reagendar modal -->
                  <button
                    v-if="canUpdateMakeupClasses && (item.status === 'available' || item.status === 'scheduled')"
                    type="button"
                    class="btn btn-xs sharp btn-info me-1"
                    :title="item.status === 'available' ? 'Agendar reposição' : 'Reagendar reposição'"
                    :aria-label="item.status === 'available' ? 'Agendar reposição' : 'Reagendar reposição'"
                    @click="openSchedulingModal(item)"
                  >
                    <i class="fa fa-calendar-plus-o"></i>
                  </button>

                  <!-- Marcar como Concluída (quando agendada) -->
                  <button
                    v-if="canUpdateMakeupClasses && item.status === 'scheduled'"
                    type="button"
                    class="btn btn-xs sharp btn-success me-1"
                    title="Marcar como concluída"
                    aria-label="Marcar como concluída"
                    @click="markAsConcluded(item)"
                  >
                    <i class="fa fa-check"></i>
                  </button>

                  <!-- Copiar Link Público -->
                  <button
                    v-if="item.public_token"
                    type="button"
                    class="btn btn-xs sharp btn-secondary me-1"
                    title="Copiar link público"
                    aria-label="Copiar link público"
                    @click="copyPublicLink(item)"
                  >
                    <i class="fa fa-link"></i>
                  </button>

                  <!-- Editar -->
                  <RouterLink
                    v-if="canUpdateMakeupClasses"
                    :to="`/makeup-classes/${item.id}/edit`"
                    class="btn btn-xs sharp btn-primary me-1"
                    title="Editar reposição"
                    :aria-label="`Editar reposição ${item.id}`"
                  >
                    <i class="fa fa-pencil"></i>
                  </RouterLink>

                  <!-- Excluir -->
                  <button
                    v-if="canDeleteMakeupClasses"
                    type="button"
                    class="btn btn-xs sharp btn-danger"
                    title="Excluir reposição"
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
      </div>

      <div class="card-footer border-0 bg-transparent pt-3 d-flex justify-content-end">
        <ListPagination
          :page="page"
          :last-page="lastPage"
          :total="total"
          @update:page="goToPage"
        />
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════
         Agendar Reposição Modal (Teleported)
         ═══════════════════════════════════════════════ -->
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
                <div class="form-control bg-light" readonly>
                  {{ getStudentName(schedulingItem) }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Data e Horário do Agendamento *</label>
                <input
                  type="datetime-local"
                  class="form-control"
                  v-model="modalNewDate"
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
                <span>{{ modalSaving ? 'Salvando...' : 'Salvar agendamento' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
