<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDeleteWithReason } from "@/lib/confirm";
import {
  formatChargeStatus,
  formatCurrency,
  formatDate,
  formatDateTime,
  getPaymentCharge,
} from "@/lib/finance/format";
import {
  getPaymentReceipt,
} from "@/lib/payments";
import type {
  PaymentWithReceipt,
} from "@/lib/payments";
import {
  createStudentDocument,
  deleteStudentDocument,
  replaceStudentDocument,
} from "@/lib/studentDocuments";
import type {
  StudentDocument,
} from "@/lib/types";

const props = defineProps<{
  payment: PaymentWithReceipt | null;
}>();

const emit = defineEmits<{
  close: [];
  receiptUpdated: [receipt: StudentDocument];
  receiptDeleted: [paymentId: number];
  previewReceipt: [receipt: StudentDocument];
}>();

const {
  canUpdatePayments,
  canViewStudentDocuments,
  canCreateStudentDocuments,
  canUpdateStudentDocuments,
  canDeleteStudentDocuments,
} = usePermissions();

const receipt = ref<StudentDocument | null>(
  null
);

const receiptInput = ref<HTMLInputElement | null>(
  null
);

const receiptActionLoading = ref(false);
const receiptError = ref("");
const receiptSuccess = ref("");

const charge = computed(() =>
  props.payment
    ? getPaymentCharge(props.payment)
    : null
);

const chargeStatus = computed(() =>
  charge.value
    ? formatChargeStatus(charge.value.status)
    : null
);

const canManageReceipt = computed(() =>
  receipt.value
    ? canUpdateStudentDocuments.value
    : canCreateStudentDocuments.value
);

function restorePageScroll() {
  window.document.body.style.overflow = "";
}

function keepPageScrollLocked() {
  if (props.payment) {
    window.document.body.style.overflow =
      "hidden";
  }
}

function closeModal() {
  emit("close");
}

function handleKeydown(event: KeyboardEvent) {
  if (
    event.key === "Escape" &&
    props.payment
  ) {
    closeModal();
  }
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

function chooseReceiptFile() {
  receiptError.value = "";
  receiptSuccess.value = "";

  if (!canManageReceipt.value) {
    receiptError.value = receipt.value
      ? "Você não tem permissão para substituir este comprovante."
      : "Você não tem permissão para enviar comprovantes.";

    return;
  }

  if (receiptInput.value) {
    receiptInput.value.value = "";
    receiptInput.value.click();
  }
}

function requestReceiptPreview() {
  if (
    !receipt.value ||
    !canViewStudentDocuments.value
  ) {
    return;
  }

  emit("previewReceipt", receipt.value);
}

async function handleReceiptFile(
  event: Event
) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;

  if (!file || !props.payment) {
    return;
  }

  const validationError =
    validateReceiptFile(file);

  if (validationError) {
    receiptError.value = validationError;
    input.value = "";
    return;
  }

  const currentCharge = charge.value;

  if (!currentCharge) {
    receiptError.value =
      "Não foi possível identificar o aluno deste pagamento.";
    input.value = "";
    return;
  }

  receiptActionLoading.value = true;
  receiptError.value = "";
  receiptSuccess.value = "";

  try {
    const updatedReceipt = receipt.value
      ? await replaceStudentDocument(
          receipt.value.id,
          file
        )
      : await createStudentDocument({
          student_id: currentCharge.student_id,
          payment_id: props.payment.id,
          category: "payment_receipt",
          description: null,
          document: file,
        });

    const action = receipt.value
      ? "substituído"
      : "enviado";

    receipt.value = updatedReceipt;

    emit("receiptUpdated", updatedReceipt);

    receiptSuccess.value =
      `Comprovante ${action} com sucesso.`;
  } catch (exception) {
    receiptError.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao salvar o comprovante.";
  } finally {
    receiptActionLoading.value = false;
    input.value = "";
  }
}

