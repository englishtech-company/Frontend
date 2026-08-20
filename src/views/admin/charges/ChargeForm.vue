<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
} from "vue";
import {
  RouterLink,
  useRoute,
  useRouter,
} from "vue-router";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import {
  createCharge,
  getCharge,
  updateCharge,
} from "@/lib/charges";
import { listEnrollments } from "@/lib/enrollments";
import {
  formatEnrollmentNumber,
  formatEnrollmentPlanLabel,
} from "@/lib/enrollments/format";
import {
  calculateEnrollmentExpectedAmount,
  formatChargeStatus,
  formatCurrency,
  getChargeEnrollment,
  getChargeStudent,
  getEnrollmentStudent,
} from "@/lib/finance/format";
import type {
  Charge,
  ChargeStatus,
  Enrollment,
} from "@/lib/types";

const route = useRoute();
const router = useRouter();

const {
  canCreateCharges,
  canUpdateCharges,
} = usePermissions();

const isEdit = computed(
  () => Boolean(route.params.id)
);

const chargeId = computed(
  () => Number(route.params.id)
);

const canSave = computed(() =>
  isEdit.value
    ? canUpdateCharges.value
    : canCreateCharges.value
);

const enrollmentId = ref<string | null>(null);
const dueDate = ref("");
const status = ref<ChargeStatus>("open");

const charge = ref<Charge | null>(null);
const enrollments = ref<Enrollment[]>([]);
const enrollmentOptions = ref<SelectOption[]>([]);

const loading = ref(false);
const saving = ref(false);
const error = ref("");

const statusOptions = computed<SelectOption[]>(() => {
  const options: SelectOption[] = [
    {
      value: "open",
      label: "Aberta",
    },
    {
      value: "overdue",
      label: "Atrasada",
    },
    {
      value: "cancelled",
      label: "Cancelada",
    },
  ];

  if (status.value === "paid") {
    options.push({
      value: "paid",
      label: "Paga",
      disabled: true,
    });
  }

  if (status.value === "partial") {
    options.push({
      value: "partial",
      label: "Parcial",
      disabled: true,
    });
  }

  return options;
});

const statusIsAutomatic = computed(
  () =>
    status.value === "paid" ||
    status.value === "partial"
);

const selectedEnrollment = computed<
  Enrollment | null
>(() => {
  if (!enrollmentId.value) {
    return null;
  }

  const selectedId = Number(enrollmentId.value);

  return (
    enrollments.value.find(
      (enrollment) =>
        enrollment.id === selectedId
    ) ?? null
  );
});

const selectedStudent = computed(() => {
  if (charge.value) {
    return getChargeStudent(charge.value);
  }

  if (selectedEnrollment.value) {
    return getEnrollmentStudent(
      selectedEnrollment.value
    );
  }

  return null;
});

const expectedAmount = computed(() => {
  if (charge.value) {
    return Number(charge.value.expected_amount);
  }

  if (selectedEnrollment.value) {
    return calculateEnrollmentExpectedAmount(
      selectedEnrollment.value
    );
  }

  return 0;
});

function buildEnrollmentOption(
  enrollment: Enrollment
): SelectOption {
  const student =
    getEnrollmentStudent(enrollment);

  return {
    value: String(enrollment.id),
    label: `${formatEnrollmentNumber(
      enrollment.id
    )} - ${
      student?.name ?? "Aluno indisponível"
    }`,
    description: `${formatEnrollmentPlanLabel(
      enrollment
    )} · ${formatCurrency(
      calculateEnrollmentExpectedAmount(
        enrollment
      )
    )}`,
  };
}

async function loadEnrollmentOptions() {
  const result = await listEnrollments({
    page: 1,
    limit: 500,
    status: "confirmed",
  });

  enrollments.value = result.data;
  enrollmentOptions.value =
    result.data.map(buildEnrollmentOption);
}

function ensureCurrentEnrollment(
  enrollment: Enrollment
) {
  if (
    !enrollments.value.some(
      (item) => item.id === enrollment.id
    )
  ) {
    enrollments.value.unshift(enrollment);
  }

  const value = String(enrollment.id);

  if (
    !enrollmentOptions.value.some(
      (option) => option.value === value
    )
  ) {
    enrollmentOptions.value.unshift(
      buildEnrollmentOption(enrollment)
    );
  }
}

