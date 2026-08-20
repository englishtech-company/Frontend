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
  getCharge,
  getChargeOptions,
} from "@/lib/charges";
import {
  formatChargeStatus,
  formatCurrency,
  formatDate,
  getChargeStudent,
  getPaymentCharge,
} from "@/lib/finance/format";
import {
  createPayment,
  getPayment,
  updatePayment,
} from "@/lib/payments";
import {
  formatPriceForInput,
  formatPriceInput,
  parsePriceInput,
} from "@/lib/plans/format";
import type {
  Charge,
  Payment,
} from "@/lib/types";

const route = useRoute();
const router = useRouter();

const {
  canCreatePayments,
  canUpdatePayments,
} = usePermissions();

const isEdit = computed(
  () => Boolean(route.params.id)
);

const paymentId = computed(
  () => Number(route.params.id)
);

const hasSavePermission = computed(() =>
  isEdit.value
    ? canUpdatePayments.value
    : canCreatePayments.value
);

const chargeId = ref<string | null>(null);
const amount = ref("");
const paidAt = ref("");
const receiptUrl = ref("");

const payment = ref<Payment | null>(null);
const selectedCharge = ref<Charge | null>(null);
const chargeOptions = ref<SelectOption[]>([]);

const loading = ref(false);
const loadingCharge = ref(false);
const saving = ref(false);
const error = ref("");

const selectedStudent = computed(() =>
  selectedCharge.value
    ? getChargeStudent(selectedCharge.value)
    : null
);

const chargeAcceptsNewPayment = computed(
  () => {
    if (isEdit.value) {
      return true;
    }

    if (!selectedCharge.value) {
      return true;
    }

    return (
      selectedCharge.value.status !==
        "cancelled" &&
      selectedCharge.value.status !== "paid"
    );
  }
);

const canSubmit = computed(
  () =>
    hasSavePermission.value &&
    !saving.value &&
    !loadingCharge.value &&
    chargeAcceptsNewPayment.value
);

function padDatePart(value: number): string {
  return String(value).padStart(2, "0");
}

function toLocalDateTimeInput(
  value: string
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return [
    date.getFullYear(),
    "-",
    padDatePart(date.getMonth() + 1),
    "-",
    padDatePart(date.getDate()),
    "T",
    padDatePart(date.getHours()),
    ":",
    padDatePart(date.getMinutes()),
  ].join("");
}

function toUtcDateTimePayload(
  value: string
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
}

function handleAmountInput(event: Event) {
  const input = event.target as HTMLInputElement;

  amount.value = formatPriceInput(input.value);
}

function buildChargeFallbackLabel(
  charge: Charge
): string {
  const studentName =
    getChargeStudent(charge)?.name ??
    "Aluno indisponível";

  return `#${charge.id} - ${studentName} - ${formatDate(
    charge.due_date
  )}`;
}

function ensureCurrentChargeOption(
  charge: Charge
) {
  const value = String(charge.id);

  if (
    chargeOptions.value.some(
      (option) => option.value === value
    )
  ) {
    return;
  }

  chargeOptions.value.unshift({
    value,
    label: buildChargeFallbackLabel(charge),
  });
}

async function loadChargeOptions() {
  const options = await getChargeOptions();

  chargeOptions.value = Object.entries(
    options
  ).map(([value, label]) => ({
    value,
    label,
  }));
}

async function handleChargeChange(
  value: string | number | null
) {
  selectedCharge.value = null;

  if (value === null || value === "") {
    return;
  }

  loadingCharge.value = true;
  error.value = "";

  try {
    selectedCharge.value = await getCharge(
      Number(value)
    );
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar a cobrança.";
  } finally {
    loadingCharge.value = false;
  }
}

