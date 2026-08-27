<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { notify, notifySaved } from "@/lib/actionNotification";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import {
  createEnrollment,
  getEnrollment,
  getEnrollmentPlucks,
  regenerateEnrollmentLink,
  updateEnrollment,
} from "@/lib/enrollments";
import {
  ENROLLMENT_STATUS_LABELS,
  formatEnrollmentNumber,
  getEnrollmentPublicUrl,
} from "@/lib/enrollments/format";
import { listPlans } from "@/lib/plans";
import { buildActivePlanVariantOptions } from "@/lib/plans/format";
import type { EnrollmentPaymentMethod, EnrollmentStatus } from "@/lib/types";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => Boolean(route.params.id));
const enrollmentId = computed(() => Number(route.params.id));

const studentId = ref<string | null>(null);
const planVariantId = ref<string | null>(null);
const discountPercent = ref("");
const paymentMethod = ref<EnrollmentPaymentMethod>("pix");
const status = ref<EnrollmentStatus>("pending");

const studentOptions = ref<SelectOption[]>([]);
const planVariantOptions = ref<SelectOption[]>([]);
const publicUrl = ref("");
const linkCopied = ref(false);
const savedStudentId = ref<number | null>(null);
const savedStatus = ref<EnrollmentStatus>("pending");

const loading = ref(false);
const saving = ref(false);
const regenerating = ref(false);
const error = ref("");

const paymentOptions: SelectOption[] = [
  { value: "pix", label: "Pix" },
  { value: "credit_card", label: "Cartão de crédito" },
];

const statusOptions = computed<SelectOption[]>(() =>
  Object.entries(ENROLLMENT_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }))
);

const canRegenerateLink = computed(
  () =>
    isEdit.value &&
    savedStudentId.value === null &&
    savedStatus.value === "pending" &&
    Boolean(publicUrl.value)
);

const canShowPublicLink = computed(() => canRegenerateLink.value);

async function loadOptions() {
  const [plucks, plansResult] = await Promise.all([
    getEnrollmentPlucks(),
    listPlans({ active: true, limit: 100 }),
  ]);

  studentOptions.value = Object.entries(plucks.students).map(([value, label]) => ({
    value,
    label,
  }));

  planVariantOptions.value = buildActivePlanVariantOptions(plansResult.data);
}

async function loadForm() {
  loading.value = true;
  error.value = "";

  try {
    await loadOptions();

    if (!isEdit.value) return;

    const enrollment = await getEnrollment(enrollmentId.value);
    studentId.value = enrollment.student_id ? String(enrollment.student_id) : null;
    savedStudentId.value = enrollment.student_id ?? null;
    planVariantId.value = String(enrollment.plan_variant_id);
    discountPercent.value = enrollment.discount_percent
      ? String(enrollment.discount_percent)
      : "";
    paymentMethod.value = enrollment.payment_method;
    status.value = enrollment.status;
    savedStatus.value = enrollment.status;
    publicUrl.value = getEnrollmentPublicUrl(enrollment);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar matrícula";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!planVariantId.value) {
    error.value = "Selecione um plano.";
    return;
  }

  saving.value = true;
  error.value = "";

  const payload = {
    student_id: studentId.value ? Number(studentId.value) : null,
    plan_variant_id: Number(planVariantId.value),
    discount_percent: discountPercent.value ? Number(discountPercent.value) : null,
    payment_method: paymentMethod.value,
    status: status.value,
  };

  try {
    if (isEdit.value) {
      await updateEnrollment(enrollmentId.value, payload);
      notifySaved("Matrícula", true);
      await router.push("/enrollments");
      return;
    }

    const enrollment = await createEnrollment(payload);
    publicUrl.value = getEnrollmentPublicUrl(enrollment);
    notifySaved("Matrícula", false);
    await router.push(`/enrollments/${enrollment.id}/edit`);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao salvar matrícula";
  } finally {
    saving.value = false;
  }
}

async function copyLink() {
  if (!publicUrl.value) return;

  try {
    await navigator.clipboard.writeText(publicUrl.value);
    notify.success("Link copiado!");
    linkCopied.value = true;
    window.setTimeout(() => {
      linkCopied.value = false;
    }, 2000);
  } catch {
    error.value = "Não foi possível copiar o link.";
  }
}

async function regenerateLink() {
  if (!canRegenerateLink.value) return;

  regenerating.value = true;
  error.value = "";

  try {
    const enrollment = await regenerateEnrollmentLink(enrollmentId.value);
    publicUrl.value = getEnrollmentPublicUrl(enrollment);
    linkCopied.value = false;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao regerar link";
  } finally {
    regenerating.value = false;
  }
}

onMounted(loadForm);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>{{ isEdit ? "Editar matrícula" : "Nova matrícula" }}</h4>
          <p class="mb-0">Escolha o plano e gere o link para o aluno preencher</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <RouterLink to="/enrollments" class="btn btn-outline-primary">Voltar</RouterLink>
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
                <div class="col-lg-6 mb-3">
                  <SingleSelect
                    id="studentId"
                    v-model="studentId"
                    label="Aluno (opcional)"
                    :options="studentOptions"
                    placeholder="Sem aluno vinculado"
                    hint="Deixe vazio para o aluno preencher pelo link."
                  />
                </div>
                <div class="col-lg-6 mb-3">
                  <SingleSelect
                    id="planVariantId"
                    v-model="planVariantId"
                    label="Plano *"
                    :options="planVariantOptions"
                    placeholder="Selecione um plano"
                    required
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-lg-4 mb-3">
                  <label class="form-label" for="discountPercent">Desconto (%)</label>
                  <input
                    id="discountPercent"
                    v-model="discountPercent"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    class="form-control"
                    placeholder="0"
                  />
                </div>
                <div class="col-lg-4 mb-3">
                  <SingleSelect
                    id="paymentMethod"
                    v-model="paymentMethod"
                    label="Forma de pagamento *"
                    :options="paymentOptions"
                    required
                  />
                </div>
                <div v-if="isEdit" class="col-lg-4 mb-3">
                  <SingleSelect
                    id="status"
                    v-model="status"
                    label="Status"
                    :options="statusOptions"
                  />
                </div>
              </div>

              <div v-if="canShowPublicLink" class="alert alert-light border mb-4">
                <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div>
                    <strong>Link público</strong>
                    <div class="text-muted small">{{ publicUrl }}</div>
                    <div v-if="canRegenerateLink" class="text-muted small mt-1">
                      Regerar invalida o link anterior.
                    </div>
                  </div>
                  <div class="d-flex flex-wrap gap-2">
                    <button
                      v-if="canRegenerateLink"
                      type="button"
                      class="btn btn-outline-secondary btn-sm"
                      :disabled="regenerating"
                      @click="regenerateLink"
                    >
                      {{ regenerating ? "Regerando..." : "Regerar link" }}
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-sm" @click="copyLink">
                      {{ linkCopied ? "Copiado!" : "Copiar link" }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <RouterLink to="/enrollments" class="btn btn-outline-secondary">Cancelar</RouterLink>
                <button type="submit" class="btn btn-primary" :disabled="saving">
                  {{ saving ? "Salvando..." : isEdit ? "Salvar" : "Criar matrícula" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
