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

import FilterPanel from "@/components/ui/FilterPanel.vue";
import FilterField from "@/components/ui/FilterField.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import ListPagination from "@/components/ui/ListPagination.vue";

const router = useRouter();
const { canCreateMakeupClasses, canUpdateMakeupClasses, canDeleteMakeupClasses } = usePermissions();

// ── State ──────────────────────────────────────────────────────────────────
const loading = ref(false);
const error = ref(false);
const makeupClasses = ref<MakeupClass[]>([]);
const total = ref(0);
const page = ref(1);
const lastPage = ref(1);

// Filters
type TabFilter = "all" | "pending" | "available" | "scheduled" | "concluded" | "expired" | "expiring_soon";
const activeTab = ref<TabFilter>("all");
const statusFilter = ref<MakeupClassStatus | "pending" | null>(null);
const expiringSoonFilter = ref<boolean>(false);
const sortByUrgency = ref<boolean>(false);

// Summary Metrics
const summaryMetrics = ref({
  available: 0,
  scheduled: 0,
  concluded: 0,
  expired: 0,
  expiring_soon: 0,
});

// Options
const statusOptions = [
  { value: "pending", label: "Pendentes / Em Aberto (Disponíveis + Agendadas)" },
  { value: "available", label: "Disponível para Agendamento" },
  { value: "scheduled", label: "Agendada" },
  { value: "concluded", label: "Concluída" },
  { value: "expired", label: "Expirada" },
];

const teacherOptions = ref<Record<string, string>>({});

// Modal & Toast state
const schedulingItem = ref<MakeupClass | null>(null);
const modalNewDate = ref("");
const modalTeacherId = ref<number | null>(null);
const modalSaving = ref(false);
const copyToast = ref(false);
let copyToastTimer: ReturnType<typeof setTimeout> | null = null;

// ── Computed ───────────────────────────────────────────────────────────────
const totalCount = computed(() => {
  return (
    summaryMetrics.value.available +
    summaryMetrics.value.scheduled +
    summaryMetrics.value.concluded +
    summaryMetrics.value.expired
  );
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (statusFilter.value) count += 1;
  if (expiringSoonFilter.value) count += 1;
  if (sortByUrgency.value) count += 1;
  return count;
});

// ── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (dateString?: string | null, withTime = true) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("pt-BR", {
    dateStyle: "short",
    ...(withTime ? { timeStyle: "short" } : {}),
  });
};

const daysUntil = (dateString?: string | null): number | null => {
  if (!dateString) return null;
  const diff = new Date(dateString).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
};

const isExpiringSoon = (item: MakeupClass): boolean => {
  if (item.status !== "available") return false;
  const d = daysUntil(item.expired_date);
  return d !== null && d >= 0 && d <= 7;
};

const isOverdue = (item: MakeupClass): boolean => {
  if (item.status !== "available") return false;
  const d = daysUntil(item.expired_date);
  return d !== null && d < 0;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "available":
      return "badge-status badge-status--available";
    case "scheduled":
      return "badge-status badge-status--scheduled";
    case "concluded":
      return "badge-status badge-status--concluded";
    case "expired":
      return "badge-status badge-status--expired";
    default:
      return "badge-status badge-status--default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "available":
      return "Disponível";
    case "scheduled":
      return "Agendada";
    case "concluded":
      return "Concluída";
    case "expired":
      return "Expirada";
    default:
      return status;
  }
};

