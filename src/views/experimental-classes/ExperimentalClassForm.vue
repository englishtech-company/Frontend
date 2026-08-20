<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import {
  createExperimentalClass,
  getExperimentalClass,
  getExperimentalClassPlucks,
  updateExperimentalClass,
} from "@/lib/experimentalClasses";
import type { ExperimentalClassPayload } from "@/lib/experimentalClasses";

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
const interestedId = ref<string | null>(null);
const teacherId = ref<string | null>(null);
const dateClass = ref("");
const statusClass = ref<string | null>("agendada");
const conversao = ref(false);
const selfDeclaredLevel = ref("");
const evaluationListening = ref<string | null>(null);
const evaluationSpeaking = ref<string | null>(null);
const evaluationVocabulary = ref<string | null>(null);
const evaluationGrammar = ref<string | null>(null);
const observationsFeedback = ref("");

// UI state
const loading = ref(false);
const saving = ref(false);
const error = ref("");

const leadOptions = ref<SelectOption[]>([]);
const teacherOptions = ref<SelectOption[]>([]);

const statusOptions: SelectOption[] = [
  { value: "agendada", label: "Agendada" },
  { value: "realizada", label: "Realizada" },
  { value: "cancelada", label: "Cancelada" },
];

const evaluationOptions: SelectOption[] = [
  { value: "A1", label: "A1 – Iniciante" },
  { value: "A2", label: "A2 – Básico" },
  { value: "B1", label: "B1 – Intermediário" },
  { value: "B2", label: "B2 – Intermediário avançado" },
  { value: "C1", label: "C1 – Avançado" },
  { value: "C2", label: "C2 – Fluente" },
];

async function loadSelectOptions() {
  try {
    const plucks = await getExperimentalClassPlucks();
    leadOptions.value = Object.entries(plucks.interested).map(([value, label]) => ({
      value,
      label,
    }));
    teacherOptions.value = Object.entries(plucks.teachers).map(([value, label]) => ({
      value,
      label,
    }));
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao carregar interessados e professores";
  }
}

async function loadForm() {
  if (!isEdit.value) return;

  loading.value = true;
  error.value = "";

  try {
    const item = await getExperimentalClass(recordId.value);

    interestedId.value = String(item.interested_id);
    teacherId.value = item.teacher_id != null ? String(item.teacher_id) : null;
    // date_class comes as ISO from backend; slice to YYYY-MM-DD for <input type="date">
    dateClass.value = item.date_class ? item.date_class.slice(0, 10) : "";
    statusClass.value = item.status_class;
    conversao.value = item.conversao;
    selfDeclaredLevel.value = item.self_declared_level ?? "";
    evaluationListening.value = item.evaluation_listening ?? null;
    evaluationSpeaking.value = item.evaluation_speaking ?? null;
    evaluationVocabulary.value = item.evaluation_vocabulary ?? null;
    evaluationGrammar.value = item.evaluation_grammar ?? null;
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

  if (!statusClass.value) {
    error.value = "Selecione o status.";
    return;
  }

  saving.value = true;
  error.value = "";

  const payload: ExperimentalClassPayload = {
    interested_id: Number(interestedId.value),
    teacher_id: teacherId.value ? Number(teacherId.value) : null,
    date_class: dateClass.value,
    status_class: statusClass.value ?? "agendada",
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
                    <SingleSelect
                      id="exp-interested"
                      v-model="interestedId"
                      label="Interessado"
                      :options="leadOptions"
                      placeholder="Selecione um interessado"
                      required
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <SingleSelect
                      id="exp-teacher"
                      v-model="teacherId"
                      label="Professor"
                      :options="teacherOptions"
                      placeholder="Sem professor atribuído"
                    />
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
                    <SingleSelect
                      id="exp-status"
                      v-model="statusClass"
                      label="Status"
                      :options="statusOptions"
                      placeholder="Selecione o status"
                      :searchable="false"
                      required
                    />
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
                    <SingleSelect
                      id="exp-listening"
                      v-model="evaluationListening"
                      label="Listening"
                      :options="evaluationOptions"
                      placeholder="Não avaliado"
                      :searchable="false"
                    />
                  </div>
                </div>

                <div class="col-sm-3">
                  <div class="form-group">
                    <SingleSelect
                      id="exp-speaking"
                      v-model="evaluationSpeaking"
                      label="Speaking"
                      :options="evaluationOptions"
                      placeholder="Não avaliado"
                      :searchable="false"
                    />
                  </div>
                </div>

                <div class="col-sm-3">
                  <div class="form-group">
                    <SingleSelect
                      id="exp-vocabulary"
                      v-model="evaluationVocabulary"
                      label="Vocabulary"
                      :options="evaluationOptions"
                      placeholder="Não avaliado"
                      :searchable="false"
                    />
                  </div>
                </div>

                <div class="col-sm-3">
                  <div class="form-group">
                    <SingleSelect
                      id="exp-grammar"
                      v-model="evaluationGrammar"
                      label="Grammar"
                      :options="evaluationOptions"
                      placeholder="Não avaliado"
                      :searchable="false"
                    />
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
