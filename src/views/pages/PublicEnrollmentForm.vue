<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ApiError } from "@/lib/api";
import {
  formatDiscountedPrice,
  PAYMENT_METHOD_LABELS,
} from "@/lib/enrollments/format";
import { formatPlanVariantOptionLabel } from "@/lib/plans/format";
import {
  getPublicEnrollment,
  submitPublicEnrollment,
} from "@/lib/public-enrollments";
import { composeAddress } from "@/lib/br/address";
import { maskCep, maskCpf, maskPhone } from "@/lib/br/masks";
import { fetchAddressByCep } from "@/lib/br/viacep";
import {
  buildEnrollmentContract,
  ENROLLMENT_CONTRACT_TITLE,
} from "@/lib/enrollments/contract";
import {
  finalizeNumericInput,
  getNumberQuestionConstraints,
  getNumberQuestionHint,
  isValidNumericAnswer,
  sanitizeNumericInput,
} from "@/lib/enrollments/numberQuestion";
import type { EnrollmentFormQuestion, PublicEnrollment } from "@/lib/types";

const TOTAL_STEPS = 2;

const route = useRoute();
const router = useRouter();
const token = computed(() => String(route.params.token ?? ""));

const appName = import.meta.env.VITE_APP_NAME || "EnglishTech";
const isDark = ref(false);
const currentStep = ref(1);
const shellRef = ref<HTMLElement | null>(null);
const step1FormRef = ref<HTMLFormElement | null>(null);
const step2FormRef = ref<HTMLFormElement | null>(null);

const brandLogoSrc = "/utils/logowhite.png";
const currentYear = new Date().getFullYear();

const enrollment = ref<PublicEnrollment | null>(null);
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const submitted = ref(false);

const name = ref("");
const email = ref("");
const cpf = ref("");
const phone = ref("");
const cep = ref("");
const street = ref("");
const number = ref("");
const complement = ref("");
const neighborhood = ref("");
const city = ref("");
const state = ref("");
const birthdate = ref("");
const cepLoading = ref(false);
const cepError = ref("");
const answers = ref<Record<string, string | string[]>>({});
const contractAccepted = ref(false);
const showContractModal = ref(false);

const steps = [
  { number: 1, label: "Dados", icon: "fa-user" },
  { number: 2, label: "Perguntas", icon: "fa-clipboard-list" },
];

const planLabel = computed(() => {
  const variant = enrollment.value?.plan_variant;

  if (!variant?.plan) {
    return "Plano selecionado";
  }

  return formatPlanVariantOptionLabel(
    {
      id: 0,
      name: variant.plan.name,
      commitment: variant.plan.commitment,
      duration_months: variant.plan.duration_months,
      active: true,
    },
    {
      id: variant.id,
      plan_workload_id: 0,
      monthly_price: variant.monthly_price,
      active: true,
      plan_workload: variant.plan_workload
        ? {
            id: 0,
            name: variant.plan_workload.name,
            hours_per_week: variant.plan_workload.hours_per_week,
            sort_order: 0,
            active: true,
          }
        : undefined,
    }
  );
});

const monthlyPriceLabel = computed(() => {
  const variant = enrollment.value?.plan_variant;

  if (!variant?.monthly_price) {
    return null;
  }

  return formatDiscountedPrice(
    variant.monthly_price,
    enrollment.value?.discount_percent
  );
});

const contractText = computed(() =>
  buildEnrollmentContract({
    name: name.value,
    cpf: cpf.value,
    address: buildAddress(),
  })
);

function openContractModal() {
  showContractModal.value = true;
}

function closeContractModal() {
  showContractModal.value = false;
}

function getQuestionNumberConstraints(question: EnrollmentFormQuestion) {
  return getNumberQuestionConstraints(question.label, question.help_text);
}

function onNumberKeydown(event: KeyboardEvent) {
  const allowedKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
  ];

  if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
    return;
  }

  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
}

function onNumberInput(question: EnrollmentFormQuestion, event: Event) {
  const input = event.target as HTMLInputElement;
  const key = String(question.id);
  const constraints = getQuestionNumberConstraints(question);
  const sanitized = sanitizeNumericInput(input.value, constraints);

  answers.value[key] = sanitized;

  if (input.value !== sanitized) {
    input.value = sanitized;
  }

  updateNumberInputValidity(input, sanitized, question, constraints);
}

