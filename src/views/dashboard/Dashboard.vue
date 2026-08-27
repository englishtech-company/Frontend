<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { listExperimentalClasses } from "@/lib/experimentalClasses";
import { listCharges } from "@/lib/charges";
import { listEnrollments } from "@/lib/enrollments";
import { formatCurrency } from "@/lib/finance/format";
import {
  formatChargeStatus,
  formatDateTime as formatFinanceDateTime,
  getChargeStudent,
  getPaymentCharge,
} from "@/lib/finance/format";
import { buildFinanceSnapshot, type FinanceSnapshot } from "@/lib/dashboard/finance";
import { listPayments, type PaymentWithReceipt } from "@/lib/payments";
import {
  ENROLLMENT_STATUS_CLASSES,
  ENROLLMENT_STATUS_LABELS,
  formatEnrollmentNumber,
  getEnrollmentStudentName,
} from "@/lib/enrollments/format";
import { listLeads } from "@/lib/leads";
import { listPlans } from "@/lib/plans";
import { listRoles } from "@/lib/roles";
import { listStudents } from "@/lib/students";
import { listTeachers } from "@/lib/teachers";
import { listUsers } from "@/lib/users";
import {
  DASHBOARD_PERIOD_OPTIONS,
  filterByCreatedAt,
  getDashboardPeriodLabel,
  getDashboardPeriodRange,
  isDateWithinPeriod,
  type DashboardPeriod,
} from "@/lib/dashboard/period";
import type { Charge, Enrollment, ExperimentalClass } from "@/lib/types";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const {
  canViewStudents,
  canViewTeachers,
  canViewPlans,
  canViewUsers,
  canViewRoles,
  canViewLeads,
  canViewExperimentalClasses,
  canViewEnrollments,
  canViewCharges,
  canViewPayments,
} = usePermissions();

type CountStat = {
  total: number | null;
  active: number | null;
};

const loading = ref(true);
const students = ref<CountStat>({ total: null, active: null });
const teachers = ref<CountStat>({ total: null, active: null });
const plans = ref<CountStat>({ total: null, active: null });
const usersTotal = ref<number | null>(null);
const rolesTotal = ref<number | null>(null);
const leadsTotal = ref<number | null>(null);
const experimentalTotal = ref<number | null>(null);
const experimentalScheduled = ref<number | null>(null);
const experimentalConversions = ref<number | null>(null);
const enrollmentsPending = ref<number | null>(null);
const enrollmentsConfirmed = ref<number | null>(null);
const upcomingClasses = ref<ExperimentalClass[]>([]);
const pendingEnrollments = ref<Enrollment[]>([]);
const financeStats = ref<FinanceSnapshot | null>(null);
const recentPayments = ref<PaymentWithReceipt[]>([]);
const pendingCharges = ref<Charge[]>([]);
const selectedPeriod = ref<DashboardPeriod>("30d");

const periodRange = computed(() => getDashboardPeriodRange(selectedPeriod.value));

const periodScopeLabel = computed(() => {
  if (selectedPeriod.value === "all") return "";
  return getDashboardPeriodLabel(selectedPeriod.value).toLowerCase();
});

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
});

