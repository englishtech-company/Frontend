<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { PERMISSIONS } from "@/lib/permissions/access";
import { listUsers } from "@/lib/users";
import { listRoles } from "@/lib/roles";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const totalUsers = ref<number | null>(null);
const totalRoles = ref<number | null>(null);
const loading = ref(true);

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
});

const canViewUsers = computed(() => auth.hasPermission(PERMISSIONS.users.view));
const canViewRoles = computed(() => auth.hasPermission(PERMISSIONS.roles.view));
const canViewPermissions = computed(() =>
  auth.hasPermission(PERMISSIONS.permissions.view)
);
const canViewAudits = computed(() => auth.hasPermission(PERMISSIONS.audits.view));

const quickLinks = computed(() =>
  [
    {
      to: "/users",
      label: "Usuários",
      icon: "la la-user",
      visible: canViewUsers.value,
    },
    {
      to: "/roles",
      label: "Perfis",
      icon: "la la-id-badge",
      visible: canViewRoles.value,
    },
    {
      to: "/permissions",
      label: "Permissões",
      icon: "la la-key",
      visible: canViewPermissions.value,
    },
    {
      to: "/audits",
      label: "Auditoria",
      icon: "la la-history",
      visible: canViewAudits.value,
    },
  ].filter((link) => link.visible)
);

const stats = computed(() => {
  const items = [
    {
      label: "Alunos",
      value: "—",
      hint: "Em breve",
      icon: "la la-users",
      color: "bg-primary",
      visible: true,
    },
    {
      label: "Professores",
      value: "—",
      hint: "Em breve",
      icon: "la la-user",
      color: "bg-warning",
      visible: true,
    },
    {
      label: "Turmas",
      value: "—",
      hint: "Em breve",
      icon: "la la-graduation-cap",
      color: "bg-secondary",
      visible: true,
    },
  ];

  if (canViewUsers.value) {
    items.push({
      label: "Usuários do sistema",
      value: totalUsers.value !== null ? String(totalUsers.value) : "—",
      hint: canViewRoles.value && totalRoles.value !== null ? `${totalRoles.value} perfis` : "",
      icon: "la la-id-badge",
      color: "bg-danger",
      visible: true,
    });
  }

  return items.filter((item) => item.visible);
});

async function loadStats() {
  loading.value = true;

  try {
    const requests: Promise<void>[] = [];

    if (canViewUsers.value) {
      requests.push(
        listUsers({ page: 1, limit: 1 }).then((users) => {
          totalUsers.value = users.total;
        })
      );
    }

    if (canViewRoles.value) {
      requests.push(
        listRoles({ page: 1, limit: 1 }).then((roles) => {
          totalRoles.value = roles.total;
        })
      );
    }

    await Promise.all(requests);
  } catch {
    totalUsers.value = null;
    totalRoles.value = null;
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
          <p class="mb-0">Painel da EnglishTech — escola de inglês</p>
        </div>
      </div>
    </div>

    <div class="row">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="col-xl-3 col-xxl-3 col-sm-6"
      >
        <div class="widget-stat card" :class="stat.color">
          <div class="card-body">
            <div class="media">
              <span class="me-3">
                <i :class="stat.icon"></i>
              </span>
              <div class="media-body text-white">
                <p class="mb-1">{{ stat.label }}</p>
                <h3 class="text-white">
                  {{ loading && stat.value !== "—" ? "..." : stat.value }}
                </h3>
                <small v-if="stat.hint">{{ stat.hint }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xl-8">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title mb-0">Próximos módulos</h4>
          </div>
          <div class="card-body">
            <p class="text-muted mb-3">
              O frontend foi simplificado para começar o desenvolvimento. Os módulos
              abaixo serão implementados conforme o backend estiver pronto.
            </p>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Alunos
                <span class="badge bg-light text-dark">Planejado</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Professores
                <span class="badge bg-light text-dark">Planejado</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Turmas e cursos
                <span class="badge bg-light text-dark">Planejado</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Matrículas e mensalidades
                <span class="badge bg-light text-dark">Planejado</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Auditoria
                <span class="badge bg-success text-white">Disponível</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="quickLinks.length" class="col-xl-4">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title mb-0">Acesso rápido</h4>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <RouterLink
                v-for="link in quickLinks"
                :key="link.to"
                :to="link.to"
                class="btn btn-outline-primary"
              >
                <i :class="`${link.icon} me-1`"></i> {{ link.label }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
