<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
  watch,
} from "vue";
import {
  RouterLink,
  useRoute,
  useRouter,
} from "vue-router";
import { notifySaved } from "@/lib/actionNotification";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import {
  cancelChargeRecurrence,
  createCharge,
  getCharge,
  updateCharge,
} from "@/lib/charges";
import { confirmAction } from "@/lib/confirm";
import { listEnrollments } from "@/lib/enrollments";
import {
  formatEnrollmentNumber,
  formatEnrollmentPlanLabel,
  getEnrollmentPlanVariant,
} from "@/lib/enrollments/format";
import {
  calculateEnrollmentExpectedAmount,
  formatChargeStatus,
  formatCurrency,
  formatDate,
  getChargeEnrollment,
  getChargeSchedule,
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
const generateRecurrence = ref(false);

const charge = ref<Charge | null>(null);
const enrollments = ref<Enrollment[]>([]);
const enrollmentOptions = ref<SelectOption[]>([]);

const loading = ref(false);
const saving = ref(false);
const cancellingRecurrence = ref(false);
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

const selectedPlanDuration = computed<
  number | null
>(() => {
  if (!selectedEnrollment.value) {
    return null;
  }

  const variant = getEnrollmentPlanVariant(
    selectedEnrollment.value
  );

  const plan =
    variant?.plan ??
    variant?.relationships?.plan;

  return plan?.duration_months ?? null;
});

const recurrenceAvailable = computed(
  () =>
    selectedPlanDuration.value !== null &&
    [1, 3, 6].includes(
      selectedPlanDuration.value
    )
);

const recurrenceHint = computed(() => {
  if (!selectedEnrollment.value) {
    return "Selecione uma matrícula para consultar a regra do plano.";
  }

  if (selectedPlanDuration.value === 1) {
    return "Será criada a primeira cobrança. As próximas serão geradas mensalmente até o cancelamento da recorrência.";
  }

  if (selectedPlanDuration.value === 3) {
    return "Serão criadas três cobranças mensais, usando esta data como primeiro vencimento.";
  }

  if (selectedPlanDuration.value === 6) {
    return "Serão criadas seis cobranças mensais, usando esta data como primeiro vencimento.";
  }

  return "A recorrência está disponível apenas para planos mensais, trimestrais ou semestrais.";
});

const chargeSchedule = computed(() => {
  if (!charge.value) {
    return null;
  }

  return getChargeSchedule(charge.value);
});

const recurrenceStatusLabel = computed(() => {
  if (!chargeSchedule.value) {
    return "";
  }

  if (
    chargeSchedule.value.status === "cancelled"
  ) {
    return "Cancelada";
  }

  if (
    chargeSchedule.value.status === "active"
  ) {
    return "Ativa";
  }

  return "Parcelas geradas";
});

const recurrenceStatusClass = computed(() => {
  if (!chargeSchedule.value) {
    return "badge-secondary";
  }

  if (
    chargeSchedule.value.status === "cancelled"
  ) {
    return "badge-secondary";
  }

  if (
    chargeSchedule.value.status === "active"
  ) {
    return "badge-success";
  }

  return "badge-info";
});

const recurrenceTypeLabel = computed(() => {
  if (!chargeSchedule.value) {
    return "—";
  }

  if (
    chargeSchedule.value.renews_automatically
  ) {
    return "Mensal com renovação automática";
  }

  if (
    chargeSchedule.value.duration_months === 3
  ) {
    return "Trimestral, com 3 cobranças";
  }

  if (
    chargeSchedule.value.duration_months === 6
  ) {
    return "Semestral, com 6 cobranças";
  }

  return `${chargeSchedule.value.duration_months} cobranças`;
});

const canCancelRecurrence = computed(
  () =>
    isEdit.value &&
    canUpdateCharges.value &&
    chargeSchedule.value !== null &&
    chargeSchedule.value.status !==
      "cancelled"
);

const statusHint = computed(() => {
  if (statusIsAutomatic.value) {
    return "Este status é calculado automaticamente pelos pagamentos.";
  }

  if (chargeSchedule.value) {
    return "Alterar o status afeta somente esta cobrança. Para encerrar todo o ciclo, use Cancelar recorrência.";
  }

  return "Os status Paga e Parcial são calculados automaticamente.";
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

watch(
  recurrenceAvailable,
  (available) => {
    if (!available) {
      generateRecurrence.value = false;
    }
  }
);

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

async function cancelRecurrence() {
  if (
    !charge.value ||
    !canCancelRecurrence.value
  ) {
    return;
  }

  const confirmed = await confirmAction({
    title: "Cancelar recorrência?",
    message:
      "Novas cobranças deixarão de ser geradas. Somente cobranças futuras ainda abertas serão canceladas; cobranças pagas, parciais e vencidas serão preservadas. A matrícula não será alterada.",
    confirmButtonText:
      "Sim, cancelar recorrência",
  });

  if (!confirmed) {
    return;
  }

  cancellingRecurrence.value = true;
  error.value = "";

  try {
    const updatedCharge =
      await cancelChargeRecurrence(
        charge.value.id
      );

    charge.value = updatedCharge;
    status.value = updatedCharge.status;
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao cancelar a recorrência.";
  } finally {
    cancellingRecurrence.value = false;
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
        generate_recurrence:
          generateRecurrence.value,
      });
    }

    notifySaved("Cobrança", isEdit.value);
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
                : "Gere cobranças para uma matrícula confirmada"
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
                    {{
                      !isEdit &&
                      generateRecurrence
                        ? "Primeiro vencimento"
                        : "Data de vencimento"
                    }}
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
                v-if="!isEdit"
                class="row"
              >
                <div class="col-12 mb-4">
                  <div
                    class="form-check charge-form__recurrence"
                  >
                    <input
                      id="charge-generate-recurrence"
                      v-model="generateRecurrence"
                      type="checkbox"
                      class="form-check-input"
                      :disabled="
                        !recurrenceAvailable
                      "
                    />

                    <label
                      class="form-check-label"
                      for="charge-generate-recurrence"
                    >
                      Gerar cobranças automaticamente
                    </label>

                    <small>
                      {{ recurrenceHint }}
                    </small>
                  </div>
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
                    :hint="statusHint"
                    required
                  />
                </div>
              </div>

              <div
                v-if="isEdit && chargeSchedule"
                class="charge-form__schedule mb-4"
              >
                <div
                  class="charge-form__schedule-header"
                >
                  <div>
                    <span>Recorrência</span>

                    <strong>
                      {{ recurrenceTypeLabel }}
                    </strong>
                  </div>

                  <span
                    class="badge"
                    :class="recurrenceStatusClass"
                  >
                    {{ recurrenceStatusLabel }}
                  </span>
                </div>

                <div
                  class="charge-form__schedule-grid"
                >
                  <div>
                    <span>Primeiro vencimento</span>

                    <strong>
                      {{
                        formatDate(
                          chargeSchedule.first_due_date
                        )
                      }}
                    </strong>
                  </div>

                  <div>
                    <span>Próximo vencimento</span>

                    <strong>
                      {{
                        formatDate(
                          chargeSchedule.next_due_date
                        )
                      }}
                    </strong>
                  </div>

                  <div>
                    <span>Dia-base</span>

                    <strong>
                      Dia
                      {{ chargeSchedule.billing_day }}
                    </strong>
                  </div>

                  <div>
                    <span>Valor por cobrança</span>

                    <strong>
                      {{
                        formatCurrency(
                          chargeSchedule.installment_amount
                        )
                      }}
                    </strong>
                  </div>
                </div>

                <div
                  v-if="canCancelRecurrence"
                  class="charge-form__schedule-actions"
                >
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    :disabled="
                      cancellingRecurrence ||
                      saving
                    "
                    @click="cancelRecurrence"
                  >
                    {{
                      cancellingRecurrence
                        ? "Cancelando..."
                        : "Cancelar recorrência"
                    }}
                  </button>

                  <small>
                    A matrícula e o histórico financeiro
                    não serão alterados.
                  </small>
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
                    saving ||
                    cancellingRecurrence ||
                    !canSave
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

.charge-form__recurrence {
  min-height: 5rem;
  padding: 1rem 1.25rem 1rem 2.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f8f9fa;
}

.charge-form__recurrence .form-check-label {
  display: block;
  color: #343a40;
  font-weight: 600;
}

.charge-form__recurrence small {
  display: block;
  margin-top: 0.25rem;
  color: #6c757d;
}

.charge-form__schedule {
  padding: 1.25rem;
  border: 1px solid #d9e8df;
  border-left: 4px solid #2f9e62;
  border-radius: 0.5rem;
  background: #f7fbf8;
}

.charge-form__schedule-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.charge-form__schedule-header div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.charge-form__schedule-header div > span,
.charge-form__schedule-grid span {
  color: #6c757d;
  font-size: 0.8125rem;
}

.charge-form__schedule-header strong {
  color: #343a40;
  font-size: 1rem;
}

.charge-form__schedule-grid {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.charge-form__schedule-grid div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.charge-form__schedule-grid strong {
  color: #343a40;
}

.charge-form__schedule-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid #d9e8df;
}

.charge-form__schedule-actions small {
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
  .charge-form__schedule-grid,
  .charge-form__summary {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 575.98px) {
  .charge-form__schedule-grid,
  .charge-form__summary {
    grid-template-columns: 1fr;
  }

  .charge-form__schedule-header {
    flex-direction: column;
  }
}
</style>