const todayLabel = computed(() => {
  const now = new Date();
  const weekday = now.toLocaleDateString("pt-BR", { weekday: "long" });
  const date = now.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${date}`;
});

function formatCount(value: number | null): string {
  if (value === null) return "—";
  return String(value);
}

function buildPeopleSubtitle(stat: CountStat): string {
  if (stat.total === null) return "—";

  if (periodScopeLabel.value) {
    const activePart =
      stat.active !== null
        ? ` · ${stat.active} ativo${stat.active === 1 ? "" : "s"}`
        : "";
    return `${stat.total} cadastrado${stat.total === 1 ? "" : "s"} ${periodScopeLabel.value}${activePart}`;
  }

  if (stat.active === null) {
    return `${stat.total} cadastrado${stat.total === 1 ? "" : "s"}`;
  }

  const inactive = Math.max(0, stat.total - stat.active);

  if (inactive === 0) {
    return `${stat.total} cadastrado${stat.total === 1 ? "" : "s"}`;
  }

  return `${stat.active} ativo${stat.active === 1 ? "" : "s"} · ${inactive} inativo${inactive === 1 ? "" : "s"}`;
}

function buildPlansSubtitle(stat: CountStat): string {
  if (stat.total === null) return "—";

  if (periodScopeLabel.value) {
    return `${stat.total} plano${stat.total === 1 ? "" : "s"} ${periodScopeLabel.value}`;
  }

  if (stat.active === null || stat.active === stat.total) {
    return `${stat.total} plano${stat.total === 1 ? "" : "s"} ativo${stat.total === 1 ? "" : "s"}`;
  }

  return `${stat.active} ativo${stat.active === 1 ? "" : "s"} · ${stat.total - stat.active} inativo${stat.total - stat.active === 1 ? "" : "s"}`;
}

function formatMoney(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return formatCurrency(value);
}

const financeStatCards = computed(() => {
  const stats = financeStats.value;
  const scope = periodScopeLabel.value;

  return [
    {
      key: "payments-received",
      label: "Recebimentos",
      value: loading.value ? "..." : formatMoney(stats?.receivedTotal),
      subtitle: stats
        ? scope
          ? `${stats.receivedCount} pagamento${stats.receivedCount === 1 ? "" : "s"} ${scope}`
          : `${stats.receivedCount} pagamento${stats.receivedCount === 1 ? "" : "s"} registrado${stats.receivedCount === 1 ? "" : "s"}`
        : "—",
      icon: "la la-money-bill-wave",
      tone: "success",
      to: "/payments",
      visible: canViewPayments.value,
    },
    {
      key: "charges-open",
      label: "Cobranças pendentes",
      value: loading.value ? "..." : formatMoney(stats?.openTotal),
      subtitle: stats
        ? `${stats.openCount} aberta${stats.openCount === 1 ? "" : "s"} · situação atual`
        : "—",
      icon: "la la-file-invoice",
      tone: "info",
      to: "/charges",
      visible: canViewCharges.value,
    },
    {
      key: "charges-overdue",
      label: "Inadimplentes",
      value: loading.value ? "..." : formatMoney(stats?.overdueTotal),
      subtitle: stats
        ? `${stats.overdueCount} cobrança${stats.overdueCount === 1 ? "" : "s"} atrasada${stats.overdueCount === 1 ? "" : "s"}`
        : "—",
      icon: "la la-exclamation-triangle",
      tone: "danger",
      to: "/charges",
      visible: canViewCharges.value,
    },
    {
      key: "charges-outstanding",
      label: "Total a receber",
      value: loading.value ? "..." : formatMoney(stats?.totalOutstanding),
      subtitle: stats
        ? stats.partialCount > 0
          ? `Inclui ${stats.partialCount} parcial${stats.partialCount === 1 ? "" : "es"} · situação atual`
          : "Abertas, atrasadas e saldos parciais"
        : "—",
      icon: "la la-hand-holding-usd",
      tone: "warning",
      to: "/charges",
      visible: canViewCharges.value,
    },
  ].filter((card) => card.visible);
});

const statCards = computed(() =>
  [
    {
      key: "students",
      label: "Alunos",
      value: formatCount(students.value.total),
      subtitle: buildPeopleSubtitle(students.value),
      icon: "la la-users",
      tone: "primary",
      to: "/students",
      visible: canViewStudents.value,
    },
    {
      key: "teachers",
      label: "Professores",
      value: formatCount(teachers.value.total),
      subtitle: buildPeopleSubtitle(teachers.value),
      icon: "la la-chalkboard-teacher",
      tone: "warning",
      to: "/teachers",
      visible: canViewTeachers.value,
    },
    {
      key: "leads",
      label: "Interessados",
      value: formatCount(leadsTotal.value),
      subtitle:
        leadsTotal.value !== null
          ? periodScopeLabel.value
            ? `${leadsTotal.value} captado${leadsTotal.value === 1 ? "" : "s"} ${periodScopeLabel.value}`
            : `${leadsTotal.value} no funil comercial`
          : "—",
      icon: "la la-user-plus",
      tone: "info",
      to: "/leads",
      visible: canViewLeads.value,
    },
    {
      key: "experimental",
      label: "Aulas experimentais",
      value: formatCount(experimentalTotal.value),
      subtitle:
        experimentalScheduled.value !== null && experimentalConversions.value !== null
          ? periodScopeLabel.value
            ? `${experimentalTotal.value ?? 0} aula${(experimentalTotal.value ?? 0) === 1 ? "" : "s"} ${periodScopeLabel.value}`
            : `${experimentalScheduled.value} agendada${experimentalScheduled.value === 1 ? "" : "s"} · ${experimentalConversions.value} conversão${experimentalConversions.value === 1 ? "" : "ões"}`
          : "—",
      icon: "la la-flask",
      tone: "success",
      to: "/experimental-classes",
      visible: canViewExperimentalClasses.value,
    },
    {
      key: "enrollments-pending",
      label: "Matrículas pendentes",
      value: formatCount(enrollmentsPending.value),
      subtitle: periodScopeLabel.value
        ? `Pendentes ${periodScopeLabel.value}`
        : "Aguardando preenchimento ou confirmação",
      icon: "la la-clock",
      tone: "info",
      to: "/enrollments",
      visible: canViewEnrollments.value,
    },
    {
      key: "enrollments-confirmed",
      label: "Matrículas confirmadas",
      value: formatCount(enrollmentsConfirmed.value),
      subtitle: periodScopeLabel.value
        ? `Confirmadas ${periodScopeLabel.value}`
        : "Matrículas concluídas",
      icon: "la la-check-circle",
      tone: "success",
      to: "/enrollments",
      visible: canViewEnrollments.value,
    },
    {
      key: "plans",
      label: "Planos comerciais",
      value: formatCount(plans.value.total),
      subtitle: buildPlansSubtitle(plans.value),
      icon: "la la-file-invoice-dollar",
      tone: "secondary",
      to: "/plans",
      visible: canViewPlans.value,
    },
    {
      key: "users",
      label: "Usuários do sistema",
      value: formatCount(usersTotal.value),
      subtitle:
        canViewRoles.value && rolesTotal.value !== null && usersTotal.value !== null
          ? `${usersTotal.value} cadastrado${usersTotal.value === 1 ? "" : "s"} · ${rolesTotal.value} perfil${rolesTotal.value === 1 ? "" : "s"}`
          : usersTotal.value !== null
            ? `${usersTotal.value} cadastrado${usersTotal.value === 1 ? "" : "s"}`
            : "—",
      icon: "la la-id-badge",
      tone: "danger",
      to: "/users",
      visible: canViewUsers.value,
    },
  ].filter((card) => card.visible)
);

function formatDate(value: string | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR");
}

function formatDateTime(value: string | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInterestedName(item: ExperimentalClass): string {
  return (
    item.relationships?.interested?.name ??
    item.interested?.name ??
    `Lead #${item.interested_id}`
  );
}

