<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { listPlans } from "@/lib/plans";
import { listRoles } from "@/lib/roles";
import { listStudents } from "@/lib/students";
import { listTeachers } from "@/lib/teachers";
import { listUsers } from "@/lib/users";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const { canViewStudents, canViewTeachers, canViewPlans, canViewUsers, canViewRoles } =
  usePermissions();

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

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
});

function formatCount(value: number | null): string {
  if (value === null) return "—";
  return String(value);
}

function getActivePercent(stat: CountStat): number {
  if (stat.total === null || stat.total <= 0) return 0;
  if (stat.active === null) return 100;
  return Math.min(100, Math.round((stat.active / stat.total) * 100));
}

function formatEntityHint(
  stat: CountStat,
  entityLabel: string,
  activeLabel = "ativo"
): string {
  if (stat.total === null) return "";

  if (stat.active === null) {
    return `${stat.total} ${entityLabel}${stat.total === 1 ? "" : "s"}`;
  }

  const inactive = Math.max(0, stat.total - stat.active);

  if (inactive === 0) {
    return `${stat.active} ${activeLabel}${stat.active === 1 ? "" : "s"}`;
  }

  return `${stat.active} ${activeLabel}${stat.active === 1 ? "" : "s"} · ${inactive} inativo${inactive === 1 ? "" : "s"}`;
}

function formatProgressHint(stat: CountStat): string {
  if (stat.total === null || stat.active === null || stat.total <= 0) return "";
  return `${getActivePercent(stat)}% ativos`;
}

const statCards = computed(() => {
  const cards = [
    {
      key: "students",
      label: "Total de alunos",
      value: formatCount(students.value.total),
      hint: formatEntityHint(students.value, "cadastrado"),
      progressHint: formatProgressHint(students.value),
      progress: getActivePercent(students.value),
      icon: "la la-users",
      color: "bg-primary",
      to: "/students",
      visible: canViewStudents.value,
    },
    {
      key: "teachers",
      label: "Total de professores",
      value: formatCount(teachers.value.total),
      hint: formatEntityHint(teachers.value, "cadastrado"),
      progressHint: formatProgressHint(teachers.value),
      progress: getActivePercent(teachers.value),
      icon: "la la-chalkboard-teacher",
      color: "bg-warning",
      to: "/teachers",
      visible: canViewTeachers.value,
    },
    {
      key: "plans",
      label: "Planos comerciais",
      value: formatCount(plans.value.total),
      hint: formatEntityHint(plans.value, "plano", "ativo"),
      progressHint: formatProgressHint(plans.value),
      progress: getActivePercent(plans.value),
      icon: "la la-file-invoice-dollar",
      color: "bg-secondary",
      to: "/plans",
      visible: canViewPlans.value,
    },
    {
      key: "users",
      label: "Usuários do sistema",
      value: formatCount(usersTotal.value),
      hint:
        canViewRoles.value && rolesTotal.value !== null && usersTotal.value !== null
          ? `${usersTotal.value} cadastrados · ${rolesTotal.value} perfil${rolesTotal.value === 1 ? "" : "s"}`
          : usersTotal.value !== null
            ? `${usersTotal.value} cadastrados`
            : "",
      progressHint: "Acesso administrativo",
      progress: 100,
      icon: "la la-id-badge",
      color: "bg-danger",
      to: "/users",
      visible: canViewUsers.value,
    },
  ];

  return cards.filter((card) => card.visible);
});

async function loadCountStat(
  loader: () => Promise<{ total: number }>,
  target: { value: CountStat }
) {
  const result = await loader();
  target.value.total = result.total;
}

async function loadActiveCount(
  loader: () => Promise<{ total: number }>,
  target: { value: CountStat }
) {
  const result = await loader();
  target.value.active = result.total;
}

async function loadStats() {
  loading.value = true;

  try {
    const requests: Promise<void>[] = [];

    if (canViewStudents.value) {
      requests.push(
        loadCountStat(() => listStudents({ page: 1, limit: 1 }), students),
        loadActiveCount(() => listStudents({ page: 1, limit: 1, status: "active" }), students)
      );
    }

    if (canViewTeachers.value) {
      requests.push(
        loadCountStat(() => listTeachers({ page: 1, limit: 1 }), teachers),
        loadActiveCount(() => listTeachers({ page: 1, limit: 1, status: "active" }), teachers)
      );
    }

    if (canViewPlans.value) {
      requests.push(
        loadCountStat(() => listPlans({ page: 1, limit: 1 }), plans),
        loadActiveCount(() => listPlans({ page: 1, limit: 1, active: true }), plans)
      );
    }

    if (canViewUsers.value) {
      requests.push(
        listUsers({ page: 1, limit: 1 }).then((users) => {
          usersTotal.value = users.total;
        })
      );
    }

    if (canViewRoles.value) {
      requests.push(
        listRoles({ page: 1, limit: 1 }).then((roles) => {
          rolesTotal.value = roles.total;
        })
      );
    }

    await Promise.all(requests);
  } catch {
    students.value = { total: null, active: null };
    teachers.value = { total: null, active: null };
    plans.value = { total: null, active: null };
    usersTotal.value = null;
    rolesTotal.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(loadStats);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>{{ greeting }}, {{ auth.user?.name ?? "usuário" }}!</h4>
          <p class="mb-0">Resumo da operação da EnglishTech</p>
        </div>
      </div>
    </div>

    <div class="row">
      <div
        v-for="stat in statCards"
        :key="stat.key"
        class="col-xl-3 col-xxl-3 col-sm-6"
      >
        <component
          :is="stat.to ? RouterLink : 'div'"
          :to="stat.to || undefined"
          class="dashboard-stat-link"
        >
          <div class="widget-stat card" :class="stat.color">
            <div class="card-body p-4">
              <div class="media">
                <span class="me-3">
                  <i :class="stat.icon"></i>
                </span>
                <div class="media-body text-white">
                  <p class="mb-1 dashboard-stat-label">{{ stat.label }}</p>
                  <h3 class="text-white mb-0 dashboard-stat-value">
                    {{ loading ? "..." : stat.value }}
                  </h3>
                  <div class="progress mb-2 bg-white mt-3">
                    <div
                      class="progress-bar progress-animated bg-white"
                      :style="{ width: `${loading ? 0 : stat.progress}%` }"
                    ></div>
                  </div>
                  <small v-if="stat.hint" class="dashboard-stat-hint">{{ stat.hint }}</small>
                </div>
              </div>
            </div>
          </div>
        </component>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-stat-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.dashboard-stat-link:hover .widget-stat.card {
  transform: translateY(-2px);
  box-shadow: 0 0.75rem 1.5rem rgba(20, 24, 31, 0.12);
}

.widget-stat.card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.dashboard-stat-label {
  font-size: 0.875rem !important;
  font-weight: 500;
  text-transform: none !important;
  opacity: 0.95;
}

.dashboard-stat-value {
  font-size: 2.5rem !important;
  font-weight: 700 !important;
  line-height: 1.1;
  color: #fff !important;
  margin: 0.25rem 0 0;
}

.dashboard-stat-hint {
  display: block;
  font-size: 0.8125rem;
  line-height: 1.4;
  opacity: 0.9;
}
</style>