function onNumberBlur(question: EnrollmentFormQuestion, event: Event) {
  const input = event.target as HTMLInputElement;
  const key = String(question.id);
  const constraints = getQuestionNumberConstraints(question);
  const finalized = finalizeNumericInput(String(answers.value[key] ?? ""), constraints);

  answers.value[key] = finalized;
  input.value = finalized;
  updateNumberInputValidity(input, finalized, question, constraints);
}

function onNumberPaste(question: EnrollmentFormQuestion, event: ClipboardEvent) {
  event.preventDefault();

  const input = event.target as HTMLInputElement;
  const pasted = event.clipboardData?.getData("text") ?? "";
  const constraints = getQuestionNumberConstraints(question);
  const sanitized = sanitizeNumericInput(
    `${String(answers.value[String(question.id)] ?? "")}${pasted}`,
    constraints
  );

  answers.value[String(question.id)] = sanitized;
  input.value = sanitized;
  updateNumberInputValidity(input, sanitized, question, constraints);
}

function updateNumberInputValidity(
  input: HTMLInputElement,
  value: string,
  question: EnrollmentFormQuestion,
  constraints = getQuestionNumberConstraints(question)
) {
  if (!value) {
    input.setCustomValidity("");
    return;
  }

  if (!isValidNumericAnswer(value, constraints)) {
    const hint = getNumberQuestionHint(constraints);
    input.setCustomValidity(hint ?? "Informe apenas números válidos.");
    return;
  }

  input.setCustomValidity("");
}

function updateTheme() {
  isDark.value = document.body.getAttribute("data-theme-version") === "dark";
}

let themeObserver: MutationObserver | null = null;

function initializeAnswers(questions: EnrollmentFormQuestion[]) {
  const nextAnswers: Record<string, string | string[]> = {};

  for (const question of questions) {
    nextAnswers[String(question.id)] = question.type === "checkbox" ? [] : "";
  }

  answers.value = nextAnswers;
}

function toggleCheckbox(questionId: number, option: string, checked: boolean) {
  const key = String(questionId);
  const current = Array.isArray(answers.value[key])
    ? [...(answers.value[key] as string[])]
    : [];

  if (checked) {
    if (!current.includes(option)) {
      current.push(option);
    }
  } else {
    answers.value[key] = current.filter((item) => item !== option);
    return;
  }

  answers.value[key] = current;
}

function isCheckboxChecked(questionId: number, option: string): boolean {
  const value = answers.value[String(questionId)];
  return Array.isArray(value) && value.includes(option);
}

function onCpfInput(event: Event) {
  cpf.value = maskCpf((event.target as HTMLInputElement).value);
}

function onPhoneInput(event: Event) {
  phone.value = maskPhone((event.target as HTMLInputElement).value);
}

function onCepInput(event: Event) {
  cepError.value = "";
  cep.value = maskCep((event.target as HTMLInputElement).value);
}

async function lookupCep() {
  const digits = cep.value.replace(/\D/g, "");

  if (digits.length !== 8) {
    return;
  }

  cepLoading.value = true;
  cepError.value = "";

  try {
    const result = await fetchAddressByCep(digits);

    if (!result) {
      cepError.value = "CEP não encontrado.";
      return;
    }

    street.value = result.logradouro ?? "";
    neighborhood.value = result.bairro ?? "";
    city.value = result.localidade ?? "";
    state.value = result.uf ?? "";

    if (result.complemento && !complement.value) {
      complement.value = result.complemento;
    }
  } catch {
    cepError.value = "Não foi possível buscar o CEP.";
  } finally {
    cepLoading.value = false;
  }
}

function buildAddress(): string {
  return composeAddress({
    cep: cep.value,
    street: street.value,
    number: number.value,
    complement: complement.value,
    neighborhood: neighborhood.value,
    city: city.value,
    state: state.value,
  });
}