const getInitials = (name?: string | null): string => {
  if (!name) return "ST";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getPublicSchedulingUrl = (token: string): string => {
  return `${window.location.origin}/public/makeup-classes/${token}`;
};

// ── API Operations ─────────────────────────────────────────────────────────
const loadSummaryMetrics = async () => {
  try {
    const [avail, sched, conc, exp, expSoon] = await Promise.all([
      listMakeupClasses({ limit: 1, status: "available" }),
      listMakeupClasses({ limit: 1, status: "scheduled" }),
      listMakeupClasses({ limit: 1, status: "concluded" }),
      listMakeupClasses({ limit: 1, status: "expired" }),
      listMakeupClasses({ limit: 1, status: "available", expiring_soon: true }),
    ]);
    summaryMetrics.value = {
      available: avail.total,
      scheduled: sched.total,
      concluded: conc.total,
      expired: exp.total,
      expiring_soon: expSoon.total,
    };
  } catch (err) {
    console.error("Error loading summary metrics:", err);
  }
};

const loadMakeupClasses = async () => {
  loading.value = true;
  error.value = false;
  try {
    const params: Parameters<typeof listMakeupClasses>[0] = {
      page: page.value,
      status: statusFilter.value || undefined,
      expiring_soon: expiringSoonFilter.value || undefined,
      sort_by_urgency: sortByUrgency.value || undefined,
    };

    const data = await listMakeupClasses(params);
    makeupClasses.value = data.data;
    total.value = data.total;
    lastPage.value = data.last_page;
  } catch (err) {
    console.error(err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const refreshAll = () => {
  loadMakeupClasses();
  loadSummaryMetrics();
};

// ── Tab Selection ──────────────────────────────────────────────────────────
const selectTab = (tab: TabFilter) => {
  activeTab.value = tab;
  page.value = 1;

  if (tab === "all") {
    statusFilter.value = null;
    expiringSoonFilter.value = false;
  } else if (tab === "expiring_soon") {
    statusFilter.value = "available";
    expiringSoonFilter.value = true;
  } else {
    statusFilter.value = tab as MakeupClassStatus | "pending";
    expiringSoonFilter.value = false;
  }

  loadMakeupClasses();
};

// ── Filter Panel Actions ───────────────────────────────────────────────────
const handleFilter = () => {
  page.value = 1;
  // Sync tab state
  if (expiringSoonFilter.value && statusFilter.value === "available") {
    activeTab.value = "expiring_soon";
  } else if (statusFilter.value) {
    activeTab.value = statusFilter.value as TabFilter;
  } else {
    activeTab.value = "all";
  }
  loadMakeupClasses();
};

const clearFilters = () => {
  statusFilter.value = null;
  expiringSoonFilter.value = false;
  sortByUrgency.value = false;
  activeTab.value = "all";
  page.value = 1;
  loadMakeupClasses();
};

// ── Direct Actions ─────────────────────────────────────────────────────────
const editMakeupClass = (id: number) => {
  router.push(`/makeup-classes/${id}/edit`);
};

const markAsConcluded = async (item: MakeupClass) => {
  try {
    await updateMakeupClass(item.id, { status: "concluded" });
    notify.success(`Reposição #${item.id} marcada como concluída!`);
    refreshAll();
  } catch (err) {
    notify.error("Erro ao marcar aula de reposição como concluída.");
  }
};

const confirmDelete = async (item: MakeupClass) => {
  if (!confirm(`Tem certeza que deseja excluir esta aula de reposição (#${item.id})?`)) return;
  try {
    await deleteMakeupClass(item.id);
    notifyRemoved("Aula de Reposição");
    refreshAll();
  } catch (err) {
    console.error(err);
    notify.error("Erro ao excluir aula de reposição.");
  }
};

const copyPublicLink = async (item: MakeupClass) => {
  if (!item.public_token) {
    notify.error("Token público indisponível para esta reposição.");
    return;
  }
  const url = getPublicSchedulingUrl(item.public_token);
  try {
    await navigator.clipboard.writeText(url);
    if (copyToastTimer) clearTimeout(copyToastTimer);
    copyToast.value = true;
    copyToastTimer = setTimeout(() => {
      copyToast.value = false;
    }, 2800);
    notify.success("Link público copiado para a área de transferência!");
  } catch {
    notify.error("Não foi possível copiar o link.");
  }
};

// ── Scheduling Modal ───────────────────────────────────────────────────────
const openSchedulingModal = async (item: MakeupClass) => {
  schedulingItem.value = item;
  modalNewDate.value = item.new_date
    ? new Date(item.new_date).toISOString().slice(0, 16)
    : "";
  modalTeacherId.value = item.teacher_id || null;

  if (Object.keys(teacherOptions.value).length === 0) {
    try {
      teacherOptions.value = await getTeacherOptions();
    } catch (e) {
      console.error("Error loading teachers:", e);
    }
  }
};

const closeSchedulingModal = () => {
  schedulingItem.value = null;
  modalNewDate.value = "";
  modalTeacherId.value = null;
};

const saveScheduling = async () => {
  if (!schedulingItem.value) return;
  if (!modalNewDate.value) {
    notify.error("Por favor, selecione a nova data e horário.");
    return;
  }

  modalSaving.value = true;
  try {
    await updateMakeupClass(schedulingItem.value.id, {
      new_date: modalNewDate.value,
      teacher_id: modalTeacherId.value || undefined,
      status: "scheduled",
    });
    notify.success("Aula de reposição agendada com sucesso!");
    closeSchedulingModal();
    refreshAll();
  } catch (err) {
    console.error(err);
    notify.error("Erro ao agendar a aula de reposição.");
  } finally {
    modalSaving.value = false;
  }
};

onMounted(async () => {
  refreshAll();
  try {
    teacherOptions.value = await getTeacherOptions();
  } catch (e) {
    console.warn("Could not prefetch teacher options:", e);
  }
});
</script>

<template>
  <div class="container-fluid">
    <!-- Page Header -->
    <div class="row page-titles mx-0 align-items-center">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4 class="mb-1 text-primary fw-bold">
            <i class="la la-calendar-check me-2"></i>Aulas de Reposição
          </h4>
          <p class="mb-0 text-muted">Gestão centralizada de créditos de reposição e aulas agendadas</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex gap-2">
        <button
          class="btn btn-outline-secondary"
          title="Recarregar dados"
          @click="refreshAll"
        >
          <i class="la la-sync-alt" :class="{ 'fa-spin': loading }"></i>
        </button>
        <RouterLink
          v-if="canCreateMakeupClasses"
          to="/makeup-classes/create"
          class="btn btn-primary shadow-sm"
        >
          <i class="la la-plus me-1"></i> Nova Reposição
        </RouterLink>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════
         Interactive Summary Metrics Header
         ═══════════════════════════════════════════════ -->
    <div class="row g-3 mb-4">
      <!-- Disponíveis -->
      <div class="col-xl-3 col-sm-6">
        <div
          class="metric-box metric-box--emerald"
          :class="{ 'metric-box--active': activeTab === 'available' }"
          role="button"
          @click="selectTab('available')"
        >
          <div class="metric-box__icon"><i class="la la-check-circle"></i></div>
          <div class="metric-box__body">
            <span class="metric-box__label">Disponíveis p/ Agendamento</span>
            <span class="metric-box__value">{{ summaryMetrics.available }}</span>
          </div>
          <span class="metric-box__badge metric-box__badge--emerald">créditos</span>
        </div>
      </div>

      <!-- Agendadas -->
      <div class="col-xl-3 col-sm-6">
        <div
          class="metric-box metric-box--sky"
          :class="{ 'metric-box--active': activeTab === 'scheduled' }"
          role="button"
          @click="selectTab('scheduled')"
        >
          <div class="metric-box__icon"><i class="la la-calendar"></i></div>
          <div class="metric-box__body">
            <span class="metric-box__label">Aulas Agendadas</span>
            <span class="metric-box__value">{{ summaryMetrics.scheduled }}</span>
          </div>
          <span class="metric-box__badge metric-box__badge--sky">agendadas</span>
        </div>
      </div>

      <!-- Expirando em Breve -->
      <div class="col-xl-3 col-sm-6">
        <div
          class="metric-box"
          :class="[
            summaryMetrics.expiring_soon > 0 ? 'metric-box--amber metric-box--pulse' : 'metric-box--neutral',
            { 'metric-box--active': activeTab === 'expiring_soon' }
          ]"
          role="button"
          @click="selectTab('expiring_soon')"
        >
          <div class="metric-box__icon"><i class="la la-exclamation-triangle"></i></div>
          <div class="metric-box__body">
            <span class="metric-box__label">Atenção — Expirando</span>
            <span class="metric-box__value">{{ summaryMetrics.expiring_soon }}</span>
          </div>
          <span
            v-if="summaryMetrics.expiring_soon > 0"
            class="metric-box__badge metric-box__badge--amber"
          >
            próx. 7 dias
          </span>
          <span v-else class="metric-box__badge metric-box__badge--ok">em dia</span>
        </div>
      </div>

      <!-- Concluídas -->
      <div class="col-xl-3 col-sm-6">
        <div
          class="metric-box metric-box--teal"
          :class="{ 'metric-box--active': activeTab === 'concluded' }"
          role="button"
          @click="selectTab('concluded')"
        >
          <div class="metric-box__icon"><i class="la la-graduation-cap"></i></div>
          <div class="metric-box__body">
            <span class="metric-box__label">Concluídas</span>
            <span class="metric-box__value">{{ summaryMetrics.concluded }}</span>
          </div>
          <span class="metric-box__badge metric-box__badge--teal">histórico</span>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════
         Segmented Navigation Tabs
         ═══════════════════════════════════════════════ -->
    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body p-2 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div class="d-flex flex-wrap gap-1 align-items-center">
          <!-- Todas (Total count) -->
          <button
            class="tab-pill"
            :class="{ 'tab-pill--active': activeTab === 'all' }"
            @click="selectTab('all')"
          >
            Todas
            <span class="tab-pill__count">{{ totalCount }}</span>
          </button>

          <!-- Aguardando Agendamento (Counter of available credits) -->
          <button
            class="tab-pill"
            :class="{ 'tab-pill--active': activeTab === 'available' }"
            @click="selectTab('available')"
          >
            <i class="la la-hourglass-half me-1"></i> Aguardando Agendamento
            <span class="tab-pill__count">{{ summaryMetrics.available }}</span>
          </button>

          <!-- Agendadas (Counter of scheduled classes) -->
          <button
            class="tab-pill"
            :class="{ 'tab-pill--active': activeTab === 'scheduled' }"
            @click="selectTab('scheduled')"
          >
            <i class="la la-calendar me-1"></i> Agendadas
            <span class="tab-pill__count">{{ summaryMetrics.scheduled }}</span>
          </button>

          <!-- Concluídas (Counter of concluded classes) -->
          <button
            class="tab-pill"
            :class="{ 'tab-pill--active': activeTab === 'concluded' }"
            @click="selectTab('concluded')"
          >
            <i class="la la-check-circle me-1"></i> Concluídas
            <span class="tab-pill__count">{{ summaryMetrics.concluded }}</span>
          </button>

          <!-- Expiradas (Counter of expired credits) -->
          <button
            class="tab-pill"
            :class="{ 'tab-pill--active': activeTab === 'expired' }"
            @click="selectTab('expired')"
          >
            <i class="la la-times-circle me-1"></i> Expiradas
            <span class="tab-pill__count">{{ summaryMetrics.expired }}</span>
          </button>

          <!-- Expirando em Breve (Alert pill) -->
          <button
            v-if="summaryMetrics.expiring_soon > 0 || activeTab === 'expiring_soon'"
            class="tab-pill tab-pill--warn"
            :class="{ 'tab-pill--active': activeTab === 'expiring_soon' }"
            @click="selectTab('expiring_soon')"
          >
            <i class="la la-fire me-1"></i> Expirando em Breve
            <span class="tab-pill__count tab-pill__count--warn">{{ summaryMetrics.expiring_soon }}</span>
          </button>
        </div>

        <div class="d-flex align-items-center gap-2">
          <div class="form-check form-switch mb-0">
            <input
              id="urgencySwitch"
              v-model="sortByUrgency"
              class="form-check-input"
              type="checkbox"
              @change="handleFilter"
            />
            <label class="form-check-label small text-muted user-select-none" for="urgencySwitch">
              Ordenar por Urgência
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════
         Filter Panel (Expandable)
         ═══════════════════════════════════════════════ -->
    <FilterPanel
      title="Filtros Detalhados"
      :active-count="activeFilterCount"
      @apply="handleFilter"
      @clear="clearFilters"
    >
      <div class="row g-3">
        <div class="col-md-4">
          <FilterField label="Status">
            <SingleSelect
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Todos os status"
            />
          </FilterField>
        </div>

        <div class="col-md-4 d-flex align-items-end">
          <div class="form-check mb-2">
            <input
              id="expSoonCheck"
              v-model="expiringSoonFilter"
              class="form-check-input"
              type="checkbox"
            />
            <label class="form-check-label text-dark" for="expSoonCheck">
              Somente créditos expirando nos próximos 7 dias
            </label>
          </div>
        </div>
      </div>
    </FilterPanel>

    <!-- ═══════════════════════════════════════════════
         Main Content Table
         ═══════════════════════════════════════════════ -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="text-muted small mt-2">Carregando aulas de reposição...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="alert alert-danger m-4">
          <i class="la la-exclamation-circle me-2"></i>
          Ocorreu um erro ao carregar as aulas de reposição.
        </div>

        <!-- Empty state -->
        <div v-else-if="makeupClasses.length === 0" class="text-center py-5 text-muted">
          <i class="la la-calendar-times fs-2 d-block mb-2 text-secondary opacity-50"></i>
          <p class="mb-1 fw-semibold">Nenhuma aula de reposição encontrada</p>
          <small>Tente ajustar os filtros acima ou registre uma nova reposição.</small>
        </div>

        <!-- Table View -->
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0 custom-makeup-table">
            <thead>
              <tr>
                <th style="min-width: 220px;">Aluno &amp; Matrícula</th>
                <th style="min-width: 130px;">Status</th>
                <th style="min-width: 200px;">Data Original vs. Reposição</th>
                <th style="min-width: 150px;">Validade / Expiração</th>
                <th style="min-width: 160px;">Professor / Turma</th>
                <th class="text-end" style="min-width: 200px;">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in makeupClasses"
                :key="item.id"
                :class="[
                  'makeup-row',
                  `makeup-row--${item.status}`,
                  { 'makeup-row--unresolved': item.status === 'available' || item.status === 'scheduled' }
                ]"
              >
                <!-- 1. Aluno & Matrícula -->
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <div class="student-avatar" :class="`student-avatar--${item.status}`">
                      {{ getInitials(item.enrollment?.student?.name) }}
                    </div>
                    <div class="student-info">
                      <template v-if="item.enrollment?.student?.name">
                        <RouterLink
                          :to="`/students/${item.enrollment.student.id}`"
                          class="student-info__name text-decoration-none"
                        >
                          {{ item.enrollment.student.name }}
                        </RouterLink>
                        <div class="student-info__sub text-muted small">
                          Matrícula #{{ item.enrollment.id }}
                        </div>
                      </template>
                      <template v-else-if="item.group_class?.name">
                        <span class="student-info__name">{{ item.group_class.name }}</span>
                        <div class="student-info__sub text-muted small">
                          Turma #{{ item.group_class_id }}
                        </div>
                      </template>
                      <template v-else>
                        <span class="text-muted">#{{ item.enrollment_id || item.group_class_id || '—' }}</span>
                      </template>
                    </div>
                  </div>
                </td>

                <!-- 2. Status -->
                <td>
                  <span :class="getStatusBadge(item.status)">
                    <i
                      v-if="item.status === 'available'"
                      class="la la-circle-notch me-1"
                    ></i>
                    <i
                      v-else-if="item.status === 'scheduled'"
                      class="la la-calendar-check me-1"
                    ></i>
                    <i
                      v-else-if="item.status === 'concluded'"
                      class="la la-check-circle me-1"
                    ></i>
                    <i
                      v-else-if="item.status === 'expired'"
                      class="la la-times-circle me-1"
                    ></i>
                    {{ getStatusLabel(item.status) }}
                  </span>
                  <div class="text-muted small ps-1 mt-1">#{{ item.id }}</div>
                </td>

                <!-- 3. Data Original vs. Reposição -->
                <td>
                  <div class="dates-comparison">
                    <div class="dates-comparison__original text-danger small">
                      <i class="la la-calendar-times me-1"></i>
                      <strong>Falta:</strong> {{ formatDate(item.original_date) }}
                    </div>
                    <div class="dates-comparison__makeup mt-1">
                      <template v-if="item.new_date">
                        <span class="text-success fw-semibold small">
                          <i class="la la-calendar-check me-1"></i>
                          <strong>Reposição:</strong> {{ formatDate(item.new_date) }}
                        </span>
                      </template>
                      <template v-else>
                        <span class="badge bg-light text-muted border small fw-normal">
                          <i class="la la-hourglass-start me-1"></i>
                          Pendente de agendamento
                        </span>
                      </template>
                    </div>
                  </div>
                </td>

                <!-- 4. Validade / Expiração -->
                <td>
                  <div class="expiry-box">
                    <span
                      class="expiry-box__date small"
                      :class="{ 'text-danger fw-semibold': isOverdue(item) || isExpiringSoon(item) }"
                    >
                      <i class="la la-clock text-muted me-1"></i>
                      {{ formatDate(item.expired_date, false) }}
                    </span>

                    <!-- Amber warning icon with tooltip if <= 7 days -->
                    <div v-if="isExpiringSoon(item)" class="mt-1">
                      <span
                        class="badge-urgency badge-urgency--warning"
                        :title="daysUntil(item.expired_date) === 0 ? 'Vence hoje!' : `Expira em ${daysUntil(item.expired_date)} dias`"
                      >
                        <i class="la la-exclamation-triangle me-1"></i>
                        {{ daysUntil(item.expired_date) === 0 ? 'Vence hoje!' : `Expira em ${daysUntil(item.expired_date)} dias` }}
                      </span>
                    </div>
                    <div v-else-if="isOverdue(item) || item.status === 'expired'" class="mt-1">
                      <span class="badge-urgency badge-urgency--danger" title="Prazo de reposição vencido">
                        <i class="la la-times-circle me-1"></i>
                        Expirada
                      </span>
                    </div>
                  </div>
                </td>

                <!-- 5. Professor / Turma -->
                <td>
                  <div class="teacher-class-cell">
                    <div v-if="item.teacher?.name" class="text-dark small fw-semibold">
                      <i class="la la-user-tie me-1 text-primary"></i>
                      {{ item.teacher.name }}
                    </div>
                    <div v-else-if="item.status === 'available'" class="text-muted small fst-italic">
                      Não atribuído
                    </div>
                    <div v-if="item.group_class?.name" class="text-muted small mt-1">
                      <i class="la la-users me-1"></i>
                      {{ item.group_class.name }}
                    </div>
                  </div>
                </td>

                <!-- 6. Ações -->
                <td class="text-end">
                  <div class="d-flex gap-1 justify-content-end align-items-center flex-wrap">
                    <!-- Agendar / Reagendar -->
                    <button
                      v-if="canUpdateMakeupClasses && (item.status === 'available' || item.status === 'scheduled')"
                      class="btn btn-sm"
                      :class="item.status === 'available' ? 'btn-primary-soft' : 'btn-outline-primary'"
                      :title="item.status === 'available' ? 'Agendar Reposição' : 'Reagendar Reposição'"
                      @click="openSchedulingModal(item)"
                    >
                      <i class="la la-calendar-plus me-1"></i>
                      {{ item.status === 'available' ? 'Agendar' : 'Reagendar' }}
                    </button>

                    <!-- Marcar como Concluída (one-click) -->
                    <button
                      v-if="canUpdateMakeupClasses && item.status === 'scheduled'"
                      class="btn btn-sm btn-success-soft"
                      title="Marcar aula como concluída"
                      @click="markAsConcluded(item)"
                    >
                      <i class="la la-check me-1"></i> Concluir
                    </button>

                    <!-- Copiar Token / Link Público -->
                    <button
                      v-if="item.public_token"
                      class="btn btn-sm btn-outline-secondary"
                      title="Copiar link público para auto-agendamento do aluno"
                      @click="copyPublicLink(item)"
                    >
                      <i class="la la-link"></i>
                    </button>

                    <!-- Editar -->
                    <button
                      v-if="canUpdateMakeupClasses"
                      class="btn btn-sm btn-outline-primary"
                      title="Editar registro completo"
                      @click="editMakeupClass(item.id)"
                    >
                      <i class="la la-pencil"></i>
                    </button>

                    <!-- Excluir -->
                    <button
                      v-if="canDeleteMakeupClasses"
                      class="btn btn-sm btn-outline-danger"
                      title="Excluir reposição"
                      @click="confirmDelete(item)"
                    >
                      <i class="la la-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="p-3 border-top">
            <ListPagination
              v-model:page="page"
              :last-page="lastPage"
              :total="total"
              @update:page="loadMakeupClasses"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════
         Scheduling Modal (Teleported)
         ═══════════════════════════════════════════════ -->
    <Teleport to="body">
      <div
        v-if="schedulingItem"
        class="custom-modal-backdrop"
        @click.self="closeSchedulingModal"
      >
        <div class="custom-modal">
          <div class="custom-modal__header">
            <h5 class="mb-0 fw-bold text-dark">
              <i class="la la-calendar-plus text-primary me-2"></i>
              Agendar Reposição #{{ schedulingItem.id }}
            </h5>
            <button
              class="btn-close"
              type="button"
              @click="closeSchedulingModal"
            ></button>
          </div>

          <div class="custom-modal__body">
            <!-- Student / Origin Summary Card -->
            <div class="origin-summary-card mb-3 p-3 rounded-3 bg-light border">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="text-muted small">Aluno:</span>
                <strong class="text-dark">
                  {{ schedulingItem.enrollment?.student?.name || '—' }}
                </strong>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="text-muted small">Data da Falta:</span>
                <span class="text-danger small fw-semibold">
                  {{ formatDate(schedulingItem.original_date) }}
                </span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted small">Data Limite:</span>
                <span class="text-dark small fw-semibold">
                  {{ formatDate(schedulingItem.expired_date, false) }}
                </span>
              </div>
            </div>

            <!-- Form: Date & Time -->
            <div class="mb-3">
              <label class="form-label fw-semibold">
                Nova Data e Horário <span class="text-danger">*</span>
              </label>
              <input
                v-model="modalNewDate"
                type="datetime-local"
                class="form-control"
                required
              />
            </div>

            <!-- Form: Teacher -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Professor Responsável</label>
              <select v-model="modalTeacherId" class="form-select">
                <option :value="null">Selecione o professor (opcional)</option>
                <option
                  v-for="(name, id) in teacherOptions"
                  :key="id"
                  :value="Number(id)"
                >
                  {{ name }}
                </option>
              </select>
            </div>

            <!-- Public Self-Service Link Option -->
            <div v-if="schedulingItem.public_token" class="public-link-box p-3 rounded-3 border">
              <label class="form-label small fw-bold text-muted mb-1">
                <i class="la la-share-alt me-1"></i> Link de Auto-Agendamento para o Aluno
              </label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control form-control-sm bg-white"
                  readonly
                  :value="getPublicSchedulingUrl(schedulingItem.public_token)"
                />
                <button
                  class="btn btn-sm btn-outline-secondary"
                  type="button"
                  @click="copyPublicLink(schedulingItem)"
                >
                  <i class="la la-copy me-1"></i> Copiar
                </button>
              </div>
            </div>
          </div>

          <div class="custom-modal__footer">
            <button
              class="btn btn-secondary"
              type="button"
              @click="closeSchedulingModal"
            >
              Cancelar
            </button>
            <button
              class="btn btn-primary"
              type="button"
              :disabled="modalSaving || !modalNewDate"
              @click="saveScheduling"
            >
              <span
                v-if="modalSaving"
                class="spinner-border spinner-border-sm me-1"
                role="status"
              ></span>
              Salvar Agendamento
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Copy Toast Notification -->
    <Teleport to="body">
      <div v-if="copyToast" class="copy-toast">
        <i class="la la-check-circle me-2 fs-5"></i> Link público copiado com sucesso!
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ── Metrics Cards ───────────────────────────────────────── */
.metric-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.15rem 1.25rem;
  border-radius: 0.85rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.metric-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
.metric-box--active {
  box-shadow: 0 0 0 2px var(--bs-primary), 0 6px 16px rgba(0, 0, 0, 0.08);
}
.metric-box__icon {
  font-size: 1.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 0.65rem;
  flex-shrink: 0;
}
.metric-box__body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
}
.metric-box__label {
  font-size: 0.775rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #64748b;
  margin-bottom: 0.15rem;
}
.metric-box__value {
  font-size: 1.65rem;
  font-weight: 800;
  line-height: 1.1;
  color: #0f172a;
}
.metric-box__badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  align-self: flex-start;
}

