<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { listLessonsForStudent } from "@/lib/lessons";
import { listMakeupClasses } from "@/lib/makeupClasses";
import { getStudentMakeupSummary } from "@/lib/students";
import type { Lesson, MakeupClass } from "@/lib/types";
import type { StudentMakeupSummary } from "@/lib/makeupClasses";

const props = defineProps<{
  studentId: number;
}>();

const {
  canCreateLessons,
  canUpdateLessons,
  canViewGroupClasses,
  canCreateMakeupClasses,
} = usePermissions();

// ── State ──────────────────────────────────────────────────────────────────
const lessons       = ref<Lesson[]>([]);
const makeupClasses = ref<MakeupClass[]>([]);
const summary       = ref<StudentMakeupSummary | null>(null);
const loading       = ref(true);
const error         = ref("");

const activeSubTab  = ref<"lessons" | "makeups">("makeups");

// Scheduling modal state
const schedulingItem  = ref<MakeupClass | null>(null);
const copyToast       = ref(false);
let   copyToastTimer: ReturnType<typeof setTimeout> | null = null;

// ── Computed ───────────────────────────────────────────────────────────────
const cyclePercent = computed(() => {
  if (!summary.value?.limit) return 0;
  return Math.min(100, Math.round((summary.value.used / summary.value.limit) * 100));
});

const cycleLabel = computed(() =>
  summary.value ? `${summary.value.used} / ${summary.value.limit} Utilizadas` : "— / —"
);

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(dateString?: string | null, withTime = true) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("pt-BR", {
    dateStyle: "short",
    ...(withTime ? { timeStyle: "short" } : {}),
  });
}

function daysUntil(dateString?: string | null): number | null {
  if (!dateString) return null;
  const diff = new Date(dateString).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

function isExpiringSoon(item: MakeupClass): boolean {
  if (item.status !== "available") return false;
  const d = daysUntil(item.expired_date);
  return d !== null && d >= 0 && d <= 7;
}

function isOverdue(item: MakeupClass): boolean {
  if (item.status !== "available") return false;
  const d = daysUntil(item.expired_date);
  return d !== null && d < 0;
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "completed":
    case "concluded":   return "badge-success";
    case "available":   return "badge-emerald";
    case "scheduled":   return "badge-sky";
    case "cancelled":
    case "expired":     return "badge-danger";
    case "postponed":   return "badge-warning";
    default:            return "badge-secondary";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "available":  return "Disponível p/ Agendar";
    case "scheduled":  return "Agendada";
    case "concluded":
    case "completed":  return "Concluída";
    case "expired":    return "Expirada";
    case "cancelled":  return "Cancelada";
    case "postponed":  return "Adiada";
    default:           return status;
  }
}

function getContextLabel(lesson: Lesson) {
  const groupClass = lesson.relationships?.group_class ?? lesson.group_class;
  if (groupClass) {
    return { type: "Turma", name: groupClass.name, link: `/group-classes/${groupClass.id}` };
  }
  return { type: "Individual", name: "Aula Individual", link: null };
}

function originLabel(item: MakeupClass): string {
  const gc =
    (item.relationships?.group_class ?? item.group_class) as { name?: string } | null | undefined;
  if (gc?.name) return gc.name;
  const enroll =
    (item.relationships?.enrollment ?? item.enrollment) as { id?: number } | null | undefined;
  if (enroll?.id) return `Matrícula #${enroll.id}`;
  return "Aula Individual";
}

function publicLink(item: MakeupClass): string {
  return `${window.location.origin}/public/makeup-classes/${item.public_token}`;
}

async function copyPublicLink(item: MakeupClass) {
  try {
    await navigator.clipboard.writeText(publicLink(item));
    copyToast.value = true;
    if (copyToastTimer) clearTimeout(copyToastTimer);
    copyToastTimer = setTimeout(() => { copyToast.value = false; }, 2500);
  } catch {
    // Fallback: open in new tab so the user can manually copy
    window.open(publicLink(item), "_blank");
  }
}

