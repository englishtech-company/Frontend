<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { getLead } from "@/lib/leads";
import {
  ENROLLMENT_QUESTION_TYPE_LABELS,
} from "@/lib/enrollments/format";
import {
  formatLeadAnswer,
  formatLeadDate,
  formatLeadDateTime,
  formatLeadLinkTag,
  formatLeadNumber,
  formatLeadPhone,
  formatLeadRegistrationSource,
  getLeadAnswer,
  getLeadFormQuestions,
  hasLeadAnswers,
} from "@/lib/leads/format";
import type { Lead } from "@/lib/types";

const route = useRoute();
const { canUpdateLeads } = usePermissions();

const leadId = computed(() => Number(route.params.id));
const lead = ref<Lead | null>(null);
const loading = ref(true);
const error = ref("");
const activeTab = ref<"overview" | "questions">("overview");

const registrationBadge = computed(() =>
  lead.value
    ? formatLeadRegistrationSource(lead.value.registration_source)
    : formatLeadRegistrationSource("manual")
);

const formQuestions = computed(() =>
  lead.value ? getLeadFormQuestions(lead.value) : []
);

const enrollmentsCount = computed(
  () => lead.value?.relationships?.enrollments?.length ?? 0
);

const studentsCount = computed(
  () => lead.value?.relationships?.students?.length ?? 0
);

const experimentalClassesCount = computed(
  () => lead.value?.relationships?.experimental_classes?.length ?? 0
);

async function loadLead() {
  loading.value = true;
  error.value = "";

  try {
    lead.value = await getLead(leadId.value);
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar interessado";
  } finally {
    loading.value = false;
  }
}