/* Emerald Variant */
.metric-box--emerald {
  border-left: 4px solid #10b981;
}
.metric-box--emerald .metric-box__icon {
  background: #ecfdf5;
  color: #059669;
}
.metric-box__badge--emerald {
  background: #d1fae5;
  color: #065f46;
}

/* Sky Variant */
.metric-box--sky {
  border-left: 4px solid #0284c7;
}
.metric-box--sky .metric-box__icon {
  background: #f0f9ff;
  color: #0284c7;
}
.metric-box__badge--sky {
  background: #e0f2fe;
  color: #0369a1;
}

/* Amber Variant */
.metric-box--amber {
  border-left: 4px solid #f59e0b;
  background: #fffbeb;
}
.metric-box--amber .metric-box__icon {
  background: #fef3c7;
  color: #d97706;
}
.metric-box__badge--amber {
  background: #fde68a;
  color: #92400e;
}

/* Teal Variant */
.metric-box--teal {
  border-left: 4px solid #0d9488;
}
.metric-box--teal .metric-box__icon {
  background: #f0fdfa;
  color: #0d9488;
}
.metric-box__badge--teal {
  background: #ccfbf1;
  color: #115e59;
}

/* Neutral */
.metric-box--neutral {
  border-left: 4px solid #94a3b8;
}
.metric-box--neutral .metric-box__icon {
  background: #f8fafc;
  color: #64748b;
}
.metric-box__badge--ok {
  background: #f1f5f9;
  color: #475569;
}