function openSchedulingModal(item: MakeupClass) {
  schedulingItem.value = item;
}

function closeModal() {
  schedulingItem.value = null;
}

// ── Data fetching ──────────────────────────────────────────────────────────
async function fetchData() {
  loading.value = true;
  error.value   = "";
  try {
    const [resLessons, resMakeups, resSummary] = await Promise.all([
      listLessonsForStudent(props.studentId, { limit: 50 }),
      listMakeupClasses({ student_id: props.studentId, limit: 50, sort_by_urgency: true }),
      getStudentMakeupSummary(props.studentId),
    ]);
    lessons.value       = resLessons.data;
    makeupClasses.value = resMakeups.data;
    summary.value       = resSummary;
  } catch (e) {
    console.error("Failed to load student lessons / makeups", e);
    error.value = "Erro ao carregar as aulas e reposições do aluno.";
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);
</script>

<template>
  <div class="pt-4">

    <!-- ═══════════════════════════════════════════════
         3.1  METRICS COUNTER BAR
         ═══════════════════════════════════════════════ -->
    <div class="makeup-metrics-bar row g-3 mb-4">

      <!-- Créditos Disponíveis — Emerald -->
      <div class="col-xl-3 col-sm-6">
        <div class="metric-card metric-card--emerald">
          <div class="metric-card__icon"><i class="la la-check-circle"></i></div>
          <div class="metric-card__body">
            <span class="metric-card__label">Créditos Disponíveis</span>
            <span class="metric-card__value">
              <template v-if="loading">—</template>
              <template v-else>{{ summary?.available_credits ?? 0 }}</template>
            </span>
          </div>
          <span class="metric-card__badge metric-card__badge--emerald">créditos</span>
        </div>
      </div>

      <!-- Aulas Agendadas — Sky -->
      <div class="col-xl-3 col-sm-6">
        <div class="metric-card metric-card--sky">
          <div class="metric-card__icon"><i class="la la-calendar-check"></i></div>
          <div class="metric-card__body">
            <span class="metric-card__label">Aulas Agendadas</span>
            <span class="metric-card__value">
              <template v-if="loading">—</template>
              <template v-else>{{ summary?.scheduled_classes ?? 0 }}</template>
            </span>
          </div>
          <span class="metric-card__badge metric-card__badge--sky">agendadas</span>
        </div>
      </div>

      <!-- Limite do Ciclo — Neutral with progress -->
      <div class="col-xl-3 col-sm-6">
        <div class="metric-card metric-card--neutral">
          <div class="metric-card__icon"><i class="la la-chart-pie"></i></div>
          <div class="metric-card__body" style="flex:1">
            <span class="metric-card__label">Limite do Ciclo</span>
            <span class="metric-card__value metric-card__value--sm">
              <template v-if="loading">— / —</template>
              <template v-else>{{ cycleLabel }}</template>
            </span>
            <div class="metric-cycle-bar mt-1">
              <div
                class="metric-cycle-bar__fill"
                :style="{ width: cyclePercent + '%' }"
                :class="{
                  'metric-cycle-bar__fill--warn': cyclePercent >= 75,
                  'metric-cycle-bar__fill--full': cyclePercent >= 100,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Atenção: Expirando em Breve — Amber -->
      <div class="col-xl-3 col-sm-6">
        <div
          class="metric-card"
          :class="summary && summary.expiring_soon_count > 0
            ? 'metric-card--amber metric-card--pulse'
            : 'metric-card--neutral-light'"
        >
          <div class="metric-card__icon"><i class="la la-exclamation-triangle"></i></div>
          <div class="metric-card__body">
            <span class="metric-card__label">Atenção — Expirando</span>
            <span class="metric-card__value">
              <template v-if="loading">—</template>
              <template v-else>{{ summary?.expiring_soon_count ?? 0 }}</template>
            </span>
          </div>
          <span
            v-if="!loading && summary && summary.expiring_soon_count > 0"
            class="metric-card__badge metric-card__badge--amber"
          >próx. 7 dias</span>
          <span v-else-if="!loading" class="metric-card__badge metric-card__badge--ok">em dia</span>
        </div>
      </div>

    </div>
    <!-- / METRICS BAR -->


    <!-- ═══════════════════════════════════════════════
         Navigation Sub-tabs
         ═══════════════════════════════════════════════ -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <button
            type="button"
            class="nav-link px-3 py-1 me-2"
            :class="{ active: activeSubTab === 'makeups' }"
            @click="activeSubTab = 'makeups'"
          >
            <i class="la la-history me-1"></i>
            Aulas de Reposição
            <span class="badge bg-secondary ms-1">{{ makeupClasses.length }}</span>
          </button>
        </li>
        <li class="nav-item">
          <button
            type="button"
            class="nav-link px-3 py-1"
            :class="{ active: activeSubTab === 'lessons' }"
            @click="activeSubTab = 'lessons'"
          >
            <i class="la la-book-open me-1"></i>
            Aulas Regulares
            <span class="badge bg-secondary ms-1">{{ lessons.length }}</span>
          </button>
        </li>
      </ul>

      <div class="d-flex gap-2">
        <RouterLink
          v-if="activeSubTab === 'makeups' && canCreateMakeupClasses"
          to="/makeup-classes/create"
          class="btn btn-sm btn-outline-primary"
        >
          <i class="la la-plus me-1"></i> Nova Reposição
        </RouterLink>
        <RouterLink
          v-if="canCreateLessons"
          :to="`/students/${studentId}/lessons/create`"
          class="btn btn-sm btn-primary"
        >
          <i class="la la-plus me-1"></i> Nova Aula Individual
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="loading" class="text-center py-4 text-muted">Carregando informações...</div>


    <!-- ═══════════════════════════════════════════════
         3.2  AULAS DE REPOSIÇÃO — Enhanced Sub-table
         ═══════════════════════════════════════════════ -->
    <div v-else-if="activeSubTab === 'makeups'">
      <div v-if="!makeupClasses.length" class="text-muted text-center py-5 border rounded-3">
        <i class="la la-info-circle fs-3 d-block mb-2"></i>
        Nenhuma aula de reposição registrada para este aluno.
      </div>

      <div v-else class="table-responsive makeup-table-wrap">
        <table class="table table-hover mb-0 align-middle makeup-table">
          <thead class="makeup-table__head">
            <tr>
              <th>Origem da Falta</th>
              <th>Status</th>
              <th>Data Limite</th>
              <th>Data Agendada</th>
              <th class="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in makeupClasses"
              :key="item.id"
              :class="{
                'makeup-row--expiring': isExpiringSoon(item),
                'makeup-row--overdue' : isOverdue(item),
              }"
            >
              <!-- Origem da Falta -->
              <td>
                <div class="origin-cell">
                  <span class="origin-cell__date">
                    <i class="la la-calendar-times text-muted me-1"></i>
                    {{ formatDate(item.original_date, false) }}
                  </span>
                  <span class="origin-cell__context text-muted">
                    {{ originLabel(item) }}
                  </span>
                  <span class="origin-cell__id text-muted">#{{ item.id }}</span>
                </div>
              </td>

              <!-- Status Pill -->
              <td>
                <span class="makeup-status-pill" :class="`makeup-status-pill--${item.status}`">
                  <i
                    class="me-1"
                    :class="{
                      'la la-circle-notch': item.status === 'available',
                      'la la-calendar-check': item.status === 'scheduled',
                      'la la-check-circle': item.status === 'concluded',
                      'la la-times-circle': item.status === 'expired',
                    }"
                  ></i>
                  {{ getStatusLabel(item.status) }}
                </span>
              </td>

              <!-- Data Limite with urgency indicator -->
              <td>
                <div class="expiry-cell">
                  <span
                    class="expiry-cell__date"
                    :class="{
                      'expiry-cell__date--warn'    : isExpiringSoon(item),
                      'expiry-cell__date--critical' : isOverdue(item),
                    }"
                  >
                    <i
                      v-if="isExpiringSoon(item)"
                      class="la la-exclamation-circle me-1"
                    ></i>
                    {{ formatDate(item.expired_date, false) }}
                  </span>
                  <!-- Expiration urgency badge with tooltip -->
                  <span
                    v-if="isExpiringSoon(item) && daysUntil(item.expired_date) !== null"
                    class="expiry-cell__countdown"
                    :title="daysUntil(item.expired_date) === 0 ? 'Vence hoje!' : `Expira em ${daysUntil(item.expired_date)} dias`"
                  >
                    <i class="la la-exclamation-triangle me-1"></i>
                    {{ daysUntil(item.expired_date) === 0
                        ? 'Vence hoje!'
                        : `Expira em ${daysUntil(item.expired_date)} dias` }}
                  </span>
                  <span
                    v-else-if="isOverdue(item) || item.status === 'expired'"
                    class="expiry-cell__countdown expiry-cell__countdown--critical"
                    title="Prazo de reposição vencido"
                  >
                    <i class="la la-times-circle me-1"></i>
                    Expirada
                  </span>
                </div>
              </td>

              <!-- Data Agendada + Professor -->
              <td>
                <div v-if="item.new_date" class="scheduled-cell">
                  <span class="scheduled-cell__date text-success fw-semibold">
                    <i class="la la-calendar-check me-1"></i>
                    {{ formatDate(item.new_date) }}
                  </span>
                  <span
                    v-if="item.relationships?.teacher ?? item.teacher"
                    class="scheduled-cell__teacher text-muted"
                  >
                    <i class="la la-user-tie me-1"></i>
                    {{ (item.relationships?.teacher ?? item.teacher as any)?.name ?? '—' }}
                  </span>
                </div>
                <span v-else class="text-muted small fst-italic">Não agendada</span>
              </td>

              <!-- Actions -->
              <td class="text-end">
                <div class="d-flex gap-2 justify-content-end flex-wrap">

                  <!-- "Agendar Reposição" — only for available records -->
                  <button
                    v-if="item.status === 'available' && canUpdateLessons"
                    class="btn btn-sm btn-action btn-action--schedule"
                    title="Agendar Reposição"
                    @click="openSchedulingModal(item)"
                  >
                    <i class="la la-calendar-plus me-1"></i>
                    Agendar
                  </button>

                  <!-- "Copiar Link Público" — always available when token exists -->
                  <button
                    v-if="item.public_token"
                    class="btn btn-sm btn-action btn-action--copy"
                    title="Copiar link de auto-agendamento"
                    @click="copyPublicLink(item)"
                  >
                    <i class="la la-link me-1"></i>
                    Copiar Link
                  </button>

                  <!-- Edit — admin only -->
                  <RouterLink
                    v-if="canUpdateLessons"
                    :to="`/makeup-classes/${item.id}/edit`"
                    class="btn btn-sm btn-action btn-action--edit"
                    title="Editar Reposição"
                  >
                    <i class="la la-pencil"></i>
                  </RouterLink>

                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <!-- ═══════════════════════════════════════════════
         Regular Lessons Section
         ═══════════════════════════════════════════════ -->
    <div v-else-if="activeSubTab === 'lessons'">
      <div v-if="!lessons.length" class="text-muted text-center py-5 border rounded-3">
        <i class="la la-info-circle fs-3 d-block mb-2"></i>
        Nenhuma aula regular registrada para este aluno.
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover mb-0 align-middle">
          <thead class="makeup-table__head">
            <tr>
              <th>ID</th>
              <th>Tópico</th>
              <th>Professor</th>
              <th>Tipo / Contexto</th>
              <th>Data e Hora</th>
              <th>Status</th>
              <th v-if="canUpdateLessons" class="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lesson in lessons" :key="lesson.id">
              <td class="text-muted small">#{{ lesson.id }}</td>
              <td><strong>{{ lesson.topic }}</strong></td>
              <td>{{ lesson.relationships?.teacher?.name ?? (lesson as any).teacher?.name ?? "—" }}</td>
              <td>
                <span class="badge bg-light text-dark me-1">{{ getContextLabel(lesson).type }}</span>
                <RouterLink
                  v-if="getContextLabel(lesson).link && canViewGroupClasses"
                  :to="getContextLabel(lesson).link!"
                  class="text-primary"
                >{{ getContextLabel(lesson).name }}</RouterLink>
                <span v-else-if="getContextLabel(lesson).link">{{ getContextLabel(lesson).name }}</span>
              </td>
              <td>{{ formatDate(lesson.class_datetime) }}</td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(lesson.status)">
                  {{ getStatusLabel(lesson.status) }}
                </span>
              </td>
              <td v-if="canUpdateLessons" class="text-end">
                <RouterLink
                  :to="`/students/${studentId}/lessons/${lesson.id}/edit`"
                  class="btn btn-sm btn-outline-secondary"
                  title="Editar"
                >
                  <i class="la la-pencil"></i>
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <!-- ═══════════════════════════════════════════════
         Scheduling Modal
         ═══════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="schedulingItem" class="modal-backdrop-custom" @click.self="closeModal">
        <div class="scheduling-modal" role="dialog" aria-modal="true">
          <div class="scheduling-modal__header">
            <h5 class="scheduling-modal__title">
              <i class="la la-calendar-plus me-2 text-primary"></i>
              Agendar Reposição #{{ schedulingItem.id }}
            </h5>
            <button class="btn-close" @click="closeModal" aria-label="Fechar"></button>
          </div>

          <div class="scheduling-modal__body">
            <div class="scheduling-modal__info-row">
              <span class="scheduling-modal__info-label">Origem da falta</span>
              <span class="scheduling-modal__info-value">
                {{ formatDate(schedulingItem.original_date, false) }} — {{ originLabel(schedulingItem) }}
              </span>
            </div>
            <div class="scheduling-modal__info-row">
              <span class="scheduling-modal__info-label">Data Limite</span>
              <span
                class="scheduling-modal__info-value"
                :class="isExpiringSoon(schedulingItem) ? 'text-warning fw-semibold' : ''"
              >
                {{ formatDate(schedulingItem.expired_date, false) }}
                <span v-if="isExpiringSoon(schedulingItem)" class="ms-1">
                  ⚠ em {{ daysUntil(schedulingItem.expired_date) }} dia(s)
                </span>
              </span>
            </div>

            <hr class="my-3">

            <!-- Self-service link section -->
            <p class="fw-semibold mb-2">
              <i class="la la-link me-1 text-primary"></i>
              Link de Auto-agendamento (Aluno)
            </p>
            <div class="scheduling-modal__link-box">
              <span class="scheduling-modal__link-text">{{ publicLink(schedulingItem) }}</span>
              <button
                class="btn btn-sm btn-primary ms-2 flex-shrink-0"
                @click="copyPublicLink(schedulingItem!)"
              >
                <i class="la la-copy me-1"></i> Copiar
              </button>
            </div>
            <p class="text-muted small mt-2 mb-0">
              Envie este link ao aluno para que ele escolha o horário disponível.
            </p>

            <hr class="my-3">

            <!-- Admin schedule redirect -->
            <p class="fw-semibold mb-2">
              <i class="la la-user-edit me-1 text-primary"></i>
              Agendar como Administrador
            </p>
            <RouterLink
              :to="`/makeup-classes/${schedulingItem.id}/edit`"
              class="btn btn-primary w-100"
              @click="closeModal"
            >
              <i class="la la-calendar-check me-1"></i>
              Abrir Formulário de Agendamento
            </RouterLink>
          </div>
        </div>
      </div>
    </Teleport>


    <!-- ═══════════════════════════════════════════════
         Copy-link toast notification
         ═══════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="toast-slide">
        <div v-if="copyToast" class="copy-toast" role="status">
          <i class="la la-check-circle me-2"></i>
          Link copiado para a área de transferência!
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
/* ─────────────────────────────────────────────
   3.1 Metric Cards
   ───────────────────────────────────────────── */
