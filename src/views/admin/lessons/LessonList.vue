<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDelete } from "@/lib/confirm";
import { notifyRemoved } from "@/lib/actionNotification";
import { countActiveFilters } from "@/lib/filters/query";
import { deleteLesson, listLessons } from "@/lib/lessons";
import type { Lesson } from "@/lib/types";

const {
  canViewLessons,
  canCreateLessons,
  canUpdateLessons,
  canDeleteLessons,
} = usePermissions();

const lessons = ref<Lesson[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const search = ref("");
const statusFilter = ref<string | number | null>(null);

const statusOptions: SelectOption[] = [
  { value: "scheduled", label: "Agendada" },
  { value: "completed", label: "Concluída" },
  { value: "cancelled", label: "Cancelada" },
  { value: "postponed", label: "Adiada" },
  { value: "makeup", label: "Reposição" },
];

const activeFilterCount = computed(() =>
  countActiveFilters([search.value, statusFilter.value])
);

const showActions = computed(
  () => canViewLessons.value || canUpdateLessons.value || canDeleteLessons.value
);

async function loadLessons() {
  if (!canViewLessons.value) {
    error.value = "Você não tem permissão para listar aulas.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listLessons({
      page: page.value,
      search: search.value.trim() || undefined,
      status: statusFilter.value ? String(statusFilter.value) : undefined,
    });
    lessons.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar aulas";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  page.value = 1;
  loadLessons();
}

function clearFilters() {
  search.value = "";
  statusFilter.value = null;
  page.value = 1;
  loadLessons();
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;
  page.value = nextPage;
  loadLessons();
}

async function removeLesson(lesson: Lesson) {
  const confirmed = await confirmDelete({
    entityLabel: "aula",
    itemName: lesson.topic,
  });

  if (!confirmed) return;

  try {
    await deleteLesson(lesson.id);
    notifyRemoved("Aula");
    await loadLessons();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao remover aula";
  }
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return { label: "Concluída", class: "badge-success" };
    case "scheduled":
      return { label: "Agendada", class: "badge-primary" };
    case "cancelled":
      return { label: "Cancelada", class: "badge-danger" };
    case "postponed":
      return { label: "Adiada", class: "badge-warning" };
    case "makeup":
      return { label: "Reposição", class: "badge-info" };
    default:
      return { label: status || "—", class: "badge-light text-dark" };
  }
}

function getTeacherName(lesson: Lesson) {
  return lesson.relationships?.teacher?.name ?? lesson.teacher?.name ?? "—";
}

function getContextLabel(lesson: Lesson) {
  const groupClass = lesson.relationships?.group_class ?? lesson.group_class;
  if (groupClass) {
    return {
      type: "Turma",
      name: groupClass.name,
      link: `/group-classes/${groupClass.id}`,
    };
  }
  const student = lesson.relationships?.student ?? lesson.student;
  if (student) {
    return {
      type: "Aluno",
      name: student.name,
      link: `/students/${student.id}`,
    };
  }
  return { type: "Geral", name: "—", link: null };
}

onMounted(loadLessons);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Aulas</h4>
          <p class="mb-0">Gerencie aulas individuais, de turma e reposições</p>
        </div>
      </div>
      <div
        v-if="canCreateLessons"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/lessons/create" class="btn btn-primary">
          <i class="la la-plus me-1"></i>
          Nova aula
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <FilterPanel
      :active-count="activeFilterCount"
      @filter="handleSearch"
      @clear="clearFilters"
    >
      <div class="row g-3">
        <div class="col-md-6 col-lg-4">
          <FilterField label="Tópico" id="lesson-filter-search">
            <input
              id="lesson-filter-search"
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Buscar por tópico..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Status" id="lesson-filter-status">
            <SingleSelect
              id="lesson-filter-status"
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Todos os status"
              :searchable="false"
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
            <h4 class="card-title mb-0">Lista de aulas ({{ total }})</h4>
            <span v-if="!showActions" class="badge bg-light text-dark">
              Somente leitura
            </span>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">Carregando...</div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-responsive-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tópico</th>
                    <th>Professor</th>
                    <th>Turma / Aluno</th>
                    <th>Data e hora</th>
                    <th>Status</th>
                    <th v-if="showActions" class="text-end text-nowrap">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="lessons.length === 0">
                    <td
                      :colspan="showActions ? 7 : 6"
                      class="text-center text-muted"
                    >
                      Nenhuma aula encontrada
                    </td>
                  </tr>
                  <tr v-for="lesson in lessons" :key="lesson.id">
                    <td>{{ lesson.id }}</td>
                    <td>
                      <RouterLink
                        v-if="canViewLessons"
                        :to="`/lessons/${lesson.id}`"
                        class="text-primary"
                      >
                        <strong>{{ lesson.topic }}</strong>
                      </RouterLink>
                      <strong v-else>{{ lesson.topic }}</strong>
                    </td>
                    <td>{{ getTeacherName(lesson) }}</td>
                    <td>
                      <template v-if="getContextLabel(lesson).link">
                        <span class="badge bg-light text-dark me-1">
                          {{ getContextLabel(lesson).type }}
                        </span>
                        <RouterLink
                          :to="getContextLabel(lesson).link!"
                          class="text-primary"
                        >
                          {{ getContextLabel(lesson).name }}
                        </RouterLink>
                      </template>
                      <span v-else class="text-muted">—</span>
                    </td>
                    <td class="text-nowrap">
                      {{ formatDateTime(lesson.class_datetime) }}
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="getStatusBadge(lesson.status).class"
                      >
                        {{ getStatusBadge(lesson.status).label }}
                      </span>
                    </td>
                    <td v-if="showActions" class="text-end text-nowrap">
                      <RouterLink
                        v-if="canViewLessons"
                        :to="`/lessons/${lesson.id}`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Ver aula ${lesson.topic}`"
                      >
                        <i class="fa fa-eye"></i>
                      </RouterLink>
                      <RouterLink
                        v-if="canUpdateLessons"
                        :to="`/lessons/${lesson.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar aula ${lesson.topic}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>
                      <button
                        v-if="canDeleteLessons"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir aula ${lesson.topic}`"
                        @click="removeLesson(lesson)"
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
</template>
