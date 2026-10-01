<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { getLesson } from "@/lib/lessons";
import type { Lesson } from "@/lib/types";

const route = useRoute();
const { canUpdateLessons } = usePermissions();

const lessonId = computed(() => Number(route.params.id));
const lesson = ref<Lesson | null>(null);
const loading = ref(true);
const error = ref("");

const statusLabels: Record<string, string> = {
  scheduled: "Agendada",
  completed: "Concluída",
  cancelled: "Cancelada",
  postponed: "Adiada",
  makeup: "Reposição",
};

const statusBadgeClass = computed(() => {
  switch (lesson.value?.status) {
    case "completed":
      return "bg-success";
    case "scheduled":
      return "bg-primary";
    case "cancelled":
      return "bg-danger";
    case "postponed":
      return "bg-warning text-dark";
    case "makeup":
      return "bg-info";
    default:
      return "bg-secondary";
  }
});

const teacherName = computed(() => {
  if (!lesson.value) return "—";
  return lesson.value.relationships?.teacher?.name ?? lesson.value.teacher?.name ?? "—";
});

const contextLink = computed(() => {
  if (!lesson.value) return null;
  const groupClass = lesson.value.relationships?.group_class ?? lesson.value.group_class;
  if (groupClass) {
    return { label: "Turma", name: groupClass.name, to: `/group-classes/${groupClass.id}` };
  }
  const student = lesson.value.relationships?.student ?? lesson.value.student;
  if (student) {
    return { label: "Aluno", name: student.name, to: `/students/${student.id}` };
  }
  return null;
});

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

async function loadLesson() {
  loading.value = true;
  error.value = "";

  try {
    lesson.value = await getLesson(lessonId.value);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar a aula";
  } finally {
    loading.value = false;
  }
}

onMounted(loadLesson);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Detalhe da aula</h4>
          <p class="mb-0 text-muted">Informações da aula agendada</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex gap-2">
        <RouterLink to="/lessons" class="btn btn-light">Voltar</RouterLink>
        <RouterLink
          v-if="canUpdateLessons && lesson"
          :to="`/lessons/${lesson.id}/edit`"
          class="btn btn-primary"
        >
          Editar
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="loading" class="text-center py-5">Carregando...</div>

    <div v-else-if="lesson" class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h4 class="card-title mb-0">{{ lesson.topic }}</h4>
            <span class="badge" :class="statusBadgeClass">
              {{ statusLabels[lesson.status] ?? lesson.status }}
            </span>
          </div>
          <div class="card-body">
            <dl class="row mb-0">
              <dt class="col-sm-4">Data e hora</dt>
              <dd class="col-sm-8">{{ formatDateTime(lesson.class_datetime) }}</dd>

              <dt class="col-sm-4">Professor</dt>
              <dd class="col-sm-8">{{ teacherName }}</dd>

              <dt class="col-sm-4">Vínculo</dt>
              <dd class="col-sm-8">
                <template v-if="contextLink">
                  <span class="badge bg-light text-dark me-1">{{ contextLink.label }}</span>
                  <RouterLink :to="contextLink.to">{{ contextLink.name }}</RouterLink>
                </template>
                <span v-else class="text-muted">—</span>
              </dd>

              <dt class="col-sm-4">Observação</dt>
              <dd class="col-sm-8">{{ lesson.observation?.trim() || "—" }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