.metric-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  border-radius: 0.75rem;
  padding: 1rem 1.1rem;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
  border: 1px solid #e8ecf0;
  position: relative;
  overflow: hidden;
  transition: box-shadow .2s, transform .15s;
  min-height: 88px;
}
.metric-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.12); transform: translateY(-1px); }
.metric-card__icon {
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  width: 44px; height: 44px; border-radius: 50%; font-size: 1.35rem;
}
.metric-card__body { display: flex; flex-direction: column; gap: .1rem; min-width: 0; }
.metric-card__label {
  font-size: .72rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: .04em; color: #6b7280; white-space: nowrap;
}
.metric-card__value { font-size: 1.75rem; font-weight: 700; line-height: 1; color: #111827; }
.metric-card__value--sm { font-size: 1.1rem; }
.metric-card__badge {
  position: absolute; top: .55rem; right: .65rem;
  font-size: .65rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase;
  padding: .18em .55em; border-radius: 999px;
}
/* Emerald */
.metric-card--emerald { border-left: 4px solid #10b981; }
.metric-card--emerald .metric-card__icon { background: #d1fae5; color: #059669; }
.metric-card--emerald .metric-card__value { color: #065f46; }
.metric-card__badge--emerald { background: #d1fae5; color: #065f46; }
/* Sky */
.metric-card--sky { border-left: 4px solid #0ea5e9; }
.metric-card--sky .metric-card__icon { background: #e0f2fe; color: #0284c7; }
.metric-card--sky .metric-card__value { color: #0c4a6e; }
.metric-card__badge--sky { background: #e0f2fe; color: #0c4a6e; }
/* Neutral */
.metric-card--neutral { border-left: 4px solid #94a3b8; }
.metric-card--neutral .metric-card__icon { background: #f1f5f9; color: #64748b; }
.metric-card--neutral-light { border-left: 4px solid #cbd5e1; }
.metric-card--neutral-light .metric-card__icon { background: #f8fafc; color: #94a3b8; }
.metric-card__badge--ok { background: #f1f5f9; color: #475569; }
/* Amber */
.metric-card--amber { border-left: 4px solid #f59e0b; }
.metric-card--amber .metric-card__icon { background: #fef3c7; color: #d97706; }
.metric-card--amber .metric-card__value { color: #92400e; }
.metric-card__badge--amber { background: #fef3c7; color: #92400e; }
@keyframes metric-pulse {
  0%,100% { box-shadow: 0 1px 4px rgba(245,158,11,.2); }
  50%      { box-shadow: 0 0 0 6px rgba(245,158,11,.12); }
}
.metric-card--pulse { animation: metric-pulse 2s ease-in-out infinite; }
/* Cycle bar */
.metric-cycle-bar { height: 5px; border-radius: 999px; background: #e2e8f0; overflow: hidden; width: 100%; max-width: 140px; }
.metric-cycle-bar__fill { height: 100%; border-radius: 999px; background: #94a3b8; transition: width .4s ease; }
.metric-cycle-bar__fill--warn { background: #f59e0b; }
.metric-cycle-bar__fill--full { background: #ef4444; }

/* ─────────────────────────────────────────────
   3.2 Make-up Table
   ───────────────────────────────────────────── */
.makeup-table-wrap { border-radius: .5rem; overflow: hidden; border: 1px solid #e5e7eb; }
.makeup-table { font-size: .875rem; }
.makeup-table__head th {
  background: #f8fafc;
  font-size: .72rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .05em; color: #6b7280; padding: .65rem 1rem;
  border-bottom: 2px solid #e5e7eb;
}
.makeup-table td { padding: .75rem 1rem; vertical-align: middle; }

/* Row urgency highlights */
.makeup-row--expiring { background: #fffbeb !important; }
.makeup-row--expiring:hover { background: #fef3c7 !important; }
.makeup-row--overdue  { background: #fff1f2 !important; }
.makeup-row--overdue:hover  { background: #ffe4e6 !important; }

/* Origin cell */
.origin-cell { display: flex; flex-direction: column; gap: .15rem; }
.origin-cell__date   { font-weight: 600; color: #374151; }
.origin-cell__context { font-size: .78rem; }
.origin-cell__id     { font-size: .7rem; }

/* Status pill */
.makeup-status-pill {
  display: inline-flex; align-items: center;
  padding: .25em .7em; border-radius: 999px;
  font-size: .75rem; font-weight: 600; white-space: nowrap;
}
.makeup-status-pill--available  { background: #d1fae5; color: #065f46; }
.makeup-status-pill--scheduled  { background: #e0f2fe; color: #0c4a6e; }
.makeup-status-pill--concluded  { background: #dcfce7; color: #166534; }
.makeup-status-pill--expired    { background: #fee2e2; color: #991b1b; }
.makeup-status-pill--cancelled  { background: #f3f4f6; color: #6b7280; }

/* Expiry cell */
.expiry-cell { display: flex; flex-direction: column; gap: .15rem; }
.expiry-cell__date { font-size: .85rem; }
.expiry-cell__date--warn     { color: #d97706; font-weight: 600; }
.expiry-cell__date--critical { color: #dc2626; font-weight: 600; }
.expiry-cell__countdown {
  display: inline-block; font-size: .7rem; font-weight: 700;
  padding: .1em .5em; border-radius: 999px;
  background: #fef3c7; color: #92400e;
}
.expiry-cell__countdown--critical { background: #fee2e2; color: #991b1b; }

/* Scheduled cell */
.scheduled-cell { display: flex; flex-direction: column; gap: .15rem; }
.scheduled-cell__date    { font-size: .85rem; }
.scheduled-cell__teacher { font-size: .78rem; }

/* Action buttons */
.btn-action {
  font-size: .78rem; font-weight: 600;
  padding: .28em .65em; border-radius: .4rem;
  white-space: nowrap; transition: all .15s;
}
.btn-action--schedule {
  background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe;
}
.btn-action--schedule:hover { background: #dbeafe; color: #1e3a8a; }
.btn-action--copy {
  background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0;
}
.btn-action--copy:hover { background: #dcfce7; color: #14532d; }
.btn-action--edit {
  background: #fafafa; color: #6b7280; border: 1px solid #e5e7eb;
}
.btn-action--edit:hover { background: #f3f4f6; color: #374151; }

/* ─────────────────────────────────────────────
   Scheduling Modal
   ───────────────────────────────────────────── */
.modal-backdrop-custom {
  position: fixed; inset: 0; z-index: 1050;
  background: rgba(15,23,42,.45);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(2px);
}
.scheduling-modal {
  background: #fff;
  border-radius: .75rem;
  width: 100%; max-width: 500px;
  box-shadow: 0 20px 60px rgba(0,0,0,.2);
  overflow: hidden;
}
.scheduling-modal__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}
.scheduling-modal__title { margin: 0; font-size: 1rem; font-weight: 700; color: #111827; }
.scheduling-modal__body { padding: 1.25rem; }
.scheduling-modal__info-row {
  display: flex; gap: .75rem; align-items: baseline;
  padding: .35rem 0;
}
.scheduling-modal__info-label {
  font-size: .75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .04em; color: #6b7280; min-width: 110px; flex-shrink: 0;
}
.scheduling-modal__info-value { font-size: .9rem; color: #111827; }
.scheduling-modal__link-box {
  display: flex; align-items: center;
  background: #f8fafc; border: 1px solid #e5e7eb; border-radius: .4rem;
  padding: .5rem .75rem;
}
.scheduling-modal__link-text {
  flex: 1; font-size: .75rem; color: #374151;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* ─────────────────────────────────────────────
   Copy-link toast
   ───────────────────────────────────────────── */
.copy-toast {
  position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
  background: #065f46; color: #fff;
  padding: .65rem 1.1rem; border-radius: .5rem;
  font-size: .875rem; font-weight: 600;
  box-shadow: 0 4px 16px rgba(0,0,0,.2);
  display: flex; align-items: center;
}
.toast-slide-enter-active, .toast-slide-leave-active { transition: all .25s ease; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(12px); }
</style>