async function scrollToTop() {
  await nextTick();
  shellRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function redirectToNotFound() {
  await router.replace({ name: "page_error_404" });
}

async function loadForm() {
  loading.value = true;
  error.value = "";

  try {
    const data = await getPublicEnrollment(token.value);
    enrollment.value = data;

    name.value = data.student?.name ?? "";
    email.value = data.student?.email ?? "";
    cpf.value = maskCpf(data.student?.cpf ?? "");
    phone.value = maskPhone(data.student?.phone ?? "");
    street.value = data.student?.address ?? "";
    birthdate.value = data.student?.birthdate ?? "";
    initializeAnswers(data.form_questions);
    loading.value = false;
  } catch (e) {
    const status = (e as ApiError)?.status;
    if (status === 404 || status === 422) {
      await redirectToNotFound();
      return;
    }

    await redirectToNotFound();
  }
}

function goToStep(step: number) {
  currentStep.value = step;
  error.value = "";
  scrollToTop();
}

async function goNextStep() {
  if (!step1FormRef.value?.reportValidity()) {
    return;
  }

  goToStep(2);
}

function goBackStep() {
  goToStep(1);
}

async function submit() {
  if (!enrollment.value) return;

  if (!step2FormRef.value?.reportValidity()) {
    return;
  }

  if (!contractAccepted.value) {
    error.value = "Você precisa ler e aceitar o contrato para enviar a matrícula.";
    await scrollToTop();
    return;
  }

  saving.value = true;
  error.value = "";
  submitted.value = false;

  try {
    const result = await submitPublicEnrollment(token.value, {
      name: name.value.trim(),
      email: email.value.trim(),
      cpf: cpf.value.trim(),
      phone: phone.value.trim(),
      address: buildAddress(),
      birthdate: birthdate.value,
      answers: answers.value,
      contract_accepted: true,
    });

    enrollment.value = result.enrollment;
    submitted.value = true;
    await scrollToTop();
  } catch (e) {
    if ((e as ApiError)?.status === 404) {
      await redirectToNotFound();
      return;
    }

    error.value = e instanceof Error ? e.message : "Erro ao enviar matrícula";
    await scrollToTop();
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  updateTheme();
  themeObserver = new MutationObserver(updateTheme);
  themeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-theme-version"],
  });
  loadForm();
});

onUnmounted(() => {
  themeObserver?.disconnect();
});
</script>

