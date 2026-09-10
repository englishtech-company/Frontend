<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  ref,
} from "vue";
import { RouterLink } from "vue-router";
import StudentDocumentPreviewModal from "@/components/admin/StudentDocumentPreviewModal.vue";
import StudentPaymentDetailsModal from "@/components/admin/StudentPaymentDetailsModal.vue";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { countActiveFilters } from "@/lib/filters/query";
import {
  formatChargeStatus,
  formatCurrency,
  formatDateTime,
  getChargeStudent,
  getPaymentCharge,
} from "@/lib/finance/format";
import {
  getPaymentReceipt,
  listPayments,
} from "@/lib/payments";
import type { PaymentWithReceipt } from "@/lib/payments";
import type { StudentDocument } from "@/lib/types";

const {
  canViewPayments,
  canCreatePayments,
} = usePermissions();

const payments = ref<PaymentWithReceipt[]>([]);
const selectedPayment =
  ref<PaymentWithReceipt | null>(null);

const loading = ref(true);
const error = ref("");

const previewedReceipt =
  ref<StudentDocument | null>(null);

const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const idFilter = ref("");
const studentNameFilter = ref("");
const chargeIdFilter = ref("");
const amountFilter = ref("");
const paidAtFrom = ref("");
const paidAtTo = ref("");
const chargeStatusFilter = ref<string | number | null>(null);
const hasReceiptFilter = ref<string | number | null>(null);

const chargeStatusOptions: SelectOption[] = [
  { value: "open", label: "Aberta" },
  { value: "paid", label: "Paga" },
  { value: "partial", label: "Parcial" },
  { value: "overdue", label: "Atrasada" },
  { value: "cancelled", label: "Cancelada" },
];

const hasReceiptOptions: SelectOption[] = [
  { value: "true", label: "Sim" },
  { value: "false", label: "Não" },
];

const activeFilterCount = computed(() =>
  countActiveFilters([
    idFilter.value,
    studentNameFilter.value,
    chargeIdFilter.value,
    amountFilter.value,
    paidAtFrom.value,
    paidAtTo.value,
    chargeStatusFilter.value,
    hasReceiptFilter.value,
  ])
);

const showActions = computed(
  () => canViewPayments.value
);

function getPaymentStudentName(
  payment: PaymentWithReceipt
): string {
  const charge = getPaymentCharge(payment);

  if (!charge) {
    return "Aluno indisponível";
  }

  return (
    getChargeStudent(charge)?.name ??
    "Aluno indisponível"
  );
}

function getPaymentStudentEmail(
  payment: PaymentWithReceipt
): string {
  const charge = getPaymentCharge(payment);

  if (!charge) {
    return "Sem e-mail";
  }

  return (
    getChargeStudent(charge)?.email ??
    "Sem e-mail"
  );
}

function openPaymentDetails(
  payment: PaymentWithReceipt
) {
  selectedPayment.value = payment;
}

function attachReceipt(
  payment: PaymentWithReceipt,
  receipt: StudentDocument
): PaymentWithReceipt {
  return {
    ...payment,
    receipt_document: receipt,
    relationships: {
      ...(payment.relationships ?? {}),
      receipt_document: receipt,
    },
  };
}

function detachReceipt(
  payment: PaymentWithReceipt
): PaymentWithReceipt {
  return {
    ...payment,
    receipt_document: null,
    relationships: {
      ...(payment.relationships ?? {}),
      receipt_document: null,
    },
  };
}

function handleReceiptUpdated(
  receipt: StudentDocument
) {
  if (!receipt.payment_id) {
    return;
  }

  payments.value = payments.value.map(
    (payment) =>
      payment.id === receipt.payment_id
        ? attachReceipt(payment, receipt)
        : payment
  );

  if (
    selectedPayment.value?.id ===
    receipt.payment_id
  ) {
    selectedPayment.value = attachReceipt(
      selectedPayment.value,
      receipt
    );
  }
}

function handleReceiptDeleted(
  paymentId: number
) {
  payments.value = payments.value.map(
    (payment) =>
      payment.id === paymentId
        ? detachReceipt(payment)
        : payment
  );

  if (
    selectedPayment.value?.id === paymentId
  ) {
    selectedPayment.value = detachReceipt(
      selectedPayment.value
    );
  }
}

async function openReceiptPreview(
  receipt: StudentDocument
) {
  selectedPayment.value = null;

  await nextTick();

  previewedReceipt.value = receipt;
}

