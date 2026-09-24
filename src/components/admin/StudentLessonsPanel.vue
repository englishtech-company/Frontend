<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { listLessonsForStudent } from "@/lib/lessons";
import { getStudentMakeupSummary } from "@/lib/students";
import type { Lesson, Student } from "@/lib/types";
import type { StudentMakeupSummary } from "@/lib/makeupClasses";
import type { RegisterStudentClassResponse } from "@/lib/studentClasses";
import RegisterStudentClassModal from "@/components/admin/RegisterStudentClassModal.vue";

const props = defineProps<{
  studentId: number;
  student?: Student | null;
}>();

const {
  canCreateLessons,
  canUpdateLessons,
  canViewGroupClasses,
} = usePermissions();

// ── State ──────────────────────────────────────────────────────────────────
const lessons = ref<Lesson[]>([]);
const summary = ref<StudentMakeupSummary | null>(null);
const loading = ref(true);
const error = ref("");
const showRegisterModal = ref(false);

// ── Computed ───────────────────────────────────────────────────────────────
const hasActiveEnrollment = computed(() => {
  if (!props.student) return true;
  const status = props.student.status?.toLowerCase();
  return status === "active" || status === "ativo";
});

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
    case "completed":
    case "concluded": return "badge-success";
    case "scheduled": return "badge-info";
    case "cancelled": return "badge-danger";
    case "postponed": return "badge-warning";
    default:          return "badge-secondary";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "scheduled": return "Agendada";
    case "concluded":
    case "completed": return "Concluída";
    case "cancelled": return "Cancelada";
    case "postponed": return "Adiada";
    default:          return status;
  }
}

function getLessonType(lesson: Lesson) {
  const topic = lesson.topic?.toLowerCase() ?? "";
  if (topic.includes("reposição") || topic.includes("reposicao") || topic.includes("make-up") || topic.includes("makeup")) {
    return { label: "Reposição", badgeClass: "badge-primary" };
  }
  if (topic.includes("extra") || topic.includes("avulsa")) {
    return { label: "Extra", badgeClass: "badge-warning" };
  }
  return { label: "Regular", badgeClass: "badge-light text-dark border" };
}

function getContextLabel(lesson: Lesson) {
  const groupClass = lesson.relationships?.group_class ?? lesson.group_class;
  if (groupClass) {
    return { type: "Turma", name: groupClass.name, link: `/group-classes/${groupClass.id}` };
  }
  return { type: "Individual", name: "VIP / Individual", link: null };
}

function getTeacherName(lesson: Lesson): string {
  return (
    lesson.relationships?.teacher?.name ??
    (lesson as any).teacher?.name ??
    "—"
  );
}

// ── Data fetching ──────────────────────────────────────────────────────────
async function fetchData() {
  loading.value = true;
  error.value = "";
  try {
    const [lessonsRes, summaryRes] = await Promise.all([
      listLessonsForStudent(props.studentId, { limit: 100 }),
      getStudentMakeupSummary(props.studentId).catch(() => null),
    ]);

    lessons.value = lessonsRes.data;
    summary.value = summaryRes;
  } catch (err: any) {
    console.error("Erro ao carregar aulas do aluno:", err);
    error.value = "Não foi possível carregar as aulas deste aluno.";
  } finally {
    loading.value = false;
  }
}

function onClassRegistered(response: RegisterStudentClassResponse) {
  if (response.lesson) {
    lessons.value.unshift(response.lesson);
  }
  if (response.makeup_summary) {
    summary.value = response.makeup_summary;
  }
  fetchData();
}

onMounted(fetchData);
</script>