<template>
  <div
    v-if="loading"
    ref="shellRef"
    class="public-enrollment public-enrollment--boot"
  >
    <div class="public-enrollment__boot-loading">
      <div class="spinner-border text-primary" role="status" aria-hidden="true"></div>
    </div>
  </div>

  <div
    v-else
    ref="shellRef"
    class="public-enrollment"
    :class="{ 'public-enrollment--dark': isDark }"
  >
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
        <h1 class="public-enrollment__title">Formulário de matrícula</h1>
        <p class="public-enrollment__subtitle">
          Preencha seus dados para concluir sua matrícula na {{ appName }}.
        </p>
      </div>

      <div v-if="error" class="alert alert-danger public-enrollment__alert" role="alert">
        {{ error }}
      </div>

      <div v-if="saving" class="public-enrollment__card">
        <div class="public-enrollment__card-body public-enrollment__loading">
          <div class="spinner-border text-primary" role="status" aria-hidden="true"></div>
          <p class="mb-0 mt-3">Enviando confirmação...</p>
        </div>
      </div>

      <div
        v-else-if="submitted && enrollment"
        class="public-enrollment__card public-enrollment__success"
      >
        <div class="public-enrollment__card-body text-center">
          <div class="public-enrollment__success-icon" aria-hidden="true">✓</div>
          <h2 class="public-enrollment__success-title">Assinatura enviada!</h2>
          <p class="mb-2">
            Enviamos a assinatura da sua matrícula.
          </p>
          <p class="text-muted mb-0">
            Em breve você receberá a confirmação no e-mail com seu ID da EnglishTech.
          </p>
        </div>
      </div>

      <template v-else-if="enrollment">
        <div
          class="public-enrollment__steps"
          aria-label="Progresso do formulário"
        >
          <div
            v-for="step in steps"
            :key="step.number"
            class="public-enrollment__step"
            :class="{
              'public-enrollment__step--active': currentStep === step.number,
              'public-enrollment__step--done': currentStep > step.number,
            }"
            :aria-current="currentStep === step.number ? 'step' : undefined"
          >
            <span class="public-enrollment__step-badge" aria-hidden="true">
              <i class="fas" :class="step.icon"></i>
            </span>
            <span class="public-enrollment__step-label">{{ step.label }}</span>
          </div>
        </div>

        <div class="public-enrollment__card">
          <div class="public-enrollment__plan-banner">
            <div>
              <span class="public-enrollment__plan-kicker">Plano selecionado</span>
              <p class="public-enrollment__plan-title mb-0">{{ planLabel }}</p>
            </div>
            <div class="public-enrollment__plan-meta">
              <span v-if="monthlyPriceLabel">{{ monthlyPriceLabel }}/mês</span>
              <span v-if="enrollment.discount_percent">
                Desconto: {{ enrollment.discount_percent }}%
              </span>
              <span>{{ PAYMENT_METHOD_LABELS[enrollment.payment_method] }}</span>
            </div>
          </div>

          <div class="public-enrollment__card-body">
            <form
              v-show="currentStep === 1"
              ref="step1FormRef"
              class="public-enrollment__step-form"
              @submit.prevent="goNextStep"
            >
              <div class="public-enrollment__section-head">
                <h2>Etapa 1 — Seus dados</h2>
                <p>Informe seus dados pessoais para continuar.</p>
              </div>

              <div class="row g-2">
                <div class="col-md-6">
                  <label class="form-label" for="name">Nome completo *</label>
                  <input
                    id="name"
                    v-model.trim="name"
                    type="text"
                    class="form-control"
                    autocomplete="name"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="email">E-mail *</label>
                  <input
                    id="email"
                    v-model.trim="email"
                    type="email"
                    class="form-control"
                    autocomplete="email"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="cpf">CPF *</label>
                  <input
                    id="cpf"
                    :value="cpf"
                    type="text"
                    class="form-control"
                    inputmode="numeric"
                    maxlength="14"
                    placeholder="000.000.000-00"
                    required
                    @input="onCpfInput"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="phone">Telefone / WhatsApp</label>
                  <input
                    id="phone"
                    :value="phone"
                    type="tel"
                    class="form-control"
                    autocomplete="tel"
                    maxlength="15"
                    placeholder="(00) 00000-0000"
                    @input="onPhoneInput"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="birthdate">Data de nascimento *</label>
                  <input
                    id="birthdate"
                    v-model="birthdate"
                    type="date"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label public-enrollment__address-title">Endereço</label>
                </div>
                <div class="col-md-4">
                  <label class="form-label" for="cep">CEP</label>
                  <input
                    id="cep"
                    :value="cep"
                    type="text"
                    class="form-control"
                    inputmode="numeric"
                    maxlength="9"
                    placeholder="00000-000"
                    @input="onCepInput"
                    @blur="lookupCep"
                  />
                  <div v-if="cepLoading" class="public-enrollment__field-hint">Buscando CEP...</div>
                  <div v-else-if="cepError" class="public-enrollment__field-hint public-enrollment__field-hint--error">
                    {{ cepError }}
                  </div>
                </div>
                <div class="col-md-8">
                  <label class="form-label" for="street">Rua</label>
                  <input
                    id="street"
                    v-model.trim="street"
                    type="text"
                    class="form-control"
                    autocomplete="address-line1"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label" for="number">Número</label>
                  <input
                    id="number"
                    v-model.trim="number"
                    type="text"
                    class="form-control"
                  />
                </div>
                <div class="col-md-8">
                  <label class="form-label" for="complement">Complemento</label>
                  <input
                    id="complement"
                    v-model.trim="complement"
                    type="text"
                    class="form-control"
                    autocomplete="address-line2"
                  />
                </div>
                <div class="col-md-5">
                  <label class="form-label" for="neighborhood">Bairro</label>
                  <input
                    id="neighborhood"
                    v-model.trim="neighborhood"
                    type="text"
                    class="form-control"
                  />
                </div>
                <div class="col-md-5">
                  <label class="form-label" for="city">Cidade</label>
                  <input
                    id="city"
                    v-model.trim="city"
                    type="text"
                    class="form-control"
                    autocomplete="address-level2"
                  />
                </div>
                <div class="col-md-2">
                  <label class="form-label" for="state">UF</label>
                  <input
                    id="state"
                    v-model.trim="state"
                    type="text"
                    class="form-control text-uppercase"
                    maxlength="2"
                    autocomplete="address-level1"
                  />
                </div>
              </div>

              <div class="public-enrollment__actions">
                <button type="submit" class="btn btn-primary">
                  Continuar
                </button>
              </div>
            </form>

            <form
              v-show="currentStep === 2"
              ref="step2FormRef"
              class="public-enrollment__step-form"
              @submit.prevent="submit"
            >
              <div class="public-enrollment__section-head">
                <h2>Etapa 2 — Informações adicionais</h2>
                <p>Responda às perguntas abaixo para finalizar sua matrícula.</p>
              </div>

              <div
                v-for="question in enrollment.form_questions"
                :key="question.id"
                class="public-enrollment__question"
              >
                <label class="form-label" :for="`question-${question.id}`">
                  {{ question.label }}
                  <span v-if="question.required" class="text-danger">*</span>
                </label>
                <p v-if="question.help_text" class="public-enrollment__help">
                  {{ question.help_text }}
                </p>

                <input
                  v-if="question.type === 'text'"
                  :id="`question-${question.id}`"
                  v-model="answers[String(question.id)]"
                  type="text"
                  class="form-control"
                  :required="question.required"
                />

                <textarea
                  v-else-if="question.type === 'textarea'"
                  :id="`question-${question.id}`"
                  v-model="answers[String(question.id)]"
                  class="form-control"
                  rows="3"
                  :required="question.required"
                ></textarea>

                <template v-else-if="question.type === 'number'">
                  <input
                    :id="`question-${question.id}`"
                    :value="answers[String(question.id)]"
                    type="text"
                    inputmode="numeric"
                    autocomplete="off"
                    class="form-control"
                    :required="question.required"
                    @keydown="onNumberKeydown"
                    @paste="onNumberPaste(question, $event)"
                    @input="onNumberInput(question, $event)"
                    @blur="onNumberBlur(question, $event)"
                  />
                  <div
                    v-if="getNumberQuestionHint(getQuestionNumberConstraints(question))"
                    class="public-enrollment__field-hint"
                  >
                    {{ getNumberQuestionHint(getQuestionNumberConstraints(question)) }}
                  </div>
                </template>

                <input
                  v-else-if="question.type === 'date'"
                  :id="`question-${question.id}`"
                  v-model="answers[String(question.id)]"
                  type="date"
                  class="form-control"
                  :required="question.required"
                />

                <select
                  v-else-if="question.type === 'select'"
                  :id="`question-${question.id}`"
                  v-model="answers[String(question.id)]"
                  class="form-select"
                  :required="question.required"
                >
                  <option value="">Selecione...</option>
                  <option
                    v-for="option in question.options ?? []"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>

                <div
                  v-else-if="question.type === 'radio'"
                  class="public-enrollment__options"
                >
                  <label
                    v-for="option in question.options ?? []"
                    :key="option"
                    class="public-enrollment__option"
                  >
                    <input
                      v-model="answers[String(question.id)]"
                      class="form-check-input"
                      type="radio"
                      :name="`question-${question.id}`"
                      :value="option"
                      :required="question.required"
                    />
                    <span>{{ option }}</span>
                  </label>
                </div>

                <div
                  v-else-if="question.type === 'checkbox'"
                  class="public-enrollment__options"
                >
                  <label
                    v-for="option in question.options ?? []"
                    :key="option"
                    class="public-enrollment__option"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="isCheckboxChecked(question.id, option)"
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

              <div class="public-enrollment__contract">
                <label class="public-enrollment__contract-label">
                  <input
                    v-model="contractAccepted"
                    class="form-check-input"
                    type="checkbox"
                    required
                  />
                  <span>
                    Li e aceito o
                    <button
                      type="button"
                      class="public-enrollment__contract-link"
                      @click="openContractModal"
                    >
                      {{ ENROLLMENT_CONTRACT_TITLE }}
                    </button>
                  </span>
                </label>
              </div>

              <div class="public-enrollment__actions public-enrollment__actions--split">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  :disabled="saving"
                  @click="goBackStep"
                >
                  Voltar
                </button>
                <button type="submit" class="btn btn-primary" :disabled="saving">
                  {{ saving ? "Enviando confirmação..." : "Enviar matrícula" }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p class="public-enrollment__footer-note text-center">
          Etapa {{ currentStep }} de {{ TOTAL_STEPS }}
        </p>
      </template>
    </div>

    <footer class="public-enrollment__copyright">
      © {{ currentYear }} English Tech. Todos os direitos reservados.
    </footer>

    <Teleport to="body">
      <div
        v-if="showContractModal"
        class="public-enrollment-contract-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="ENROLLMENT_CONTRACT_TITLE"
        @click.self="closeContractModal"
      >
        <div class="public-enrollment-contract-modal__panel">
          <div class="public-enrollment-contract-modal__header">
            <h2 class="public-enrollment-contract-modal__title">
              {{ ENROLLMENT_CONTRACT_TITLE }}
            </h2>
            <button
              type="button"
              class="public-enrollment-contract-modal__close"
              aria-label="Fechar contrato"
              @click="closeContractModal"
            >
              ×
            </button>
          </div>
          <div class="public-enrollment-contract-modal__body">
            <pre class="public-enrollment-contract-modal__text">{{ contractText }}</pre>
          </div>
          <div class="public-enrollment-contract-modal__footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="closeContractModal"
            >
              Fechar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="
                contractAccepted = true;
                closeContractModal();
              "
            >
              Li e aceito
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.public-enrollment {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
  padding: 0 0.85rem 0;
  background:
    radial-gradient(circle at top left, var(--rgba-primary-2), transparent 45%),
    radial-gradient(circle at bottom right, rgba(149, 150, 246, 0.18), transparent 40%),
    var(--body-bg);
}

.public-enrollment--dark {
  background:
    radial-gradient(circle at top left, rgba(149, 150, 246, 0.22), transparent 45%),
    radial-gradient(circle at bottom right, rgba(94, 95, 206, 0.16), transparent 40%),
    var(--body-bg);
}

.public-enrollment__brand-header {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  margin: 0 calc(50% - 50vw) 1rem;
  padding: 0.85rem 1rem;
  background: #600123;
  box-shadow: 0 4px 16px rgba(96, 1, 35, 0.25);
}

.public-enrollment__brand-logo {
  max-width: 220px;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.public-enrollment__container {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  flex: 1;
  padding-bottom: 1rem;
}

.public-enrollment__intro {
  margin-bottom: 0.85rem;
}

.public-enrollment__title {
  font-size: clamp(1.15rem, 3.5vw, 1.5rem);
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.25rem;
}

.public-enrollment__subtitle {
  color: var(--text-gray);
  margin-bottom: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.public-enrollment__alert {
  border-radius: 12px;
  margin-bottom: 1rem;
}

.public-enrollment__steps {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.public-enrollment__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.55rem 0.4rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid var(--border);
  color: var(--text-gray);
  text-align: center;
  transition: all 0.2s ease;
}

.public-enrollment__step--active {
  background: #fff;
  border-color: var(--primary);
  box-shadow: 0 4px 14px var(--rgba-primary-1);
  color: var(--text-dark);
}

.public-enrollment__step--done {
  border-color: rgba(96, 0, 34, 0.35);
}

.public-enrollment__step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: var(--rgba-primary-1);
  color: var(--primary);
  font-size: 0.85rem;
  flex-shrink: 0;
}

.public-enrollment__step--active .public-enrollment__step-badge,
.public-enrollment__step--done .public-enrollment__step-badge {
  background: var(--primary);
  color: #fff;
}

.public-enrollment__step-label {
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.1;
}

.public-enrollment__card {
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 28px var(--rgba-primary-1);
  overflow: hidden;
}

.public-enrollment__card-body {
  padding: 1rem;
}

.public-enrollment__plan-banner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #600123;
  color: #fff;
}

.public-enrollment__plan-kicker {
  display: block;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.85;
  margin-bottom: 0.15rem;
}

.public-enrollment__plan-title {
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.3;
}

.public-enrollment__plan-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  font-size: 0.78rem;
  opacity: 0.95;
  text-align: right;
}

