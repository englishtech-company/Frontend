<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDelete } from "@/lib/confirm";
import { deleteGroupStudent, listGroupStudents } from "@/lib/groupStudents";
import type { GroupStudent } from "@/lib/types";

const {
  canViewGroupStudents,
  canCreateGroupStudents,
  canUpdateGroupStudents,
  canDeleteGroupStudents,
} = usePermissions();

const groupStudents = ref<GroupStudent[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const showActions = computed(
  () => canViewGroupStudents.value || canUpdateGroupStudents.value || canDeleteGroupStudents.value
);

async function loadGroupStudents() {
  if (!canViewGroupStudents.value) {
    error.value = "Você não tem permissão para listar alunos das turmas.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listGroupStudents({
      page: page.value,
    });
    groupStudents.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar alunos das turmas";
  } finally {
    loading.value = false;
  }
}

async function removeGroupStudent(groupStudent: GroupStudent) {
  const confirmed = await confirmDelete({
    entityLabel: "aluno da turma",
    itemName: groupStudent.student?.name || `Registro #${groupStudent.id}`,
  });

  if (!confirmed) return;

  try {
    await deleteGroupStudent(groupStudent.id);
    await loadGroupStudents();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao remover aluno da turma";
  }
}

function goToPage(next: number) {
  if (next < 1 || next > lastPage.value) return;
  page.value = next;
  loadGroupStudents();
}

onMounted(loadGroupStudents);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Alunos da Turma</h4>
          <p class="mb-0">Vincule alunos às turmas</p>
        </div>
      </div>
      <div
        v-if="canCreateGroupStudents"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/group-students/create" class="btn btn-primary">
          <i class="la la-plus me-1"></i> Novo Vínculo
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h4 class="card-title mb-0">Alunos em turmas ({{ total }})</h4>
            <div class="d-flex align-items-center gap-2">
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
                    <th>Turma</th>
                    <th>Aluno</th>
                    <th>Data de Vínculo</th>
                    <th v-if="showActions" class="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="groupStudents.length === 0">
                    <td :colspan="showActions ? 5 : 4" class="text-center text-muted">
                      Nenhum aluno em turma encontrado
                    </td>
                  </tr>
                  <tr v-for="groupStudent in groupStudents" :key="groupStudent.id">
                    <td>
                      <RouterLink
                        v-if="canUpdateGroupStudents"
                        :to="`/group-students/${groupStudent.id}/edit`"
                        class="text-primary"
                      >
                        <strong>{{ groupStudent.id }}</strong>
                      </RouterLink>
                      <strong v-else>{{ groupStudent.id }}</strong>
                    </td>
                    <td>
                      Turma #{{ groupStudent.group_class_id }}
                    </td>
                    <td>
                      {{ groupStudent.student?.name || `Aluno #${groupStudent.student_id}` }}
                    </td>
                    <td>
                      {{
                        groupStudent.created_at
                          ? new Date(groupStudent.created_at).toLocaleDateString("pt-BR")
                          : "—"
                      }}
                    </td>
                    <td v-if="showActions" class="text-end text-nowrap">
                      <RouterLink
                        v-if="canUpdateGroupStudents"
                        :to="`/group-students/${groupStudent.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar vínculo ${groupStudent.id}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>
                      <button
                        v-if="canDeleteGroupStudents"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir vínculo ${groupStudent.id}`"
                        @click="removeGroupStudent(groupStudent)"
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
