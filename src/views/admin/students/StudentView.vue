<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import ProfileAvatar from "@/components/admin/ProfileAvatar.vue";
import StudentDocumentsPanel from "@/components/admin/StudentDocumentsPanel.vue";
import StudentPaymentsPanel from "@/components/admin/StudentPaymentsPanel.vue";
import StudentLessonsPanel from "@/components/admin/StudentLessonsPanel.vue";
import ProfileModulePlaceholder from "@/components/admin/ProfileModulePlaceholder.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { notify } from "@/lib/actionNotification";
import { getStudent } from "@/lib/students";
import {
  formatCpf,
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
  STUDENT_MODULE_TABS,
} from "@/lib/students/format";
import { enrollStudentInGroupClass, getGroupClassOptions } from "@/lib/groupClasses";
import type { Student } from "@/lib/types";

const route = useRoute();
const { canUpdateStudents, canViewTeachers, canViewPlans, canUpdateGroupClasses, canViewGroupClasses } = usePermissions();

const studentId = computed(() => Number(route.params.id));
const student = ref<Student | null>(null);
const loading = ref(true);
const error = ref("");
const activeTab = ref<
  "overview" | "classes" | "payments" | "documents" | "history" | "turmas"
>("overview");

// --- Modal state ---
const showEnrollModal = ref(false);
const enrollError = ref("");
const enrollSuccess = ref("");
const enrolling = ref(false);
const selectedGroupClassId = ref<string>("");
const groupClassOptions = ref<SelectOption[]>([]);
const loadingClassOptions = ref(false);

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

async function openEnrollModal() {
  enrollError.value = "";
  enrollSuccess.value = "";
  selectedGroupClassId.value = "";
  showEnrollModal.value = true;

  if (groupClassOptions.value.length === 0) {
    loadingClassOptions.value = true;
    try {
      const options = await getGroupClassOptions();
      groupClassOptions.value = Object.entries(options).map(([value, label]) => ({
        value,
        label,
      }));
    } catch {
      enrollError.value = "Erro ao carregar as turmas disponíveis.";
    } finally {
      loadingClassOptions.value = false;
    }
  }
}

function closeEnrollModal() {
  showEnrollModal.value = false;
  enrollError.value = "";
  enrollSuccess.value = "";
  selectedGroupClassId.value = "";
}