function getTeacherName(item: ExperimentalClass): string {
  return item.relationships?.teacher?.name ?? item.teacher?.name ?? "Sem professor";
}

function formatExperimentalStatus(status: string): { label: string; cls: string } {
  const map: Record<string, { label: string; cls: string }> = {
    agendada: { label: "Agendada", cls: "badge-warning" },
    realizada: { label: "Realizada", cls: "badge-success" },
    cancelada: { label: "Cancelada", cls: "badge-danger" },
    scheduled: { label: "Agendada", cls: "badge-warning" },
  };

  return map[status?.toLowerCase()] ?? { label: status, cls: "badge-secondary" };
}

const funnelSteps = computed(() => {
  const leads = leadsTotal.value ?? 0;
  const scheduled = experimentalScheduled.value ?? 0;
  const conversions = experimentalConversions.value ?? 0;
  const confirmed = enrollmentsConfirmed.value ?? 0;
  const max = Math.max(leads, scheduled, conversions, confirmed, 1);

  return [
    {
      key: "leads",
      label: "Interessados",
      value: leads,
      percent: Math.round((leads / max) * 100),
      color: "dashboard-funnel__bar--info",
      visible: canViewLeads.value,
    },
    {
      key: "scheduled",
      label: "Aulas agendadas",
      value: scheduled,
      percent: Math.round((scheduled / max) * 100),
      color: "dashboard-funnel__bar--warning",
      visible: canViewExperimentalClasses.value,
    },
    {
      key: "conversions",
      label: "Conversões",
      value: conversions,
      percent: Math.round((conversions / max) * 100),
      color: "dashboard-funnel__bar--success",
      visible: canViewExperimentalClasses.value,
    },
    {
      key: "enrollments",
      label: "Matrículas confirmadas",
      value: confirmed,
      percent: Math.round((confirmed / max) * 100),
      color: "dashboard-funnel__bar--primary",
      visible: canViewEnrollments.value,
    },
  ].filter((step) => step.visible);
});

const showFunnel = computed(() => funnelSteps.value.length > 0);

const showUpcomingClasses = computed(
  () => canViewExperimentalClasses.value && upcomingClasses.value.length > 0
);
const showPendingEnrollments = computed(
  () => canViewEnrollments.value && pendingEnrollments.value.length > 0
);
const showActivitySection = computed(
  () => showUpcomingClasses.value || showPendingEnrollments.value || loading.value
);

const showFinanceActivity = computed(
  () =>
    loading.value ||
    (canViewPayments.value && recentPayments.value.length > 0) ||
    (canViewCharges.value && pendingCharges.value.length > 0)
);

function getPaymentStudentName(payment: PaymentWithReceipt): string {
  const charge = getPaymentCharge(payment);
  const student = charge ? getChargeStudent(charge) : null;

  return student?.name ?? "—";
}

