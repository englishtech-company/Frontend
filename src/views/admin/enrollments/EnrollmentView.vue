<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { notify } from "@/lib/actionNotification";
import { getEnrollment } from "@/lib/enrollments";
import {
  ENROLLMENT_QUESTION_TYPE_LABELS,
  ENROLLMENT_STATUS_CLASSES,
  ENROLLMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  canCopyEnrollmentLink,
  formatDiscountedPrice,
  formatEnrollmentAnswer,
  formatEnrollmentDate,
  formatEnrollmentDateTime,
  formatEnrollmentNumber,
  formatEnrollmentPlanLabel,
  getEnrollmentAnswer,
  getEnrollmentFormQuestions,
  getEnrollmentPublicUrl,
  getEnrollmentStudent,
  hasEnrollmentAnswers,
} from "@/lib/enrollments/format";
import { formatCpf } from "@/lib/students/format";
import type { Enrollment } from "@/lib/types";

const route = useRoute();
const { canUpdateEnrollments, canViewStudents } = usePermissions();

const enrollmentId = computed(() => Number(route.params.id));
const enrollment = ref<Enrollment | null>(null);
const loading = ref(true);
const error = ref("");
const copiedLink = ref(false);
const activeTab = ref<"overview" | "questions">("overview");

const statusBadgeClass = computed(
  () => ENROLLMENT_STATUS_CLASSES[enrollment.value?.status ?? "pending"]
);

const statusLabel = computed(
  () => ENROLLMENT_STATUS_LABELS[enrollment.value?.status ?? "pending"]
);

const student = computed(() =>
  enrollment.value ? getEnrollmentStudent(enrollment.value) : null
);

const formQuestions = computed(() =>
  enrollment.value ? getEnrollmentFormQuestions(enrollment.value) : []
);

const planVariant = computed(
  () => enrollment.value?.relationships?.plan_variant ?? enrollment.value?.plan_variant ?? null
);

const monthlyPriceLabel = computed(() => {
  if (!planVariant.value) return "—";

  return formatDiscountedPrice(
    planVariant.value.monthly_price,
    enrollment.value?.discount_percent
  );
});

async function loadEnrollment() {
  loading.value = true;
  error.value = "";

  try {
    enrollment.value = await getEnrollment(enrollmentId.value);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar matrícula";
  } finally {
    loading.value = false;
  }
}

async function copyLink() {
  if (!enrollment.value) return;

  const url = getEnrollmentPublicUrl(enrollment.value);

  if (!url) {
    error.value = "Link público indisponível.";
    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    notify.success("Link copiado!");
    copiedLink.value = true;
    window.setTimeout(() => {
      copiedLink.value = false;
    }, 2000);
  } catch {
    error.value = "Não foi possível copiar o link.";
  }
}

