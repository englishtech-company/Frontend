<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import ListPagination from "@/components/ui/ListPagination.vue";
import { usePermissions } from "@/composables/usePermissions";
import { getCouponUsage } from "@/lib/coupons";
import type {
  CouponUsage,
  CouponUsageEnrollment,
  CouponUsagePayment,
} from "@/lib/coupons";
import {
  formatCouponDate,
  formatCouponLimit,
  formatCouponStatus,
  formatCouponValue,
} from "@/lib/coupons/format";
import {
  ENROLLMENT_STATUS_CLASSES,
  ENROLLMENT_STATUS_LABELS,
  formatEnrollmentNumber,
} from "@/lib/enrollments/format";
import {
  formatChargeStatus,
  formatCurrency,
  formatDateTime,
} from "@/lib/finance/format";

const route = useRoute();

const {
  canViewStudents,
  canViewEnrollments,
  canViewCharges,
  canUpdateCoupons,
} = usePermissions();

const couponId = computed(() => Number(route.params.id));

const usage = ref<CouponUsage | null>(null);
const loading = ref(true);
const error = ref("");
const enrollmentsPage = ref(1);
const paymentsPage = ref(1);

const coupon = computed(() => usage.value?.coupon ?? null);
const summary = computed(() => usage.value?.summary ?? null);
const enrollments = computed(
  () => usage.value?.enrollments.data ?? []
);
const payments = computed(() => usage.value?.payments.data ?? []);

const countFormatter = new Intl.NumberFormat("pt-BR");

const statusBadge = computed(() =>
  coupon.value ? formatCouponStatus(coupon.value) : null
);

const metricCards = computed(() => {
  const current = summary.value;

  return [
    {
      key: "students",
      label: "Alunos",
      value: current
        ? countFormatter.format(current.students_count)
        : "—",
      subtitle: current
        ? `${countFormatter.format(current.enrollments_count)} matrícula(s)`
        : "Quem já usou este cupom",
      icon: "la la-users",
      tone: "primary",
    },
    {
      key: "return",
      label: "Retorno",
      value: current ? formatCurrency(current.paid_amount) : "—",
      subtitle: current
        ? `${countFormatter.format(current.payments_count)} pagamento(s)`
        : "Valor já recebido",
      icon: "la la-chart-line",
      tone: "success",
    },
    {
      key: "discount",
      label: "Desconto concedido",
      value: current ? formatCurrency(current.discount_amount) : "—",
      subtitle: current
        ? `De ${formatCurrency(current.original_amount)} para ${formatCurrency(current.billed_amount)}`
        : "Diferença sem o cupom",
      icon: "la la-tag",
      tone: "warning",
    },
    {
      key: "open",
      label: "Em aberto",
      value: current ? formatCurrency(current.open_amount) : "—",
      subtitle: current
        ? `${countFormatter.format(current.charges_count)} cobrança(s)`
        : "Ainda a receber",
      icon: "la la-file-invoice-dollar",
      tone: "info",
    },
  ];
});

async function loadUsage() {
  if (!Number.isFinite(couponId.value) || couponId.value < 1) {
    error.value = "Cupom inválido.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    usage.value = await getCouponUsage(couponId.value, {
      enrollmentsPage: enrollmentsPage.value,
      paymentsPage: paymentsPage.value,
    });
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar o histórico do cupom";
    usage.value = null;
  } finally {
    loading.value = false;
  }
}

function goToEnrollmentsPage(nextPage: number) {
  const lastPage = usage.value?.enrollments.last_page ?? 1;

  if (nextPage < 1 || nextPage > lastPage) return;

  enrollmentsPage.value = nextPage;
  loadUsage();
}

function goToPaymentsPage(nextPage: number) {
  const lastPage = usage.value?.payments.last_page ?? 1;

  if (nextPage < 1 || nextPage > lastPage) return;

  paymentsPage.value = nextPage;
  loadUsage();
}

function enrollmentStatus(enrollment: CouponUsageEnrollment) {
  return {
    label: ENROLLMENT_STATUS_LABELS[enrollment.status],
    class: ENROLLMENT_STATUS_CLASSES[enrollment.status],
  };
}

function paymentChargeStatus(payment: CouponUsagePayment) {
  if (!payment.charge_status) return null;

  return formatChargeStatus(payment.charge_status);
}

watch(couponId, () => {
  enrollmentsPage.value = 1;
  paymentsPage.value = 1;
  loadUsage();
});