onMounted(loadLead);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Detalhes do interessado</h4>
          <p class="mb-0">Cadastro, origem e respostas do formulário</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <RouterLink to="/leads">Interessados</RouterLink>
          </li>
          <li class="breadcrumb-item active">
            <span>{{ lead ? lead.name : "Detalhes" }}</span>
          </li>
        </ol>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="loading" class="text-center py-5">Carregando...</div>

    <div v-else-if="lead" class="row">
      <div class="col-xl-3 col-xxl-4 col-lg-4">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="text-center p-3 overlay-box">
                <div
                  class="profile-photo d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white mb-2"
                  style="width: 100px; height: 100px;"
                >
                  <i class="fa fa-user fa-2x"></i>
                </div>
                <h3 class="mt-3 mb-1 text-white">{{ lead.name }}</h3>
                <span class="badge me-1" :class="registrationBadge.class">
                  {{ registrationBadge.label }}
                </span>
                <span
                  v-if="lead.link_tag"
                  class="badge badge-light text-dark"
                >
                  {{ formatLeadLinkTag(lead.link_tag) }}
                </span>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">ID</span>
                  <strong class="text-muted">{{ formatLeadNumber(lead.id) }}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">WhatsApp</span>
                  <strong class="text-muted text-end ms-2">
                    {{ formatLeadPhone(lead.whatsapp_phone) }}
                  </strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">E-mail</span>
                  <strong class="text-muted text-end ms-2 text-break">
                    {{ lead.email || "—" }}
                  </strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">Nascimento</span>
                  <strong class="text-muted">
                    {{ formatLeadDate(lead.birthdate) }}
                  </strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span class="mb-0">Cadastro em</span>
                  <strong class="text-muted">
                    {{ formatLeadDateTime(lead.created_at) }}
                  </strong>
                </li>
                <li
                  v-if="lead.converted_at"
                  class="list-group-item d-flex justify-content-between"
                >
                  <span class="mb-0">Convertido em</span>
                  <strong class="text-muted">
                    {{ formatLeadDateTime(lead.converted_at) }}
                  </strong>
                </li>
              </ul>
              <div class="card-footer text-center border-0 mt-0">
                <div class="profile-actions">
                  <RouterLink
                    to="/leads"
                    class="btn btn-warning"
                    data-tooltip="Voltar"
                    aria-label="Voltar"
                  >
                    <i class="fa fa-arrow-left"></i>
                  </RouterLink>
                  <RouterLink
                    v-if="canUpdateLeads"
                    :to="`/leads/${lead.id}/edit`"
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
                <h2 class="card-title">Vínculos</h2>
              </div>
              <div class="card-body pb-0">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>Matrículas</strong>
                    <span class="mb-0">{{ enrollmentsCount }}</span>
                  </li>
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>Alunos</strong>
                    <span class="mb-0">{{ studentsCount }}</span>
                  </li>
                  <li class="list-group-item d-flex px-0 justify-content-between">
                    <strong>Aulas experimentais</strong>
                    <span class="mb-0">{{ experimentalClassesCount }}</span>
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
                    <ul class="nav nav-tabs">
                      <li class="nav-item">
                        <button
                          type="button"
                          class="nav-link"
                          :class="{ active: activeTab === 'overview' }"
                          @click="activeTab = 'overview'"
                        >
                          Resumo
                        </button>
                      </li>
                      <li class="nav-item">
                        <button
                          type="button"
                          class="nav-link"
                          :class="{ active: activeTab === 'questions' }"
                          @click="activeTab = 'questions'"
                        >
                          Perguntas e respostas
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
                            <h5 class="text-primary mb-3">Perfil</h5>
                            <dl class="row mb-0">
                              <dt class="col-sm-4">Origem informada</dt>
                              <dd class="col-sm-8">{{ lead.source || "—" }}</dd>
                              <dt class="col-sm-4">Nível declarado</dt>
                              <dd class="col-sm-8">
                                {{ lead.self_declared_level || "—" }}
                              </dd>
                              <dt class="col-sm-4">Tag do link</dt>
                              <dd class="col-sm-8">
                                {{ formatLeadLinkTag(lead.link_tag) }}
                              </dd>
                            </dl>
                          </div>
                          <div class="col-md-6 mb-4">
                            <h5 class="text-primary mb-3">Objetivo</h5>
                            <p class="mb-0 text-break">
                              {{ lead.objective?.trim() || "—" }}
                            </p>
                          </div>
                        </div>

                        <div
                          v-if="lead.raw_payload && Object.keys(lead.raw_payload).length"
                          class="mt-2"
                        >
                          <h5 class="text-primary mb-3">Payload bruto</h5>
                          <pre class="bg-light rounded p-3 small mb-0 text-break">{{ JSON.stringify(lead.raw_payload, null, 2) }}</pre>
                        </div>
                      </div>

                      <div
                        v-show="activeTab === 'questions'"
                        class="tab-pane fade active show pt-4"
                      >
                        <div
                          v-if="formQuestions.length === 0"
                          class="text-center text-muted py-5"
                        >
                          Nenhuma pergunta ativa no formulário de interessado.
                        </div>

                        <div
                          v-else-if="!hasLeadAnswers(lead)"
                          class="alert alert-light border"
                        >
                          O interessado ainda não respondeu às perguntas do formulário público.
                        </div>

                        <div class="row">
                          <div
                            v-for="(question, index) in formQuestions"
                            :key="question.id"
                            class="col-12 mb-3"
                          >
                            <div class="card border">
                              <div class="card-body">
                                <div
                                  class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2"
                                >
                                  <div>
                                    <span class="badge badge-light text-dark me-2">
                                      {{ index + 1 }}
                                    </span>
                                    <strong>{{ question.label }}</strong>
                                    <span
                                      v-if="question.required"
                                      class="text-danger ms-1"
                                    >*</span>
                                  </div>
                                  <span class="badge badge-secondary">
                                    {{
                                      ENROLLMENT_QUESTION_TYPE_LABELS[question.type] ??
                                        question.type
                                    }}
                                  </span>
                                </div>

                                <p
                                  v-if="question.help_text"
                                  class="text-muted small mb-3"
                                >
                                  {{ question.help_text }}
                                </p>

                                <div class="bg-light rounded p-3">
                                  <span class="text-muted small d-block mb-1">
                                    Resposta
                                  </span>
                                  <p class="mb-0 text-break">
                                    {{
                                      formatLeadAnswer(
                                        getLeadAnswer(lead, question.id),
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
</style>