.public-enrollment__section-head h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.2rem;
}

.public-enrollment__section-head p {
  color: var(--text-gray);
  margin-bottom: 0.85rem;
  font-size: 0.82rem;
}

.public-enrollment__question + .public-enrollment__question {
  margin-top: 0.85rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border);
}

.public-enrollment__help {
  font-size: 0.875rem;
  color: var(--text-gray);
  margin: -0.25rem 0 0.75rem;
}

.public-enrollment__options {
  display: grid;
  gap: 0.65rem;
}

.public-enrollment__option {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.public-enrollment__option:has(input:checked) {
  border-color: var(--primary);
  background: var(--rgba-primary-1);
}

.public-enrollment__option span {
  line-height: 1.4;
}

.public-enrollment__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border);
}

.public-enrollment__actions--split {
  justify-content: space-between;
  gap: 0.5rem;
}

.public-enrollment__actions .btn {
  min-width: 120px;
  padding: 0.45rem 1rem;
  font-size: 0.875rem;
}

.public-enrollment__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  color: var(--text-gray);
}

.public-enrollment__success {
  text-align: center;
}

.public-enrollment__success-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(96, 1, 35, 0.1);
  color: #600123;
  font-size: 2rem;
  font-weight: 700;
}

.public-enrollment--boot {
  align-items: center;
  justify-content: center;
  background: var(--body-bg);
}

