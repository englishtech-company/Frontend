<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
} from "vue";
import { RouterLink } from "vue-router";
import StudentPaymentDetailsModal from "@/components/admin/StudentPaymentDetailsModal.vue";
import { usePermissions } from "@/composables/usePermissions";
import {
  formatChargeStatus,
  formatCurrency,
  formatDate,
  formatDateTime,
  getPaymentCharge,
} from "@/lib/finance/format";
import { listPayments } from "@/lib/payments";
import type {
  Payment,
} from "@/lib/types";

const props = defineProps<{
  studentId: number;
}>();

const {
  canViewPayments,
  canCreatePayments,
  canUpdatePayments,
} = usePermissions();

const payments = ref<Payment[]>([]);
const selectedPayment = ref<Payment | null>(
  null
);

const loading = ref(true);
const error = ref("");

const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const showActions = computed(
  () =>
    canViewPayments.value ||
    canUpdatePayments.value
);

function getChargeStatus(
  payment: Payment
) {
  const charge = getPaymentCharge(payment);

  return charge
    ? formatChargeStatus(charge.status)
    : null;
}

function openPaymentDetails(
  payment: Payment
) {
  selectedPayment.value = payment;
}

async function loadPayments() {
  if (!canViewPayments.value) {
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listPayments({
      page: page.value,
      limit: 10,
      studentId: props.studentId,
    });

    payments.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar o histórico de pagamentos.";
  } finally {
    loading.value = false;
  }
}

async function goToPage(nextPage: number) {
  if (
    nextPage < 1 ||
    nextPage > lastPage.value ||
    nextPage === page.value
  ) {
    return;
  }

  page.value = nextPage;

  await loadPayments();
}

onMounted(loadPayments);
</script>