async function loadForm() {
  loading.value = true;
  error.value = "";

  try {
    await loadEnrollmentOptions();

    if (!isEdit.value) {
      return;
    }

    const currentCharge = await getCharge(
      chargeId.value
    );

    charge.value = currentCharge;
    enrollmentId.value = String(
      currentCharge.enrollment_id
    );

    dueDate.value =
      currentCharge.due_date.slice(0, 10);

    status.value = currentCharge.status;

    const currentEnrollment =
      getChargeEnrollment(currentCharge);

    if (currentEnrollment) {
      ensureCurrentEnrollment(
        currentEnrollment
      );
    }
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar a cobrança.";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!canSave.value) {
    error.value =
      "Você não tem permissão para salvar cobranças.";
    return;
  }

  if (!enrollmentId.value && !isEdit.value) {
    error.value = "Selecione a matrícula.";
    return;
  }

  if (!dueDate.value) {
    error.value =
      "Informe a data de vencimento.";
    return;
  }

  saving.value = true;
  error.value = "";

  try {
    if (isEdit.value) {
      const data: {
        due_date: string;
        status?:
          | "open"
          | "overdue"
          | "cancelled";
      } = {
        due_date: dueDate.value,
      };

      if (
        status.value === "open" ||
        status.value === "overdue" ||
        status.value === "cancelled"
      ) {
        data.status = status.value;
      }

      await updateCharge(
        chargeId.value,
        data
      );
    } else {
      await createCharge({
        enrollment_id: Number(
          enrollmentId.value
        ),
        due_date: dueDate.value,
      });
    }

    await router.push("/charges");
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao salvar a cobrança.";
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
          <h4>
            {{
              isEdit
                ? "Editar cobrança"
                : "Nova cobrança"
            }}
          </h4>

          <p class="mb-0">
            {{
              isEdit
                ? "Atualize o vencimento e o status da cobrança"
                : "Gere uma cobrança para uma matrícula confirmada"
            }}
          </p>
        </div>
      </div>

      <div
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink
          to="/charges"
          class="btn btn-outline-primary"
        >
          Voltar
        </RouterLink>
      </div>
    </div>

    <div
      v-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">
              Dados da cobrança
            </h5>
          </div>

          <div class="card-body">
            <div
              v-if="loading"
              class="text-center py-4"
            >
              Carregando...
            </div>

            <form
              v-else
              @submit.prevent="submit"
            >
              <div
                v-if="isEdit && charge"
                class="charge-form__identifier mb-4"
              >
                <span class="text-muted">
                  Número da cobrança
                </span>

                <strong>
                  #{{ charge.id }}
                </strong>

                <small>
                  A matrícula e o valor esperado foram
                  definidos na criação e não podem ser
                  alterados.
                </small>
              </div>

              <div class="row">
                <div class="col-lg-7 mb-3">
                  <SingleSelect
                    id="charge-enrollment"
                    v-model="enrollmentId"
                    label="Matrícula"
                    :options="enrollmentOptions"
                    placeholder="Selecione a matrícula"
                    hint="Somente matrículas confirmadas podem receber novas cobranças."
                    :disabled="isEdit"
                    required
                  />
                </div>

                <div class="col-lg-5 mb-3">
                  <label
                    class="form-label charge-form__label"
                    for="charge-due-date"
                  >
                    Data de vencimento
                    <span>*</span>
                  </label>

                  <input
                    id="charge-due-date"
                    v-model="dueDate"
                    type="date"
                    class="form-control charge-form__input"
                    required
                  />

                  <small class="text-muted">
                    Não pode existir outra cobrança da
                    mesma matrícula com essa data.
                  </small>
                </div>
              </div>

              <div
                v-if="isEdit"
                class="row"
              >
                <div class="col-lg-5 mb-3">
                  <SingleSelect
                    id="charge-status"
                    v-model="status"
                    label="Status"
                    :options="statusOptions"
                    placeholder="Selecione o status"
                    :disabled="statusIsAutomatic"
                    :hint="
                      statusIsAutomatic
                        ? 'Este status é calculado automaticamente pelos pagamentos.'
                        : 'Os status Paga e Parcial são calculados automaticamente.'
                    "
                    required
                  />
                </div>
              </div>

              <div
                v-if="selectedEnrollment || charge"
                class="charge-form__summary mb-4"
              >
                <div>
                  <span>Aluno</span>

                  <strong>
                    {{
                      selectedStudent?.name ??
                      "Aluno indisponível"
                    }}
                  </strong>
                </div>

                <div>
                  <span>Matrícula</span>

                  <strong>
                    {{
                      selectedEnrollment
                        ? formatEnrollmentNumber(
                            selectedEnrollment.id
                          )
                        : "—"
                    }}
                  </strong>
                </div>

                <div>
                  <span>Valor esperado</span>

                  <strong>
                    {{
                      formatCurrency(
                        expectedAmount
                      )
                    }}
                  </strong>
                </div>

                <div>
                  <span>Status inicial</span>

                  <strong>
                    {{
                      isEdit
                        ? formatChargeStatus(status)
                            .label
                        : "Aberta"
                    }}
                  </strong>
                </div>
              </div>

              <div class="mt-4">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="
                    saving || !canSave
                  "
                >
                  {{
                    saving
                      ? "Salvando..."
                      : "Salvar cobrança"
                  }}
                </button>

                <RouterLink
                  to="/charges"
                  class="btn btn-light ms-2"
                >
                  Cancelar
                </RouterLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.charge-form__label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6c757d;
}

.charge-form__label span {
  color: var(--primary);
}

.charge-form__input {
  min-height: 3rem;
}

.charge-form__identifier {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f8f9fa;
}

.charge-form__identifier strong {
  color: var(--primary);
  font-size: 1.25rem;
}

.charge-form__identifier small {
  width: 100%;
  color: #6c757d;
}

.charge-form__summary {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f8f9fa;
}

.charge-form__summary div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.charge-form__summary span {
  color: #6c757d;
  font-size: 0.8125rem;
}

.charge-form__summary strong {
  color: #343a40;
  font-size: 1rem;
}

@media (max-width: 991.98px) {
  .charge-form__summary {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 575.98px) {
  .charge-form__summary {
    grid-template-columns: 1fr;
  }
}
</style>
