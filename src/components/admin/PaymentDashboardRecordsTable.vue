<script lang="ts" setup>
import {
  computed,
  ref,
  watch,
} from "vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import { formatCurrency } from "@/lib/finance/format";
import type {
  PaymentDashboardRecords,
} from "@/lib/paymentDashboard";

const props = withDefaults(
  defineProps<{
    result: PaymentDashboardRecords | null;
    search?: string;
    loading?: boolean;
    error?: string;
  }>(),
  {
    search: "",
    loading: false,
    error: "",
  }
);

const emit = defineEmits<{
  search: [value: string];
  changePage: [page: number];
  retry: [];
}>();

const searchDraft = ref(props.search);
const countFormatter = new Intl.NumberFormat("pt-BR");

watch(
  () => props.search,
  (value) => {
    searchDraft.value = value;
  }
);

const dateFormatter = computed(
  () => new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: props.result?.timezone ?? "America/Fortaleza",
  })
);

const pageData = computed(
  () => props.result?.records ?? null
);

function formatPaymentDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return dateFormatter.value.format(date);
}

function submitSearch(): void {
  if (!props.loading) {
    emit("search", searchDraft.value.trim());
  }
}

function clearSearch(): void {
  searchDraft.value = "";

  if (!props.loading) {
    emit("search", "");
  }
}

function changePage(nextPage: number): void {
  if (!props.loading) {
    emit("changePage", nextPage);
  }
}
</script>