function pickRecentPayments(
  payments: PaymentWithReceipt[],
  range = periodRange.value
): PaymentWithReceipt[] {
  const filtered = range.start
    ? payments.filter((payment) => isDateWithinPeriod(payment.paid_at, range))
    : payments;

  return [...filtered]
    .sort(
      (a, b) =>
        new Date(b.paid_at ?? 0).getTime() - new Date(a.paid_at ?? 0).getTime()
    )
    .slice(0, 5);
}

function pickPendingCharges(charges: Charge[]): Charge[] {
  return charges
    .filter((charge) => charge.status === "open" || charge.status === "overdue")
    .sort((a, b) => {
      const priority = (status: string) => (status === "overdue" ? 0 : 1);
      const byPriority = priority(a.status) - priority(b.status);

      if (byPriority !== 0) return byPriority;

      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 5);
}

function countInPeriod<T extends { created_at?: string | null }>(
  items: T[],
  apiTotal: number,
  range = periodRange.value
): number {
  if (!range.start) return apiTotal;
  return filterByCreatedAt(items, range).length;
}

function isActiveStatus(status?: string | null): boolean {
  return (status ?? "").toLowerCase() === "active" || (status ?? "").toLowerCase() === "ativo";
}

async function loadStats() {
  loading.value = true;

  const range = periodRange.value;
  const requests: Promise<void>[] = [];

  if (canViewStudents.value) {
    requests.push(
      listStudents({ page: 1, limit: 500 })
        .then((result) => {
          const filtered = filterByCreatedAt(result.data, range);
          students.value.total = countInPeriod(result.data, result.total, range);
          students.value.active = filtered.filter((item) => isActiveStatus(item.status)).length;
        })
        .catch(() => undefined)
    );
  }

  if (canViewTeachers.value) {
    requests.push(
      listTeachers({ page: 1, limit: 500 })
        .then((result) => {
          const filtered = filterByCreatedAt(result.data, range);
          teachers.value.total = countInPeriod(result.data, result.total, range);
          teachers.value.active = filtered.filter((item) => isActiveStatus(item.status)).length;
        })
        .catch(() => undefined)
    );
  }

  if (canViewPlans.value) {
    requests.push(
      listPlans({ page: 1, limit: 500 })
        .then((result) => {
          const filtered = filterByCreatedAt(result.data, range);
          plans.value.total = countInPeriod(result.data, result.total, range);
          plans.value.active = filtered.filter((item) => item.active).length;
        })
        .catch(() => undefined)
    );
  }

  if (canViewUsers.value) {
    requests.push(
      listUsers({ page: 1, limit: 500 })
        .then((users) => {
          usersTotal.value = countInPeriod(users.data, users.total, range);
        })
        .catch(() => undefined)
    );
  }

  if (canViewRoles.value) {
    requests.push(
      listRoles({ page: 1, limit: 500 })
        .then((roles) => {
          rolesTotal.value = countInPeriod(roles.data, roles.total, range);
        })
        .catch(() => undefined)
    );
  }

  if (canViewLeads.value) {
    requests.push(
      listLeads({ page: 1, limit: 500 })
        .then((result) => {
          leadsTotal.value = countInPeriod(result.data, result.total, range);
        })
        .catch(() => undefined)
    );
  }

  if (canViewExperimentalClasses.value) {
    requests.push(
      listExperimentalClasses({ page: 1, limit: 500 })
        .then(async (result) => {
          const inPeriod = filterByCreatedAt(result.data, range);
          experimentalTotal.value = countInPeriod(result.data, result.total, range);
          experimentalConversions.value = inPeriod.filter((item) => item.conversao).length;

          const scheduledClasses = result.data.filter(
            (item) =>
              item.status_class?.toLowerCase() === "agendada" &&
              isDateWithinPeriod(item.date_class, range)
          );

          if (range.start) {
            experimentalScheduled.value = scheduledClasses.length;
          } else {
            const scheduledResult = await listExperimentalClasses({
              page: 1,
              limit: 1,
              status_class: "agendada",
            });
            experimentalScheduled.value = scheduledResult.total;
          }

          upcomingClasses.value = (range.start ? scheduledClasses : result.data.filter(
            (item) => item.status_class?.toLowerCase() === "agendada"
          ))
            .sort(
              (a, b) =>
                new Date(a.date_class).getTime() - new Date(b.date_class).getTime()
            )
            .slice(0, 5);
        })
        .catch(() => undefined)
    );
  }

  if (canViewEnrollments.value) {
    requests.push(
      listEnrollments({ page: 1, limit: 500 })
        .then(async (result) => {
          if (!range.start) {
            const [pendingResult, confirmedResult, pendingList] = await Promise.all([
              listEnrollments({ page: 1, limit: 1, status: "pending" }),
              listEnrollments({ page: 1, limit: 1, status: "confirmed" }),
              listEnrollments({ page: 1, limit: 5, status: "pending" }),
            ]);
            enrollmentsPending.value = pendingResult.total;
            enrollmentsConfirmed.value = confirmedResult.total;
            pendingEnrollments.value = pendingList.data;
            return;
          }

          const inPeriod = filterByCreatedAt(result.data, range);
          enrollmentsPending.value = inPeriod.filter((item) => item.status === "pending").length;
          enrollmentsConfirmed.value = inPeriod.filter((item) => item.status === "confirmed").length;
          pendingEnrollments.value = inPeriod
            .filter((item) => item.status === "pending")
            .sort(
              (a, b) =>
                new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
            )
            .slice(0, 5);
        })
        .catch(() => undefined)
    );
  }

  if (canViewCharges.value || canViewPayments.value) {
    requests.push(
      Promise.all([
        canViewCharges.value
          ? listCharges({ page: 1, limit: 500 })
          : Promise.resolve({ data: [], total: 0 }),
        canViewPayments.value
          ? listPayments({ page: 1, limit: 500 })
          : Promise.resolve({ data: [], total: 0 }),
      ])
        .then(([chargesResult, paymentsResult]) => {
          financeStats.value = buildFinanceSnapshot(
            chargesResult.data,
            paymentsResult.data,
            range
          );
          recentPayments.value = canViewPayments.value
            ? pickRecentPayments(paymentsResult.data, range)
            : [];
          pendingCharges.value = canViewCharges.value
            ? pickPendingCharges(chargesResult.data)
            : [];
        })
        .catch(() => {
          financeStats.value = null;
          recentPayments.value = [];
          pendingCharges.value = [];
        })
    );
  } else {
    financeStats.value = null;
    recentPayments.value = [];
    pendingCharges.value = [];
  }

  await Promise.all(requests);
  loading.value = false;
}

function handlePeriodChange() {
  loadStats();
}

onMounted(loadStats);
</script>

<template>
  <div class="container-fluid dashboard-page">
    <div class="row page-titles mx-0 dashboard-header">
      <div class="col-sm-7 col-lg-8 p-md-0">
        <div class="welcome-text">
          <h4>{{ greeting }}, {{ auth.user?.name ?? "usuário" }}!</h4>
          <p class="dashboard-header__date mb-1">{{ todayLabel }}</p>
          <p class="mb-0">Resumo da operação da EnglishTech</p>
        </div>
      </div>
      <div
        class="col-sm-5 col-lg-4 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex align-items-end"
      >
        <div class="dashboard-period-filter w-100 w-sm-auto">
          <label for="dashboard-period" class="form-label mb-1">Período</label>
          <select
            id="dashboard-period"
            v-model="selectedPeriod"
            class="form-select form-select-sm"
            :disabled="loading"
            @change="handlePeriodChange"
          >
            <option
              v-for="option in DASHBOARD_PERIOD_OPTIONS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="statCards.length" class="row dashboard-stats">
      <div
        v-for="stat in statCards"
        :key="stat.key"
        class="col-xl-3 col-lg-4 col-sm-6"
      >
        <RouterLink :to="stat.to" class="dashboard-stat-link">
          <div class="dashboard-stat-card" :class="`dashboard-stat-card--${stat.tone}`">
            <span class="dashboard-stat-card__icon">
              <i :class="stat.icon"></i>
            </span>
            <div class="dashboard-stat-card__content">
              <p class="dashboard-stat-card__label">{{ stat.label }}</p>
              <p class="dashboard-stat-card__value">
                {{ loading ? "..." : stat.value }}
              </p>
              <p class="dashboard-stat-card__subtitle">{{ stat.subtitle }}</p>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>

    <div
      v-if="canViewCharges || canViewPayments"
      class="dashboard-finance-section"
    >
      <div class="dashboard-section-heading">
        <h5 class="dashboard-section-heading__title">Financeiro</h5>
        <p class="dashboard-section-heading__subtitle mb-0">
          Recebimentos no período selecionado e situação atual das cobranças
        </p>
      </div>
      <div v-if="financeStatCards.length" class="row dashboard-stats">
        <div
          v-for="stat in financeStatCards"
          :key="stat.key"
          class="col-xl-3 col-lg-4 col-sm-6"
        >
          <RouterLink :to="stat.to" class="dashboard-stat-link">
            <div class="dashboard-stat-card" :class="`dashboard-stat-card--${stat.tone}`">
              <span class="dashboard-stat-card__icon">
                <i :class="stat.icon"></i>
              </span>
              <div class="dashboard-stat-card__content">
                <p class="dashboard-stat-card__label">{{ stat.label }}</p>
                <p class="dashboard-stat-card__value dashboard-stat-card__value--money">
                  {{ stat.value }}
                </p>
                <p class="dashboard-stat-card__subtitle">{{ stat.subtitle }}</p>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>

      <div v-if="showFinanceActivity" class="row g-3 dashboard-finance-activity">
        <div
          v-if="canViewPayments"
          :class="canViewCharges ? 'col-xl-6' : 'col-12'"
        >
          <div class="card dashboard-panel h-100">
            <div
              class="card-header border-0 pb-0 d-flex flex-wrap justify-content-between align-items-center gap-2"
            >
              <div>
                <h4 class="card-title mb-1">Últimos recebimentos</h4>
                <p class="text-muted mb-0 small">
                  Pagamentos registrados{{ periodScopeLabel ? ` ${periodScopeLabel}` : "" }}
                </p>
              </div>
              <RouterLink to="/payments" class="btn btn-sm btn-outline-primary">
                Ver pagamentos
              </RouterLink>
            </div>
            <div class="card-body">
              <div v-if="loading" class="text-center py-4 text-muted">Carregando...</div>
              <div
                v-else-if="recentPayments.length === 0"
                class="text-center py-4 text-muted"
              >
                Nenhum recebimento no período selecionado.
              </div>
              <div v-else class="table-responsive">
                <table class="table table-sm dashboard-table mb-0">
                  <thead>
                    <tr>
                      <th>Pagamento</th>
                      <th>Aluno</th>
                      <th>Cobrança</th>
                      <th>Valor</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="payment in recentPayments" :key="payment.id">
                      <td>
                        <strong>#{{ payment.id }}</strong>
                      </td>
                      <td>{{ getPaymentStudentName(payment) }}</td>
                      <td>
                        <RouterLink
                          v-if="canViewCharges && payment.charge_id"
                          :to="`/charges/${payment.charge_id}/edit`"
                          class="dashboard-table__link"
                        >
                          #{{ payment.charge_id }}
                        </RouterLink>
                        <span v-else>#{{ payment.charge_id }}</span>
                      </td>
                      <td class="text-nowrap">{{ formatMoney(Number(payment.amount)) }}</td>
                      <td class="text-nowrap">
                        {{ formatFinanceDateTime(payment.paid_at) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div v-if="canViewCharges" :class="canViewPayments ? 'col-xl-6' : 'col-12'">
          <div class="card dashboard-panel h-100">
            <div
              class="card-header border-0 pb-0 d-flex flex-wrap justify-content-between align-items-center gap-2"
            >
              <div>
                <h4 class="card-title mb-1">Cobranças pendentes</h4>
                <p class="text-muted mb-0 small">Abertas e inadimplentes · situação atual</p>
              </div>
              <RouterLink to="/charges" class="btn btn-sm btn-outline-primary">
                Ver cobranças
              </RouterLink>
            </div>
            <div class="card-body">
              <div v-if="loading" class="text-center py-4 text-muted">Carregando...</div>
              <div
                v-else-if="pendingCharges.length === 0"
                class="text-center py-4 text-muted"
              >
                Nenhuma cobrança pendente no momento.
              </div>
              <div v-else class="table-responsive">
                <table class="table table-sm dashboard-table mb-0">
                  <thead>
                    <tr>
                      <th>Cobrança</th>
                      <th>Aluno</th>
                      <th>Vencimento</th>
                      <th>Valor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="charge in pendingCharges" :key="charge.id">
                      <td>
                        <RouterLink
                          :to="`/charges/${charge.id}/edit`"
                          class="dashboard-table__link"
                        >
                          #{{ charge.id }}
                        </RouterLink>
                      </td>
                      <td>{{ getChargeStudent(charge)?.name ?? "—" }}</td>
                      <td class="text-nowrap">{{ formatDate(charge.due_date) }}</td>
                      <td class="text-nowrap">
                        {{ formatMoney(Number(charge.expected_amount)) }}
                      </td>
                      <td>
                        <span
                          class="badge"
                          :class="formatChargeStatus(charge.status).class"
                        >
                          {{ formatChargeStatus(charge.status).label }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row dashboard-main-row g-3">
      <div v-if="showFunnel" class="col-xl-6">
        <div class="card dashboard-panel dashboard-funnel-panel h-100">
          <div class="card-header border-0 pb-0">
            <h4 class="card-title mb-1">Funil comercial</h4>
            <p class="text-muted mb-0 small">
              Da captação de interessados até a matrícula confirmada
            </p>
          </div>
          <div class="card-body dashboard-funnel-panel__body">
            <div v-if="loading" class="text-center py-4 text-muted">Carregando...</div>
            <div v-else class="dashboard-funnel dashboard-funnel--stretch">
              <div
                v-for="step in funnelSteps"
                :key="step.key"
                class="dashboard-funnel__item"
              >
                <div class="dashboard-funnel__header">
                  <span>{{ step.label }}</span>
                  <strong>{{ step.value }}</strong>
                </div>
                <div class="dashboard-funnel__track">
                  <div
                    class="dashboard-funnel__bar"
                    :class="step.color"
                    :style="{ width: `${step.percent}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        :class="[
          showFunnel ? 'col-xl-6' : 'col-12',
          !showActivitySection && !showFunnel ? 'd-none' : '',
        ]"
      >
        <div class="card dashboard-panel h-100">
          <div
            class="card-header border-0 pb-0 d-flex flex-wrap justify-content-between align-items-center gap-2"
          >
            <div>
              <h4 class="card-title mb-1">Próximas aulas experimentais</h4>
              <p class="text-muted mb-0 small">Aulas agendadas mais próximas</p>
            </div>
            <RouterLink
              v-if="canViewExperimentalClasses"
              to="/experimental-classes"
              class="btn btn-sm btn-outline-primary"
            >
              Ver todas
            </RouterLink>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4 text-muted">Carregando...</div>
            <div
              v-else-if="!canViewExperimentalClasses"
              class="text-center py-4 text-muted"
            >
              Sem permissão para visualizar aulas experimentais.
            </div>
            <div v-else-if="upcomingClasses.length === 0" class="text-center py-4 text-muted">
              Nenhuma aula experimental agendada no momento.
            </div>
            <div v-else class="table-responsive">
              <table class="table table-sm dashboard-table mb-0">
                <thead>
                  <tr>
                    <th>Interessado</th>
                    <th>Professor</th>
                    <th>Data</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in upcomingClasses" :key="item.id">
                    <td>
                      <RouterLink
                        :to="`/experimental-classes/${item.id}/edit`"
                        class="dashboard-table__link"
                      >
                        {{ getInterestedName(item) }}
                      </RouterLink>
                    </td>
                    <td>{{ getTeacherName(item) }}</td>
                    <td class="text-nowrap">{{ formatDateTime(item.date_class) }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="formatExperimentalStatus(item.status_class).cls"
                      >
                        {{ formatExperimentalStatus(item.status_class).label }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section
      v-if="showPendingEnrollments || (canViewEnrollments && loading)"
      class="dashboard-enrollments-section"
    >
      <div class="row">
        <div class="col-12">
          <div class="card dashboard-panel dashboard-enrollments-panel">
          <div
            class="card-header border-0 pb-0 d-flex flex-wrap justify-content-between align-items-center gap-2"
          >
            <div>
              <h4 class="card-title mb-1">Matrículas aguardando ação</h4>
              <p class="text-muted mb-0 small">
                Links pendentes de preenchimento ou confirmação
              </p>
            </div>
            <RouterLink to="/enrollments" class="btn btn-sm btn-outline-primary">
              Ver matrículas
            </RouterLink>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4 text-muted">Carregando...</div>
            <div v-else-if="pendingEnrollments.length === 0" class="text-center py-4 text-muted">
              Nenhuma matrícula pendente no momento.
            </div>
            <div v-else class="table-responsive">
              <table class="table table-sm dashboard-table mb-0">
                <thead>
                  <tr>
                    <th>Matrícula</th>
                    <th>Aluno</th>
                    <th>Status</th>
                    <th>Criada em</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in pendingEnrollments" :key="item.id">
                    <td>
                      <RouterLink
                        :to="`/enrollments/${item.id}`"
                        class="dashboard-table__link"
                      >
                        {{ formatEnrollmentNumber(item.id) }}
                      </RouterLink>
                    </td>
                    <td>{{ getEnrollmentStudentName(item) }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="ENROLLMENT_STATUS_CLASSES[item.status]"
                      >
                        {{ ENROLLMENT_STATUS_LABELS[item.status] }}
                      </span>
                    </td>
                    <td class="text-nowrap">{{ formatDate(item.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard-page {
  padding-top: 0.75rem;
}

.dashboard-header {
  align-items: flex-end;
}

.dashboard-header__date {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-gray, #6c757d);
}

.dashboard-period-filter {
  min-width: 11rem;
}

.dashboard-period-filter .form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-gray, #6c757d);
}

.dashboard-stat-link {
  display: block;
  color: inherit;
  text-decoration: none;
  height: 100%;
}

.dashboard-stats > [class*="col-"] {
  margin-bottom: 1rem;
}

.dashboard-stat-link:hover .dashboard-stat-card {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--primary, #600022) 18%, var(--border, #edf0f2));
  box-shadow: 0 6px 18px rgba(96, 0, 34, 0.08);
}

.dashboard-stat-card,
.dashboard-panel {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.dashboard-stat-card {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  min-height: 8.75rem;
  height: 100%;
  padding: 1.125rem 1rem;
  border: 1px solid var(--border, #edf0f2);
  border-radius: 5px;
  background: var(--card, #fff);
}

.dashboard-stat-card__icon {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
}

.dashboard-stat-card__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.dashboard-stat-card__label {
  margin: 0 0 0.35rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-gray, #6c757d);
}

.dashboard-stat-card__value {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-dark, #212529);
}

.dashboard-stat-card__value--money {
  font-size: 1.65rem;
}

.dashboard-finance-section {
  margin-bottom: 1rem;
}

.dashboard-finance-activity {
  margin-top: 0.25rem;
}

.dashboard-section-heading {
  margin-bottom: 0.75rem;
}

.dashboard-section-heading__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-dark, #212529);
}

.dashboard-section-heading__subtitle {
  font-size: 0.8125rem;
  color: var(--text-gray, #6c757d);
}

.dashboard-stat-card__subtitle {
  margin: 0.5rem 0 0;
  min-height: 2.5rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--text-gray, #6c757d);
}

.dashboard-stat-card--primary .dashboard-stat-card__icon {
  background: rgba(69, 43, 144, 0.12);
  color: #452b90;
}

.dashboard-stat-card--warning .dashboard-stat-card__icon {
  background: rgba(255, 171, 45, 0.16);
  color: #d68700;
}

.dashboard-stat-card--info .dashboard-stat-card__icon {
  background: rgba(54, 157, 201, 0.14);
  color: #369dc9;
}

.dashboard-stat-card--success .dashboard-stat-card__icon {
  background: rgba(55, 168, 101, 0.12);
  color: #37a865;
}

.dashboard-stat-card--danger .dashboard-stat-card__icon {
  background: rgba(220, 53, 69, 0.12);
  color: #dc3545;
}

.dashboard-stat-card--secondary .dashboard-stat-card__icon {
  background: rgba(108, 117, 125, 0.12);
  color: #6c757d;
}

.dashboard-panel {
  margin-bottom: 0;
}

.dashboard-main-row {
  align-items: stretch;
  margin-bottom: 1rem;
}

.dashboard-funnel-panel {
  display: flex;
  flex-direction: column;
}

.dashboard-funnel-panel__body {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.dashboard-funnel--stretch {
  flex: 1 1 auto;
  justify-content: space-between;
  min-height: 100%;
}

.dashboard-enrollments-section {
  margin-top: 1rem;
  padding-top: 0;
  border-top: none;
}

.dashboard-enrollments-panel {
  margin-bottom: 0;
  border-color: color-mix(in srgb, var(--primary, #600022) 12%, var(--border, #edf0f2));
  box-shadow: 0 0.35rem 1rem rgba(0, 0, 0, 0.12);
}

.dashboard-enrollments-panel .card-header {
  background: color-mix(in srgb, var(--primary, #600022) 8%, var(--card, #fff));
}

.dashboard-funnel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dashboard-funnel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
  font-size: 0.9rem;
}

.dashboard-funnel__track {
  height: 0.65rem;
  background: color-mix(in srgb, var(--text, #212529) 8%, transparent);
  border-radius: 999px;
  overflow: hidden;
}

.dashboard-funnel__bar {
  height: 100%;
  border-radius: 999px;
  min-width: 0.5rem;
  transition: width 0.35s ease;
}

.dashboard-funnel__bar--info {
  background: #369dc9;
}

.dashboard-funnel__bar--warning {
  background: #ffab2d;
}

.dashboard-funnel__bar--success {
  background: #37a865;
}

.dashboard-funnel__bar--primary {
  background: #452b90;
}

.dashboard-table {
  font-size: 0.9rem;
}

.dashboard-table th {
  font-weight: 600;
  color: var(--text-gray, #6c757d);
  border-top: none;
}

.dashboard-table__link {
  color: var(--text-dark, inherit);
  font-weight: 600;
  text-decoration: none;
}

.dashboard-table__link:hover {
  color: var(--primary, #452b90);
}
</style>
