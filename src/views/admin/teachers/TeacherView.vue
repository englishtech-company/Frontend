<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import ProfileAvatar from "@/components/admin/ProfileAvatar.vue";
import ProfileModulePlaceholder from "@/components/admin/ProfileModulePlaceholder.vue";
import { usePermissions } from "@/composables/usePermissions";
import { getTeacher } from "@/lib/teachers";
import {
  formatStudentPlanShortLabel,
  getStudentCurrentPlanVariant,
} from "@/lib/students/format";
import {
  formatStudentStatusForTeacher,
  formatTeacherDate,
  formatTeacherDateTime,
  formatTeacherStatusBadge,
  getTeacherActiveStudentCount,
  getTeacherAssignmentSince,
  getTeacherCurrentStudents,
  getTeacherDaysInSystem,
  getTeacherStudentAssignments,
  TEACHER_MODULE_TABS,
} from "@/lib/teachers/format";
import type { Teacher } from "@/lib/types";

const route = useRoute();
const { canUpdateTeachers, canViewStudents } = usePermissions();

const teacherId = computed(() => Number(route.params.id));
const teacher = ref<Teacher | null>(null);
const loading = ref(true);
const error = ref("");
const activeTab = ref<
  | "overview"
  | "students"
  | "classes"
  | "reports"
  | "documents"
  | "availability"
  | "history"
>("overview");

const statusBadge = computed(() =>
  formatTeacherStatusBadge(teacher.value?.status ?? "")
);

const currentStudents = computed(() =>
  teacher.value ? getTeacherCurrentStudents(teacher.value) : []
);

const studentAssignments = computed(() =>
  teacher.value ? getTeacherStudentAssignments(teacher.value) : []
);

async function loadTeacher() {
  loading.value = true;
  error.value = "";

  try {
    teacher.value = await getTeacher(teacherId.value);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar professor";
  } finally {
    loading.value = false;
  }
}