@keyframes pulse-ring {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.35); }
  50%       { box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
}
.metric-box--pulse {
  animation: pulse-ring 2.2s infinite;
}

/* ── Segmented Navigation Tabs ───────────────────────────── */
.tab-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.tab-pill:hover {
  background: #f1f5f9;
  color: #0f172a;
}
.tab-pill--active {
  background: #0f172a !important;
  color: #ffffff !important;
}
.tab-pill--pending.tab-pill--active {
  background: #1e293b !important;
}
.tab-pill--warn.tab-pill--active {
  background: #d97706 !important;
}
.tab-pill__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.35rem;
  font-size: 0.725rem;
  font-weight: 700;
  border-radius: 9999px;
  background: #e2e8f0;
  color: #334155;
}
.tab-pill--active .tab-pill__count {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}
.tab-pill__count--warn {
  background: #fef3c7;
  color: #b45309;
}

/* ── Custom Table Styles ─────────────────────────────────── */
.custom-makeup-table th {
  background: #f8fafc;
  font-size: 0.785rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  border-top: none;
  padding: 0.85rem 1rem;
}
.custom-makeup-table td {
  padding: 0.95rem 1rem;
  vertical-align: middle;
}
.makeup-row {
  transition: background-color 0.15s ease;
}
.makeup-row--unresolved {
  background: #ffffff;
}
.makeup-row--concluded {
  background: #fafafa;
  opacity: 0.92;
}
.makeup-row--expired {
  background: #fffcfc;
}

