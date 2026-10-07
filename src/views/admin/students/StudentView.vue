<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import ProfileAvatar from "@/components/admin/ProfileAvatar.vue";
import ProfileTabListCard from "@/components/admin/ProfileTabListCard.vue";
import StudentContractHistoryPanel from "@/components/admin/StudentContractHistoryPanel.vue";
import StudentDocumentsPanel from "@/components/admin/StudentDocumentsPanel.vue";
import StudentLessonsPanel from "@/components/admin/StudentLessonsPanel.vue";
import StudentMakeupClassesPanel from "@/components/admin/StudentMakeupClassesPanel.vue";
import StudentPaymentsPanel from "@/components/admin/StudentPaymentsPanel.vue";
import StudentLibraryPanel from "@/components/admin/StudentLibraryPanel.vue";
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
type StudentProfileTab =
  | "overview"
  | "history"
  | "turmas"
  | (typeof STUDENT_MODULE_TABS)[number]["id"];

const activeTab = ref<StudentProfileTab>("overview");
const tabsScrollRef = ref<HTMLElement | null>(null);

function scrollActiveTabIntoView() {
  nextTick(() => {
    const container = tabsScrollRef.value;
    const activeButton = container?.querySelector<HTMLElement>(".nav-link.active");

    activeButton?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  });
}

watch(activeTab, scrollActiveTabIntoView);

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

