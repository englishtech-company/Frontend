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
import { deleteStudent, listStudents } from "@/lib/students";
import {
  formatStudentPlanShortLabel,
  getStudentCurrentPlanVariant,
  getStudentCurrentTeacher,
} from "@/lib/students/format";
import type { Student } from "@/lib/types";

const {
  canViewStudents,
  canCreateStudents,
  canUpdateStudents,
  canDeleteStudents,
} = usePermissions();

const students = ref<Student[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);
const idFilter = ref("");
const nameFilter = ref("");
const emailFilter = ref("");
const phoneFilter = ref("");
const statusFilter = ref<string | number | null>(null);
const teacherFilter = ref("");
const planFilter = ref("");
const startDateFrom = ref("");
const startDateTo = ref("");

const statusOptions: SelectOption[] = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
  { value: "pending", label: "Pendente" },
];

const showActions = computed(
  () => canViewStudents.value || canUpdateStudents.value || canDeleteStudents.value
);

const activeFilterCount = computed(() =>
  countActiveFilters([
    idFilter.value,
    nameFilter.value,
    emailFilter.value,
    phoneFilter.value,
    statusFilter.value,
    teacherFilter.value,
    planFilter.value,
    startDateFrom.value,
    startDateTo.value,
  ])
);

async function loadStudents() {
  if (!canViewStudents.value) {
    error.value = "Você não tem permissão para listar alunos.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listStudents({
      page: page.value,
      id: idFilter.value.trim() ? Number(idFilter.value) : undefined,
      name: nameFilter.value.trim() || undefined,
      email: emailFilter.value.trim() || undefined,
      phone: phoneFilter.value.trim() || undefined,
      status: statusFilter.value ? String(statusFilter.value) : undefined,
      teacherName: teacherFilter.value.trim() || undefined,
      planName: planFilter.value.trim() || undefined,
      startDateFrom: startDateFrom.value || undefined,
      startDateTo: startDateTo.value || undefined,
    });
    students.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar alunos";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  page.value = 1;
  loadStudents();
}

function clearFilters() {
  idFilter.value = "";
  nameFilter.value = "";
  emailFilter.value = "";
  phoneFilter.value = "";
  statusFilter.value = null;
  teacherFilter.value = "";
  planFilter.value = "";
  startDateFrom.value = "";
  startDateTo.value = "";
  page.value = 1;
  loadStudents();
}

async function removeStudent(student: Student) {
  const confirmed = await confirmDelete({
    entityLabel: "aluno",
    itemName: student.name,
  });

  if (!confirmed) return;

  try {
    await deleteStudent(student.id);
    notifyRemoved("Aluno");
    await loadStudents();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao remover aluno";
  }
}

function goToPage(next: number) {
  if (next < 1 || next > lastPage.value) return;
  page.value = next;
  loadStudents();
}

function formatStatusBadge(status: string) {
  const s = status?.toLowerCase();
  if (s === "active" || s === "ativo") return { label: "Ativo", class: "badge-success" };
  if (s === "inactive" || s === "inativo") return { label: "Inativo", class: "badge-secondary" };
  if (s === "pending" || s === "pendente") return { label: "Pendente", class: "badge-warning" };
  return { label: status, class: "badge-light text-dark" };
}

onMounted(loadStudents);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Alunos</h4>
          <p class="mb-0">Gerencie os alunos cadastrados no sistema</p>
        </div>
      </div>
      <div
        v-if="canCreateStudents"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/students/create" class="btn btn-primary">
          <i class="la la-plus me-1"></i> Novo aluno
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
        <div class="col-md-6 col-lg-3">
          <FilterField label="#" id="student-filter-id" hint="ID do aluno">
            <input
              id="student-filter-id"
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
          <FilterField label="Nome" id="student-filter-name">
            <input
              id="student-filter-name"
              v-model="nameFilter"
              type="text"
              class="form-control"
              placeholder="Digite o nome..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="E-mail" id="student-filter-email">
            <input
              id="student-filter-email"
              v-model="emailFilter"
              type="text"
              class="form-control"
              placeholder="Digite o e-mail..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Telefone" id="student-filter-phone">
            <input
              id="student-filter-phone"
              v-model="phoneFilter"
              type="text"
              class="form-control"
              placeholder="Digite o telefone..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Status" id="student-filter-status">
            <SingleSelect
              id="student-filter-status"
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Todos os status"
              :searchable="false"
              aria-label="Filtrar por status"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Professor" id="student-filter-teacher">
            <input
              id="student-filter-teacher"
              v-model="teacherFilter"
              type="text"
              class="form-control"
              placeholder="Nome do professor..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Plano" id="student-filter-plan">
            <input
              id="student-filter-plan"
              v-model="planFilter"
              type="text"
              class="form-control"
              placeholder="Nome do plano..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Início desde" id="student-filter-start-from">
            <input
              id="student-filter-start-from"
              v-model="startDateFrom"
              type="date"
              class="form-control"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Início até" id="student-filter-start-to">
            <input
              id="student-filter-start-to"
              v-model="startDateTo"
              type="date"
              class="form-control"
            />
          </FilterField>
        </div>
      </div>
    </FilterPanel>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h4 class="card-title mb-0">Lista de alunos ({{ total }})</h4>
            <span v-if="!showActions" class="badge bg-light text-dark">Somente leitura</span>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">Carregando...</div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-responsive-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                    <th>Status</th>
                    <th>Professor</th>
                    <th>Plano</th>
                    <th>Início</th>
                    <th v-if="showActions" class="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="students.length === 0">
                    <td :colspan="showActions ? 9 : 8" class="text-center text-muted">
                      Nenhum aluno encontrado
                    </td>
                  </tr>
                  <tr v-for="student in students" :key="student.id">
                    <td>{{ student.id }}</td>
                    <td>
                      <RouterLink
                        v-if="canViewStudents"
                        :to="`/students/${student.id}`"
                        class="text-primary"
                      >
                        <strong>{{ student.name }}</strong>
                      </RouterLink>
                      <strong v-else>{{ student.name }}</strong>
                    </td>
                    <td>{{ student.email }}</td>
                    <td>{{ student.phone || "—" }}</td>
                    <td>
                      <span class="badge" :class="formatStatusBadge(student.status).class">
                        {{ formatStatusBadge(student.status).label }}
                      </span>
                    </td>
                    <td>{{ getStudentCurrentTeacher(student)?.name || "—" }}</td>
                    <td>{{ formatStudentPlanShortLabel(getStudentCurrentPlanVariant(student)) }}</td>
                    <td>
                      {{
                        student.start_date
                          ? new Date(student.start_date).toLocaleDateString("pt-BR")
                          : "—"
                      }}
                    </td>
                    <td v-if="showActions" class="text-end text-nowrap">
                      <RouterLink
                        v-if="canViewStudents"
                        :to="`/students/${student.id}`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Ver ${student.name}`"
                      >
                        <i class="fa fa-eye"></i>
                      </RouterLink>
                      <RouterLink
                        v-if="canUpdateStudents"
                        :to="`/students/${student.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar ${student.name}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>
                      <button
                        v-if="canDeleteStudents"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir ${student.name}`"
                        @click="removeStudent(student)"
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