onMounted(loadEnrollment);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Detalhes da matrícula</h4>
          <p class="mb-0">Plano, aluno e respostas do formulário</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <RouterLink to="/enrollments">Matrículas</RouterLink>
          </li>
          <li class="breadcrumb-item active">
            <span>{{ enrollment ? formatEnrollmentNumber(enrollment.id) : "Detalhes" }}</span>
          </li>
        </ol>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="loading" class="text-center py-5">Carregando...</div>

    <div v-else-if="enrollment" class="row">
      <div class="col-xl-3 col-xxl-4 col-lg-4">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="text-center p-3 overlay-box">
                <div class="profile-photo d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white mb-2" style="width: 100px; height: 100px;">
                  <i class="fa fa-file-signature fa-2x"></i>
                </div>
                <h3 class="mt-3 mb-1 text-white">{{ formatEnrollmentNumber(enrollment.id) }}</h3>
                <span class="badge" :class="statusBadgeClass">{{ statusLabel }}</span>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">Plano</span>
                  <strong class="text-muted text-end ms-2">{{ formatEnrollmentPlanLabel(enrollment) }}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">Pagamento</span>
                  <strong class="text-muted">{{ PAYMENT_METHOD_LABELS[enrollment.payment_method] }}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">Valor mensal</span>
                  <strong class="text-muted">{{ monthlyPriceLabel }}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">Criada em</span>
                  <strong class="text-muted">{{ formatEnrollmentDate(enrollment.created_at) }}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">Preenchida em</span>
                  <strong class="text-muted">{{ formatEnrollmentDateTime(enrollment.submitted_at) }}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">Confirmada em</span>
                  <strong class="text-muted">{{ formatEnrollmentDateTime(enrollment.confirmed_at) }}</strong>
                </li>
              </ul>
              <div class="card-footer text-center border-0 mt-0">
                <div class="profile-actions">
                  <RouterLink
                    to="/enrollments"
                    class="btn btn-warning"
                    data-tooltip="Voltar"
                    aria-label="Voltar"
                  >
                    <i class="fa fa-arrow-left"></i>
                  </RouterLink>
                  <RouterLink
                    v-if="canUpdateEnrollments"
                    :to="`/enrollments/${enrollment.id}/edit`"
                    class="btn btn-primary"
                    data-tooltip="Editar"
                    aria-label="Editar"
                  >
                    <i class="fa fa-pencil"></i>
                  </RouterLink>
                  <button
                    v-if="canCopyEnrollmentLink(enrollment)"
                    type="button"
                    class="btn btn-success"
                    :data-tooltip="copiedLink ? 'Link copiado!' : 'Copiar link público'"
                    :aria-label="copiedLink ? 'Link copiado!' : 'Copiar link público'"
                    @click="copyLink"
                  >
                    <i class="fa" :class="copiedLink ? 'fa-check' : 'fa-link'"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="student" class="col-lg-12">
            <div class="card overflow-hidden">
              <div class="card-header">
                <h2 class="card-title">Aluno</h2>
              </div>
              <div class="card-body pb-0">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>Nome</strong>
                    <span class="mb-0 text-end">
                      <RouterLink
                        v-if="canViewStudents"
                        :to="`/students/${student.id}`"
                        class="text-primary"
                      >
                        {{ student.name }}
                      </RouterLink>
                      <span v-else>{{ student.name }}</span>
                    </span>
                  </li>
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
                </ul>
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
                          :class="{ active: activeTab === 'questions' }"
                          @click="activeTab = 'questions'"
                        >
                          Perguntas e respostas
                          <span v-if="formQuestions.length" class="badge badge-light ms-1">
                            {{ formQuestions.length }}
                          </span>
                        </button>
                      </li>
                    </ul>

                    <div class="tab-content">
                      <div
                        v-show="activeTab === 'overview'"
                        class="tab-pane fade active show pt-4"
                      >
                        <div class="row">
                          <div class="col-md-6 mb-4">
                            <h5 class="text-primary mb-3">Informações da matrícula</h5>
                            <ul class="list-group list-group-flush">
                              <li class="list-group-item d-flex justify-content-between px-0">
                                <span>Status</span>
                                <span class="badge" :class="statusBadgeClass">{{ statusLabel }}</span>
                              </li>
                              <li class="list-group-item d-flex justify-content-between px-0">
                                <span>Forma de pagamento</span>
                                <strong>{{ PAYMENT_METHOD_LABELS[enrollment.payment_method] }}</strong>
                              </li>
                              <li class="list-group-item d-flex justify-content-between px-0">
                                <span>Desconto</span>
                                <strong>
                                  {{
                                    enrollment.discount_percent
                                      ? `${enrollment.discount_percent}%`
                                      : "—"
                                  }}
                                </strong>
                              </li>
                              <li class="list-group-item d-flex justify-content-between px-0">
                                <span>Valor com desconto</span>
                                <strong>{{ monthlyPriceLabel }}</strong>
                              </li>
                            </ul>
                          </div>

                          <div class="col-md-6 mb-4">
                            <h5 class="text-primary mb-3">Linha do tempo</h5>
                            <ul class="list-group list-group-flush">
                              <li class="list-group-item d-flex justify-content-between px-0">
                                <span>Criação</span>
                                <strong>{{ formatEnrollmentDateTime(enrollment.created_at) }}</strong>
                              </li>
                              <li class="list-group-item d-flex justify-content-between px-0">
                                <span>Preenchimento</span>
                                <strong>{{ formatEnrollmentDateTime(enrollment.submitted_at) }}</strong>
                              </li>
                              <li class="list-group-item d-flex justify-content-between px-0">
                                <span>Confirmação</span>
                                <strong>{{ formatEnrollmentDateTime(enrollment.confirmed_at) }}</strong>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div v-if="!student" class="alert alert-light border mb-0">
                          O aluno ainda não preencheu o formulário público desta matrícula.
                        </div>
                      </div>

                      <div
                        v-show="activeTab === 'questions'"
                        class="tab-pane fade active show pt-4"
                      >
                        <div v-if="formQuestions.length === 0" class="text-center text-muted py-5">
                          Nenhuma pergunta vinculada a esta matrícula.
                        </div>

                        <div v-else-if="!hasEnrollmentAnswers(enrollment)" class="alert alert-light border">
                          O formulário ainda não foi preenchido. As perguntas abaixo serão respondidas quando o aluno concluir a matrícula.
                        </div>

                        <div class="row">
                          <div
                            v-for="(question, index) in formQuestions"
                            :key="question.id"
                            class="col-12 mb-3"
                          >
                            <div class="card border">
                              <div class="card-body">
                                <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                                  <div>
                                    <span class="badge badge-light text-dark me-2">
                                      {{ index + 1 }}
                                    </span>
                                    <strong>{{ question.label }}</strong>
                                    <span v-if="question.required" class="text-danger ms-1">*</span>
                                  </div>
                                  <span class="badge badge-secondary">
                                    {{ ENROLLMENT_QUESTION_TYPE_LABELS[question.type] ?? question.type }}
                                  </span>
                                </div>

                                <p v-if="question.help_text" class="text-muted small mb-3">
                                  {{ question.help_text }}
                                </p>

                                <div class="bg-light rounded p-3">
                                  <span class="text-muted small d-block mb-1">Resposta</span>
                                  <p class="mb-0 text-break">
                                    {{
                                      formatEnrollmentAnswer(
                                        getEnrollmentAnswer(enrollment, question.id),
                                        question.type
                                      )
                                    }}
                                  </p>
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