onMounted(loadUsage);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Histórico do cupom</h4>
          <p class="mb-0">
            Alunos, pagamentos e retorno gerado por este cupom
          </p>
        </div>
      </div>

      <div
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex gap-2"
      >
        <RouterLink
          v-if="canUpdateCoupons && coupon"
          :to="`/coupons/${coupon.id}/edit`"
          class="btn btn-outline-primary"
        >
          Editar
        </RouterLink>

        <RouterLink to="/coupons" class="btn btn-outline-primary">
          Voltar
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center py-5">
      Carregando...
    </div>

    <template v-else-if="coupon && summary">
      <div class="row">
        <div class="col-xl-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ coupon.name }}</h5>

              <p class="mb-3">
                <span
                  v-if="statusBadge"
                  class="badge me-2"
                  :class="statusBadge.class"
                >
                  {{ statusBadge.label }}
                </span>

                <span
                  v-if="coupon.unique_per_student"
                  class="badge badge-primary"
                >
                  Único
                </span>
              </p>

              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between px-0">
                  <span>Desconto</span>
                  <strong>
                    {{
                      formatCouponValue(
                        coupon.value,
                        coupon.discount_type
                      )
                    }}
                  </strong>
                </li>

                <li class="list-group-item d-flex justify-content-between px-0">
                  <span>Usos</span>
                  <strong>{{ formatCouponLimit(coupon) }}</strong>
                </li>

                <li class="list-group-item d-flex justify-content-between px-0">
                  <span>Início</span>
                  <strong>{{ formatCouponDate(coupon.starts_at) }}</strong>
                </li>

                <li class="list-group-item d-flex justify-content-between px-0">
                  <span>Fim</span>
                  <strong>{{ formatCouponDate(coupon.ends_at) }}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-xl-8">
          <div class="row">
            <div
              v-for="card in metricCards"
              :key="card.key"
              class="col-sm-6"
            >
              <div class="widget-stat card">
                <div class="card-body p-4">
                  <div class="media ai-icon">
                    <span
                      class="me-3"
                      :class="`bgl-${card.tone} text-${card.tone}`"
                    >
                      <i :class="card.icon"></i>
                    </span>

                    <div class="media-body">
                      <p class="mb-1">{{ card.label }}</p>
                      <h4 class="mb-0">{{ card.value }}</h4>
                      <span class="fs-12">{{ card.subtitle }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title mb-0">
                Matrículas ({{ usage?.enrollments.total ?? 0 }})
              </h4>
            </div>

            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped table-responsive-sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Aluno</th>
                      <th>Plano</th>
                      <th>Status</th>
                      <th>Cobrado</th>
                      <th>Recebido</th>
                      <th>Em aberto</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-if="enrollments.length === 0">
                      <td colspan="7" class="text-center text-muted">
                        Nenhuma matrícula usou este cupom
                      </td>
                    </tr>

                    <tr
                      v-for="enrollment in enrollments"
                      :key="enrollment.id"
                    >
                      <td>
                        <RouterLink
                          v-if="canViewEnrollments"
                          :to="`/enrollments/${enrollment.id}`"
                        >
                          {{ formatEnrollmentNumber(enrollment.id) }}
                        </RouterLink>

                        <span v-else>
                          {{ formatEnrollmentNumber(enrollment.id) }}
                        </span>
                      </td>

                      <td>
                        <RouterLink
                          v-if="enrollment.student && canViewStudents"
                          :to="`/students/${enrollment.student.id}`"
                        >
                          {{ enrollment.student.name }}
                        </RouterLink>

                        <span v-else>
                          {{ enrollment.student?.name ?? "Sem aluno" }}
                        </span>
                      </td>

                      <td>{{ enrollment.plan_name ?? "—" }}</td>

                      <td>
                        <span
                          class="badge"
                          :class="enrollmentStatus(enrollment).class"
                        >
                          {{ enrollmentStatus(enrollment).label }}
                        </span>
                      </td>

                      <td class="text-nowrap">
                        {{ formatCurrency(enrollment.billed_amount) }}
                      </td>

                      <td class="text-nowrap">
                        {{ formatCurrency(enrollment.paid_amount) }}
                      </td>

                      <td class="text-nowrap">
                        {{ formatCurrency(enrollment.open_amount) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <ListPagination
                :page="enrollmentsPage"
                :last-page="usage?.enrollments.last_page ?? 1"
                :total="usage?.enrollments.total ?? 0"
                @update:page="goToEnrollmentsPage"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title mb-0">
                Pagamentos ({{ usage?.payments.total ?? 0 }})
              </h4>
            </div>

            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped table-responsive-sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Aluno</th>
                      <th>Cobrança</th>
                      <th>Valor</th>
                      <th>Pago em</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-if="payments.length === 0">
                      <td colspan="6" class="text-center text-muted">
                        Nenhum pagamento recebido com este cupom
                      </td>
                    </tr>

                    <tr
                      v-for="payment in payments"
                      :key="payment.id"
                    >
                      <td>{{ payment.id }}</td>

                      <td>
                        <RouterLink
                          v-if="payment.student && canViewStudents"
                          :to="`/students/${payment.student.id}`"
                        >
                          {{ payment.student.name }}
                        </RouterLink>

                        <span v-else>
                          {{ payment.student?.name ?? "—" }}
                        </span>
                      </td>

                      <td>
                        <RouterLink
                          v-if="canViewCharges"
                          :to="`/charges/${payment.charge_id}`"
                        >
                          #{{ payment.charge_id }}
                        </RouterLink>

                        <span v-else>#{{ payment.charge_id }}</span>
                      </td>

                      <td class="text-nowrap">
                        {{ formatCurrency(payment.amount) }}
                      </td>

                      <td class="text-nowrap">
                        {{ formatDateTime(payment.paid_at) }}
                      </td>

                      <td>
                        <span
                          v-if="paymentChargeStatus(payment)"
                          class="badge"
                          :class="paymentChargeStatus(payment)?.class"
                        >
                          {{ paymentChargeStatus(payment)?.label }}
                        </span>

                        <span v-else>—</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <ListPagination
                :page="paymentsPage"
                :last-page="usage?.payments.last_page ?? 1"
                :total="usage?.payments.total ?? 0"
                @update:page="goToPaymentsPage"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
