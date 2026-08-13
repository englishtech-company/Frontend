<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import {
  createEnrollmentQuestion,
  getEnrollmentQuestion,
  getEnrollmentQuestionPlucks,
  updateEnrollmentQuestion,
} from "@/lib/enrollment-questions";
import type { EnrollmentQuestionType } from "@/lib/types";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => Boolean(route.params.id));
const questionId = computed(() => Number(route.params.id));

const label = ref("");
const helpText = ref("");
const type = ref<EnrollmentQuestionType>("text");
const required = ref(true);
const sortOrder = ref("0");
const active = ref(true);
const options = ref<string[]>([""]);

const typeOptions = ref<SelectOption[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref("");

const isChoiceType = computed(() =>
  ["radio", "checkbox", "select"].includes(type.value)
);

watch(type, (nextType) => {
  if (["radio", "checkbox", "select"].includes(nextType) && options.value.length === 0) {
    options.value = [""];
  }
});

function addOption() {
  options.value.push("");
}

function removeOption(index: number) {
  if (options.value.length <= 1) {
    options.value = [""];
    return;
  }

  options.value.splice(index, 1);
}

async function loadForm() {
  loading.value = true;
  error.value = "";

  try {
    const plucks = await getEnrollmentQuestionPlucks();
    typeOptions.value = Object.entries(plucks.types).map(([value, itemLabel]) => ({
      value,
      label: itemLabel,
    }));

    if (!isEdit.value) return;

    const question = await getEnrollmentQuestion(questionId.value);
    label.value = question.label;
    helpText.value = question.help_text ?? "";
    type.value = question.type;
    required.value = question.required;
    sortOrder.value = String(question.sort_order ?? 0);
    active.value = question.active;
    options.value =
      question.options && question.options.length > 0 ? [...question.options] : [""];
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar pergunta";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  saving.value = true;
  error.value = "";

  const cleanedOptions = options.value.map((item) => item.trim()).filter(Boolean);

  if (isChoiceType.value && cleanedOptions.length === 0) {
    error.value = "Informe ao menos uma opção.";
    saving.value = false;
    return;
  }

  const payload = {
    label: label.value.trim(),
    help_text: helpText.value.trim() || null,
    type: type.value,
    required: required.value,
    sort_order: Number(sortOrder.value || 0),
    active: active.value,
    options: isChoiceType.value ? cleanedOptions : null,
  };

  try {
    if (isEdit.value) {
      await updateEnrollmentQuestion(questionId.value, payload);
    } else {
      await createEnrollmentQuestion(payload);
    }

    await router.push("/enrollment-questions");
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao salvar pergunta";
  } finally {
    saving.value = false;
  }
}

onMounted(loadForm);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>{{ isEdit ? "Editar pergunta" : "Nova pergunta" }}</h4>
          <p class="mb-0">Alterações afetam apenas novas matrículas</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <RouterLink to="/enrollment-questions" class="btn btn-outline-primary">
          Voltar
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">Carregando...</div>

            <form v-else @submit.prevent="submit">
              <div class="row">
                <div class="col-lg-8 mb-3">
                  <label class="form-label" for="label">Pergunta *</label>
                  <input
                    id="label"
                    v-model.trim="label"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col-lg-4 mb-3">
                  <SingleSelect
                    id="type"
                    v-model="type"
                    label="Tipo *"
                    :options="typeOptions"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label" for="helpText">Texto de ajuda</label>
                <textarea
                  id="helpText"
                  v-model.trim="helpText"
                  class="form-control"
                  rows="2"
                ></textarea>
              </div>

              <div v-if="isChoiceType" class="mb-4">
                <label class="form-label">Opções *</label>
                <div
                  v-for="(option, index) in options"
                  :key="index"
                  class="d-flex gap-2 mb-2"
                >
                  <input
                    v-model="options[index]"
                    type="text"
                    class="form-control"
                    :placeholder="`Opção ${index + 1}`"
                  />
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    @click="removeOption(index)"
                  >
                    Remover
                  </button>
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary" @click="addOption">
                  Adicionar opção
                </button>
              </div>

              <div class="row">
                <div class="col-lg-3 mb-3">
                  <label class="form-label" for="sortOrder">Ordem</label>
                  <input
                    id="sortOrder"
                    v-model="sortOrder"
                    type="number"
                    min="0"
                    class="form-control"
                  />
                </div>
                <div class="col-lg-3 mb-3 d-flex align-items-end">
                  <div class="form-check">
                    <input
                      id="required"
                      v-model="required"
                      class="form-check-input"
                      type="checkbox"
                    />
                    <label class="form-check-label" for="required">Obrigatória</label>
                  </div>
                </div>
                <div class="col-lg-3 mb-3 d-flex align-items-end">
                  <div class="form-check">
                    <input
                      id="active"
                      v-model="active"
                      class="form-check-input"
                      type="checkbox"
                    />
                    <label class="form-check-label" for="active">Ativa</label>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <RouterLink to="/enrollment-questions" class="btn btn-outline-secondary">
                  Cancelar
                </RouterLink>
                <button type="submit" class="btn btn-primary" :disabled="saving">
                  {{ saving ? "Salvando..." : "Salvar" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
