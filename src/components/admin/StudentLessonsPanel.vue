<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import ProfileTabListCard from "@/components/admin/ProfileTabListCard.vue";
import { usePermissions } from "@/composables/usePermissions";
import { listLessonsForStudent } from "@/lib/lessons";
import type { Lesson } from "@/lib/types";

const props = defineProps<{
  studentId: number;
}>();

const {
  canCreateLessons,
  canUpdateLessons,
  canDeleteLessons,
  canViewGroupClasses,
} = usePermissions();

const lessons = ref<Lesson[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const showActions = computed(
  () => canUpdateLessons.value || canDeleteLessons.value
);

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
    case "scheduled":
      return "Agendada";
    case "completed":
      return "Concluída";
    case "cancelled":
      return "Cancelada";
    case "postponed":
      return "Adiada";
    case "makeup":
      return "Reposição";
    default:
      return status;
  }
};

const getContextLabel = (lesson: Lesson) => {
  const groupClass = lesson.relationships?.group_class ?? lesson.group_class;
  if (groupClass) {
    return { type: "Turma", name: groupClass.name, link: `/group-classes/${groupClass.id}` };
  }
  return { type: "Individual", name: "Aula individual", link: null };
};

async function fetchLessons() {
  loading.value = true;
  error.value = "";

  try {
    const res = await listLessonsForStudent(props.studentId, {
      page: page.value,
      limit: 10,
    });
    lessons.value = res.data;
    total.value = res.total;
    lastPage.value = res.last_page;
  } catch {
    error.value = "Erro ao carregar as aulas do aluno.";
  } finally {
    loading.value = false;
  }
}

async function goToPage(nextPage: number) {
  if (
    nextPage < 1 ||
    nextPage > lastPage.value ||
    nextPage === page.value
  ) {
    return;
  }

  page.value = nextPage;
  await fetchLessons();
}

onMounted(fetchLessons);
</script>

<template>
  <div>
    <div v-if="error" class="alert alert-danger mt-3 mb-0">{{ error }}</div>

    <ProfileTabListCard
      title="Lista de aulas"
      :total="total"
      :loading="loading"
      :page="page"
      :last-page="lastPage"
      :read-only="!showActions"
      @update:page="goToPage"
    >
      <template #actions>
        <RouterLink
          v-if="canCreateLessons"
          :to="`/students/${studentId}/lessons/create`"
          class="btn btn-primary btn-sm"
        >
          <i class="la la-plus me-1"></i>
          Nova aula individual
        </RouterLink>
      </template>

      <thead>
        <tr>
          <th>#</th>
          <th>Tópico</th>
          <th>Professor</th>
          <th>Tipo / Contexto</th>
          <th>Data e hora</th>
          <th>Status</th>
          <th v-if="showActions" class="text-end text-nowrap">Ações</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="!lessons.length">
          <td
            :colspan="showActions ? 7 : 6"
            class="text-center text-muted"
          >
            Nenhuma aula registrada para este aluno.
          </td>
        </tr>

        <tr v-for="lesson in lessons" :key="lesson.id">
          <td>{{ lesson.id }}</td>
          <td>
            <strong>{{ lesson.topic }}</strong>
          </td>
          <td>
            {{ lesson.relationships?.teacher?.name ?? lesson.teacher?.name ?? "—" }}
          </td>
          <td>
            <span class="badge bg-light text-dark me-1">
              {{ getContextLabel(lesson).type }}
            </span>
            <RouterLink
              v-if="getContextLabel(lesson).link && canViewGroupClasses"
              :to="getContextLabel(lesson).link!"
              class="text-primary"
            >
              {{ getContextLabel(lesson).name }}
            </RouterLink>
            <span v-else>{{ getContextLabel(lesson).name }}</span>
          </td>
          <td class="text-nowrap">{{ formatDate(lesson.class_datetime) }}</td>
          <td>
            <span class="badge" :class="getStatusBadgeClass(lesson.status)">
              {{ getStatusLabel(lesson.status) }}
            </span>
          </td>
          <td v-if="showActions" class="text-end text-nowrap">
            <RouterLink
              v-if="canUpdateLessons"
              :to="`/students/${studentId}/lessons/${lesson.id}/edit`"
              class="btn btn-xs sharp btn-primary"
              :aria-label="`Editar aula ${lesson.id}`"
            >
              <i class="fa fa-pencil"></i>
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </ProfileTabListCard>
  </div>
</template>