async function loadPayments() {
  if (!canViewPayments.value) {
    error.value =
      "Você não tem permissão para listar pagamentos.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listPayments({
      page: page.value,
      id: idFilter.value.trim() ? Number(idFilter.value) : undefined,
      studentName: studentNameFilter.value.trim() || undefined,
      chargeId: chargeIdFilter.value.trim()
        ? Number(chargeIdFilter.value)
        : undefined,
      amount: amountFilter.value.trim() || undefined,
      paidAtFrom: paidAtFrom.value || undefined,
      paidAtTo: paidAtTo.value || undefined,
      chargeStatus: chargeStatusFilter.value
        ? String(chargeStatusFilter.value)
        : undefined,
      hasReceipt:
        hasReceiptFilter.value === "true"
          ? true
          : hasReceiptFilter.value === "false"
            ? false
            : undefined,
    });

    payments.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar pagamentos.";
  } finally {
    loading.value = false;
  }
}

function handleFilter() {
  page.value = 1;
  loadPayments();
}

function clearFilters() {
  idFilter.value = "";
  studentNameFilter.value = "";
  chargeIdFilter.value = "";
  amountFilter.value = "";
  paidAtFrom.value = "";
  paidAtTo.value = "";
  chargeStatusFilter.value = null;
  hasReceiptFilter.value = null;
  page.value = 1;
  loadPayments();
}

function goToPage(nextPage: number) {
  if (
    nextPage < 1 ||
    nextPage > lastPage.value
  ) {
    return;
  }

  page.value = nextPage;
  loadPayments();
}