<template>
  <div class="student-payments pt-4 pb-3">
    <div
      v-if="!canViewPayments"
      class="alert alert-warning mb-0"
    >
      Você não tem permissão para visualizar os
      pagamentos deste aluno.
    </div>

    <template v-else>
      <div
        class="student-payments__heading"
      >
        <div>
          <h4 class="text-primary mb-1">
            Histórico de pagamentos
          </h4>

          <p class="text-muted mb-0">
            Pagamentos registrados nas cobranças
            deste aluno.
          </p>
        </div>

        <RouterLink
          v-if="canCreatePayments"
          to="/payments/create"
          class="btn btn-primary"
        >
          <i class="la la-plus me-1"></i>
          Novo pagamento
        </RouterLink>
      </div>

      <div
        v-if="error"
        class="alert alert-danger"
      >
        {{ error }}
      </div>

      <div
        v-if="loading"
        class="text-center py-5"
      >
        Carregando pagamentos...
      </div>

      <div
        v-else-if="payments.length === 0"
        class="alert alert-light border mb-0"
      >
        Nenhum pagamento foi registrado para este
        aluno.
      </div>

      <template v-else>
        <div class="student-payments__summary">
          <div>
            <span>Pagamentos registrados</span>
            <strong>{{ total }}</strong>
          </div>

          <div>
            <span>Último pagamento</span>
            <strong>
              {{
                formatDateTime(
                  payments[0]?.paid_at
                )
              }}
            </strong>
          </div>
        </div>

        <div class="table-responsive">
          <table
            class="table table-hover align-middle"
          >
            <thead>
              <tr>
                <th class="payment-column">
                  Pagamento
                </th>

                <th class="amount-column">
                  Valor
                </th>

                <th class="charge-column">
                  Cobrança
                </th>

                <th class="status-column">
                  Status
                </th>

                <th class="receipt-column">
                  Comprovante
                </th>

                <th
                  v-if="showActions"
                  class="actions-column"
                >
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="payment in payments"
                :key="payment.id"
              >
                <td>
                  <button
                    type="button"
                    class="student-payments__payment"
                    :title="`Ver detalhes do pagamento ${payment.id}`"
                    @click="
                      openPaymentDetails(payment)
                    "
                  >
                    #{{ payment.id }}
                  </button>

                  <div class="small text-muted mt-1">
                    {{
                      formatDateTime(
                        payment.paid_at
                      )
                    }}
                  </div>
                </td>

                <td class="text-nowrap">
                  <strong>
                    {{
                      formatCurrency(
                        payment.amount
                      )
                    }}
                  </strong>
                </td>

                <td>
                  <template
                    v-if="getPaymentCharge(payment)"
                  >
                    <strong>
                      #{{
                        getPaymentCharge(payment)!
                          .id
                      }}
                    </strong>

                    <div
                      class="small text-muted mt-1"
                    >
                      Vence em
                      {{
                        formatDate(
                          getPaymentCharge(
                            payment
                          )!.due_date
                        )
                      }}
                    </div>
                  </template>

                  <span
                    v-else
                    class="text-muted"
                  >
                    Indisponível
                  </span>
                </td>

                <td>
                  <span
                    v-if="getChargeStatus(payment)"
                    class="badge"
                    :class="
                      getChargeStatus(payment)!.class
                    "
                  >
                    {{
                      getChargeStatus(payment)!
                        .label
                    }}
                  </span>

                  <span
                    v-else
                    class="text-muted"
                  >
                    —
                  </span>
                </td>

                <td>
                  <a
                    v-if="payment.receipt_url"
                    :href="payment.receipt_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-xs btn-outline-primary"
                  >
                    Abrir
                  </a>

                  <span
                    v-else
                    class="text-muted small"
                  >
                    Não informado
                  </span>
                </td>

                <td
                  v-if="showActions"
                  class="actions-column"
                >
                  <div
                    class="d-flex flex-nowrap gap-1"
                  >
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-primary"
                      title="Ver detalhes"
                      :aria-label="`Ver pagamento ${payment.id}`"
                      @click="
                        openPaymentDetails(
                          payment
                        )
                      "
                    >
                      <i class="la la-eye"></i>
                    </button>

                    <RouterLink
                      v-if="canUpdatePayments"
                      :to="`/payments/${payment.id}/edit`"
                      class="btn btn-sm btn-outline-secondary"
                      title="Editar pagamento"
                      :aria-label="`Editar pagamento ${payment.id}`"
                    >
                      <i class="la la-edit"></i>
                    </RouterLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="lastPage > 1"
          class="student-payments__pagination"
        >
          <span class="text-muted small">
            {{ total }} pagamento(s)
          </span>

          <div class="btn-group">
            <button
              type="button"
              class="btn btn-sm btn-outline-primary"
              :disabled="page <= 1"
              @click="goToPage(page - 1)"
            >
              Anterior
            </button>

            <button
              type="button"
              class="btn btn-sm btn-outline-primary"
              disabled
            >
              {{ page }} de {{ lastPage }}
            </button>

            <button
              type="button"
              class="btn btn-sm btn-outline-primary"
              :disabled="page >= lastPage"
              @click="goToPage(page + 1)"
            >
              Próxima
            </button>
          </div>
        </div>
      </template>
    </template>

    <StudentPaymentDetailsModal
      :payment="selectedPayment"
      @close="selectedPayment = null"
    />
  </div>
</template>

<style scoped>
.student-payments__heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.student-payments__summary {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.student-payments__summary > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  background: #f8f8f8;
  border: 1px solid #ececec;
  border-radius: 8px;
}

.student-payments__summary span {
  color: #727272;
  font-size: 0.8125rem;
}

.student-payments__summary strong {
  color: #343a40;
  font-size: 1rem;
}

.student-payments table {
  width: 100%;
  table-layout: fixed;
}

.student-payments td {
  vertical-align: middle;
}

.student-payments .payment-column {
  width: auto;
}

.student-payments .amount-column {
  width: 120px;
}

.student-payments .charge-column {
  width: 145px;
}

.student-payments .status-column {
  width: 105px;
}

.student-payments .receipt-column {
  width: 115px;
}

.student-payments .actions-column {
  width: 96px;
}

.student-payments__payment {
  padding: 0;
  color: var(--primary);
  font: inherit;
  font-weight: 700;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.student-payments__payment:hover,
.student-payments__payment:focus-visible {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.student-payments__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
}

@media (max-width: 767.98px) {
  .student-payments table {
    min-width: 700px;
  }
}

@media (max-width: 575.98px) {
  .student-payments__heading {
    align-items: stretch;
    flex-direction: column;
  }

  .student-payments__heading .btn {
    width: 100%;
  }

  .student-payments__summary {
    grid-template-columns: 1fr;
  }

  .student-payments__pagination {
    align-items: stretch;
    flex-direction: column;
  }

  .student-payments__pagination .btn-group {
    width: 100%;
  }

  .student-payments__pagination .btn {
    flex: 1;
  }
}
</style>
