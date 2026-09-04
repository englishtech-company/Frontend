<script lang="ts" setup>
import {
  computed,
} from "vue";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/lib/finance/format";
import type {
  ChargeFinancialSummary,
} from "@/lib/charges";

const props = defineProps<{
  summary: ChargeFinancialSummary;
}>();

const hasPayments = computed(
  () => props.summary.payments.length > 0
);
</script>

<template>
  <section class="charge-financial-summary">
    <div class="charge-financial-summary__header">
      <div>
        <span>Resumo financeiro</span>

        <h6>
          Valores calculados em
          {{ formatDate(summary.reference_date) }}
        </h6>
      </div>

      <strong>
        {{ formatCurrency(summary.total_due_amount) }}
      </strong>
    </div>

    <div class="charge-financial-summary__grid">
      <div>
        <span>Valor original</span>

        <strong>
          {{ formatCurrency(summary.expected_amount) }}
        </strong>
      </div>

      <div>
        <span>Principal pago</span>

        <strong>
          {{ formatCurrency(summary.principal.paid_amount) }}
        </strong>
      </div>

      <div>
        <span>Saldo principal</span>

        <strong>
          {{
            formatCurrency(
              summary.principal.remaining_amount
            )
          }}
        </strong>
      </div>

      <div>
        <span>Multa pendente</span>

        <strong>
          {{
            formatCurrency(
              summary.late_fee.remaining_amount
            )
          }}
        </strong>
      </div>

      <div>
        <span>Juros pendentes</span>

        <strong>
          {{
            formatCurrency(
              summary.interest.remaining_amount
            )
          }}
        </strong>
      </div>
    </div>

    <div
      v-if="hasPayments"
      class="charge-financial-summary__history"
    >
      <h6>Alocação dos pagamentos confirmados</h6>

      <div class="table-responsive">
        <table class="table table-sm mb-0">
          <thead>
            <tr>
              <th>Pagamento</th>
              <th>Data</th>
              <th class="text-end">Total</th>
              <th class="text-end">Principal</th>
              <th class="text-end">Multa</th>
              <th class="text-end">Juros</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="payment in summary.payments"
              :key="payment.id"
            >
              <td>#{{ payment.id }}</td>

              <td>
                {{
                  payment.paid_at
                    ? formatDateTime(payment.paid_at)
                    : "—"
                }}
              </td>

              <td class="text-end">
                {{ formatCurrency(payment.amount) }}
              </td>

              <td class="text-end">
                {{
                  formatCurrency(
                    payment.principal_amount
                  )
                }}
              </td>

              <td class="text-end">
                {{
                  formatCurrency(
                    payment.late_fee_amount
                  )
                }}
              </td>

              <td class="text-end">
                {{
                  formatCurrency(
                    payment.interest_amount
                  )
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.charge-financial-summary {
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.charge-financial-summary__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.charge-financial-summary__header span,
.charge-financial-summary__grid span {
  display: block;
  margin-bottom: 0.25rem;
  color: #6c757d;
  font-size: 0.8125rem;
}

.charge-financial-summary__header h6,
.charge-financial-summary__history h6 {
  margin: 0;
  color: #343a40;
}

.charge-financial-summary__header > strong {
  color: var(--primary);
  font-size: 1.25rem;
}

.charge-financial-summary__grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1rem;
}

.charge-financial-summary__grid strong {
  color: #343a40;
  font-size: 1rem;
}

.charge-financial-summary__history {
  padding-top: 1.25rem;
  margin-top: 1.25rem;
  border-top: 1px solid #e5e7eb;
}

.charge-financial-summary__history h6 {
  margin-bottom: 0.75rem;
}

.charge-financial-summary__history th,
.charge-financial-summary__history td {
  vertical-align: middle;
  white-space: nowrap;
}

@media (max-width: 1199.98px) {
  .charge-financial-summary__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 767.98px) {
  .charge-financial-summary__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 575.98px) {
  .charge-financial-summary__grid {
    grid-template-columns: 1fr;
  }
}
</style>