onMounted(loadPayments);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Pagamentos</h4>

          <p class="mb-0">
            Registre e acompanhe os pagamentos das
            cobranças
          </p>
        </div>
      </div>

      <div
        v-if="canCreatePayments"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink
          to="/payments/create"
          class="btn btn-primary"
        >
          <i class="la la-plus me-1"></i>
          Novo pagamento
        </RouterLink>
      </div>
    </div>

    <div
      v-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>

    <FilterPanel
      :active-count="activeFilterCount"
      @filter="handleFilter"
      @clear="clearFilters"
    >
      <div class="row g-3">
        <div class="col-md-6 col-lg-3">
          <FilterField label="Pagamento" id="payment-filter-id" hint="ID do pagamento">
            <input
              id="payment-filter-id"
              v-model="idFilter"
              type="number"
              min="1"
              class="form-control"
              placeholder="Ex.: 12"
              @keyup.enter="handleFilter"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Aluno" id="payment-filter-student">
            <input
              id="payment-filter-student"
              v-model="studentNameFilter"
              type="text"
              class="form-control"
              placeholder="Nome do aluno..."
              @keyup.enter="handleFilter"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Cobrança" id="payment-filter-charge" hint="ID da cobrança">
            <input
              id="payment-filter-charge"
              v-model="chargeIdFilter"
              type="number"
              min="1"
              class="form-control"
              placeholder="Ex.: 45"
              @keyup.enter="handleFilter"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Valor pago" id="payment-filter-amount">
            <input
              id="payment-filter-amount"
              v-model="amountFilter"
              type="text"
              class="form-control"
              placeholder="Ex.: 350.00"
              @keyup.enter="handleFilter"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Data pagamento desde" id="payment-filter-paid-from">
            <input
              id="payment-filter-paid-from"
              v-model="paidAtFrom"
              type="date"
              class="form-control"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Data pagamento até" id="payment-filter-paid-to">
            <input
              id="payment-filter-paid-to"
              v-model="paidAtTo"
              type="date"
              class="form-control"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Status da cobrança" id="payment-filter-charge-status">
            <SingleSelect
              id="payment-filter-charge-status"
              v-model="chargeStatusFilter"
              :options="chargeStatusOptions"
              placeholder="Todos os status"
              :searchable="false"
              aria-label="Filtrar pelo status da cobrança"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Comprovante" id="payment-filter-receipt">
            <SingleSelect
              id="payment-filter-receipt"
              v-model="hasReceiptFilter"
              :options="hasReceiptOptions"
              placeholder="Todos"
              :searchable="false"
              aria-label="Filtrar por comprovante"
            />
          </FilterField>
        </div>
      </div>
    </FilterPanel>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header payment-list__header">
            <h4 class="card-title mb-0">
              Lista de pagamentos ({{ total }})
            </h4>
          </div>

          <div class="card-body">
            <div
              v-if="loading"
              class="text-center py-4"
            >
              Carregando...
            </div>

            <div
              v-else
              class="table-responsive"
            >
              <table
                class="table table-striped table-responsive-sm payment-list__table"
              >
                <colgroup>
                  <col class="payment-list__payment-column" />
                  <col class="payment-list__student-column" />
                  <col class="payment-list__charge-column" />
                  <col class="payment-list__amount-column" />
                  <col class="payment-list__date-column" />
                  <col class="payment-list__status-column" />
                  <col class="payment-list__receipt-column" />
                  <col class="payment-list__actions-column" />
                </colgroup>

                <thead>
                  <tr>
                    <th>
                      Pagamento
                    </th>

                    <th>Aluno</th>

                    <th>
                      Cobrança
                    </th>

                    <th>
                      Valor pago
                    </th>

                    <th>
                      Data do pagamento
                    </th>

                    <th>Status da cobrança</th>

                    <th>Comprovante</th>

                    <th
                      v-if="showActions"
                      class="text-end"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-if="payments.length === 0">
                    <td
                      :colspan="showActions ? 8 : 7"
                      class="text-center text-muted"
                    >
                      Nenhum pagamento encontrado
                    </td>
                  </tr>

                  <tr
                    v-for="payment in payments"
                    :key="payment.id"
                  >
                    <td class="text-nowrap">
                      <strong>
                        #{{ payment.id }}
                      </strong>
                    </td>

                    <td class="payment-list__student-cell">
                      <strong>
                        {{
                          getPaymentStudentName(
                            payment
                          )
                        }}
                      </strong>

                      <div class="small text-muted">
                        {{
                          getPaymentStudentEmail(
                            payment
                          )
                        }}
                      </div>
                    </td>

                    <td class="text-nowrap">
                      <strong>
                        {{
                          getPaymentCharge(payment)
                            ? `#${
                                getPaymentCharge(
                                  payment
                                )!.id
                              }`
                            : "—"
                        }}
                      </strong>
                    </td>

                    <td class="text-nowrap">
                      {{
                        formatCurrency(
                          payment.amount
                        )
                      }}
                    </td>

                    <td class="text-nowrap">
                      {{
                        formatDateTime(
                          payment.paid_at
                        )
                      }}
                    </td>

                    <td class="text-nowrap">
                      <span
                        v-if="getPaymentCharge(payment)"
                        class="badge"
                        :class="
                          formatChargeStatus(
                            getPaymentCharge(payment)!
                              .status
                          ).class
                        "
                      >
                        {{
                          formatChargeStatus(
                            getPaymentCharge(payment)!
                              .status
                          ).label
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
                      <button
                        v-if="getPaymentReceipt(payment)"
                        type="button"
                        class="btn btn-xs btn-outline-primary text-nowrap"
                        @click="
                          openReceiptPreview(
                            getPaymentReceipt(payment)!
                          )
                        "
                      >
                        <i class="la la-eye me-1"></i>
                        Visualizar
                      </button>

                      <a
                        v-else-if="payment.receipt_url"
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
                      class="text-end text-nowrap"
                    >
                      <button
                        type="button"
                        class="btn btn-xs sharp btn-outline-primary"
                        :aria-label="`Ver detalhes e gerenciar comprovante do pagamento ${payment.id}`"
                        @click="openPaymentDetails(payment)"
                      >
                        <i class="fa fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ListPagination
              :page="page"
              :last-page="lastPage"
              :total="total"
              @update:page="goToPage"
            />
          </div>
        </div>
      </div>
    </div>

    <StudentPaymentDetailsModal
      :payment="selectedPayment"
      @close="selectedPayment = null"
      @receipt-updated="handleReceiptUpdated"
      @receipt-deleted="handleReceiptDeleted"
      @preview-receipt="openReceiptPreview"
    />

    <StudentDocumentPreviewModal
      :document="previewedReceipt"
      @close="previewedReceipt = null"
    />
  </div>
</template>

<style scoped>
.payment-list__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

@media (min-width: 1200px) {
  .payment-list__table {
    width: 100%;
    table-layout: fixed;
  }

  .payment-list__payment-column {
    width: 10%;
  }

  .payment-list__student-column {
    width: 18%;
  }

  .payment-list__charge-column {
    width: 9%;
  }

  .payment-list__amount-column {
    width: 11%;
  }

  .payment-list__date-column {
    width: 15%;
  }

  .payment-list__status-column {
    width: 14%;
  }

  .payment-list__receipt-column {
    width: 15%;
  }

  .payment-list__actions-column {
    width: 8%;
  }

  .payment-list__table th,
  .payment-list__table td {
    padding-right: 0.5rem;
    padding-left: 0.5rem;
    vertical-align: middle;
  }

  .payment-list__table th {
    line-height: 1.2;
    white-space: normal;
  }

  .payment-list__student-cell {
    overflow-wrap: anywhere;
  }
}
</style>