const studentGroupClasses = computed(
  () => student.value?.relationships?.group_classes ?? []
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

function applyTabFromQuery() {
  const tab = route.query.tab;
  if (typeof tab !== "string") return;

  if (tab === "overview" || tab === "history" || tab === "turmas") {
    activeTab.value = tab;
    return;
  }

  if (STUDENT_MODULE_TABS.some((moduleTab) => moduleTab.id === tab)) {
    activeTab.value = tab as StudentProfileTab;
  }
}

watch(() => route.query.tab, applyTabFromQuery);

onMounted(() => {
  applyTabFromQuery();
  loadStudent();
});
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

    <div v-else-if="student" class="student-profile">
      <div class="row">
        <div class="col-12">
          <div class="card student-profile-header mb-3">
            <div class="student-profile-header__banner">
              <div class="student-profile-header__banner-inner">
                <div class="student-profile-header__identity">
                  <ProfileAvatar :size="92" />
                  <div class="student-profile-header__name">
                    <h3 class="mb-2">{{ student.name }}</h3>
                    <div class="student-profile-header__chips">
                      <span class="badge" :class="statusBadge.class">{{ statusBadge.label }}</span>
                      <span v-if="currentPlanVariant" class="student-profile-header__chip">
                        <i class="fa fa-tag" aria-hidden="true"></i>
                        {{ formatStudentPlanVariantLabel(currentPlanVariant) }}
                      </span>
                      <span v-if="currentTeacher" class="student-profile-header__chip">
                        <i class="fa fa-chalkboard-teacher" aria-hidden="true"></i>
                        <RouterLink
                          v-if="canViewTeachers"
                          :to="`/teachers/${currentTeacher.id}`"
                        >
                          {{ currentTeacher.name }}
                        </RouterLink>
                        <span v-else>{{ currentTeacher.name }}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div class="student-profile-header__actions">
                  <RouterLink to="/students" class="btn btn-light btn-sm">
                    <i class="fa fa-arrow-left me-1"></i>
                    Voltar
                  </RouterLink>
                  <RouterLink
                    v-if="canUpdateStudents"
                    :to="`/students/${student.id}/edit`"
                    class="btn btn-light btn-sm"
                  >
                    <i class="fa fa-pencil me-1"></i>
                    Editar
                  </RouterLink>
                  <button
                    v-if="canUpdateGroupClasses"
                    type="button"
                    class="btn btn-success btn-sm"
                    @click="openEnrollModal"
                  >
                    <i class="fa fa-graduation-cap me-1"></i>
                    Matricular
                  </button>
                </div>
              </div>
            </div>

            <div class="card-body student-profile-header__body">
              <div class="student-profile-header__sections">
                <section class="student-profile-header__section">
                  <h6 class="student-profile-header__section-title">
                    <i class="fa fa-address-card" aria-hidden="true"></i>
                    Contato
                  </h6>
                  <dl class="student-profile-header__details">
                    <div class="student-profile-header__detail">
                      <dt>E-mail</dt>
                      <dd>{{ student.email }}</dd>
                    </div>
                    <div class="student-profile-header__detail">
                      <dt>Telefone</dt>
                      <dd>{{ student.phone || "—" }}</dd>
                    </div>
                    <div class="student-profile-header__detail">
                      <dt>CPF</dt>
                      <dd>{{ formatCpf(student.cpf) }}</dd>
                    </div>
                    <div class="student-profile-header__detail student-profile-header__detail--wide">
                      <dt>Endereço</dt>
                      <dd>{{ student.address || "Endereço não informado." }}</dd>
                    </div>
                  </dl>
                </section>

                <section class="student-profile-header__section">
                  <h6 class="student-profile-header__section-title">
                    <i class="fa fa-graduation-cap" aria-hidden="true"></i>
                    Acadêmico
                  </h6>
                  <dl class="student-profile-header__details">
                    <div class="student-profile-header__detail">
                      <dt>Professor</dt>
                      <dd>
                        <RouterLink
                          v-if="currentTeacher && canViewTeachers"
                          :to="`/teachers/${currentTeacher.id}`"
                          class="text-primary"
                        >
                          {{ currentTeacher.name }}
                        </RouterLink>
                        <span v-else>{{ currentTeacher?.name || "—" }}</span>
                      </dd>
                    </div>
                    <div class="student-profile-header__detail">
                      <dt>Plano</dt>
                      <dd>{{ formatStudentPlanVariantLabel(currentPlanVariant) }}</dd>
                    </div>
                    <div class="student-profile-header__detail">
                      <dt>Nascimento</dt>
                      <dd>
                        {{ formatStudentDate(student.birthdate) }}
                        <span class="text-muted">({{ getStudentAge(student.birthdate) }})</span>
                      </dd>
                    </div>
                  </dl>
                </section>

                <section class="student-profile-header__section">
                  <h6 class="student-profile-header__section-title">
                    <i class="fa fa-calendar-alt" aria-hidden="true"></i>
                    Matrícula
                  </h6>
                  <dl class="student-profile-header__details">
                    <div class="student-profile-header__detail">
                      <dt>Início</dt>
                      <dd>{{ formatStudentDate(student.start_date) }}</dd>
                    </div>
                    <div class="student-profile-header__detail">
                      <dt>Término</dt>
                      <dd>{{ formatStudentDate(student.end_date) }}</dd>
                    </div>
                    <div class="student-profile-header__detail">
                      <dt>Cadastro</dt>
                      <dd>{{ formatStudentDate(student.created_at) }}</dd>
                    </div>
                  </dl>
                </section>
              </div>

              <div class="student-profile-header__metrics">
                <button
                  type="button"
                  class="student-profile-header__metric"
                  @click="activeTab = 'classes'"
                >
                  <span class="student-profile-header__metric-icon">
                    <i class="fa fa-book" aria-hidden="true"></i>
                  </span>
                  <span class="student-profile-header__metric-content">
                    <strong>—</strong>
                    <span>Aulas</span>
                  </span>
                </button>
                <button
                  type="button"
                  class="student-profile-header__metric"
                  @click="activeTab = 'payments'"
                >
                  <span class="student-profile-header__metric-icon">
                    <i class="fa fa-credit-card" aria-hidden="true"></i>
                  </span>
                  <span class="student-profile-header__metric-content">
                    <strong>—</strong>
                    <span>Pagamentos</span>
                  </span>
                </button>
                <div class="student-profile-header__metric student-profile-header__metric--static">
                  <span class="student-profile-header__metric-icon">
                    <i class="fa fa-clock" aria-hidden="true"></i>
                  </span>
                  <span class="student-profile-header__metric-content">
                    <strong>{{ getStudentEnrollmentDays(student) }}</strong>
                    <span>Dias matriculado</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card student-profile-tabs-card">
            <div class="card-body">
                <div class="profile-tab">
                  <div class="custom-tab-1">
                    <div
                      ref="tabsScrollRef"
                      class="student-profile-tabs-scroll"
                    >
                      <ul
                        class="nav nav-tabs student-profile-tabs"
                        role="tablist"
                      >
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
                    </div>

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
                          :student="student"
                        />
                        <StudentMakeupClassesPanel
                          v-else-if="moduleTab.id === 'makeup'"
                          :student-id="student.id"
                        />
                        <StudentLibraryPanel
                          v-else-if="moduleTab.id === 'library'"
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
                        <ProfileTabListCard
                          title="Lista de turmas"
                          :total="studentGroupClasses.length"
                          :read-only="!canViewGroupClasses"
                        >
                          <template #actions>
                            <button
                              v-if="canUpdateGroupClasses"
                              type="button"
                              class="btn btn-success btn-sm"
                              @click="openEnrollModal"
                            >
                              <i class="fa fa-plus me-1"></i>
                              Matricular em turma
                            </button>
                          </template>

                          <thead>
                            <tr>
                              <th>Turma</th>
                              <th>Status</th>
                              <th class="text-nowrap">Data de ingresso</th>
                              <th
                                v-if="canViewGroupClasses"
                                class="text-end text-nowrap"
                              >
                                Ações
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr v-if="!studentGroupClasses.length">
                              <td
                                :colspan="canViewGroupClasses ? 4 : 3"
                                class="text-center text-muted"
                              >
                                O aluno não está matriculado em nenhuma turma.
                              </td>
                            </tr>

                            <tr
                              v-for="groupClass in studentGroupClasses"
                              :key="groupClass.id"
                            >
                              <td>
                                <RouterLink
                                  v-if="canViewGroupClasses"
                                  :to="`/group-classes/${groupClass.id}`"
                                  class="text-primary"
                                >
                                  <strong>{{ groupClass.name }}</strong>
                                </RouterLink>
                                <strong v-else>{{ groupClass.name }}</strong>
                              </td>
                              <td>
                                <span
                                  class="badge"
                                  :class="
                                    groupClass.pivot?.status === 'enrolled'
                                      ? 'badge-success'
                                      : 'badge-secondary'
                                  "
                                >
                                  {{
                                    groupClass.pivot?.status === "enrolled"
                                      ? "Inscrito"
                                      : groupClass.pivot?.status || "Inscrito"
                                  }}
                                </span>
                              </td>
                              <td class="text-nowrap">
                                {{
                                  groupClass.pivot?.joined_at
                                    ? formatStudentDate(groupClass.pivot.joined_at)
                                    : "—"
                                }}
                              </td>
                              <td
                                v-if="canViewGroupClasses"
                                class="text-end text-nowrap"
                              >
                                <RouterLink
                                  :to="`/group-classes/${groupClass.id}`"
                                  class="btn btn-xs sharp btn-primary"
                                  :aria-label="`Ver turma ${groupClass.name}`"
                                >
                                  <i class="fa fa-eye"></i>
                                </RouterLink>
                              </td>
                            </tr>
                          </tbody>
                        </ProfileTabListCard>
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
                              Consulte os aceites de contratos e os vínculos de professores
                              e planos deste aluno.
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

                          <StudentContractHistoryPanel
                            v-if="activeTab === 'history'"
                            :key="student.id"
                            :student-id="student.id"
                          />

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
.student-profile-header {
  overflow: hidden;
}

.student-profile-header__banner {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--primary, #600022) 92%, #000) 0%,
    color-mix(in srgb, var(--primary, #600022) 72%, #452b90) 100%
  );
  padding: 1.35rem 1.5rem 1.1rem;
}

.student-profile-header__banner-inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.student-profile-header__identity {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  min-width: 0;
}

.student-profile-header__name h3 {
  font-size: 1.55rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.5rem;
}

.student-profile-header__chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

.student-profile-header__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.22rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.78rem;
  line-height: 1.3;
  max-width: 100%;
}

.student-profile-header__chip a {
  color: inherit;
  text-decoration: none;
}

.student-profile-header__chip a:hover {
  text-decoration: underline;
}

.student-profile-header__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.45rem;
  flex-shrink: 0;
}