.public-enrollment__boot-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
}

.public-enrollment__success-title {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-dark);
}

.public-enrollment__footer-note {
  margin-top: 0.65rem;
  color: var(--text-gray);
  font-size: 0.75rem;
}

.public-enrollment__copyright {
  width: 100vw;
  margin: 0 calc(50% - 50vw);
  padding: 0.85rem 1rem;
  text-align: center;
  font-size: 0.72rem;
  color: var(--text-gray);
  background: rgba(255, 255, 255, 0.45);
  border-top: 1px solid var(--border);
}

.public-enrollment :deep(.form-label) {
  font-size: 0.82rem;
  margin-bottom: 0.3rem;
}

.public-enrollment :deep(.form-control),
.public-enrollment :deep(.form-select) {
  min-height: 2.25rem;
  padding: 0.35rem 0.65rem;
  font-size: 0.875rem;
}

.public-enrollment :deep(.form-control:focus),
.public-enrollment :deep(.form-select:focus) {
  border-color: var(--primary);
  box-shadow: 0 0 0 0.2rem var(--rgba-primary-2);
}

.public-enrollment__address-title {
  font-weight: 600;
  margin-bottom: 0;
  margin-top: 0.25rem;
}

.public-enrollment__field-hint {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-gray);
}

.public-enrollment__field-hint--error {
  color: #dc3545;
}

