<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
} from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDelete } from "@/lib/confirm";
import { getChargeOptions } from "@/lib/charges";
import {
  formatChargeStatus,
  formatCurrency,
  formatDateTime,
  getChargeStudent,
  getPaymentCharge,
} from "@/lib/finance/format";
import {
  deletePayment,
  listPayments,
} from "@/lib/payments";
import type { Payment } from "@/lib/types";

const {
  canViewPayments,
  canCreatePayments,
  canUpdatePayments,
  canDeletePayments,
} = usePermissions();

const payments = ref<Payment[]>([]);
const chargeOptions = ref<
  Array<{
    value: string;
    label: string;
  }>
>([]);

const loading = ref(true);
const error = ref("");

const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const chargeIdFilter = ref("");

const showActions = computed(
  () =>
    canUpdatePayments.value ||
    canDeletePayments.value
);

function getPaymentStudentName(
  payment: Payment
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
  payment: Payment
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

async function loadChargeOptions() {
  const options = await getChargeOptions();

  chargeOptions.value = Object.entries(options).map(
    ([value, label]) => ({
      value,
      label,
    })
  );
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
      chargeId: chargeIdFilter.value
        ? Number(chargeIdFilter.value)
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

async function loadPage() {
  try {
    await Promise.all([
      loadChargeOptions(),
      loadPayments(),
    ]);
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar os dados dos pagamentos.";

    loading.value = false;
  }
}

function handleFilter() {
  page.value = 1;
  loadPayments();
}

function clearFilters() {
  chargeIdFilter.value = "";
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

async function removePayment(payment: Payment) {
  if (!canDeletePayments.value) {
    error.value =
      "Você não tem permissão para excluir pagamentos.";
    return;
  }

  const confirmed = await confirmDelete({
    entityLabel: "pagamento",
    itemName: `#${payment.id} - ${getPaymentStudentName(
      payment
    )}`,
    message:
      "Deseja remover este pagamento? O status da cobrança será recalculado automaticamente.",
  });

  if (!confirmed) {
    return;
  }

  try {
    await deletePayment(payment.id);
    await loadPayments();
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao remover o pagamento.";
  }
}

onMounted(loadPage);
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

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header payment-list__header">
            <h4 class="card-title mb-0">
              Lista de pagamentos ({{ total }})
            </h4>

            <div class="payment-list__filters">
              <select
                v-model="chargeIdFilter"
                class="form-select form-select-sm"
                aria-label="Filtrar pela cobrança"
                @change="handleFilter"
              >
                <option value="">
                  Todas as cobranças
                </option>

                <option
                  v-for="option in chargeOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>

              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                @click="handleFilter"
              >
                Filtrar
              </button>

              <button
                type="button"
                class="btn btn-sm btn-light"
                @click="clearFilters"
              >
                Limpar
              </button>
            </div>
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
                class="table table-striped table-responsive-sm"
              >
                <thead>
                  <tr>
                    <th class="text-nowrap">
                      Pagamento
                    </th>

                    <th>Aluno</th>

                    <th class="text-nowrap">
                      Cobrança
                    </th>

                    <th class="text-nowrap">
                      Valor pago
                    </th>

                    <th class="text-nowrap">
                      Data do pagamento
                    </th>

                    <th>Status da cobrança</th>

                    <th>Comprovante</th>

                    <th
                      v-if="showActions"
                      class="text-end text-nowrap"
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

                    <td>
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
                      class="text-end text-nowrap"
                    >
                      <RouterLink
                        v-if="canUpdatePayments"
                        :to="`/payments/${payment.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar pagamento ${payment.id}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>

                      <button
                        v-if="canDeletePayments"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir pagamento ${payment.id}`"
                        @click="removePayment(payment)"
                      >
                        <i class="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              v-if="lastPage > 1"
              class="d-flex justify-content-between align-items-center mt-3"
            >
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                :disabled="page <= 1"
                @click="goToPage(page - 1)"
              >
                Anterior
              </button>

              <span>
                Página {{ page }} de {{ lastPage }}
              </span>

              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                :disabled="page >= lastPage"
                @click="goToPage(page + 1)"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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

.payment-list__filters {
  display: grid;
  grid-template-columns:
    minmax(260px, 420px)
    auto
    auto;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 767.98px) {
  .payment-list__filters {
    width: 100%;
    grid-template-columns:
      minmax(0, 1fr)
      auto
      auto;
  }
}

@media (max-width: 575.98px) {
  .payment-list__filters {
    grid-template-columns: 1fr;
  }
}
</style>
