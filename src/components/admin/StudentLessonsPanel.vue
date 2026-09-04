<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { listLessonsForStudent } from "@/lib/lessons";
import type { Lesson } from "@/lib/types";

const props = defineProps<{
  studentId: number;
}>();

const { canCreateLessons, canUpdateLessons, canViewGroupClasses } = usePermissions();

const lessons = ref<Lesson[]>([]);
const loading = ref(true);
const error = ref("");

const formatDate = (dateString: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "completed":
      return "badge-success";
    case "scheduled":
      return "badge-primary";
    case "cancelled":
      return "badge-danger";
    case "postponed":
      return "badge-warning";
    case "makeup":
      return "badge-info";
    default:
      return "badge-secondary";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "scheduled": return "Agendada";
    case "completed": return "Concluída";
    case "cancelled": return "Cancelada";
    case "postponed": return "Adiada";
    case "makeup": return "Reposição";
    default: return status;
  }
};

const getContextLabel = (lesson: Lesson) => {
  const groupClass = lesson.relationships?.group_class ?? lesson.group_class;
  if (groupClass) {
    return { type: "Turma", name: groupClass.name, link: `/group-classes/${groupClass.id}` };
  }
  return { type: "Individual", name: "Aula Individual", link: null };
};

async function fetchLessons() {
  loading.value = true;
  error.value = "";
  try {
    const res = await listLessonsForStudent(props.studentId, { limit: 50 });
    lessons.value = res.data;
  } catch (e) {
    console.error("Failed to load student lessons", e);
    error.value = "Erro ao carregar as aulas do aluno.";
  } finally {
    loading.value = false;
  }
}

onMounted(fetchLessons);
</script>

<template>
  <div class="pt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="text-primary mb-1">Aulas do Aluno</h4>
        <p class="text-muted small mb-0">
          Aulas individuais e sessões de turmas em que o aluno está matriculado.
        </p>
      </div>
      <RouterLink
        v-if="canCreateLessons"
        :to="`/students/${studentId}/lessons/create`"
        class="btn btn-sm btn-primary"
      >
        <i class="la la-plus me-1"></i> Nova Aula Individual
      </RouterLink>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="loading" class="text-center py-4 text-muted">
      Carregando aulas...
    </div>

    <div v-else-if="!lessons.length" class="text-muted text-center py-4 border rounded">
      <i class="la la-info-circle me-1"></i>
      Nenhuma aula registrada para este aluno.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped table-hover mb-0">
        <thead>
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
            <td>{{ lesson.id }}</td>
            <td><strong>{{ lesson.topic }}</strong></td>
            <td>{{ lesson.relationships?.teacher?.name ?? lesson.teacher?.name ?? "—" }}</td>
            <td>
              <span class="badge bg-light text-dark me-1">{{ getContextLabel(lesson).type }}</span>
              <RouterLink
                v-if="getContextLabel(lesson).link && canViewGroupClasses"
                :to="getContextLabel(lesson).link!"
                class="text-primary"
              >
                {{ getContextLabel(lesson).name }}
              </RouterLink>
              <span v-else-if="getContextLabel(lesson).link">
                {{ getContextLabel(lesson).name }}
              </span>
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
                class="btn btn-sm btn-outline-primary"
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
</template>