async function submitEnrollment() {
  if (!selectedGroupClassId.value || !student.value) return;

  enrolling.value = true;
  enrollError.value = "";
  enrollSuccess.value = "";

  try {
    await enrollStudentInGroupClass(Number(selectedGroupClassId.value), student.value.id);
    enrollSuccess.value = "Aluno matriculado com sucesso!";
    notify.success("Aluno matriculado com sucesso!");
    // Reload student so their turmas list (if shown) refreshes
    await loadStudent();
  } catch (e) {
    enrollError.value = e instanceof Error ? e.message : "Erro ao matricular aluno.";
  } finally {
    enrolling.value = false;
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
                <div class="profile-actions">
                  <RouterLink
                    to="/students"
                    class="btn btn-warning"
                    data-tooltip="Voltar"
                    aria-label="Voltar"
                  >
                    <i class="fa fa-arrow-left"></i>
                  </RouterLink>
                  <RouterLink
                    v-if="canUpdateStudents"
                    :to="`/students/${student.id}/edit`"
                    class="btn btn-primary"
                    data-tooltip="Editar"
                    aria-label="Editar"
                  >
                    <i class="fa fa-pencil"></i>
                  </RouterLink>
                  <button
                    v-if="canUpdateGroupClasses"
                    type="button"
                    class="btn btn-success"
                    data-tooltip="Matricular em Turma"
                    aria-label="Matricular em Turma"
                    @click="openEnrollModal"
                  >
                    <i class="fa fa-graduation-cap"></i>
                  </button>
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
                  Dados de contato e identificação do aluno no sistema.
                </p>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>E-mail</strong>
                    <span class="mb-0 text-end">{{ student.email }}</span>
                  </li>
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>CPF</strong>
                    <span class="mb-0">{{ formatCpf(student.cpf) }}</span>
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
                      <li
                        v-for="moduleTab in STUDENT_MODULE_TABS"
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
                      <li class="nav-item" role="presentation">
                        <button
                          type="button"
                          class="nav-link"
                          :class="{ active: activeTab === 'turmas' }"
                          @click="activeTab = 'turmas'"
                        >
                          Turmas
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
                          <h4 class="text-primary mb-3">Informações cadastrais</h4>
                          <div class="info-grid">
                            <div class="info-item">
                              <span class="info-label">Nome</span>
                              <span class="info-value">{{ student.name }}</span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">Status</span>
                              <span class="info-value">
                                <span class="badge" :class="statusBadge.class">
                                  {{ statusBadge.label }}
                                </span>
                              </span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">E-mail</span>
                              <span class="info-value">{{ student.email }}</span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">Telefone</span>
                              <span class="info-value">{{ student.phone || "—" }}</span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">Nascimento</span>
                              <span class="info-value">{{ formatStudentDate(student.birthdate) }}</span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">Professor</span>
                              <span class="info-value">
                                <RouterLink
                                  v-if="currentTeacher && canViewTeachers"
                                  :to="`/teachers/${currentTeacher.id}`"
                                  class="text-primary"
                                >
                                  {{ currentTeacher.name }}
                                </RouterLink>
                                <span v-else>{{ currentTeacher?.name || "—" }}</span>
                              </span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">Início</span>
                              <span class="info-value">{{ formatStudentDate(student.start_date) }}</span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">Término</span>
                              <span class="info-value">{{ formatStudentDate(student.end_date) }}</span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">Plano</span>
                              <span class="info-value">{{ formatStudentPlanVariantLabel(currentPlanVariant) }}</span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">Atualizado em</span>
                              <span class="info-value">{{ formatStudentDateTime(student.updated_at) }}</span>
                            </div>
                            <div class="info-item info-item--wide">
                              <span class="info-label">Endereço</span>
                              <span class="info-value">{{ student.address || "—" }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="pt-3 mt-3 border-top">
                          <h4 class="text-primary mb-3">Plano contratado</h4>
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
                      </div>

                      <div
                        v-for="moduleTab in STUDENT_MODULE_TABS"
                        :key="moduleTab.id"
                        v-show="activeTab === moduleTab.id"
                        class="tab-pane fade active show"
                        role="tabpanel"
                      >
                        <StudentPaymentsPanel
                          v-if="moduleTab.id === 'payments'"
                          :student-id="student.id"
                        />
                        <StudentDocumentsPanel
                          v-else-if="moduleTab.id === 'documents'"
                          :student-id="student.id"
                        />
                        <StudentLessonsPanel
                          v-else-if="moduleTab.id === 'classes'"
                          :student-id="student.id"
                        />
                        <ProfileModulePlaceholder
                          v-else
                          :title="moduleTab.title"
                          :description="moduleTab.description"
                          :icon="moduleTab.icon"
                          :examples="moduleTab.examples"
                        />
                      </div>

                      <!-- Turmas Tab -->
                      <div
                        v-show="activeTab === 'turmas'"
                        class="tab-pane fade active show"
                        role="tabpanel"
                      >
                        <div class="pt-4">
                          <div class="d-flex justify-content-between align-items-center mb-4">
                            <h4 class="text-primary mb-0">Turmas do aluno</h4>
                            <button
                              v-if="canUpdateGroupClasses"
                              type="button"
                              class="btn btn-sm btn-success"
                              @click="openEnrollModal"
                            >
                              <i class="fa fa-plus me-1"></i> Matricular em Turma
                            </button>
                          </div>
                          <p class="text-muted small mb-4">
                            Turmas em que este aluno está matriculado no momento.
                          </p>
                          <div v-if="student.relationships?.group_classes?.length" class="table-responsive">
                            <table class="table table-responsive-md">
                              <thead>
                                <tr>
                                  <th>Turma</th>
                                  <th>Status</th>
                                  <th>Data de Ingresso</th>
                                  <th>Ações</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="groupClass in student.relationships.group_classes" :key="groupClass.id">
                                  <td>
                                    <RouterLink v-if="canViewGroupClasses" :to="`/group-classes/${groupClass.id}`" class="text-primary">
                                      <strong>{{ groupClass.name }}</strong>
                                    </RouterLink>
                                    <strong v-else>{{ groupClass.name }}</strong>
                                  </td>
                                  <td>
                                    <span class="badge" :class="groupClass.pivot?.status === 'enrolled' ? 'badge-success' : 'badge-secondary'">
                                      {{ groupClass.pivot?.status === 'enrolled' ? 'Inscrito' : (groupClass.pivot?.status || 'Inscrito') }}
                                    </span>
                                  </td>
                                  <td>{{ groupClass.pivot?.joined_at ? formatStudentDate(groupClass.pivot.joined_at) : '—' }}</td>
                                  <td>
                                    <RouterLink v-if="canViewGroupClasses" :to="`/group-classes/${groupClass.id}`" class="btn btn-xs sharp btn-primary">
                                      <i class="fa fa-eye"></i>
                                    </RouterLink>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div v-else class="text-muted text-center py-4">
                            <i class="fa fa-info-circle me-1"></i>
                            O aluno não está matriculado em nenhuma turma.
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

    <!-- Enroll in Group Class Modal -->
    <Teleport to="body">
      <div
        v-if="showEnrollModal"
        class="modal fade show"
        style="display: block; z-index: 1055;"
        tabindex="-1"
        aria-modal="true"
        role="dialog"
        @click.self="closeEnrollModal"
      >
        <div class="modal-dialog modal-dialog-centered" style="z-index: 1056;">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Matricular em Turma</h5>
              <button
                type="button"
                class="btn-close"
                aria-label="Fechar"
                @click="closeEnrollModal"
              ></button>
            </div>

            <div class="modal-body">
              <p class="text-muted mb-3">
                Selecione a turma em que deseja matricular
                <strong>{{ student?.name }}</strong>.
              </p>

              <div v-if="enrollSuccess" class="alert alert-success py-2">
                <i class="fa fa-check-circle me-1"></i> {{ enrollSuccess }}
              </div>
              <div v-if="enrollError" class="alert alert-danger py-2">
                <i class="fa fa-exclamation-circle me-1"></i> {{ enrollError }}
              </div>

              <div v-if="loadingClassOptions" class="text-center py-3">
                Carregando turmas...
              </div>

              <div v-else>
                <SingleSelect
                  id="enroll-group-class-select"
                  v-model="selectedGroupClassId"
                  label="Turma"
                  :options="groupClassOptions"
                  placeholder="Selecione uma turma..."
                />
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-outline-secondary"
                :disabled="enrolling"
                @click="closeEnrollModal"
              >
                Cancelar
              </button>
              <button
                type="button"
                class="btn btn-success"
                :disabled="!selectedGroupClassId || enrolling || !!enrollSuccess"
                @click="submitEnrollment"
              >
                <span v-if="enrolling">Matriculando...</span>
                <span v-else>Confirmar Matrícula</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Backdrop -->
      <div
        v-if="showEnrollModal"
        class="modal-backdrop fade show"
        style="z-index: 1054;"
      ></div>
    </Teleport>
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem 2rem;
}

.info-item {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  column-gap: 0.65rem;
  align-items: start;
  min-width: 0;
}

.info-item--wide {
  grid-column: 1 / -1;
}

.info-label {
  color: #6e6e6e;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.4;
}

.info-value {
  color: #111827;
  font-size: 0.9375rem;
  line-height: 1.4;
  min-width: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 767.98px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
