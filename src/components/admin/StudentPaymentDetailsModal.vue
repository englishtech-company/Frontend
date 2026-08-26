<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  watch,
} from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import {
  formatChargeStatus,
  formatCurrency,
  formatDate,
  formatDateTime,
  getPaymentCharge,
} from "@/lib/finance/format";
import type { Payment } from "@/lib/types";

const props = defineProps<{
  payment: Payment | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const {
  canUpdatePayments,
} = usePermissions();

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

function restorePageScroll() {
  window.document.body.style.overflow = "";
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

watch(
  () => props.payment,
  (payment) => {
    if (payment) {
      window.document.body.style.overflow =
        "hidden";
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
            <div>
              <h5 class="mb-1">Comprovante</h5>
              <p class="text-muted mb-0">
                Documento associado ao registro do
                pagamento.
              </p>
            </div>

            <a
              v-if="payment.receipt_url"
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

            <span
              v-else
              class="badge badge-light text-dark"
            >
              Não informado
            </span>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e7e7e7;
  border-radius: 8px;
}

.student-payment-modal__receipt .badge-light {
  background-color: #f2f2f2;
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

  .student-payment-modal__receipt {
    align-items: flex-start;
    flex-direction: column;
  }

  .student-payment-modal__footer {
    flex-direction: column-reverse;
  }

  .student-payment-modal__footer .btn {
    width: 100%;
  }
}
</style>
