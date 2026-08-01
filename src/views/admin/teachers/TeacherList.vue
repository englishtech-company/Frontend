<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { deleteTeacher, listTeachers } from "@/lib/teachers";
import type { Teacher, TeacherStatus } from "@/lib/types";

const {
  canViewTeachers,
  canCreateTeachers,
  canUpdateTeachers,
  canDeleteTeachers,
} = usePermissions();

const teachers = ref<Teacher[]>([]);
const selectedTeacher = ref<Teacher | null>(null);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);
const search = ref("");
const statusFilter = ref<TeacherStatus | "">("");

const showActions = computed(
  () => canUpdateTeachers.value || canDeleteTeachers.value
);

async function loadTeachers() {
  if (!canViewTeachers.value) {
    error.value = "Você não tem permissão para listar professores.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listTeachers({
      page: page.value,
      search: search.value.trim() || undefined,
      status: statusFilter.value || undefined,
    });

    teachers.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao carregar professores";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  page.value = 1;
  loadTeachers();
}

function openTeacherNotes(teacher: Teacher) {
  selectedTeacher.value = teacher;
}

function closeTeacherNotes() {
  selectedTeacher.value = null;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && selectedTeacher.value) {
    closeTeacherNotes();
  }
}

async function removeTeacher(teacher: Teacher) {
  if (!canDeleteTeachers.value) {
    error.value = "Você não tem permissão para excluir professores.";
    return;
  }

  const confirmed = confirm(
    `Remover o professor "${teacher.name}"?`
  );

  if (!confirmed) return;

  try {
    await deleteTeacher(teacher.id);
    await loadTeachers();
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao remover professor";
  }
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;

  page.value = nextPage;
  loadTeachers();
}

function formatStatusBadge(status: TeacherStatus) {
  if (status === "active") {
    return {
      label: "Ativo",
      class: "badge-success",
    };
  }

  return {
    label: "Inativo",
    class: "badge-secondary",
  };
}

function formatNotesPreview(notes: string): string {
  const normalizedNotes = notes.trim();
  const maximumLength = 40;

  if (normalizedNotes.length <= maximumLength) {
    return normalizedNotes;
  }

  return `${normalizedNotes.slice(0, maximumLength).trimEnd()}...`;
}

