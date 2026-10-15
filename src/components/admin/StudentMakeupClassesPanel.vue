<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import FilterField from "@/components/ui/FilterField.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import AppDatePicker from "@/components/ui/AppDatePicker.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { notify, notifyRemoved } from "@/lib/actionNotification";
import { confirmDelete } from "@/lib/confirm";
import { countActiveFilters } from "@/lib/filters/query";
import { formatMakeupClassStatusBadge } from "@/lib/makeupClasses/format";
import {
  deleteMakeupClass,
  listMakeupClasses,
  updateMakeupClass,
} from "@/lib/makeupClasses";
import { getStudentMakeupSummary } from "@/lib/students";
import { getTeacherOptions } from "@/lib/teachers";
import type { MakeupClass, MakeupClassStatus } from "@/lib/types";
import type { StudentMakeupSummary } from "@/lib/makeupClasses";

const props = defineProps<{
  studentId: number;
}>();

const {
  canViewMakeupClasses,
  canCreateMakeupClasses,
  canUpdateMakeupClasses,
  canDeleteMakeupClasses,
} = usePermissions();

const loading = ref(true);
const error = ref("");
const summary = ref<StudentMakeupSummary | null>(null);
const makeupClasses = ref<MakeupClass[]>([]);
const total = ref(0);
const page = ref(1);
const lastPage = ref(1);

const idFilter = ref("");
const statusFilter = ref<string | number | null>(null);
const teacherIdFilter = ref<string | number | null>(null);
const dateFromFilter = ref("");
const dateToFilter = ref("");

const statusOptions: SelectOption[] = [
  { value: "available", label: "Disponível" },
  { value: "scheduled", label: "Agendada" },
  { value: "concluded", label: "Concluída" },
  { value: "expired", label: "Expirada" },
];

const teacherOptions = ref<SelectOption[]>([]);

const schedulingItem = ref<MakeupClass | null>(null);
const modalNewDateISO = ref<string | null>(null); // YYYY-MM-DD
const modalTeacherId = ref<string | number | null>(null);
const modalSaving = ref(false);
const modalError = ref("");

const showActions = computed(
  () => canUpdateMakeupClasses.value || canDeleteMakeupClasses.value
);

const activeFilterCount = computed(() =>
  countActiveFilters([
    idFilter.value,
    statusFilter.value,
    teacherIdFilter.value,
    dateFromFilter.value,
    dateToFilter.value,
  ])
);

const createLink = computed(
  () => `/makeup-classes/create?student_id=${props.studentId}`
);

function formatDate(dateString?: string | null, withTime = true) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("pt-BR", {
    dateStyle: "short",
    ...(withTime ? { timeStyle: "short" } : {}),
  });
}

function getTeacherName(item: MakeupClass): string {
  return item.relationships?.teacher?.name ?? item.teacher?.name ?? "—";
}

async function loadSummary() {
  try {
    summary.value = await getStudentMakeupSummary(props.studentId);
  } catch {
    summary.value = null;
  }
}

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
      student_id: props.studentId,
      id: idFilter.value.trim() ? Number(idFilter.value) : undefined,
      teacher_id: teacherIdFilter.value ? Number(teacherIdFilter.value) : undefined,
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
    error.value = e instanceof Error ? e.message : "Erro ao carregar reposições.";
  } finally {
    loading.value = false;
  }
}

async function refresh() {
  await Promise.all([loadSummary(), loadMakeupClasses()]);
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
  statusFilter.value = null;
  teacherIdFilter.value = null;
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

async function removeMakeupClass(item: MakeupClass) {
  const confirmed = await confirmDelete({
    entityLabel: "aula de reposição",
    itemName: `#${item.id}`,
  });
  if (!confirmed) return;

  try {
    await deleteMakeupClass(item.id);
    notifyRemoved("Aula de Reposição");
    await refresh();
  } catch (e) {
    notify.error(e instanceof Error ? e.message : "Erro ao excluir reposição.");
  }
}

async function markAsConcluded(item: MakeupClass) {
  try {
    await updateMakeupClass(item.id, { status: "concluded" });
    notify.success(`Reposição #${item.id} marcada como concluída!`);
    await refresh();
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
    notify.success("Link público copiado para a área de transferência!");
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
      teacher_id: modalTeacherId.value ? Number(modalTeacherId.value) : undefined,
      status: "scheduled",
    });
    notify.success("Aula de reposição agendada com sucesso!");
    closeSchedulingModal();
    await refresh();
  } catch (e) {
    modalError.value = e instanceof Error ? e.message : "Erro ao agendar reposição.";
  } finally {
    modalSaving.value = false;
  }
}

onMounted(async () => {
  await loadOptions();
  await refresh();
});
</script>

