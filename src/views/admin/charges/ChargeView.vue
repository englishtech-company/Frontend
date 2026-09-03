<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
} from "vue";
import {
  RouterLink,
  useRoute,
} from "vue-router";
import ChargeFinancialSummary from "@/components/admin/ChargeFinancialSummary.vue";
import { usePermissions } from "@/composables/usePermissions";
import {
  formatEnrollmentNumber,
  formatEnrollmentPlanLabel,
} from "@/lib/enrollments/format";
import {
  formatChargeStatus,
  formatCurrency,
  formatDate,
  formatDateTime,
  getChargeEnrollment,
  getChargeSchedule,
  getChargeStudent,
} from "@/lib/finance/format";
import {
  getCharge,
  getChargeFinancialSummary,
} from "@/lib/charges";
import type {
  ChargeFinancialSummary as ChargeFinancialSummaryData,
} from "@/lib/charges";
import type {
  Charge,
} from "@/lib/types";

const route = useRoute();

const {
  canUpdateCharges,
  canViewStudents,
} = usePermissions();

const chargeId = computed(() => Number(route.params.id));
const charge = ref<Charge | null>(null);
const financialSummary =
  ref<ChargeFinancialSummaryData | null>(null);
const loading = ref(true);
const error = ref("");
const financialSummaryError = ref("");

const student = computed(() =>
  charge.value
    ? getChargeStudent(charge.value)
    : null
);

const enrollment = computed(() =>
  charge.value
    ? getChargeEnrollment(charge.value)
    : null
);

const chargeSchedule = computed(() =>
  charge.value
    ? getChargeSchedule(charge.value)
    : null
);

const chargeStatus = computed(() =>
  charge.value
    ? formatChargeStatus(charge.value.status)
    : null
);

const recurrenceLabel = computed(() => {
  if (!chargeSchedule.value) {
    return "Sem recorrência";
  }

  if (chargeSchedule.value.status === "cancelled") {
    return "Cancelada";
  }

  if (chargeSchedule.value.renews_automatically) {
    return "Mensal com renovação automática";
  }

  return `${chargeSchedule.value.duration_months} cobranças programadas`;
});

function padDatePart(value: number): string {
  return String(value).padStart(2, "0");
}

function todayForApi(): string {
  const today = new Date();

  return [
    today.getFullYear(),
    padDatePart(today.getMonth() + 1),
    padDatePart(today.getDate()),
  ].join("-");
}

async function loadCharge() {
  loading.value = true;
  error.value = "";
  financialSummaryError.value = "";

  try {
    const currentCharge = await getCharge(chargeId.value);

    charge.value = currentCharge;

    try {
      financialSummary.value =
        await getChargeFinancialSummary(
          currentCharge.id,
          todayForApi()
        );
    } catch (exception) {
      financialSummaryError.value =
        exception instanceof Error
          ? exception.message
          : "Erro ao carregar o resumo financeiro.";
    }
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar a cobrança.";
  } finally {
    loading.value = false;
  }
}

onMounted(loadCharge);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Detalhes da cobrança</h4>

          <p class="mb-0">
            Consulta financeira e histórico dos pagamentos confirmados
          </p>
        </div>
      </div>

      <div
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <RouterLink to="/charges">
              Cobranças
            </RouterLink>
          </li>

          <li class="breadcrumb-item active">
            <span>
              {{ charge ? `#${charge.id}` : "Detalhes" }}
            </span>
          </li>
        </ol>
      </div>
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
      Carregando...
    </div>

    <div
      v-else-if="charge"
      class="row"
    >
      <div class="col-xl-3 col-lg-4">
        <div class="card">
          <div class="text-center p-3 overlay-box">
            <div
              class="charge-view__icon d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white mb-2"
            >
              <i class="fa fa-file-invoice-dollar fa-2x"></i>
            </div>

            <h3 class="mt-3 mb-1 text-white">
              #{{ charge.id }}
            </h3>

            <span
              v-if="chargeStatus"
              class="badge"
              :class="chargeStatus.class"
            >
              {{ chargeStatus.label }}
            </span>
          </div>

          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between">
              <span>Valor original</span>
              <strong class="text-muted text-end ms-2">
                {{ formatCurrency(charge.expected_amount) }}
              </strong>
            </li>

            <li class="list-group-item d-flex justify-content-between">
              <span>Vencimento</span>
              <strong class="text-muted text-end ms-2">
                {{ formatDate(charge.due_date) }}
              </strong>
            </li>

            <li class="list-group-item d-flex justify-content-between">
              <span>Matrícula</span>
              <strong class="text-muted text-end ms-2">
                {{ formatEnrollmentNumber(charge.enrollment_id) }}
              </strong>
            </li>

            <li class="list-group-item d-flex justify-content-between">
              <span>Criada em</span>
              <strong class="text-muted text-end ms-2">
                {{ formatDateTime(charge.created_at) }}
              </strong>
            </li>
          </ul>

          <div class="card-footer text-center border-0 mt-0">
            <div class="profile-actions">
              <RouterLink
                to="/charges"
                class="btn btn-warning"
                aria-label="Voltar para cobranças"
              >
                <i class="fa fa-arrow-left"></i>
              </RouterLink>

              <RouterLink
                v-if="canUpdateCharges"
                :to="`/charges/${charge.id}/edit`"
                class="btn btn-primary"
                aria-label="Editar cobrança"
              >
                <i class="fa fa-pencil"></i>
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              Aluno e matrícula
            </h5>
          </div>

          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex px-0 justify-content-between">
                <span>Aluno</span>
                <strong class="text-end ms-2">
                  <RouterLink
                    v-if="student && canViewStudents"
                    :to="`/students/${student.id}`"
                    class="text-primary"
                  >
                    {{ student.name }}
                  </RouterLink>

                  <span v-else>
                    {{ student?.name ?? "Indisponível" }}
                  </span>
                </strong>
              </li>

              <li class="list-group-item d-flex px-0 justify-content-between">
                <span>Plano</span>
                <strong class="text-end ms-2">
                  {{ enrollment ? formatEnrollmentPlanLabel(enrollment) : "—" }}
                </strong>
              </li>

              <li class="list-group-item d-flex px-0 justify-content-between">
                <span>Recorrência</span>
                <strong class="text-end ms-2">
                  {{ recurrenceLabel }}
                </strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-xl-9 col-lg-8">
        <div
          v-if="financialSummaryError"
          class="alert alert-danger"
        >
          {{ financialSummaryError }}
        </div>

        <ChargeFinancialSummary
          v-if="financialSummary"
          :summary="financialSummary"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.charge-view__icon {
  width: 100px;
  height: 100px;
}
</style>