async function removeReceipt() {
  if (
    !receipt.value ||
    !props.payment
  ) {
    return;
  }

  receiptError.value = "";
  receiptSuccess.value = "";

  if (!canDeleteStudentDocuments.value) {
    receiptError.value =
      "Você não tem permissão para excluir comprovantes.";
    return;
  }

  const currentReceipt = receipt.value;
  const currentPaymentId = props.payment.id;

  const reason = await confirmDeleteWithReason({
    entityLabel: "comprovante",
    itemName: currentReceipt.original_name,
    message:
      "O arquivo será removido do armazenamento, mas o pagamento e os metadados de auditoria serão preservados.",
    reasonLabel: "Motivo da exclusão",
    reasonPlaceholder:
      "Exemplo: comprovante anexado ao pagamento incorreto.",
  });

  keepPageScrollLocked();

  if (!reason) {
    return;
  }

  receiptActionLoading.value = true;

  try {
    await deleteStudentDocument(
      currentReceipt.id,
      reason
    );

    receipt.value = null;

    if (receiptInput.value) {
      receiptInput.value.value = "";
    }

    emit(
      "receiptDeleted",
      currentPaymentId
    );

    receiptSuccess.value =
      "Comprovante excluído com sucesso. O pagamento foi preservado.";
  } catch (exception) {
    receiptError.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao excluir o comprovante.";
  } finally {
    receiptActionLoading.value = false;
  }
}

watch(
  () => props.payment,
  (payment) => {
    receipt.value = payment
      ? getPaymentReceipt(payment)
      : null;

    receiptError.value = "";
    receiptSuccess.value = "";

    if (payment) {
      keepPageScrollLocked();
      return;
    }

    restorePageScroll();
  }
);

onMounted(() => {
  window.addEventListener(
    "keydown",
    handleKeydown
  );
});