async function loadForm() {
  loading.value = true;
  error.value = "";

  try {
    await loadChargeOptions();

    if (!isEdit.value) {
      paidAt.value = toLocalDateTimeInput(
        new Date().toISOString()
      );

      return;
    }

    const currentPayment = await getPayment(
      paymentId.value
    );

    payment.value = currentPayment;
    chargeId.value = String(
      currentPayment.charge_id
    );

    amount.value = formatPriceForInput(
      currentPayment.amount
    );

    paidAt.value = toLocalDateTimeInput(
      currentPayment.paid_at
    );

    receiptUrl.value =
      currentPayment.receipt_url ?? "";

    const currentCharge =
      getPaymentCharge(currentPayment);

    if (currentCharge) {
      selectedCharge.value = currentCharge;
      ensureCurrentChargeOption(currentCharge);
    } else {
      selectedCharge.value = await getCharge(
        currentPayment.charge_id
      );

      ensureCurrentChargeOption(
        selectedCharge.value
      );
    }
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar o pagamento.";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!hasSavePermission.value) {
    error.value =
      "Você não tem permissão para salvar pagamentos.";
    return;
  }

  if (!isEdit.value && !chargeId.value) {
    error.value = "Selecione a cobrança.";
    return;
  }

  if (!chargeAcceptsNewPayment.value) {
    error.value =
      "A cobrança selecionada não aceita novos pagamentos.";
    return;
  }

  const parsedAmount = parsePriceInput(
    amount.value
  );

  if (
    !Number.isFinite(parsedAmount) ||
    parsedAmount < 0.01
  ) {
    error.value =
      "Informe um valor pago válido.";
    return;
  }

  const paidAtPayload =
    toUtcDateTimePayload(paidAt.value);

  if (!paidAtPayload) {
    error.value =
      "Informe a data e o horário do pagamento.";
    return;
  }

  saving.value = true;
  error.value = "";

  try {
    const data = {
      amount: parsedAmount,
      paid_at: paidAtPayload,
      receipt_url:
        receiptUrl.value.trim() || null,
    };

    if (isEdit.value) {
      await updatePayment(
        paymentId.value,
        data
      );
    } else {
      await createPayment({
        charge_id: Number(chargeId.value),
        ...data,
      });
    }

    await router.push("/payments");
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao salvar o pagamento.";
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
                ? "Editar pagamento"
                : "Novo pagamento"
            }}
          </h4>

          <p class="mb-0">
            {{
              isEdit
                ? "Atualize os dados do pagamento registrado"
                : "Registre um pagamento recebido para uma cobrança"
            }}
          </p>
        </div>
      </div>

      <div
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink
          to="/payments"
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
              Dados do pagamento
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
                v-if="isEdit && payment"
                class="payment-form__identifier mb-4"
              >
                <span class="text-muted">
                  Número do pagamento
                </span>

                <strong>
                  #{{ payment.id }}
                </strong>

                <small>
                  A cobrança foi definida na criação
                  e não pode ser alterada.
                </small>
              </div>

              <div class="row">
                <div class="col-lg-7 mb-3">
                  <SingleSelect
                    id="payment-charge"
                    v-model="chargeId"
                    label="Cobrança"
                    :options="chargeOptions"
                    placeholder="Selecione a cobrança"
                    hint="Selecione a cobrança que recebeu o pagamento."
                    :disabled="isEdit"
                    required
                    @change="handleChargeChange"
                  />
                </div>

                <div class="col-lg-5 mb-3">
                  <label
                    class="form-label payment-form__label"
                    for="payment-amount"
                  >
                    Valor pago
                    <span>*</span>
                  </label>

                  <div class="input-group">
                    <span class="input-group-text">
                      R$
                    </span>

                    <input
                      id="payment-amount"
                      :value="amount"
                      type="text"
                      inputmode="decimal"
                      class="form-control payment-form__input"
                      maxlength="11"
                      placeholder="0,00"
                      required
                      @input="handleAmountInput"
                    />
                  </div>

                  <small class="text-muted">
                    Digite os centavos, como em uma
                    maquininha. Ex.: 10000 para
                    R$ 100,00.
                  </small>
                </div>
              </div>

              <div class="row">
                <div class="col-lg-5 mb-3">
                  <label
                    class="form-label payment-form__label"
                    for="payment-paid-at"
                  >
                    Data do pagamento
                    <span>*</span>
                  </label>

                  <input
                    id="payment-paid-at"
                    v-model="paidAt"
                    type="datetime-local"
                    class="form-control payment-form__input"
                    required
                  />

                  <small class="text-muted">
                    Informe a data e o horário em que o
                    pagamento foi recebido.
                  </small>
                </div>

                <div class="col-lg-7 mb-3">
                  <label
                    class="form-label payment-form__label"
                    for="payment-receipt-url"
                  >
                    URL do comprovante
                  </label>

                  <input
                    id="payment-receipt-url"
                    v-model="receiptUrl"
                    type="url"
                    class="form-control payment-form__input"
                    maxlength="2048"
                    placeholder="https://exemplo.com/comprovante.pdf"
                  />

                  <small class="text-muted">
                    Campo opcional. Informe um endereço
                    completo iniciado por http ou https.
                  </small>
                </div>
              </div>

              <div
                v-if="
                  loadingCharge &&
                  !isEdit
                "
                class="text-muted mb-4"
              >
                Carregando dados da cobrança...
              </div>

              <div
                v-if="selectedCharge"
                class="payment-form__summary mb-4"
              >
                <div>
                  <span>Cobrança</span>

                  <strong>
                    #{{ selectedCharge.id }}
                  </strong>
                </div>

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
                  <span>Valor esperado</span>

                  <strong>
                    {{
                      formatCurrency(
                        selectedCharge.expected_amount
                      )
                    }}
                  </strong>
                </div>

                <div>
                  <span>Vencimento</span>

                  <strong>
                    {{
                      formatDate(
                        selectedCharge.due_date
                      )
                    }}
                  </strong>
                </div>

                <div>
                  <span>Status da cobrança</span>

                  <strong>
                    {{
                      formatChargeStatus(
                        selectedCharge.status
                      ).label
                    }}
                  </strong>
                </div>
              </div>

              <div
                v-if="
                  selectedCharge &&
                  !chargeAcceptsNewPayment
                "
                class="alert alert-warning"
              >
                Esta cobrança está
                {{
                  selectedCharge.status ===
                  "cancelled"
                    ? "cancelada"
                    : "totalmente paga"
                }}
                e não aceita novos pagamentos.
              </div>

              <div class="mt-4">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="!canSubmit"
                >
                  {{
                    saving
                      ? "Salvando..."
                      : "Salvar pagamento"
                  }}
                </button>

                <RouterLink
                  to="/payments"
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
.payment-form__label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6c757d;
}

.payment-form__label span {
  color: var(--primary);
}

.payment-form__input {
  min-height: 3rem;
}

.payment-form__identifier {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f8f9fa;
}

.payment-form__identifier strong {
  color: var(--primary);
  font-size: 1.25rem;
}

.payment-form__identifier small {
  width: 100%;
  color: #6c757d;
}

.payment-form__summary {
  display: grid;
  grid-template-columns:
    repeat(5, minmax(0, 1fr));
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f8f9fa;
}

.payment-form__summary div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.payment-form__summary span {
  color: #6c757d;
  font-size: 0.8125rem;
}

.payment-form__summary strong {
  color: #343a40;
  font-size: 1rem;
}

@media (max-width: 1199.98px) {
  .payment-form__summary {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 767.98px) {
  .payment-form__summary {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 575.98px) {
  .payment-form__summary {
    grid-template-columns: 1fr;
  }
}
</style>
