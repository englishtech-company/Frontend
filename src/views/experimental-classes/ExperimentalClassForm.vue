<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import {
  createExperimentalClass,
  getExperimentalClass,
  updateExperimentalClass,
} from "@/lib/experimentalClasses";
import type { ExperimentalClassPayload } from "@/lib/experimentalClasses";
import { listLeads } from "@/lib/leads";
import { listUsers } from "@/lib/users";
import type { Lead, User } from "@/lib/types";

const route = useRoute();
const router = useRouter();

const {
  canCreateExperimentalClasses,
  canUpdateExperimentalClasses,
} = usePermissions();

const isEdit = computed(() => Boolean(route.params.id));
const recordId = computed(() => Number(route.params.id));
const canSave = computed(() =>
  isEdit.value
    ? canUpdateExperimentalClasses.value
    : canCreateExperimentalClasses.value
);

// Form fields
const interestedId = ref<number | "">("");
const teacherId = ref<number | "">("");
const dateClass = ref("");
const statusClass = ref("agendada");
const conversao = ref(false);
const selfDeclaredLevel = ref("");
const evaluationListening = ref("");
const evaluationSpeaking = ref("");
const evaluationVocabulary = ref("");
const evaluationGrammar = ref("");
const observationsFeedback = ref("");

// UI state
const loading = ref(false);
const saving = ref(false);
const error = ref("");

// Select options
const leads = ref<Lead[]>([]);
const users = ref<User[]>([]);

const STATUS_OPTIONS = [
  { value: "agendada", label: "Agendada" },
  { value: "realizada", label: "Realizada" },
  { value: "cancelada", label: "Cancelada" },
];

const EVALUATION_OPTIONS = [
  { value: "", label: "Não avaliado" },
  { value: "A1", label: "A1 – Iniciante" },
  { value: "A2", label: "A2 – Básico" },
  { value: "B1", label: "B1 – Intermediário" },
  { value: "B2", label: "B2 – Intermediário avançado" },
  { value: "C1", label: "C1 – Avançado" },
  { value: "C2", label: "C2 – Fluente" },
];

async function loadSelectOptions() {
  try {
    const [leadsPage, usersPage] = await Promise.all([
      listLeads({ limit: 100 }),
      listUsers({ limit: 100 }),
    ]);
    leads.value = leadsPage.data;
    users.value = usersPage.data;
  } catch {
    // Non-critical; selects will simply be empty
  }
}

