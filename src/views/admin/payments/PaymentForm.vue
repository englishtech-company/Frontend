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
import { notify, notifySaved } from "@/lib/actionNotification";
import StudentDocumentPreviewModal from "@/components/admin/StudentDocumentPreviewModal.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import {
  getCharge,
  getChargeOptions,
} from "@/lib/charges";
import { confirmDeleteWithReason } from "@/lib/confirm";
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
  getPaymentReceipt,
  updatePayment,
} from "@/lib/payments";
import type {
  PaymentWithReceipt,
} from "@/lib/payments";
import {
  formatPriceForInput,
  formatPriceInput,
  parsePriceInput,
} from "@/lib/plans/format";
import {
  createStudentDocument,
  deleteStudentDocument,
  replaceStudentDocument,
} from "@/lib/studentDocuments";
import type {
  Charge,
  StudentDocument,
} from "@/lib/types";

const route = useRoute();
const router = useRouter();

const {
  canCreatePayments,
  canUpdatePayments,
  canViewStudentDocuments,
  canCreateStudentDocuments,
  canUpdateStudentDocuments,
  canDeleteStudentDocuments,
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

const payment =
  ref<PaymentWithReceipt | null>(null);

const receipt =
  ref<StudentDocument | null>(null);

const receiptFile = ref<File | null>(null);

const previewedReceipt =
  ref<StudentDocument | null>(null);

const receiptInput =
  ref<HTMLInputElement | null>(null);

const selectedCharge = ref<Charge | null>(null);
const chargeOptions = ref<SelectOption[]>([]);

const loading = ref(false);
const loadingCharge = ref(false);
const saving = ref(false);
const deletingReceipt = ref(false);
const error = ref("");
const success = ref("");

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

const canManageReceipt = computed(() =>
  receipt.value
    ? canUpdateStudentDocuments.value
    : canCreateStudentDocuments.value
);

const canSubmit = computed(
  () =>
    hasSavePermission.value &&
    !saving.value &&
    !deletingReceipt.value &&
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

function formatFileSize(size: number): string {
  if (!Number.isFinite(size) || size < 0) {
    return "—";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(
    size /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function validateReceiptFile(
  file: File
): string | null {
  const allowedMimeTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
  ];

  const allowedExtensions = [
    "pdf",
    "png",
    "jpg",
    "jpeg",
  ];

  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() ?? "";

  if (
    !allowedMimeTypes.includes(file.type) ||
    !allowedExtensions.includes(extension)
  ) {
    return "Selecione um arquivo PDF, PNG, JPG ou JPEG.";
  }

  if (file.size > 10 * 1024 * 1024) {
    return "O comprovante não pode ser maior que 10 MB.";
  }

  return null;
}

function handleAmountInput(event: Event) {
  const input = event.target as HTMLInputElement;

  amount.value = formatPriceInput(input.value);
}

function handleReceiptFile(event: Event) {
  error.value = "";
  success.value = "";

  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;

  if (!file) {
    receiptFile.value = null;
    return;
  }

  const validationError =
    validateReceiptFile(file);

  if (validationError) {
    error.value = validationError;
    receiptFile.value = null;
    input.value = "";
    return;
  }

  receiptFile.value = file;
}

function clearReceiptInput() {
  receiptFile.value = null;

  if (receiptInput.value) {
    receiptInput.value.value = "";
  }
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
  success.value = "";

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
  success.value = "";

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
    receipt.value = getPaymentReceipt(
      currentPayment
    );

    chargeId.value = String(
      currentPayment.charge_id
    );

    amount.value = formatPriceForInput(
      currentPayment.amount
    );

    paidAt.value = toLocalDateTimeInput(
      currentPayment.paid_at
    );

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

async function saveReceipt(
  savedPayment: PaymentWithReceipt
): Promise<void> {
  if (!receiptFile.value) {
    return;
  }

  if (!canManageReceipt.value) {
    throw new Error(
      receipt.value
        ? "Você não tem permissão para substituir este comprovante."
        : "Você não tem permissão para enviar comprovantes."
    );
  }

  const paymentCharge =
    getPaymentCharge(savedPayment) ??
    selectedCharge.value;

  if (!paymentCharge) {
    throw new Error(
      "Não foi possível identificar o aluno deste pagamento."
    );
  }

  const savedReceipt = receipt.value
    ? await replaceStudentDocument(
        receipt.value.id,
        receiptFile.value
      )
    : await createStudentDocument({
        student_id: paymentCharge.student_id,
        payment_id: savedPayment.id,
        category: "payment_receipt",
        description: null,
        document: receiptFile.value,
      });

  receipt.value = savedReceipt;
  clearReceiptInput();
}

async function removeReceipt() {
  if (!receipt.value) {
    return;
  }

  error.value = "";
  success.value = "";

  if (!canDeleteStudentDocuments.value) {
    error.value =
      "Você não tem permissão para excluir comprovantes.";
    return;
  }

  const currentReceipt = receipt.value;

  const reason = await confirmDeleteWithReason({
    entityLabel: "comprovante",
    itemName: currentReceipt.original_name,
    message:
      "O arquivo será removido do armazenamento, mas o pagamento e os metadados de auditoria serão preservados.",
    reasonLabel: "Motivo da exclusão",
    reasonPlaceholder:
      "Exemplo: comprovante anexado ao pagamento incorreto.",
  });

  if (!reason) {
    return;
  }

  deletingReceipt.value = true;

  try {
    await deleteStudentDocument(
      currentReceipt.id,
      reason
    );

    if (
      previewedReceipt.value?.id ===
      currentReceipt.id
    ) {
      previewedReceipt.value = null;
    }

    receipt.value = null;
    clearReceiptInput();

    success.value =
      "Comprovante excluído com sucesso. O pagamento foi preservado.";
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao excluir o comprovante.";
  } finally {
    deletingReceipt.value = false;
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
  success.value = "";

  let savedPayment: PaymentWithReceipt | null =
    null;

  try {
    const data = {
      amount: parsedAmount,
      paid_at: paidAtPayload,
    };

    if (isEdit.value) {
      savedPayment = await updatePayment(
        paymentId.value,
        data
      );
    } else {
      savedPayment = await createPayment({
        charge_id: Number(chargeId.value),
        ...data,
      });
    }

    payment.value = savedPayment;

    try {
      await saveReceipt(savedPayment);
    } catch (receiptException) {
      if (!isEdit.value) {
        await router.replace(
          `/payments/${savedPayment.id}/edit`
        );
      }

      notify.warning(
        receiptException instanceof Error
          ? `Pagamento salvo, mas o comprovante não foi enviado: ${receiptException.message}`
          : "Pagamento salvo, mas o comprovante não foi enviado."
      );
      error.value =
        receiptException instanceof Error
          ? `Pagamento salvo, mas o comprovante não foi enviado: ${receiptException.message}`
          : "Pagamento salvo, mas o comprovante não foi enviado.";

      return;
    }

    notifySaved("Pagamento", isEdit.value);
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

    <div
      v-if="success"
      class="alert alert-success"
    >
      {{ success }}
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
                    for="payment-receipt"
                  >
                    Comprovante privado
                  </label>

                  <input
                    id="payment-receipt"
                    ref="receiptInput"
                    type="file"
                    class="form-control payment-form__input"
                    accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                    :disabled="
                      !canManageReceipt ||
                      saving ||
                      deletingReceipt
                    "
                    @change="handleReceiptFile"
                  />

                  <small class="text-muted">
                    {{
                      receipt
                        ? "Selecione um arquivo somente se desejar substituir o comprovante atual."
                        : "Campo opcional. PDF, PNG ou JPEG, com no máximo 10 MB."
                    }}
                  </small>

                  <div
                    v-if="receiptFile"
                    class="payment-form__selected-file"
                  >
                    <i class="la la-paperclip"></i>
                    {{ receiptFile.name }}
                  </div>
                </div>
              </div>

              <div
                v-if="receipt"
                class="payment-form__receipt mb-4"
              >
                <div
                  class="payment-form__receipt-icon"
                  aria-hidden="true"
                >
                  <i class="la la-file-alt"></i>
                </div>

                <div
                  class="payment-form__receipt-details"
                >
                  <strong>
                    {{ receipt.original_name }}
                  </strong>

                  <span>
                    {{ formatFileSize(receipt.size) }}
                  </span>
                </div>

                <div
                  class="payment-form__receipt-actions"
                >
                  <button
                    v-if="canViewStudentDocuments"
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    :disabled="deletingReceipt"
                    @click="
                      previewedReceipt = receipt
                    "
                  >
                    <i class="la la-eye me-1"></i>
                    Visualizar
                  </button>

                  <button
                    v-if="canDeleteStudentDocuments"
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    :disabled="
                      deletingReceipt || saving
                    "
                    @click="removeReceipt"
                  >
                    <span
                      v-if="deletingReceipt"
                      class="spinner-border spinner-border-sm me-1"
                      aria-hidden="true"
                    ></span>

                    <i
                      v-else
                      class="la la-trash me-1"
                    ></i>

                    {{
                      deletingReceipt
                        ? "Excluindo..."
                        : "Excluir"
                    }}
                  </button>
                </div>
              </div>

              <div
                v-else-if="payment?.receipt_url"
                class="payment-form__legacy-receipt mb-4"
              >
                <div>
                  <strong>
                    Comprovante legado
                  </strong>

                  <span>
                    Este registro utiliza uma URL
                    cadastrada anteriormente.
                  </span>
                </div>

                <a
                  :href="payment.receipt_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-sm btn-outline-primary"
                >
                  <i
                    class="la la-external-link-alt me-1"
                  ></i>
                  Abrir URL
                </a>
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

    <StudentDocumentPreviewModal
      :document="previewedReceipt"
      @close="previewedReceipt = null"
    />
  </div>
</template>

<style scoped>
.payment-form__label {
  display: block;
  margin-bottom: 0.5rem;
  color: #6c757d;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.payment-form__label span {
  color: var(--primary);
}

.payment-form__input {
  min-height: 3rem;
}

.payment-form__selected-file {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
  color: var(--primary);
  font-size: 0.8125rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.payment-form__identifier {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 1rem;
  padding: 1rem 1.25rem;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.payment-form__identifier strong {
  color: var(--primary);
  font-size: 1.25rem;
}

.payment-form__identifier small {
  width: 100%;
  color: #6c757d;
}

.payment-form__receipt,
.payment-form__legacy-receipt {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.payment-form__receipt-icon {
  display: flex;
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 1.25rem;
  background: #f7edf1;
  border-radius: 0.5rem;
}

.payment-form__receipt-details,
.payment-form__legacy-receipt > div {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 0.2rem;
}

.payment-form__receipt-details strong {
  overflow: hidden;
  color: var(--primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.payment-form__receipt-details span,
.payment-form__legacy-receipt span {
  color: #6c757d;
  font-size: 0.8125rem;
}

.payment-form__receipt-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
}

.payment-form__summary {
  display: grid;
  grid-template-columns:
    repeat(5, minmax(0, 1fr));
  gap: 1rem;
  padding: 1.25rem;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
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

  .payment-form__receipt,
  .payment-form__legacy-receipt {
    align-items: stretch;
    flex-direction: column;
  }

  .payment-form__receipt-actions {
    flex-direction: column;
  }

  .payment-form__receipt .btn,
  .payment-form__legacy-receipt .btn {
    width: 100%;
  }
}
</style>