.student-profile-header__body {
  padding: 1.25rem 1.5rem 1.35rem;
}

.student-profile-header__sections {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.15rem;
}

.student-profile-header__section {
  padding: 0.95rem 1rem;
  border: 1px solid var(--border, #e8ecef);
  border-radius: 0.65rem;
  background: color-mix(in srgb, var(--primary, #600022) 3%, #fff);
  min-width: 0;
}

.student-profile-header__section-title {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0 0 0.75rem;
  color: var(--primary, #600022);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.student-profile-header__details {
  display: grid;
  gap: 0.55rem;
  margin: 0;
}

.student-profile-header__detail {
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr);
  gap: 0.5rem;
  align-items: start;
}

.student-profile-header__detail--wide {
  grid-template-columns: 1fr;
  gap: 0.2rem;
}

.student-profile-header__detail dt {
  margin: 0;
  color: #6e6e6e;
  font-size: 0.78rem;
  font-weight: 600;
}

.student-profile-header__detail dd {
  margin: 0;
  color: #111827;
  font-size: 0.9rem;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.student-profile-header__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  padding-top: 0.15rem;
}

.student-profile-header__metric {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border, #e8ecef);
  border-radius: 0.65rem;
  background: #fff;
  text-align: left;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

button.student-profile-header__metric {
  cursor: pointer;
}

button.student-profile-header__metric:hover {
  border-color: color-mix(in srgb, var(--primary, #600022) 28%, var(--border, #e8ecef));
  box-shadow: 0 4px 14px rgba(17, 24, 39, 0.06);
  transform: translateY(-1px);
}

.student-profile-header__metric-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.55rem;
  background: color-mix(in srgb, var(--primary, #600022) 10%, #fff);
  color: var(--primary, #600022);
  flex-shrink: 0;
}

.student-profile-header__metric-content {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.student-profile-header__metric-content strong {
  color: var(--primary, #600022);
  font-size: 1.2rem;
  line-height: 1.2;
}

.student-profile-header__metric-content span {
  color: #6e6e6e;
  font-size: 0.8rem;
}

.student-profile-tabs-card {
  margin-bottom: 0;
}

.student-profile-tabs-card .card-body {
  padding-top: 0.75rem;
}

@media (max-width: 1199.98px) {
  .student-profile-header__sections {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767.98px) {
  .student-profile-header__banner {
    padding: 1rem;
  }

  .student-profile-header__banner-inner {
    flex-direction: column;
  }

  .student-profile-header__actions {
    width: 100%;
    justify-content: flex-start;
  }

  .student-profile-header__body {
    padding: 1rem;
  }

  .student-profile-header__detail {
    grid-template-columns: 1fr;
    gap: 0.15rem;
  }

  .student-profile-header__metrics {
    grid-template-columns: 1fr;
  }
}

.student-profile-tabs-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.student-profile-tabs-scroll::-webkit-scrollbar {
  height: 5px;
}

.student-profile-tabs-scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.18);
}

.student-profile-tabs {
  display: flex;
  flex-wrap: nowrap;
  width: max-content;
  min-width: 100%;
  margin-bottom: 0;
  border-bottom: 1px solid var(--border, #dee2e6);
}

.student-profile-tabs .nav-item {
  flex: 0 0 auto;
}

.student-profile-tabs .nav-link {
  white-space: nowrap;
}

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
