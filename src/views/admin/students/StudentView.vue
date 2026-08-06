<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import ProfileAvatar from "@/components/admin/ProfileAvatar.vue";
import { usePermissions } from "@/composables/usePermissions";
import { getStudent } from "@/lib/students";
import {
  formatStudentDate,
  formatStudentDateTime,
  formatStudentPlanSummary,
  formatStudentPlanVariantLabel,
  formatStudentStatusBadge,
  getStudentAge,
  getStudentCurrentPlanVariant,
  getStudentCurrentTeacher,
  getStudentEnrollmentDays,
  getStudentEnrollmentHistory,
  getStudentTeacherHistory,
  STUDENT_FUTURE_SECTIONS,
} from "@/lib/students/format";
import type { Student } from "@/lib/types";

const route = useRoute();
const { canUpdateStudents, canViewTeachers, canViewPlans } = usePermissions();

const studentId = computed(() => Number(route.params.id));
const student = ref<Student | null>(null);
const loading = ref(true);
const error = ref("");
const activeTab = ref<"overview" | "history">("overview");

const statusBadge = computed(() =>
  formatStudentStatusBadge(student.value?.status ?? "")
);

const currentTeacher = computed(() =>
  student.value ? getStudentCurrentTeacher(student.value) : null
);

const teacherHistory = computed(() =>
  student.value ? getStudentTeacherHistory(student.value) : []
);

const currentPlanVariant = computed(() =>
  student.value ? getStudentCurrentPlanVariant(student.value) : null
);

const planSummary = computed(() => formatStudentPlanSummary(currentPlanVariant.value));

const enrollmentHistory = computed(() =>
  student.value ? getStudentEnrollmentHistory(student.value) : []
);

async function loadStudent() {
  loading.value = true;
  error.value = "";

  try {
    student.value = await getStudent(studentId.value);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar aluno";
  } finally {
    loading.value = false;
  }
}

