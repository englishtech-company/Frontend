<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { maskPhone } from "@/lib/br/masks";
import { publicLeadLinkCode } from "@/lib/linkTag";
import { getPublicLeadQuestions, submitPublicLead } from "@/lib/public-leads";
import type { PublicLeadQuestion } from "@/lib/public-leads";

const appName = import.meta.env.VITE_APP_NAME || "EnglishTech";
const brandLogoSrc = "/utils/logowhite.png";
const route = useRoute();
const linkCode = computed(() =>
  publicLeadLinkCode(String(route.query.t ?? route.query.tag ?? ""))
);

const questions = ref<PublicLeadQuestion[]>([]);
const answers = ref<Record<string, string | string[]>>({});
const name = ref("");
const email = ref("");
const phone = ref("");
const birthdate = ref("");
const loading = ref(true);
const saving = ref(false);
const submitted = ref(false);
const successMessage = ref("");
const error = ref("");
const formRef = ref<HTMLFormElement | null>(null);

function initializeAnswers(items: PublicLeadQuestion[]) {
  const next: Record<string, string | string[]> = {};
  for (const question of items) {
    next[String(question.id)] = question.type === "checkbox" ? [] : "";
  }
  answers.value = next;
}

function questionSelectOptions(question: PublicLeadQuestion): SelectOption[] {
  return (question.options ?? []).map((option) => ({
    value: option,
    label: option,
  }));
}

function toggleCheckbox(questionId: number, option: string, checked: boolean) {
  const key = String(questionId);
  const current = Array.isArray(answers.value[key])
    ? [...(answers.value[key] as string[])]
    : [];

  if (checked) {
    if (!current.includes(option)) current.push(option);
    answers.value[key] = current;
    return;
  }

  answers.value[key] = current.filter((item) => item !== option);
}

function isCheckboxChecked(questionId: number, option: string): boolean {
  const value = answers.value[String(questionId)];
  return Array.isArray(value) && value.includes(option);
}

function onPhoneInput(event: Event) {
  phone.value = maskPhone((event.target as HTMLInputElement).value);
}

async function loadForm() {
  loading.value = true;
  error.value = "";

  try {
    questions.value = await getPublicLeadQuestions();
    initializeAnswers(questions.value);
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Não foi possível carregar o formulário.";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!formRef.value?.reportValidity()) {
    return;
  }

  saving.value = true;
  error.value = "";

  try {
    const result = await submitPublicLead({
      name: name.value.trim(),
      whatsapp_phone: phone.value.replace(/\D/g, ""),
      email: email.value.trim() || null,
      birthdate: birthdate.value,
      answers: answers.value,
      link_code: linkCode.value || undefined,
    });

    successMessage.value =
      result.message ??
      "Cadastro enviado. Em breve entraremos em contato pelo WhatsApp.";
    submitted.value = true;
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Não foi possível enviar o cadastro.";
  } finally {
    saving.value = false;
  }
}

onMounted(loadForm);
</script>