onMounted(loadTeacher);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Perfil do professor</h4>
          <p class="mb-0">Visão geral e alunos vinculados</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <RouterLink to="/teachers">Professores</RouterLink>
          </li>
          <li class="breadcrumb-item active">
            <span>{{ teacher?.name ?? "Detalhes" }}</span>
          </li>
        </ol>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="loading" class="text-center py-5">Carregando...</div>

    <div v-else-if="teacher" class="row">
      <div class="col-xl-3 col-xxl-4 col-lg-4">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="text-center p-3 overlay-box">
                <div class="profile-photo">
                  <ProfileAvatar :size="100" />
                </div>
                <h3 class="mt-3 mb-1 text-white">{{ teacher.name }}</h3>
                <span class="badge" :class="statusBadge.class">{{ statusBadge.label }}</span>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">Cadastro</span>
                  <strong class="text-muted">{{ formatTeacherDate(teacher.created_at) }}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">Atualizado</span>
                  <strong class="text-muted">{{ formatTeacherDate(teacher.updated_at) }}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">Alunos ativos</span>
                  <strong class="text-muted">{{ getTeacherActiveStudentCount(teacher) }}</strong>
                </li>
              </ul>
              <div class="card-footer text-center border-0 mt-0">
                <div class="profile-actions">
                  <RouterLink
                    to="/teachers"
                    class="btn btn-warning"
                    data-tooltip="Voltar"
                    aria-label="Voltar"
                  >
                    <i class="fa fa-arrow-left"></i>
                  </RouterLink>
                  <RouterLink
                    v-if="canUpdateTeachers"
                    :to="`/teachers/${teacher.id}/edit`"
                    class="btn btn-primary"
                    data-tooltip="Editar"
                    aria-label="Editar"
                  >
                    <i class="fa fa-pencil"></i>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-12">
            <div class="card overflow-hidden">
              <div class="card-header">
                <h2 class="card-title">Sobre</h2>
              </div>
              <div class="card-body pb-0">
                <p class="text-muted mb-3">
                  Dados de contato e identificação do professor no sistema.
                </p>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>E-mail</strong>
                    <span class="mb-0 text-end">{{ teacher.email }}</span>
                  </li>
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>Telefone</strong>
                    <span class="mb-0">{{ teacher.phone || "—" }}</span>
                  </li>
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>Status</strong>
                    <span class="badge" :class="statusBadge.class">{{ statusBadge.label }}</span>
                  </li>
                </ul>
              </div>
              <div class="card-footer pt-0 pb-0 text-center">
                <div class="row">
                  <div class="col-4 pt-3 pb-3 border-end">
                    <h3 class="mb-1 text-primary">{{ getTeacherActiveStudentCount(teacher) }}</h3>
                    <span>Alunos</span>
                  </div>
                  <div class="col-4 pt-3 pb-3 border-end">
                    <h3 class="mb-1 text-primary">{{ studentAssignments.length }}</h3>
                    <span>Atribuições</span>
                  </div>
                  <div class="col-4 pt-3 pb-3">
                    <h3 class="mb-1 text-primary">{{ getTeacherDaysInSystem(teacher) }}</h3>
                    <span>Dias no sistema</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-12">
            <div class="card">
              <div class="card-header d-block">
                <h4 class="card-title">Observações</h4>
              </div>
              <div class="card-body">
                <p class="mb-0">{{ teacher.notes || "Nenhuma observação registrada." }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-9 col-xxl-8 col-lg-8">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="profile-tab">
                  <div class="custom-tab-1">
                    <ul class="nav nav-tabs" role="tablist">
                      <li class="nav-item" role="presentation">
                        <button
                          type="button"
                          class="nav-link"
                          :class="{ active: activeTab === 'overview' }"
                          @click="activeTab = 'overview'"
                        >
                          Resumo
                        </button>
                      </li>
                      <li class="nav-item" role="presentation">
                        <button
                          type="button"
                          class="nav-link"
                          :class="{ active: activeTab === 'students' }"
                          @click="activeTab = 'students'"
                        >
                          Alunos
                          <span v-if="currentStudents.length" class="badge badge-primary ms-1">
                            {{ currentStudents.length }}
                          </span>
                        </button>
                      </li>
                      <li
                        v-for="moduleTab in TEACHER_MODULE_TABS"
                        :key="moduleTab.id"
                        class="nav-item"
                        role="presentation"
                      >
                        <button
                          type="button"
                          class="nav-link"
                          :class="{ active: activeTab === moduleTab.id }"
                          @click="activeTab = moduleTab.id as typeof activeTab"
                        >
                          {{ moduleTab.label }}
                        </button>
                      </li>
                      <li class="nav-item" role="presentation">
                        <button
                          type="button"
                          class="nav-link"
                          :class="{ active: activeTab === 'history' }"
                          @click="activeTab = 'history'"
                        >
                          Histórico
                        </button>
                      </li>
                    </ul>

                    <div class="tab-content">
                      <div
                        v-show="activeTab === 'overview'"
                        class="tab-pane fade active show"
                        role="tabpanel"
                      >
                        <div class="profile-personal-info pt-4">
                          <h4 class="text-primary mb-4">Informações cadastrais</h4>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">Nome <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <span>{{ teacher.name }}</span>
                            </div>
                          </div>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">E-mail <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <span>{{ teacher.email }}</span>
                            </div>
                          </div>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">Status <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <span class="badge" :class="statusBadge.class">
                                {{ statusBadge.label }}
                              </span>
                            </div>
                          </div>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">Telefone <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <span>{{ teacher.phone || "—" }}</span>
                            </div>
                          </div>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">Observações <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <span>{{ teacher.notes || "—" }}</span>
                            </div>
                          </div>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">Alunos ativos <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <span>{{ getTeacherActiveStudentCount(teacher) }}</span>
                            </div>
                          </div>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">Atualizado em <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <span>{{ formatTeacherDateTime(teacher.updated_at) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        v-for="moduleTab in TEACHER_MODULE_TABS"
                        :key="moduleTab.id"
                        v-show="activeTab === moduleTab.id"
                        class="tab-pane fade active show"
                        role="tabpanel"
                      >
                        <ProfileModulePlaceholder
                          :title="moduleTab.title"
                          :description="moduleTab.description"
                          :icon="moduleTab.icon"
                          :examples="moduleTab.examples"
                        />
                      </div>

                      <div
                        v-show="activeTab === 'students'"
                        class="tab-pane fade active show"
                        role="tabpanel"
                      >
                        <div class="pt-4 pb-3">
                          <h5 class="mb-3">
                            Alunos vinculados ({{ currentStudents.length }})
                          </h5>

                          <div v-if="currentStudents.length" class="table-responsive">
                            <table class="table table-striped table-responsive-sm">
                              <thead>
                                <tr>
                                  <th>Nome</th>
                                  <th>E-mail</th>
                                  <th>Status</th>
                                  <th>Plano</th>
                                  <th>Desde</th>
                                  <th
                                    v-if="canViewStudents"
                                    class="text-end text-nowrap"
                                  >
                                    Ações
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="student in currentStudents" :key="student.id">
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
                                  <td>
                                    <span
                                      class="badge"
                                      :class="formatStudentStatusForTeacher(student.status).class"
                                    >
                                      {{ formatStudentStatusForTeacher(student.status).label }}
                                    </span>
                                  </td>
                                  <td>
                                    {{
                                      formatStudentPlanShortLabel(
                                        getStudentCurrentPlanVariant(student)
                                      )
                                    }}
                                  </td>
                                  <td>
                                    {{ getTeacherAssignmentSince(teacher, student.id) }}
                                  </td>
                                  <td
                                    v-if="canViewStudents"
                                    class="text-end text-nowrap"
                                  >
                                    <RouterLink
                                      :to="`/students/${student.id}`"
                                      class="btn btn-xs sharp btn-primary"
                                      :aria-label="`Ver ${student.name}`"
                                    >
                                      <i class="fa fa-eye"></i>
                                    </RouterLink>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <p v-else class="text-muted mb-0">
                            Nenhum aluno vinculado atualmente a este professor.
                          </p>
                        </div>
                      </div>

                      <div
                        v-show="activeTab === 'history'"
                        class="tab-pane fade active show"
                        role="tabpanel"
                      >
                        <div class="pt-4 pb-3">
                          <div class="alert alert-light border mb-4">
                            <h5 class="mb-2">Histórico de atividades</h5>
                            <p class="mb-0 text-muted">
                              Em breve você verá aqui alterações cadastrais, eventos de agenda
                              e relatórios vinculados a este professor.
                            </p>
                          </div>

                          <ul class="list-group list-group-flush mb-4">
                            <li class="list-group-item px-0 d-flex justify-content-between">
                              <span>Cadastro no sistema</span>
                              <strong class="text-muted">
                                {{ formatTeacherDateTime(teacher.created_at) }}
                              </strong>
                            </li>
                            <li class="list-group-item px-0 d-flex justify-content-between">
                              <span>Última atualização</span>
                              <strong class="text-muted">
                                {{ formatTeacherDateTime(teacher.updated_at) }}
                              </strong>
                            </li>
                          </ul>

                          <h5 class="mb-3">Atribuições de alunos</h5>
                          <ul v-if="studentAssignments.length" class="list-group list-group-flush">
                            <li
                              v-for="assignment in studentAssignments"
                              :key="assignment.id"
                              class="list-group-item px-0 d-flex justify-content-between align-items-start gap-3"
                            >
                              <div>
                                <RouterLink
                                  v-if="canViewStudents && assignment.student"
                                  :to="`/students/${assignment.student.id}`"
                                  class="text-primary"
                                >
                                  <strong>{{ assignment.student.name }}</strong>
                                </RouterLink>
                                <strong v-else>
                                  {{ assignment.student?.name || `Aluno #${assignment.student_id}` }}
                                </strong>
                                <div class="text-muted small">
                                  Desde {{ formatTeacherDate(assignment.created_at) }}
                                </div>
                              </div>
                              <span
                                v-if="
                                  assignment.student &&
                                  currentStudents.some((item) => item.id === assignment.student_id)
                                "
                                class="badge badge-success"
                              >
                                Atual
                              </span>
                            </li>
                          </ul>
                          <p v-else class="text-muted mb-0">Nenhuma atribuição registrada.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-link {
  border: none;
  background: transparent;
}

.nav-link.active {
  color: var(--primary);
}

.profile-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.profile-actions .btn {
  position: relative;
  width: 38px;
  height: 38px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.profile-actions .btn::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%);
  padding: 0.35rem 0.55rem;
  border-radius: 4px;
  background: #111827;
  color: #fff;
  font-size: 0.75rem;
  line-height: 1.2;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s ease;
  z-index: 5;
}

.profile-actions .btn:hover::after,
.profile-actions .btn:focus-visible::after {
  opacity: 1;
}
</style>