onBeforeUnmount(() => {
  window.removeEventListener(
    "keydown",
    handleKeydown
  );

  restorePageScroll();
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="payment"
      class="student-payment-modal"
      role="presentation"
      @click.self="closeModal"
    >
      <section
        class="student-payment-modal__dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="`Detalhes do pagamento ${payment.id}`"
      >
        <header
          class="student-payment-modal__header"
        >
          <div>
            <span
              class="student-payment-modal__eyebrow"
            >
              Histórico financeiro
            </span>

            <h4 class="mb-0">
              Pagamento #{{ payment.id }}
            </h4>
          </div>

          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            title="Fechar detalhes"
            aria-label="Fechar detalhes"
            @click="closeModal"
          >
            <i class="la la-times"></i>
          </button>
        </header>

        <div class="student-payment-modal__body">
          <div
            class="student-payment-modal__amount"
          >
            <span>Valor pago</span>

            <strong>
              {{ formatCurrency(payment.amount) }}
            </strong>

            <small>
              Registrado em
              {{ formatDateTime(payment.paid_at) }}
            </small>
          </div>

          <div
            class="student-payment-modal__details"
          >
            <div>
              <span>Cobrança</span>

              <strong>
                {{
                  charge
                    ? `#${charge.id}`
                    : "Indisponível"
                }}
              </strong>
            </div>

            <div>
              <span>Valor esperado</span>

              <strong>
                {{
                  charge
                    ? formatCurrency(
                        charge.expected_amount
                      )
                    : "—"
                }}
              </strong>
            </div>

            <div>
              <span>Vencimento</span>

              <strong>
                {{
                  charge
                    ? formatDate(charge.due_date)
                    : "—"
                }}
              </strong>
            </div>

            <div>
              <span>Status da cobrança</span>

              <strong>
                <span
                  v-if="chargeStatus"
                  class="badge"
                  :class="chargeStatus.class"
                >
                  {{ chargeStatus.label }}
                </span>

                <span v-else>—</span>
              </strong>
            </div>

            <div>
              <span>Matrícula</span>

              <strong>
                {{
                  charge
                    ? `#${charge.enrollment_id}`
                    : "—"
                }}
              </strong>
            </div>

            <div>
              <span>Registrado no sistema</span>

              <strong>
                {{
                  formatDateTime(
                    payment.created_at
                  )
                }}
              </strong>
            </div>
          </div>

          <div
            class="student-payment-modal__receipt"
          >
            <div
              class="student-payment-modal__receipt-heading"
            >
              <div>
                <h5 class="mb-1">Comprovante</h5>

                <p class="text-muted mb-0">
                  Documento privado associado ao
                  pagamento.
                </p>
              </div>

              <div
                class="student-payment-modal__receipt-heading-actions"
              >
                <button
                  v-if="canManageReceipt"
                  type="button"
                  class="btn btn-sm btn-outline-secondary"
                  :disabled="receiptActionLoading"
                  @click="chooseReceiptFile"
                >
                  <span
                    v-if="receiptActionLoading"
                    class="spinner-border spinner-border-sm me-1"
                    aria-hidden="true"
                  ></span>

                  <i
                    v-else
                    class="la me-1"
                    :class="
                      receipt
                        ? 'la-sync'
                        : 'la-upload'
                    "
                  ></i>

                  {{
                    receipt
                      ? "Substituir"
                      : "Enviar comprovante"
                  }}
                </button>

                <button
                  v-if="
                    receipt &&
                    canDeleteStudentDocuments
                  "
                  type="button"
                  class="btn btn-sm btn-outline-danger"
                  :disabled="receiptActionLoading"
                  @click="removeReceipt"
                >
                  <i class="la la-trash me-1"></i>
                  Excluir
                </button>
              </div>
            </div>

            <input
              ref="receiptInput"
              type="file"
              class="d-none"
              accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
              @change="handleReceiptFile"
            />

            <div
              v-if="receiptError"
              class="alert alert-danger mt-3 mb-0"
            >
              {{ receiptError }}
            </div>

            <div
              v-if="receiptSuccess"
              class="alert alert-success mt-3 mb-0"
            >
              {{ receiptSuccess }}
            </div>

            <div
              v-if="receipt"
              class="student-payment-modal__receipt-document"
            >
              <div
                class="student-payment-modal__receipt-icon"
                aria-hidden="true"
              >
                <i class="la la-file-alt"></i>
              </div>

              <div
                class="student-payment-modal__receipt-details"
              >
                <button
                  v-if="canViewStudentDocuments"
                  type="button"
                  class="student-payment-modal__receipt-name"
                  :title="receipt.original_name"
                  @click="requestReceiptPreview"
                >
                  {{ receipt.original_name }}
                </button>

                <strong
                  v-else
                  class="student-payment-modal__receipt-name-static"
                >
                  {{ receipt.original_name }}
                </strong>

                <span>
                  {{ formatFileSize(receipt.size) }}
                </span>
              </div>

              <button
                v-if="canViewStudentDocuments"
                type="button"
                class="btn btn-sm btn-outline-primary"
                :disabled="receiptActionLoading"
                @click="requestReceiptPreview"
              >
                <i class="la la-eye me-1"></i>
                Visualizar
              </button>
            </div>

            <div
              v-else-if="payment.receipt_url"
              class="student-payment-modal__legacy-receipt"
            >
              <span class="text-muted">
                Comprovante legado por URL
              </span>

              <a
                :href="payment.receipt_url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-sm btn-outline-primary"
              >
                <i
                  class="la la-external-link-alt me-1"
                ></i>
                Abrir comprovante
              </a>
            </div>

            <div
              v-else
              class="student-payment-modal__empty-receipt"
            >
              Nenhum comprovante foi vinculado a este
              pagamento.
            </div>
          </div>
        </div>

        <footer
          class="student-payment-modal__footer"
        >
          <button
            type="button"
            class="btn btn-light"
            @click="closeModal"
          >
            Fechar
          </button>

          <RouterLink
            v-if="canUpdatePayments"
            :to="`/payments/${payment.id}/edit`"
            class="btn btn-primary"
          >
            <i class="la la-edit me-1"></i>
            Editar pagamento
          </RouterLink>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.student-payment-modal {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(20, 20, 20, 0.72);
  backdrop-filter: blur(2px);
}

.student-payment-modal__dialog {
  width: min(760px, 92vw);
  max-height: 90vh;
  overflow: auto;
  background: #fff;
  border-radius: 12px;
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.35);
}

.student-payment-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e5e5;
}

