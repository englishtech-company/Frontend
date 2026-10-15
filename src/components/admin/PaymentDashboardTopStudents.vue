<script lang="ts" setup>
import { formatCurrency } from "@/lib/finance/format";
import type {
  PaymentDashboardTopStudent,
} from "@/lib/paymentDashboard";

withDefaults(
  defineProps<{
    students: PaymentDashboardTopStudent[];
    loading?: boolean;
  }>(),
  {
    loading: false,
  }
);

const countFormatter = new Intl.NumberFormat("pt-BR");
</script>

<template>
  <section
    class="card payment-ranking"
    :aria-busy="loading"
  >
    <div class="card-header payment-ranking__header">
      <h3 class="card-title">
        Top alunos com maior faturamento
      </h3>

      <p class="payment-ranking__caption">
        Até cinco no recorte selecionado, incluindo ex-alunos.
      </p>
    </div>

    <div class="card-body payment-ranking__body">
      <p
        v-if="loading && students.length === 0"
        class="payment-ranking__empty text-muted"
        role="status"
      >
        Carregando ranking…
      </p>

      <p
        v-else-if="students.length === 0"
        class="payment-ranking__empty text-muted"
      >
        Nenhum aluno com recebimentos neste recorte.
      </p>

      <ol
        v-else
        class="payment-ranking__list"
        aria-label="Alunos ordenados pela receita recebida"
      >
        <li
          v-for="student in students"
          :key="student.student_id"
          class="payment-ranking__item"
        >
          <div class="payment-ranking__heading">
            <span class="payment-ranking__position">
              <span class="visually-hidden">Posição </span>
              #{{ student.position }}
            </span>

            <span class="payment-ranking__count">
              {{ countFormatter.format(student.transactions_count) }}
              pagamento{{ student.transactions_count === 1 ? "" : "s" }}
            </span>
          </div>

          <h4 class="payment-ranking__name">
            {{ student.student_name }}
          </h4>

          <p class="payment-ranking__amount">
            {{ formatCurrency(student.revenue_amount) }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.payment-ranking {
  margin-bottom: 0.875rem;
}

.payment-ranking > .payment-ranking__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.375rem 0.75rem;
  padding: 0.75rem 0.875rem 0;
  border-bottom: 0;
}

.payment-ranking__header .card-title {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.4;
}

.payment-ranking__caption {
  margin: 0;
  color: var(--text-gray, #6c757d);
  font-size: 0.6875rem;
  line-height: 1.4;
}

.payment-ranking > .payment-ranking__body {
  padding: 0.625rem 0.875rem 0.75rem;
}

.payment-ranking__empty {
  margin: 0;
  font-size: 0.8125rem;
}

.payment-ranking__list {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.625rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.payment-ranking__item {
  min-width: 0;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--border, #edf0f2);
  border-radius: 5px;
  background: var(--card, #fff);
}

.payment-ranking__heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.375rem;
  margin-bottom: 0.375rem;
}

.payment-ranking__position {
  padding: 0.0625rem 0.375rem;
  border-radius: 4px;
  background: color-mix(
    in srgb,
    var(--primary, #600022) 10%,
    transparent
  );
  color: var(--primary, #600022);
  font-size: 0.6875rem;
  font-weight: 700;
}

.payment-ranking__count {
  color: var(--text-gray, #6c757d);
  font-size: 0.6875rem;
}

.payment-ranking__name {
  margin: 0 0 0.25rem;
  color: var(--text-dark, #212529);
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.payment-ranking__amount {
  margin: 0;
  color: var(--text-dark, #212529);
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

@media (max-width: 1199px) {
  .payment-ranking__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .payment-ranking__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 479px) {
  .payment-ranking__list {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