.public-enrollment__contract {
  margin-top: 1.5rem;
  padding: 1rem 1.1rem;
  border: 1px solid #ecd9df;
  border-radius: 12px;
  background: #faf7f8;
}

.public-enrollment__contract-label {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--text-dark);
}

.public-enrollment__contract-label .form-check-input {
  margin-top: 0.2rem;
  flex-shrink: 0;
}

.public-enrollment__contract-link {
  border: 0;
  padding: 0;
  background: none;
  color: #600123;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.public-enrollment__contract-link:hover {
  color: #4a011c;
}

.public-enrollment-contract-modal {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(20, 16, 18, 0.62);
}

.public-enrollment-contract-modal__panel {
  display: flex;
  flex-direction: column;
  width: min(760px, 100%);
  max-height: min(88vh, 900px);
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 18px 48px rgba(96, 1, 35, 0.18);
}

.public-enrollment-contract-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #600123;
  color: #fff;
}

.public-enrollment-contract-modal__title {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.35;
  color: #fff;
}

.public-enrollment-contract-modal__close {
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.15rem;
}

.public-enrollment-contract-modal__body {
  flex: 1;
  overflow: auto;
  padding: 1.25rem;
  background: #faf7f8;
}

.public-enrollment-contract-modal__text {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  font-size: 0.84rem;
  line-height: 1.65;
  color: #2d3748;
}

.public-enrollment-contract-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #ecd9df;
  background: #fff;
}

@media (max-width: 767px) {
  .public-enrollment {
    padding: 0 0.75rem 0;
  }

  .public-enrollment__brand-header {
    padding: 0.7rem 0.75rem;
    margin-bottom: 0.75rem;
  }

  .public-enrollment__brand-logo {
    max-width: 190px;
  }

  .public-enrollment__steps {
    gap: 0.4rem;
  }

  .public-enrollment__step {
    padding: 0.5rem 0.3rem;
  }

  .public-enrollment__step-badge {
    width: 1.85rem;
    height: 1.85rem;
    font-size: 0.78rem;
  }

  .public-enrollment__step-label {
    font-size: 0.72rem;
  }

  .public-enrollment__card-body {
    padding: 0.85rem;
  }

  .public-enrollment__plan-banner {
    padding: 0.65rem 0.85rem;
  }

  .public-enrollment__copyright {
    font-size: 0.68rem;
    padding: 0.75rem 0.85rem;
  }

  .public-enrollment__actions,
  .public-enrollment__actions--split {
    flex-direction: column;
  }

  .public-enrollment__actions .btn {
    width: 100%;
    min-width: 0;
  }
}
</style>

<style>
.layout-public {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