async function loadForm() {
  if (!isEdit.value) return;

  loading.value = true;
  error.value = "";

  try {
    const item = await getExperimentalClass(recordId.value);

    interestedId.value = item.interested_id;
    teacherId.value = item.teacher_id ?? "";
    // date_class comes as ISO from backend; slice to YYYY-MM-DD for <input type="date">
    dateClass.value = item.date_class ? item.date_class.slice(0, 10) : "";
    statusClass.value = item.status_class;
    conversao.value = item.conversao;
    selfDeclaredLevel.value = item.self_declared_level ?? "";
    evaluationListening.value = item.evaluation_listening ?? "";
    evaluationSpeaking.value = item.evaluation_speaking ?? "";
    evaluationVocabulary.value = item.evaluation_vocabulary ?? "";
    evaluationGrammar.value = item.evaluation_grammar ?? "";
    observationsFeedback.value = item.observations_feedback ?? "";
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao carregar os dados da aula experimental";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!canSave.value) {
    error.value = "Você não tem permissão para salvar aulas experimentais.";
    return;
  }

  if (!interestedId.value) {
    error.value = "Selecione o interessado.";
    return;
  }

  if (!dateClass.value) {
    error.value = "Informe a data da aula.";
    return;
  }

  saving.value = true;
  error.value = "";

  const payload: ExperimentalClassPayload = {
    interested_id: Number(interestedId.value),
    teacher_id: teacherId.value !== "" ? Number(teacherId.value) : null,
    date_class: dateClass.value,
    status_class: statusClass.value,
    conversao: conversao.value,
    self_declared_level: selfDeclaredLevel.value.trim() || null,
    evaluation_listening: evaluationListening.value || null,
    evaluation_speaking: evaluationSpeaking.value || null,
    evaluation_vocabulary: evaluationVocabulary.value || null,
    evaluation_grammar: evaluationGrammar.value || null,
    observations_feedback: observationsFeedback.value.trim() || null,
  };

  try {
    if (isEdit.value) {
      await updateExperimentalClass(recordId.value, payload);
    } else {
      await createExperimentalClass(payload);
    }

    await router.push("/experimental-classes");
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao salvar a aula experimental";
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await loadSelectOptions();
  await loadForm();
});
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>
            {{ isEdit ? "Editar aula experimental" : "Nova aula experimental" }}
          </h4>
          <p class="mb-0">Preencha os dados da aula e avaliações do interessado</p>
        </div>
      </div>

      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <RouterLink to="/experimental-classes" class="btn btn-outline-primary">
          Voltar
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div class="row">
      <div class="col-xl-12 col-xxl-12 col-sm-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Dados da aula experimental</h5>
          </div>

          <div class="card-body">
            <div v-if="loading" class="text-center py-4">Carregando...</div>

            <form v-else @submit.prevent="submit">
              <!-- Row 1: Interessado, Professor -->
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="exp-interested">
                      Interessado *
                    </label>
                    <select
                      id="exp-interested"
                      v-model="interestedId"
                      class="form-select"
                      required
                    >
                      <option value="">Selecione um interessado</option>
                      <option
                        v-for="lead in leads"
                        :key="lead.id"
                        :value="lead.id"
                      >
                        {{ lead.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="exp-teacher">Professor</label>
                    <select
                      id="exp-teacher"
                      v-model="teacherId"
                      class="form-select"
                    >
                      <option value="">Sem professor atribuído</option>
                      <option
                        v-for="user in users"
                        :key="user.id"
                        :value="user.id"
                      >
                        {{ user.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Row 2: Data, Status, Conversão -->
              <div class="row">
                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="form-label" for="exp-date">
                      Data da aula *
                    </label>
                    <input
                      id="exp-date"
                      v-model="dateClass"
                      type="date"
                      class="form-control"
                      required
                    />
                  </div>
                </div>

                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="form-label" for="exp-status">
                      Status *
                    </label>
                    <select
                      id="exp-status"
                      v-model="statusClass"
                      class="form-select"
                      required
                    >
                      <option
                        v-for="opt in STATUS_OPTIONS"
                        :key="opt.value"
                        :value="opt.value"
                      >
                        {{ opt.label }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="form-label" for="exp-conversao">Conversão</label>
                    <div class="form-check mt-2">
                      <input
                        id="exp-conversao"
                        v-model="conversao"
                        type="checkbox"
                        class="form-check-input"
                      />
                      <label class="form-check-label" for="exp-conversao">
                        Interessado convertido em aluno
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Row 3: Nível autodeclarado -->
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="exp-self-level">
                      Nível autodeclarado
                    </label>
                    <input
                      id="exp-self-level"
                      v-model.trim="selfDeclaredLevel"
                      type="text"
                      class="form-control"
                      maxlength="255"
                      placeholder="Ex.: Iniciante, A2 ou B1"
                    />
                  </div>
                </div>
              </div>

              <!-- Evaluations section -->
              <h6 class="mt-3 mb-3 text-muted">Avaliações do professor</h6>

              <div class="row">
                <div class="col-sm-3">
                  <div class="form-group">
                    <label class="form-label" for="exp-listening">Listening</label>
                    <select
                      id="exp-listening"
                      v-model="evaluationListening"
                      class="form-select"
                    >
                      <option
                        v-for="opt in EVALUATION_OPTIONS"
                        :key="opt.value"
                        :value="opt.value"
                      >
                        {{ opt.label }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="col-sm-3">
                  <div class="form-group">
                    <label class="form-label" for="exp-speaking">Speaking</label>
                    <select
                      id="exp-speaking"
                      v-model="evaluationSpeaking"
                      class="form-select"
                    >
                      <option
                        v-for="opt in EVALUATION_OPTIONS"
                        :key="opt.value"
                        :value="opt.value"
                      >
                        {{ opt.label }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="col-sm-3">
                  <div class="form-group">
                    <label class="form-label" for="exp-vocabulary">Vocabulary</label>
                    <select
                      id="exp-vocabulary"
                      v-model="evaluationVocabulary"
                      class="form-select"
                    >
                      <option
                        v-for="opt in EVALUATION_OPTIONS"
                        :key="opt.value"
                        :value="opt.value"
                      >
                        {{ opt.label }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="col-sm-3">
                  <div class="form-group">
                    <label class="form-label" for="exp-grammar">Grammar</label>
                    <select
                      id="exp-grammar"
                      v-model="evaluationGrammar"
                      class="form-select"
                    >
                      <option
                        v-for="opt in EVALUATION_OPTIONS"
                        :key="opt.value"
                        :value="opt.value"
                      >
                        {{ opt.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Observations -->
              <div class="row">
                <div class="col-12">
                  <div class="form-group">
                    <label class="form-label" for="exp-feedback">
                      Observações / Feedback
                    </label>
                    <textarea
                      id="exp-feedback"
                      v-model.trim="observationsFeedback"
                      class="form-control"
                      rows="4"
                      placeholder="Descreva observações gerais ou feedback da aula"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="row">
                <div class="col-12">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="saving || !canSave"
                  >
                    {{ saving ? "Salvando..." : "Salvar" }}
                  </button>

                  <RouterLink
                    to="/experimental-classes"
                    class="btn btn-light ms-2"
                  >
                    Cancelar
                  </RouterLink>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