.student-payment-modal__eyebrow {
  display: block;
  margin-bottom: 4px;
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.student-payment-modal__body {
  padding: 24px;
}

.student-payment-modal__amount {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 20px;
  margin-bottom: 20px;
  background: #f7edf1;
  border-radius: 10px;
}

.student-payment-modal__amount span,
.student-payment-modal__amount small {
  color: #727272;
}

.student-payment-modal__amount strong {
  color: var(--primary);
  font-size: 1.75rem;
  line-height: 1.2;
}

.student-payment-modal__details {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.student-payment-modal__details > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  padding: 14px 16px;
  border: 1px solid #e7e7e7;
  border-radius: 8px;
}

.student-payment-modal__details span {
  color: #727272;
  font-size: 0.8125rem;
}

.student-payment-modal__details strong {
  color: #343a40;
  overflow-wrap: anywhere;
}

.student-payment-modal__receipt {
  padding: 16px;
  border: 1px solid #e7e7e7;
  border-radius: 8px;
}

.student-payment-modal__receipt-heading,
.student-payment-modal__legacy-receipt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.student-payment-modal__receipt-heading-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.student-payment-modal__receipt-document {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 14px;
  margin-top: 16px;
  background: #f8f8f8;
  border-radius: 8px;
}

.student-payment-modal__receipt-icon {
  display: flex;
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 1.25rem;
  background: #f7edf1;
  border-radius: 8px;
}

.student-payment-modal__receipt-details {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}

.student-payment-modal__receipt-details > span {
  color: #727272;
  font-size: 0.8125rem;
}

.student-payment-modal__receipt-name,
.student-payment-modal__receipt-name-static {
  min-width: 0;
  padding: 0;
  overflow: hidden;
  color: var(--primary);
  font: inherit;
  font-weight: 700;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: transparent;
  border: 0;
}

.student-payment-modal__receipt-name {
  cursor: pointer;
}

.student-payment-modal__receipt-name:hover,
.student-payment-modal__receipt-name:focus-visible {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.student-payment-modal__legacy-receipt {
  margin-top: 16px;
}

.student-payment-modal__empty-receipt {
  padding: 14px;
  margin-top: 16px;
  color: #727272;
  text-align: center;
  background: #f8f8f8;
  border-radius: 8px;
}

.student-payment-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid #e5e5e5;
}

@media (max-width: 575.98px) {
  .student-payment-modal {
    padding: 8px;
  }

  .student-payment-modal__dialog {
    width: 100%;
    max-height: 94vh;
  }

  .student-payment-modal__header,
  .student-payment-modal__body,
  .student-payment-modal__footer {
    padding: 16px;
  }

  .student-payment-modal__details {
    grid-template-columns: 1fr;
  }

  .student-payment-modal__receipt-heading,
  .student-payment-modal__legacy-receipt,
  .student-payment-modal__receipt-document {
    align-items: stretch;
    flex-direction: column;
  }

  .student-payment-modal__receipt-heading-actions {
    width: 100%;
    flex-direction: column;
  }

  .student-payment-modal__receipt-heading .btn,
  .student-payment-modal__legacy-receipt .btn,
  .student-payment-modal__receipt-document .btn {
    width: 100%;
  }

  .student-payment-modal__footer {
    flex-direction: column-reverse;
  }

  .student-payment-modal__footer .btn {
    width: 100%;
  }
}
</style>