onMounted(loadStudent);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Perfil do aluno</h4>
          <p class="mb-0">Visão geral e informações cadastrais</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <RouterLink to="/students">Alunos</RouterLink>
          </li>
          <li class="breadcrumb-item active">
            <span>{{ student?.name ?? "Detalhes" }}</span>
          </li>
        </ol>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="loading" class="text-center py-5">Carregando...</div>

    <div v-else-if="student" class="row">
      <div class="col-xl-3 col-xxl-4 col-lg-4">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="text-center p-3 overlay-box">
                <div class="profile-photo">
                  <ProfileAvatar :size="100" />
                </div>
                <h3 class="mt-3 mb-1 text-white">{{ student.name }}</h3>
                <span class="badge" :class="statusBadge.class">{{ statusBadge.label }}</span>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">Início</span>
                  <strong class="text-muted">{{ formatStudentDate(student.start_date) }}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">Término</span>
                  <strong class="text-muted">{{ formatStudentDate(student.end_date) }}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">Cadastro</span>
                  <strong class="text-muted">{{ formatStudentDate(student.created_at) }}</strong>
                </li>
              </ul>
              <div class="card-footer text-center border-0 mt-0">
                <RouterLink
                  v-if="canUpdateStudents"
                  :to="`/students/${student.id}/edit`"
                  class="btn btn-primary px-4 me-1"
                >
                  Editar
                </RouterLink>
                <RouterLink to="/students" class="btn btn-warning px-4">Voltar</RouterLink>
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
                  Dados de contato e identificação do aluno no sistema.
                </p>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>E-mail</strong>
                    <span class="mb-0 text-end">{{ student.email }}</span>
                  </li>
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>Telefone</strong>
                    <span class="mb-0">{{ student.phone || "—" }}</span>
                  </li>
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>Nascimento</strong>
                    <span class="mb-0">{{ formatStudentDate(student.birthdate) }}</span>
                  </li>
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>Idade</strong>
                    <span class="mb-0">{{ getStudentAge(student.birthdate) }}</span>
                  </li>
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>Professor</strong>
                    <span class="mb-0 text-end">
                      <RouterLink
                        v-if="currentTeacher && canViewTeachers"
                        :to="`/teachers/${currentTeacher.id}`"
                        class="text-primary"
                      >
                        {{ currentTeacher.name }}
                      </RouterLink>
                      <span v-else>{{ currentTeacher?.name || "—" }}</span>
                    </span>
                  </li>
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>Plano</strong>
                    <span class="mb-0 text-end">
                      {{ formatStudentPlanVariantLabel(currentPlanVariant) }}
                    </span>
                  </li>
                </ul>
              </div>
              <div class="card-footer pt-0 pb-0 text-center">
                <div class="row">
                  <div class="col-4 pt-3 pb-3 border-end">
                    <h3 class="mb-1 text-primary">—</h3>
                    <span>Aulas</span>
                  </div>
                  <div class="col-4 pt-3 pb-3 border-end">
                    <h3 class="mb-1 text-primary">—</h3>
                    <span>Pagamentos</span>
                  </div>
                  <div class="col-4 pt-3 pb-3">
                    <h3 class="mb-1 text-primary">{{ getStudentEnrollmentDays(student) }}</h3>
                    <span>Dias matriculado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-12">
            <div class="card">
              <div class="card-header d-block">
                <h4 class="card-title">Endereço</h4>
              </div>
              <div class="card-body">
                <p class="mb-0">{{ student.address || "Endereço não informado." }}</p>
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
                              <span>{{ student.name }}</span>
                            </div>
                          </div>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">E-mail <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <span>{{ student.email }}</span>
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
                              <span>{{ student.phone || "—" }}</span>
                            </div>
                          </div>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">Nascimento <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <span>{{ formatStudentDate(student.birthdate) }}</span>
                            </div>
                          </div>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">Início <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <span>{{ formatStudentDate(student.start_date) }}</span>
                            </div>
                          </div>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">Término <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <span>{{ formatStudentDate(student.end_date) }}</span>
                            </div>
                          </div>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">Endereço <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <span>{{ student.address || "—" }}</span>
                            </div>
                          </div>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">Professor <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <RouterLink
                                v-if="currentTeacher && canViewTeachers"
                                :to="`/teachers/${currentTeacher.id}`"
                                class="text-primary"
                              >
                                {{ currentTeacher.name }}
                              </RouterLink>
                              <span v-else>{{ currentTeacher?.name || "—" }}</span>
                            </div>
                          </div>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">Plano <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <span>{{ formatStudentPlanVariantLabel(currentPlanVariant) }}</span>
                            </div>
                          </div>
                          <div class="row mb-4">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                              <h5 class="f-w-500">Atualizado em <span class="pull-right">:</span></h5>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-6 col-6">
                              <span>{{ formatStudentDateTime(student.updated_at) }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="pt-2 border-top">
                          <h4 class="text-primary mb-4">Plano contratado</h4>
                          <div v-if="currentPlanVariant" class="card border mb-4">
                            <div class="card-body">
                              <div class="d-flex align-items-start justify-content-between gap-3">
                                <div>
                                  <h5 class="mb-2">{{ planSummary.planName }}</h5>
                                  <p class="text-muted mb-2">
                                    {{ planSummary.hours }} · {{ planSummary.price }}/mês
                                  </p>
                                  <p class="mb-0 small text-muted">
                                    {{ planSummary.commitment }} · Vigência de
                                    {{ planSummary.duration }}
                                  </p>
                                </div>
                                <RouterLink
                                  v-if="canViewPlans && currentPlanVariant.plan_id"
                                  :to="`/plans/${currentPlanVariant.plan_id}/edit`"
                                  class="btn btn-sm btn-outline-primary"
                                >
                                  Ver plano
                                </RouterLink>
                              </div>
                            </div>
                          </div>
                          <p v-else class="text-muted mb-4">Nenhum plano vinculado atualmente.</p>
                        </div>

                        <div class="pt-2 border-top">
                          <h4 class="text-primary mb-4">Próximas integrações</h4>
                          <div class="row">
                            <div
                              v-for="section in STUDENT_FUTURE_SECTIONS"
                              :key="section.id"
                              class="col-xl-6 mb-4"
                            >
                              <div class="card border h-100 mb-0">
                                <div class="card-body">
                                  <div class="d-flex align-items-start">
                                    <span
                                      class="rounded-circle bg-primary-light d-inline-flex align-items-center justify-content-center me-3"
                                      style="width: 42px; height: 42px; min-width: 42px;"
                                    >
                                      <i :class="section.icon" class="text-primary fs-18"></i>
                                    </span>
                                    <div>
                                      <h5 class="mb-1">{{ section.title }}</h5>
                                      <p class="text-muted mb-2">{{ section.description }}</p>
                                      <span class="badge badge-light text-dark">Em breve</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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
                              Em breve você verá aqui alterações cadastrais, eventos de matrícula,
                              pagamentos e registros de aula vinculados a este aluno.
                            </p>
                          </div>

                          <ul class="list-group list-group-flush mb-4">
                            <li class="list-group-item px-0 d-flex justify-content-between">
                              <span>Cadastro no sistema</span>
                              <strong class="text-muted">
                                {{ formatStudentDateTime(student.created_at) }}
                              </strong>
                            </li>
                            <li class="list-group-item px-0 d-flex justify-content-between">
                              <span>Última atualização</span>
                              <strong class="text-muted">
                                {{ formatStudentDateTime(student.updated_at) }}
                              </strong>
                            </li>
                          </ul>

                          <h5 class="mb-3">Professores</h5>
                          <ul v-if="teacherHistory.length" class="list-group list-group-flush mb-4">
                            <li
                              v-for="assignment in teacherHistory"
                              :key="assignment.id"
                              class="list-group-item px-0 d-flex justify-content-between align-items-start gap-3"
                            >
                              <div>
                                <RouterLink
                                  v-if="assignment.teacher && canViewTeachers"
                                  :to="`/teachers/${assignment.teacher.id}`"
                                  class="text-primary"
                                >
                                  <strong>{{ assignment.teacher.name }}</strong>
                                </RouterLink>
                                <strong v-else-if="assignment.teacher">
                                  {{ assignment.teacher.name }}
                                </strong>
                                <strong v-else>Sem professor</strong>
                                <div class="text-muted small">
                                  Desde {{ formatStudentDate(assignment.created_at) }}
                                </div>
                              </div>
                              <span
                                v-if="
                                  assignment.teacher?.id &&
                                  assignment.teacher.id === currentTeacher?.id
                                "
                                class="badge badge-success"
                              >
                                Atual
                              </span>
                            </li>
                          </ul>
                          <p v-else class="text-muted mb-4">Nenhum professor vinculado.</p>

                          <h5 class="mb-3">Planos</h5>
                          <ul v-if="enrollmentHistory.length" class="list-group list-group-flush">
                            <li
                              v-for="assignment in enrollmentHistory"
                              :key="assignment.id"
                              class="list-group-item px-0 d-flex justify-content-between align-items-start gap-3"
                            >
                              <div>
                                <strong>
                                  {{
                                    assignment.plan_variant
                                      ? formatStudentPlanVariantLabel(assignment.plan_variant)
                                      : "Sem plano"
                                  }}
                                </strong>
                                <div class="text-muted small">
                                  Desde {{ formatStudentDate(assignment.created_at) }}
                                </div>
                              </div>
                              <span
                                v-if="
                                  assignment.plan_variant_id &&
                                  assignment.plan_variant_id === currentPlanVariant?.id
                                "
                                class="badge badge-success"
                              >
                                Atual
                              </span>
                            </li>
                          </ul>
                          <p v-else class="text-muted mb-0">Nenhum plano vinculado.</p>
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
</style>