onMounted(() => {
  loadTeachers();
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Professores</h4>
          <p class="mb-0">
            Gerencie os professores cadastrados no sistema
          </p>
        </div>
      </div>

      <div
        v-if="canCreateTeachers"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink
          to="/teachers/create"
          class="btn btn-primary"
        >
          <i class="la la-plus me-1"></i>
          Novo professor
        </RouterLink>
      </div>
    </div>

    <div
      v-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div
            class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"
          >
            <h4 class="card-title mb-0">
              Lista de professores ({{ total }})
            </h4>

            <div class="d-flex align-items-center gap-2">
              <input
                v-model="search"
                type="text"
                class="form-control form-control-sm"
                placeholder="Buscar por nome..."
                aria-label="Buscar professor por nome"
                style="max-width: 200px;"
                @keyup.enter="handleSearch"
              />

              <select
                v-model="statusFilter"
                class="form-select form-select-sm"
                aria-label="Filtrar professores por status"
                style="max-width: 140px;"
                @change="handleSearch"
              >
                <option value="">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>

              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                @click="handleSearch"
              >
                Filtrar
              </button>

              <span
                v-if="!showActions"
                class="badge bg-light text-dark"
              >
                Somente leitura
              </span>
            </div>
          </div>

          <div class="card-body">
            <div
              v-if="loading"
              class="text-center py-4"
            >
              Carregando...
            </div>

            <div
              v-else
              class="table-responsive"
            >
              <table class="table table-striped table-responsive-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th class="text-nowrap">Nome</th>
                    <th class="text-nowrap">E-mail</th>
                    <th class="text-nowrap">Telefone</th>
                    <th class="text-nowrap">Status</th>
                    <th>Observações</th>
                    <th
                      v-if="showActions"
                      class="text-end text-nowrap"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-if="teachers.length === 0">
                    <td
                      :colspan="showActions ? 7 : 6"
                      class="text-center text-muted"
                    >
                      Nenhum professor encontrado
                    </td>
                  </tr>

                  <tr
                    v-for="teacher in teachers"
                    :key="teacher.id"
                  >
                    <td>{{ teacher.id }}</td>

                    <td class="text-nowrap">
                      <strong>{{ teacher.name }}</strong>
                    </td>

                    <td class="text-nowrap">
                      {{ teacher.email }}
                    </td>

                    <td class="text-nowrap">
                      {{ teacher.phone || "—" }}
                    </td>

                    <td class="text-nowrap">
                      <span
                        class="badge"
                        :class="formatStatusBadge(teacher.status).class"
                      >
                        {{ formatStatusBadge(teacher.status).label }}
                      </span>
                    </td>

                    <td>
                      <button
                        v-if="teacher.notes"
                        type="button"
                        class="teacher-notes-button"
                        :aria-label="`Ver observações de ${teacher.name}`"
                        @click="openTeacherNotes(teacher)"
                      >
                        <span class="teacher-notes">
                          {{ formatNotesPreview(teacher.notes) }}
                        </span>
                        <i
                          class="la la-eye teacher-notes-button__icon"
                          aria-hidden="true"
                        ></i>
                      </button>

                      <span v-else>—</span>
                    </td>

                    <td
                      v-if="showActions"
                      class="text-end text-nowrap"
                    >
                      <RouterLink
                        v-if="canUpdateTeachers"
                        :to="`/teachers/${teacher.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar ${teacher.name}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>

                      <button
                        v-if="canDeleteTeachers"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir ${teacher.name}`"
                        @click="removeTeacher(teacher)"
                      >
                        <i class="fa fa-trash"></i>
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

              <span>
                Página {{ page }} de {{ lastPage }}
              </span>

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

  <Teleport to="body">
    <Transition name="teacher-notes-modal">
      <div
        v-if="selectedTeacher"
        class="teacher-notes-overlay"
        @click.self="closeTeacherNotes"
      >
        <section
          class="teacher-notes-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="teacher-notes-title"
        >
          <header class="teacher-notes-dialog__header">
            <div>
              <h5
                id="teacher-notes-title"
                class="teacher-notes-dialog__title"
              >
                Observações do professor
              </h5>
              <p class="teacher-notes-dialog__teacher">
                {{ selectedTeacher.name }}
              </p>
            </div>

            <button
              type="button"
              class="teacher-notes-dialog__close"
              aria-label="Fechar observações"
              @click="closeTeacherNotes"
            >
              <i class="la la-times" aria-hidden="true"></i>
            </button>
          </header>

          <div class="teacher-notes-dialog__body">
            {{ selectedTeacher.notes }}
          </div>

          <footer class="teacher-notes-dialog__footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="closeTeacherNotes"
            >
              Fechar
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.teacher-notes-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
}

.teacher-notes {
  white-space: nowrap;
}

.teacher-notes-button__icon {
  flex-shrink: 0;
  color: var(--primary);
  font-size: 1rem;
}

.teacher-notes-button:hover .teacher-notes,
.teacher-notes-button:focus .teacher-notes {
  color: var(--primary);
}

.teacher-notes-button:focus-visible {
  border-radius: 0.2rem;
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

.teacher-notes-overlay {
  position: fixed;
  z-index: 2000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(20, 24, 31, 0.55);
}

.teacher-notes-dialog {
  width: 100%;
  max-width: 560px;
  max-height: calc(100vh - 2rem);
  overflow: hidden;
  border-radius: 0.75rem;
  background: #ffffff;
  box-shadow: 0 1.25rem 3rem rgba(20, 24, 31, 0.24);
}

.teacher-notes-dialog__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.teacher-notes-dialog__title {
  margin: 0;
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.teacher-notes-dialog__teacher {
  margin: 0.35rem 0 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.teacher-notes-dialog__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #f3f4f6;
  color: #495057;
  font-size: 1.25rem;
  cursor: pointer;
}

.teacher-notes-dialog__close:hover {
  background: #e9ecef;
  color: var(--primary);
}

.teacher-notes-dialog__body {
  max-height: 50vh;
  overflow-y: auto;
  padding: 1.5rem;
  color: #495057;
  line-height: 1.6;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.teacher-notes-dialog__footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
}

.teacher-notes-modal-enter-active,
.teacher-notes-modal-leave-active {
  transition: opacity 0.15s ease;
}

.teacher-notes-modal-enter-active .teacher-notes-dialog,
.teacher-notes-modal-leave-active .teacher-notes-dialog {
  transition: transform 0.15s ease;
}

.teacher-notes-modal-enter-from,
.teacher-notes-modal-leave-to {
  opacity: 0;
}

.teacher-notes-modal-enter-from .teacher-notes-dialog,
.teacher-notes-modal-leave-to .teacher-notes-dialog {
  transform: translateY(0.5rem) scale(0.98);
}
</style>