<template>
  <section
    class="card payment-records"
    :aria-busy="loading"
  >
    <div class="card-header payment-records__header">
      <h3 class="card-title">
        Registro de pagamentos
      </h3>

      <p class="payment-records__caption">
        Recebimentos válidos, sem estornos · horário de Fortaleza
      </p>
    </div>

    <div class="card-body payment-records__body">
      <form
        class="payment-records__search"
        role="search"
        @submit.prevent="submitSearch"
      >
        <div class="payment-records__search-field">
          <label
            for="payment-dashboard-search"
            class="visually-hidden"
          >
            Buscar nos registros por aluno, plano ou número do pagamento
          </label>

          <input
            id="payment-dashboard-search"
            v-model="searchDraft"
            type="search"
            class="form-control"
            maxlength="255"
            placeholder="Buscar por aluno, plano ou número do pagamento"
            aria-describedby="payment-dashboard-search-help"
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading"
        >
          Buscar
        </button>

        <button
          type="button"
          class="btn btn-outline-secondary"
          :disabled="loading || (!searchDraft && !search)"
          @click="clearSearch"
        >
          Limpar busca
        </button>
      </form>

      <div class="payment-records__meta">
        <p
          id="payment-dashboard-search-help"
          class="payment-records__help"
        >
          A busca afeta somente esta tabela, não os indicadores,
          gráficos ou ranking.
        </p>

        <p
          v-if="pageData"
          class="payment-records__count"
        >
          Exibindo
          {{ countFormatter.format(pageData.from ?? 0) }}
          a
          {{ countFormatter.format(pageData.to ?? 0) }}
          de
          {{ countFormatter.format(pageData.total) }}
          registro{{ pageData.total === 1 ? "" : "s" }}.
        </p>
      </div>

      <div
        v-if="error"
        class="alert alert-danger"
        role="alert"
      >
        <p class="mb-2">{{ error }}</p>

        <p
          v-if="result"
          class="small mb-2"
        >
          Os registros abaixo são da última consulta bem-sucedida.
        </p>

        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          :disabled="loading"
          @click="emit('retry')"
        >
          Tentar novamente
        </button>
      </div>

      <p
        v-if="loading"
        class="small text-muted"
        role="status"
      >
        Atualizando registros…
      </p>

      <template v-if="pageData">
        <div
          v-if="pageData.data.length > 0"
          class="table-responsive"
        >
          <table class="table table-striped payment-records__table">
            <caption class="visually-hidden">
              Pagamentos recebidos no período e plano selecionados,
              considerando a busca aplicada à tabela.
            </caption>

            <thead>
              <tr>
                <th scope="col">Pagamento</th>
                <th scope="col">Aluno</th>
                <th scope="col">Plano</th>
                <th scope="col">Recebido em</th>
                <th scope="col" class="text-end">Total recebido</th>
                <th scope="col" class="text-end">Principal</th>
                <th scope="col" class="text-end">Multa</th>
                <th scope="col" class="text-end">Juros</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="payment in pageData.data"
                :key="payment.id"
              >
                <th scope="row">
                  #{{ payment.id }}

                  <div
                    v-if="payment.charge_id !== null"
                    class="small text-muted fw-normal"
                  >
                    Cobrança #{{ payment.charge_id }}
                  </div>
                </th>

                <td class="payment-records__student">
                  {{ payment.student_name }}
                </td>

                <td>
                  <span>{{ payment.plan_label }}</span>

                  <div
                    v-if="payment.plan_name"
                    class="small text-muted"
                  >
                    {{ payment.plan_name }}
                  </div>
                </td>

                <td class="text-nowrap">
                  {{ formatPaymentDate(payment.paid_at) }}
                </td>

                <td class="text-end text-nowrap fw-semibold">
                  {{ formatCurrency(payment.amount) }}
                </td>

                <td class="text-end text-nowrap">
                  {{ formatCurrency(payment.principal_amount) }}
                </td>

                <td class="text-end text-nowrap">
                  {{ formatCurrency(payment.late_fee_amount) }}
                </td>

                <td class="text-end text-nowrap">
                  {{ formatCurrency(payment.interest_amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p
          v-else-if="!loading"
          class="text-muted mb-0"
        >
          Nenhum pagamento corresponde aos filtros e à busca.
        </p>

        <fieldset
          class="payment-records__pagination"
          :disabled="loading"
        >
          <legend class="visually-hidden">
            Navegação entre páginas dos pagamentos
          </legend>

          <ListPagination
            :page="pageData.current_page"
            :last-page="pageData.last_page"
            :total="pageData.total"
            @update:page="changePage"
          />
        </fieldset>
      </template>

      <p
        v-else-if="!loading && !error"
        class="text-muted mb-0"
      >
        Aguardando consulta dos pagamentos.
      </p>
    </div>
  </section>
</template>

<style scoped>
.payment-records {
  margin-bottom: 0.875rem;
}

.payment-records > .payment-records__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.375rem 0.75rem;
  padding: 0.75rem 0.875rem 0;
  border-bottom: 0;
}

.payment-records__header .card-title {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.4;
}

.payment-records__caption {
  margin: 0;
  color: var(--text-gray, #6c757d);
  font-size: 0.6875rem;
  line-height: 1.4;
}

.payment-records > .payment-records__body {
  padding: 0.625rem 0.875rem 0.75rem;
}

.payment-records__search {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.payment-records__search-field {
  flex: 1 1 280px;
  min-width: 0;
}

.payment-records__search .form-control {
  min-height: 2.125rem;
  padding: 0.375rem 0.625rem;
  font-size: 0.8125rem;
}

.payment-records__search .btn {
  padding: 0.4375rem 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.4;
}

.payment-records__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem 0.75rem;
  margin: 0.375rem 0 0.5rem;
  color: var(--text-gray, #6c757d);
  font-size: 0.6875rem;
  line-height: 1.4;
}

.payment-records__help,
.payment-records__count {
  margin: 0;
}

.payment-records__table {
  min-width: 1000px;
  margin-bottom: 0;
  font-size: 0.875rem;
}

.payment-records__table td,
.payment-records__table th {
  vertical-align: middle;
}

.payment-records__student {
  min-width: 180px;
  max-width: 280px;
  overflow-wrap: anywhere;
}

.payment-records__pagination {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

@media (max-width: 575px) {
  .payment-records__search-field {
    flex-basis: 100%;
  }

  .payment-records__search .btn {
    flex: 1 1 auto;
  }
}
</style>
