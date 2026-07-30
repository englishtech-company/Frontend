<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { deleteStudent, listStudents } from "@/lib/students";
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
const search = ref("");
const statusFilter = ref("");

const showActions = computed(() => canUpdateStudents.value || canDeleteStudents.value);

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
      search: search.value.trim() || undefined,
      status: statusFilter.value || undefined,
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

async function removeStudent(student: Student) {
  if (!confirm(`Remover o aluno "${student.name}"?`)) return;

  try {
    await deleteStudent(student.id);
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

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h4 class="card-title mb-0">Lista de alunos ({{ total }})</h4>
            <div class="d-flex align-items-center gap-2">
              <input
                v-model="search"
                type="text"
                class="form-control form-control-sm"
                placeholder="Buscar por nome..."
                style="max-width: 200px;"
                @keyup.enter="handleSearch"
              />
              <select
                v-model="statusFilter"
                class="form-select form-select-sm"
                style="max-width: 140px;"
                @change="handleSearch"
              >
                <option value="">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="pending">Pendente</option>
              </select>
              <button type="button" class="btn btn-sm btn-outline-secondary" @click="handleSearch">
                Filtrar
              </button>
              <span v-if="!showActions" class="badge bg-light text-dark">Somente leitura</span>
            </div>
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
                    <th>Início</th>
                    <th v-if="showActions" class="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="students.length === 0">
                    <td :colspan="showActions ? 7 : 6" class="text-center text-muted">
                      Nenhum aluno encontrado
                    </td>
                  </tr>
                  <tr v-for="student in students" :key="student.id">
                    <td>{{ student.id }}</td>
                    <td><strong>{{ student.name }}</strong></td>
                    <td>{{ student.email }}</td>
                    <td>{{ student.phone || "—" }}</td>
                    <td>
                      <span class="badge" :class="formatStatusBadge(student.status).class">
                        {{ formatStatusBadge(student.status).label }}
                      </span>
                    </td>
                    <td>
                      {{
                        student.start_date
                          ? new Date(student.start_date).toLocaleDateString("pt-BR")
                          : "—"
                      }}
                    </td>
                    <td v-if="showActions" class="text-end">
                      <RouterLink
                        v-if="canUpdateStudents"
                        :to="`/students/${student.id}/edit`"
                        class="btn btn-sm btn-primary me-1"
                      >
                        Editar
                      </RouterLink>
                      <button
                        v-if="canDeleteStudents"
                        type="button"
                        class="btn btn-sm btn-danger"
                        @click="removeStudent(student)"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              v-if="lastPage > 1"
              class="d-flex justify-content-between align-items-center mt-3"
            >
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                :disabled="page <= 1"
                @click="goToPage(page - 1)"
              >
                Anterior
              </button>
              <span>Página {{ page }} de {{ lastPage }}</span>
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                :disabled="page >= lastPage"
                @click="goToPage(page + 1)"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