<template>
  <div class="public-enrollment">
    <header class="public-enrollment__brand-header">
      <img
        :src="brandLogoSrc"
        :alt="appName"
        class="public-enrollment__brand-logo"
        width="220"
        height="55"
      />
    </header>

    <div class="public-enrollment__container">
      <div class="public-enrollment__intro text-center">
        <h1 class="public-enrollment__title">Aula experimental</h1>
        <p class="public-enrollment__subtitle">
          Preencha seus dados. Entraremos em contato pelo WhatsApp para combinar o horário.
        </p>
      </div>

      <div v-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div v-if="loading" class="public-enrollment__card">
        <div class="public-enrollment__card-body text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
      </div>

      <div
        v-else-if="submitted"
        class="public-enrollment__card public-enrollment__success"
      >
        <div class="public-enrollment__card-body text-center">
          <div class="public-enrollment__success-icon" aria-hidden="true">✓</div>
          <h2 class="public-enrollment__success-title">Cadastro enviado!</h2>
          <p class="mb-0">{{ successMessage }}</p>
        </div>
      </div>

      <div v-else class="public-enrollment__card">
        <div class="public-enrollment__card-body">
          <form ref="formRef" @submit.prevent="submit">
            <div class="row g-2 mb-3">
              <div class="col-md-6">
                <label class="form-label" for="lead-name">Nome completo *</label>
                <input
                  id="lead-name"
                  v-model.trim="name"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="lead-phone">WhatsApp (com DDD) *</label>
                <input
                  id="lead-phone"
                  :value="phone"
                  type="tel"
                  class="form-control"
                  required
                  @input="onPhoneInput"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="lead-email">E-mail</label>
                <input
                  id="lead-email"
                  v-model.trim="email"
                  type="email"
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="lead-birthdate">Data de nascimento *</label>
                <input
                  id="lead-birthdate"
                  v-model="birthdate"
                  type="date"
                  class="form-control"
                  required
                />
              </div>
            </div>

            <div
              v-for="question in questions"
              :key="question.id"
              class="mb-3"
            >
              <label class="form-label" :for="`lead-q-${question.id}`">
                {{ question.label }}
                <span v-if="question.required" class="text-danger">*</span>
              </label>
              <p v-if="question.help_text" class="text-muted small mb-1">
                {{ question.help_text }}
              </p>

              <input
                v-if="question.type === 'text'"
                :id="`lead-q-${question.id}`"
                v-model="answers[String(question.id)]"
                type="text"
                class="form-control"
                :required="question.required"
              />

              <textarea
                v-else-if="question.type === 'textarea'"
                :id="`lead-q-${question.id}`"
                v-model="answers[String(question.id)]"
                class="form-control"
                rows="3"
                :required="question.required"
              ></textarea>

              <input
                v-else-if="question.type === 'number' || question.type === 'date'"
                :id="`lead-q-${question.id}`"
                v-model="answers[String(question.id)]"
                :type="question.type === 'date' ? 'date' : 'text'"
                class="form-control"
                :required="question.required"
              />

              <div v-else-if="question.type === 'select'">
                <SingleSelect
                  :id="`lead-q-${question.id}`"
                  v-model="answers[String(question.id)]"
                  :options="questionSelectOptions(question)"
                  placeholder="Selecione..."
                />
              </div>

              <div v-else-if="question.type === 'radio'">
                <label
                  v-for="option in question.options ?? []"
                  :key="option"
                  class="d-flex align-items-center gap-2 mb-1"
                >
                  <input
                    v-model="answers[String(question.id)]"
                    class="form-check-input"
                    type="radio"
                    :name="`lead-q-${question.id}`"
                    :value="option"
                    :required="question.required"
                  />
                  <span>{{ option }}</span>
                </label>
              </div>

              <div v-else-if="question.type === 'checkbox'">
                <label
                  v-for="option in question.options ?? []"
                  :key="option"
                  class="d-flex align-items-center gap-2 mb-1"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :checked="isCheckboxChecked(question.id, option)"
                    :required="
                      question.required &&
                      !isCheckboxChecked(question.id, option) &&
                      !(answers[String(question.id)] as string[])?.length
                    "
                    @change="
                      toggleCheckbox(
                        question.id,
                        option,
                        ($event.target as HTMLInputElement).checked
                      )
                    "
                  />
                  <span>{{ option }}</span>
                </label>
              </div>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? "Enviando..." : "Enviar" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.public-enrollment {
  min-height: 100vh;
  background: #f6f3f4;
}
.public-enrollment__brand-header {
  background: #600022;
  display: flex;
  justify-content: center;
  padding: 1rem;
}
.public-enrollment__brand-logo {
  height: 48px;
  width: auto;
}
.public-enrollment__container {
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}
.public-enrollment__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #600022;
}
.public-enrollment__subtitle {
  color: #6c757d;
}
.public-enrollment__card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 28px rgba(96, 0, 34, 0.08);
  overflow: hidden;
}
.public-enrollment__card-body {
  padding: 1.25rem;
}
.public-enrollment__success-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 0.75rem;
  border-radius: 999px;
  background: #600022;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}
.public-enrollment__success-title {
  color: #600022;
}
</style>