<template>
  <div class="student-lessons pt-4 pb-3">

    <!-- ═══════════════════════════════════════════════
         Heading & Action Button
         ═══════════════════════════════════════════════ -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <div>
        <h4 class="text-primary mb-1">
          Aulas do Aluno
        </h4>
        <p class="text-muted mb-0">
          Histórico pedagógico de aulas regulares, reposições e aulas extras.
        </p>
      </div>

      <div class="d-flex align-items-center gap-2">
        <button
          v-if="!hasActiveEnrollment"
          type="button"
          class="btn btn-primary"
          disabled
          title="O aluno não possui matrículas ativas para agendamento"
        >
          <i class="la la-plus me-1"></i> Registrar aula
        </button>

        <button
          v-else-if="canCreateLessons"
          type="button"
          class="btn btn-primary"
          @click="showRegisterModal = true"
        >
          <i class="la la-plus me-1"></i> Registrar aula
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger mb-4">
      {{ error }}
    </div>

    <!-- ═══════════════════════════════════════════════
         Summary Metrics Cards (Pedagogical & Makeup Credits)
         ═══════════════════════════════════════════════ -->
    <div class="row g-3 mb-4">
      <!-- Limite de Reposições do Ciclo -->
      <div class="col-sm-6 col-xl-3">
        <div class="card border mb-0 h-100">
          <div class="card-body p-3 d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small d-block fw-semibold text-uppercase">Limite do Ciclo</span>
              <h3 class="mb-0 fw-bold text-dark">
                <template v-if="loading">—</template>
                <template v-else>{{ summary?.limit ?? 0 }} aulas</template>
              </h3>
            </div>
            <div class="rounded-circle bg-light p-3 text-primary d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="la la-shield-alt fs-4"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Reposições Utilizadas -->
      <div class="col-sm-6 col-xl-3">
        <div class="card border mb-0 h-100">
          <div class="card-body p-3 d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small d-block fw-semibold text-uppercase">Reposições Usadas</span>
              <h3 class="mb-0 fw-bold text-primary">
                <template v-if="loading">—</template>
                <template v-else>{{ summary?.used ?? 0 }} / {{ summary?.limit ?? 0 }}</template>
              </h3>
            </div>
            <div class="rounded-circle bg-light p-3 text-primary d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="la la-history fs-4"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Créditos Restantes -->
      <div class="col-sm-6 col-xl-3">
        <div class="card border mb-0 h-100">
          <div class="card-body p-3 d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small d-block fw-semibold text-uppercase">Créditos Restantes</span>
              <h3 class="mb-0 fw-bold text-success">
                <template v-if="loading">—</template>
                <template v-else>{{ summary?.remaining ?? 0 }} disponíveis</template>
              </h3>
            </div>
            <div class="rounded-circle bg-light p-3 text-success d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="la la-check-circle fs-4"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Total de Aulas no Histórico -->
      <div class="col-sm-6 col-xl-3">
        <div class="card border mb-0 h-100">
          <div class="card-body p-3 d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small d-block fw-semibold text-uppercase">Aulas Registradas</span>
              <h3 class="mb-0 fw-bold text-dark">
                <template v-if="loading">—</template>
                <template v-else>{{ lessons.length }} aulas</template>
              </h3>
            </div>
            <div class="rounded-circle bg-light p-3 text-secondary d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="la la-chalkboard-teacher fs-4"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════
         Unified Lessons Table
         ═══════════════════════════════════════════════ -->
    <div class="card border mb-0">
      <div class="card-header bg-transparent py-3">
        <h5 class="card-title mb-0">Histórico de Aulas ({{ lessons.length }})</h5>
      </div>

      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="text-muted small mt-2 mb-0">Carregando aulas...</p>
        </div>

        <div v-else-if="lessons.length === 0" class="text-center py-5 text-muted">
          <i class="la la-calendar-times fs-2 d-block mb-2 text-secondary opacity-50"></i>
          <p class="mb-1 fw-semibold">Nenhuma aula registrada para este aluno.</p>
          <small>Clique em "Registrar aula" para agendar uma aula regular, reposição ou avulsa.</small>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Tipo</th>
                <th>Tópico / Conteúdo</th>
                <th>Professor</th>
                <th>Modalidade / Turma</th>
                <th>Data e Horário</th>
                <th>Status</th>
                <th v-if="canUpdateLessons" class="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lesson in lessons" :key="lesson.id">
                <td class="text-muted small">#{{ lesson.id }}</td>
                <td>
                  <span class="badge" :class="getLessonType(lesson).badgeClass">
                    {{ getLessonType(lesson).label }}
                  </span>
                </td>
                <td>
                  <strong>{{ lesson.topic }}</strong>
                  <div v-if="lesson.observation" class="small text-muted text-truncate" style="max-width: 260px;">
                    {{ lesson.observation }}
                  </div>
                </td>
                <td>{{ getTeacherName(lesson) }}</td>
                <td>
                  <template v-if="getContextLabel(lesson).link && canViewGroupClasses">
                    <span class="badge bg-light text-dark me-1">{{ getContextLabel(lesson).type }}</span>
                    <RouterLink :to="getContextLabel(lesson).link!" class="text-primary">
                      {{ getContextLabel(lesson).name }}
                    </RouterLink>
                  </template>
                  <template v-else>
                    <span class="badge bg-light text-dark me-1">{{ getContextLabel(lesson).type }}</span>
                    <span>{{ getContextLabel(lesson).name }}</span>
                  </template>
                </td>
                <td>{{ formatDate(lesson.class_datetime) }}</td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(lesson.status)">
                    {{ getStatusLabel(lesson.status) }}
                  </span>
                </td>
                <td v-if="canUpdateLessons" class="text-end text-nowrap">
                  <RouterLink
                    :to="`/students/${studentId}/lessons/${lesson.id}/edit`"
                    class="btn btn-xs sharp btn-primary me-1"
                    title="Editar aula"
                    :aria-label="`Editar aula ${lesson.id}`"
                  >
                    <i class="fa fa-pencil"></i>
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════
         Register Student Class Modal
         ═══════════════════════════════════════════════ -->
    <RegisterStudentClassModal
      :show="showRegisterModal"
      :student-id="studentId"
      :student="student"
      @close="showRegisterModal = false"
      @saved="onClassRegistered"
    />

  </div>
</template>
