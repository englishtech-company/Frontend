<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { listLessons, deleteLesson } from "@/lib/lessons";
import type { Lesson } from "@/lib/types";
import { usePermissions } from "@/composables/usePermissions";
import { notifyRemoved, notify } from "@/lib/actionNotification";

import FilterPanel from "@/components/ui/FilterPanel.vue";
import FilterField from "@/components/ui/FilterField.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import ListPagination from "@/components/ui/ListPagination.vue";

const router = useRouter();
const { canCreateLessons, canUpdateLessons, canDeleteLessons } = usePermissions();

const loading = ref(false);
const error = ref(false);
const lessons = ref<Lesson[]>([]);
const total = ref(0);
const page = ref(1);
const lastPage = ref(1);

const search = ref("");
const statusFilter = ref<string | null>(null);

const statusOptions = [
  { value: "scheduled", label: "Agendada" },
  { value: "completed", label: "Concluída" },
  { value: "cancelled", label: "Cancelada" },
  { value: "postponed", label: "Adiada" },
  { value: "makeup", label: "Reposição" },
];

const activeFilterCount = computed(() => {
  let count = 0;
  if (search.value.trim()) count += 1;
  if (statusFilter.value) count += 1;
  return count;
});

const loadLessons = async () => {
  loading.value = true;
  error.value = false;
  try {
    const data = await listLessons({
      page: page.value,
      search: search.value,
      status: statusFilter.value || undefined,
    });
    lessons.value = data.data;
    total.value = data.total;
    lastPage.value = data.last_page;
  } catch (err) {
    console.error(err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  page.value = 1;
  loadLessons();
};

const clearFilters = () => {
  search.value = "";
  statusFilter.value = null;
  page.value = 1;
  loadLessons();
};

const goToPage = (newPage: number) => {
  page.value = newPage;
  loadLessons();
};

const editLesson = (id: number) => {
  router.push(`/lessons/${id}/edit`);
};

const confirmDelete = async (lesson: Lesson) => {
  if (!confirm(`Tem certeza que deseja excluir a aula "${lesson.topic}"?`)) return;
  try {
    await deleteLesson(lesson.id);
    notifyRemoved("Aula");
    loadLessons();
  } catch (err) {
    console.error(err);
    notify.error("Erro ao excluir a aula.");
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const getStatusLabel = (status: string) => {
  const opt = statusOptions.find((o) => o.value === status);
  return opt ? opt.label : status;
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
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
};

const getTeacherName = (lesson: Lesson) => {
  return lesson.relationships?.teacher?.name ?? lesson.teacher?.name ?? "—";
};

const getContextLabel = (lesson: Lesson) => {
  const groupClass = lesson.relationships?.group_class ?? lesson.group_class;
  if (groupClass) {
    return { type: "Turma", name: groupClass.name, link: `/group-classes/${groupClass.id}` };
  }
  const student = lesson.relationships?.student ?? lesson.student;
  if (student) {
    return { type: "Aluno", name: student.name, link: `/students/${student.id}` };
  }
  return { type: "Geral", name: "—", link: null };
};

onMounted(() => {
  loadLessons();
});
</script>

<template>
  <div class="container-fluid">
    <div class="page-titles d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Aulas</h4>
      <RouterLink
        v-if="canCreateLessons"
        to="/lessons/create"
        class="btn btn-primary"
      >
        <i class="la la-plus me-1"></i>
        Nova Aula
      </RouterLink>
    </div>

    <div v-if="error" class="alert alert-danger">
      Erro ao carregar a lista de aulas.
    </div>

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

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="card-title mb-0">Lista de Aulas ({{ total }})</h4>
        <span v-if="!canUpdateLessons && !canDeleteLessons" class="badge bg-secondary">
          Somente leitura
        </span>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tópico</th>
                <th>Professor</th>
                <th>Turma / Aluno</th>
                <th>Data e Hora</th>
                <th>Status</th>
                <th v-if="canUpdateLessons || canDeleteLessons" class="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading && !lessons.length">
                <td colspan="7" class="text-center py-4">Carregando...</td>
              </tr>
              <tr v-else-if="!lessons.length">
                <td colspan="7" class="text-center py-4">Nenhuma aula encontrada.</td>
              </tr>
              <tr v-for="lesson in lessons" :key="lesson.id">
                <td>{{ lesson.id }}</td>
                <td><strong>{{ lesson.topic }}</strong></td>
                <td>{{ getTeacherName(lesson) }}</td>
                <td>
                  <template v-if="getContextLabel(lesson).link">
                    <span class="badge bg-light text-dark me-1">{{ getContextLabel(lesson).type }}</span>
                    <RouterLink :to="getContextLabel(lesson).link!" class="text-primary">
                      {{ getContextLabel(lesson).name }}
                    </RouterLink>
                  </template>
                  <template v-else>
                    <span class="text-muted">—</span>
                  </template>
                </td>
                <td>{{ formatDate(lesson.class_datetime) }}</td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(lesson.status)">
                    {{ getStatusLabel(lesson.status) }}
                  </span>
                </td>
                <td v-if="canUpdateLessons || canDeleteLessons" class="text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <button
                      v-if="canUpdateLessons"
                      class="btn btn-sm btn-outline-primary"
                      title="Editar"
                      @click="editLesson(lesson.id)"
                    >
                      <i class="la la-pencil"></i>
                    </button>
                    <button
                      v-if="canDeleteLessons"
                      class="btn btn-sm btn-outline-danger"
                      title="Excluir"
                      @click="confirmDelete(lesson)"
                    >
                      <i class="la la-trash"></i>
                    </button>
                  </div>
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
  </div>
</template>