/* Status Badges */
.badge-status {
  display: inline-flex;
  align-items: center;
  padding: 0.325rem 0.65rem;
  font-size: 0.775rem;
  font-weight: 700;
  border-radius: 0.45rem;
  letter-spacing: 0.02em;
}
.badge-status--available {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}
.badge-status--scheduled {
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
}
.badge-status--concluded {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
}
.badge-status--expired {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* Urgency Badges */
.badge-urgency {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.45rem;
  font-size: 0.725rem;
  font-weight: 700;
  border-radius: 0.35rem;
}
.badge-urgency--warning {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
}
.badge-urgency--danger {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

/* Student Avatar & Info */
.student-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  flex-shrink: 0;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.student-avatar--available {
  background: #ecfdf5;
  color: #059669;
}
.student-avatar--scheduled {
  background: #e0f2fe;
  color: #0284c7;
}
.student-avatar--concluded {
  background: #f1f5f9;
  color: #475569;
}
.student-avatar--expired {
  background: #fef2f2;
  color: #dc2626;
}

.student-info__name {
  font-weight: 700;
  color: #0f172a;
  display: block;
}
.student-info__name:hover {
  color: var(--bs-primary);
  text-decoration: underline !important;
}

/* Action Buttons Soft */
.btn-primary-soft {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  font-weight: 600;
}
.btn-primary-soft:hover {
  background: #1d4ed8;
  color: #ffffff;
}
.btn-success-soft {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
  font-weight: 600;
}
.btn-success-soft:hover {
  background: #15803d;
  color: #ffffff;
}

/* ── Custom Modal ────────────────────────────────────────── */
.custom-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}
.custom-modal {
  background: #ffffff;
  border-radius: 0.85rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 520px;
  overflow: hidden;
  animation: modal-enter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modal-enter {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.custom-modal__header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.custom-modal__body {
  padding: 1.5rem;
}
.custom-modal__footer {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* ── Copy Toast ─────────────────────────────────────────── */
.copy-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #0f172a;
  color: #ffffff;
  padding: 0.85rem 1.35rem;
  border-radius: 0.65rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 9999;
  animation: toast-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes toast-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
