<script lang="ts" setup>
/**
 * ConfiguracoesHostView.vue
 *
 * Workspace de Configurações — consolida quatro abas administrativas:
 *   • Usuários   (users.view)
 *   • Perfis     (roles.view)
 *   • Permissões (permissions.view)
 *   • Auditoria  (audits.view)
 *
 * ── Redirect guard ──────────────────────────────────────────────────────────
 * Ao montar, verifica se a aba padrão está autorizada.
 * Se não, redireciona para a primeira aba autorizada encontrada na ordem
 * declarada em `tabs`. Se nenhuma estiver autorizada, encaminha para 403.
 * Isso evita que um usuário sem `users.view` veja a tela em branco ou
 * receba um 403 inesperado ao abrir /configuracoes.
 *
 * ── keep-alive ──────────────────────────────────────────────────────────────
 * Aplicado APENAS às abas de formulário/gerenciamento estável:
 *   • UsuariosTab    → preserva filtros e posição da paginação
 *   • PerfisTab      → preserva filtros e posição da paginação
 *   • PermissoesTab  → catálogo read-only, raramente muda; cache OK
 *
 * EXCLUÍDA do keep-alive:
 *   • AuditoriaTab   → log de atividade em tempo real; dados devem ser
 *                      sempre frescos (stale = enganoso para o operador)
 */
import { computed, ref, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";

// Tabs com keep-alive (forms/gerenciamento estável)
import UsuariosTab from "./UsuariosTab.vue";
import PerfisTab from "./PerfisTab.vue";
import PermissoesTab from "./PermissoesTab.vue";

// AuditoriaTab carregada sem keep-alive — stream em tempo real
import AuditoriaTab from "./AuditoriaTab.vue";

const router = useRouter();

const {
  canViewUsers,
  canViewRoles,
  canViewPermissions,
  canViewAudits,
} = usePermissions();

// ── Tab definitions ───────────────────────────────────────────────────────────

type TabKey = "usuarios" | "perfis" | "permissoes" | "auditoria";

interface TabDef {
  key: TabKey;
  label: string;
  icon: string;
  permitted: () => boolean;
  /** true = incluir no keep-alive; false = sempre re-montar */
  cached: boolean;
}

const tabs: TabDef[] = [
  {
    key: "usuarios",
    label: "Usuários",
    icon: "la la-user",
    permitted: () => canViewUsers.value,
    cached: true,
  },
  {
    key: "perfis",
    label: "Perfis",
    icon: "la la-id-badge",
    permitted: () => canViewRoles.value,
    cached: true,
  },
  {
    key: "permissoes",
    label: "Permissões",
    icon: "la la-lock",
    permitted: () => canViewPermissions.value,
    cached: true,
  },
  {
    key: "auditoria",
    label: "Auditoria",
    icon: "la la-history",
    permitted: () => canViewAudits.value,
    cached: false, // leitura em tempo real — sem cache
  },
];

const activeTab = ref<TabKey>("usuarios");

const visibleTabs = computed(() => tabs.filter((t) => t.permitted()));

// ── Redirect guard ────────────────────────────────────────────────────────────
onMounted(() => {
  const first = visibleTabs.value[0];
  if (!first) {
    router.replace("/page-error-403");
    return;
  }
  // Se a aba padrão não está visível (sem permissão), ir para a primeira
  if (!visibleTabs.value.find((t) => t.key === activeTab.value)) {
    activeTab.value = first.key;
  }
});

function selectTab(key: TabKey) {
  activeTab.value = key;
}

// ── keep-alive include list ───────────────────────────────────────────────────
// Mapeia keys das abas com `cached: true` para os nomes de componente
// que o <keep-alive :include> deve preservar.
const keepAliveNames: Record<TabKey, string> = {
  usuarios: "UsuariosTab",
  perfis: "PerfisTab",
  permissoes: "PermissoesTab",
  auditoria: "", // excluída
};

const cachedComponentNames = computed(() =>
  tabs
    .filter((t) => t.cached)
    .map((t) => keepAliveNames[t.key])
    .filter(Boolean)
);
</script>

<template>
  <div class="container-fluid">
    <!-- Page Header -->
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Configurações</h4>
          <p class="mb-0">Usuários, perfis, permissões e auditoria do sistema</p>
        </div>
      </div>
    </div>

    <!-- Tab Navigation + Content -->
    <div class="row">
      <div class="col-12">
        <ul
          class="nav nav-tabs mb-4"
          role="tablist"
          id="configuracoes-host-tabs"
        >
          <li
            v-for="tab in visibleTabs"
            :key="tab.key"
            class="nav-item"
            role="presentation"
          >
            <button
              :id="`config-tab-${tab.key}`"
              class="nav-link"
              :class="{ active: activeTab === tab.key }"
              type="button"
              role="tab"
              :aria-selected="activeTab === tab.key"
              :aria-controls="`config-tabpanel-${tab.key}`"
              @click="selectTab(tab.key)"
            >
              <i :class="[tab.icon, 'me-1']"></i>
              {{ tab.label }}
            </button>
          </li>
        </ul>

        <!--
          keep-alive wraps only the cached tabs (Usuários, Perfis, Permissões).
          AuditoriaTab is rendered outside keep-alive so it always re-mounts
          and fetches fresh data.
        -->
        <div
          id="config-tabpanel-usuarios"
          role="tabpanel"
          :aria-labelledby="'config-tab-usuarios'"
        >
          <keep-alive :include="cachedComponentNames">
            <UsuariosTab v-if="activeTab === 'usuarios'" />
          </keep-alive>
        </div>

        <div
          id="config-tabpanel-perfis"
          role="tabpanel"
          :aria-labelledby="'config-tab-perfis'"
        >
          <keep-alive :include="cachedComponentNames">
            <PerfisTab v-if="activeTab === 'perfis'" />
          </keep-alive>
        </div>

        <div
          id="config-tabpanel-permissoes"
          role="tabpanel"
          :aria-labelledby="'config-tab-permissoes'"
        >
          <keep-alive :include="cachedComponentNames">
            <PermissoesTab v-if="activeTab === 'permissoes'" />
          </keep-alive>
        </div>

        <!--
          AuditoriaTab: rendered WITHOUT keep-alive.
          Every tab switch forces a fresh mount → fresh API call → no stale log data.
        -->
        <div
          id="config-tabpanel-auditoria"
          role="tabpanel"
          :aria-labelledby="'config-tab-auditoria'"
        >
          <AuditoriaTab v-if="activeTab === 'auditoria'" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-tabs .nav-link {
  color: #6c757d;
  font-weight: 500;
}

.nav-tabs .nav-link.active {
  color: var(--primary, #452b90);
  border-bottom: 2px solid var(--primary, #452b90);
  font-weight: 600;
}

.nav-tabs .nav-link:hover:not(.active) {
  color: var(--primary, #452b90);
  background: transparent;
}
</style>