<template>
  <div class="student-makeup pt-4 pb-3">
    <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
      <div>
        <h4 class="text-primary mb-1">Reposições do aluno</h4>
        <p class="text-muted mb-0">
          Créditos de falta, prazos e agendamento vinculados a este aluno.
        </p>
      </div>

      <div class="d-flex flex-wrap align-items-center gap-2">
        <RouterLink to="/makeup-classes" class="btn btn-outline-secondary btn-sm">
          Ver todas
        </RouterLink>
        <RouterLink
          v-if="canCreateMakeupClasses"
          :to="createLink"
          class="btn btn-primary btn-sm"
        >
          <i class="la la-plus me-1"></i>
          Nova reposição
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger mb-4">{{ error }}</div>

    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-xl-3">
        <div class="card border mb-0 h-100">
          <div class="card-body p-3">
            <span class="text-muted small d-block fw-semibold text-uppercase">
              Créditos disponíveis
            </span>
            <h3 class="mb-0 fw-bold text-success">
              {{ loading && !summary ? "—" : (summary?.available_credits ?? 0) }}
            </h3>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card border mb-0 h-100">
          <div class="card-body p-3">
            <span class="text-muted small d-block fw-semibold text-uppercase">
              Agendadas
            </span>
            <h3 class="mb-0 fw-bold text-primary">
              {{ loading && !summary ? "—" : (summary?.scheduled_classes ?? 0) }}
            </h3>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card border mb-0 h-100">
          <div class="card-body p-3">
            <span class="text-muted small d-block fw-semibold text-uppercase">
              Usadas no ciclo
            </span>
            <h3 class="mb-0 fw-bold text-dark">
              {{ loading && !summary ? "—" : `${summary?.used ?? 0} / ${summary?.limit ?? 0}` }}
            </h3>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card border mb-0 h-100">
          <div class="card-body p-3">
            <span class="text-muted small d-block fw-semibold text-uppercase">
              Expirando em breve
            </span>
            <h3 class="mb-0 fw-bold text-warning">
              {{ loading && !summary ? "—" : (summary?.expiring_soon_count ?? 0) }}
            </h3>
          </div>
        </div>
      </div>
    </div>

    <FilterPanel
      :active-count="activeFilterCount"
      @filter="handleSearch"
      @clear="clearFilters"
    >
      <div class="row g-3">
        <div class="col-md-6 col-lg-2">
          <FilterField label="#" id="student-makeup-filter-id" hint="ID da reposição">
            <input
              id="student-makeup-filter-id"
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
          <FilterField label="Status" id="student-makeup-filter-status">
            <SingleSelect
              id="student-makeup-filter-status"
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Todos os status"
              :searchable="false"
            />
          </FilterField>
        </div>

        <div class="col-md-6 col-lg-3">
          <FilterField label="Professor" id="student-makeup-filter-teacher">
            <SingleSelect
              id="student-makeup-filter-teacher"
              v-model="teacherIdFilter"
              :options="teacherOptions"
              placeholder="Todos os professores"
              :searchable="true"
            />
          </FilterField>
        </div>

        <div class="col-md-6 col-lg-2">
          <AppDatePicker
            id="student-makeup-filter-from"
            v-model="dateFromFilter"
            label="Data falta (de)"
            placeholder="DD/MM/AAAA"
          />
        </div>

        <div class="col-md-6 col-lg-2">
          <AppDatePicker
            id="student-makeup-filter-to"
            v-model="dateToFilter"
            label="Data falta (até)"
            placeholder="DD/MM/AAAA"
          />
        </div>
      </div>
    </FilterPanel>

    <div class="card border mb-0">
      <div class="card-header bg-transparent py-3">
        <h5 class="card-title mb-0">Créditos de reposição ({{ total }})</h5>
      </div>

      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
        </div>

        <div v-else class="table-responsive makeup-credits-table-wrap">
          <table class="table table-hover align-middle mb-0 makeup-credits-table w-100">
            <thead>
              <tr>
                <th>#</th>
                <th>Matrícula</th>
                <th>Professor</th>
                <th>Data da falta</th>
                <th>Data limite</th>
                <th>Data agendada</th>
                <th>Status</th>
                <th v-if="showActions" class="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="makeupClasses.length === 0">
                <td :colspan="showActions ? 8 : 7" class="text-center text-muted py-4">
                  Nenhuma reposição registrada para este aluno.
                </td>
              </tr>

              <tr v-for="item in makeupClasses" :key="item.id">
                <td>{{ item.id }}</td>
                <td>
                  <span v-if="item.enrollment_id">#{{ item.enrollment_id }}</span>
                  <span v-else class="text-muted">—</span>
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
                    v-if="
                      canUpdateMakeupClasses &&
                      (item.status === 'available' || item.status === 'scheduled')
                    "
                    type="button"
                    class="btn btn-xs sharp btn-info me-1"
                    :title="
                      item.status === 'available' ? 'Agendar reposição' : 'Reagendar reposição'
                    "
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
                    title="Editar reposição"
                  >
                    <i class="fa fa-pencil"></i>
                  </RouterLink>

                  <button
                    v-if="canDeleteMakeupClasses"
                    type="button"
                    class="btn btn-xs sharp btn-danger"
                    title="Excluir reposição"
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

      <div
        v-if="!loading && lastPage > 1"
        class="card-footer border-0 bg-transparent pt-3 d-flex justify-content-end"
      >
        <ListPagination
          :page="page"
          :last-page="lastPage"
          :total="total"
          @update:page="goToPage"
        />
      </div>
    </div>

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
              <h5 class="modal-title">Agendar reposição #{{ schedulingItem.id }}</h5>
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
                <AppDatePicker
                  id="student-makeup-modal-new-date"
                  v-model="modalNewDateISO"
                  label="Data do agendamento *"
                  placeholder="DD/MM/AAAA"
                  required
                />
              </div>



              <div class="mb-3">
                <label class="form-label fw-semibold">Professor responsável</label>
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

<style scoped>
.makeup-credits-table-wrap {
  width: 100%;
}

.makeup-credits-table {
  width: 100%;
  table-layout: fixed;
}

.makeup-credits-table th:nth-child(1),
.makeup-credits-table td:nth-child(1) {
  width: 4rem;
}

.makeup-credits-table th:nth-child(2),
.makeup-credits-table td:nth-child(2) {
  width: 6rem;
}

.makeup-credits-table th:nth-child(3),
.makeup-credits-table td:nth-child(3) {
  width: 18%;
}

.makeup-credits-table th:nth-child(8),
.makeup-credits-table td:nth-child(8) {
  width: 11rem;
}
</style>
