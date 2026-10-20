<script lang="ts" setup>
/**
 * AulasHostView.vue
 *
 * Workspace de Aulas — consolida:
 *   • Aba "Agenda" → CalendarView (LessonList ou Calendar, depende do tab ativo)
 *   • Aba "Reposições" → AulasReposicoesTab
 *
 * Lógica de redirect guard:
 *   Ao montar, se o usuário não tem permissão para a aba padrão, redireciona
 *   para a primeira aba autorizada. Isso evita 403 silenciosos.
 *
 * keep-alive:
 *   NÃO usado aqui — ambas as abas são listas de leitura com dados
 *   em tempo real (aulas e reposições). Cada troca de aba re-executa
 *   onMounted para garantir dados frescos.
 */
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import AulasReposicoesTab from "./AulasReposicoesTab.vue";

// Lazy-load as abas pesadas
import LessonList from "@/views/admin/lessons/LessonList.vue";

const router = useRouter();
const { canViewLessons, canViewMakeupClasses } = usePermissions();

// ── Tabs ─────────────────────────────────────────────────────────────────────

type TabKey = "aulas" | "reposicoes";

interface Tab {
  key: TabKey;
  label: string;
  icon: string;
  permitted: () => boolean;
}

const tabs: Tab[] = [
  {
    key: "aulas",
    label: "Aulas",
    icon: "la la-chalkboard",
    permitted: () => canViewLessons.value,
  },
  {
    key: "reposicoes",
    label: "Reposições",
    icon: "la la-redo",
    permitted: () => canViewMakeupClasses.value,
  },
];

const activeTab = ref<TabKey>("aulas");

const visibleTabs = computed(() => tabs.filter((t) => t.permitted()));

// ── Redirect guard ────────────────────────────────────────────────────────────
// Se a aba inicial não está autorizada, saltar para a primeira permitida.
// Se nenhuma aba está autorizada, encaminhar para 403.
onMounted(() => {
  const first = visibleTabs.value[0];
  if (!first) {
    router.replace("/page-error-403");
    return;
  }
  activeTab.value = first.key;
});

function selectTab(key: TabKey) {
  activeTab.value = key;
}
</script>

<template>
  <div class="container-fluid">
    <!-- Page Header -->
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Aulas</h4>
          <p class="mb-0">Gerencie o cronograma semanal e as reposições</p>
        </div>
      </div>
      <div
        v-if="canViewLessons"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex align-items-center"
      >
        <RouterLink to="/lessons/create" class="btn btn-primary">
          <i class="la la-plus me-1"></i>Nova aula
        </RouterLink>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="row">
      <div class="col-12">
        <ul class="nav nav-tabs mb-4" role="tablist" id="aulas-host-tabs">
          <li
            v-for="tab in visibleTabs"
            :key="tab.key"
            class="nav-item"
            role="presentation"
          >
            <button
              :id="`aulas-tab-${tab.key}`"
              class="nav-link"
              :class="{ active: activeTab === tab.key }"
              type="button"
              role="tab"
              :aria-selected="activeTab === tab.key"
              :aria-controls="`aulas-tabpanel-${tab.key}`"
              @click="selectTab(tab.key)"
            >
              <i :class="[tab.icon, 'me-1']"></i>
              {{ tab.label }}
            </button>
          </li>
        </ul>

        <!-- Tab Panels
             keep-alive NÃO aplicado: ambas as abas são streams de leitura
             que devem sempre buscar dados frescos ao serem ativadas. -->
        <div
          id="aulas-tabpanel-aulas"
          role="tabpanel"
          :aria-labelledby="'aulas-tab-aulas'"
        >
          <LessonList v-if="activeTab === 'aulas'" />
        </div>

        <div
          id="aulas-tabpanel-reposicoes"
          role="tabpanel"
          :aria-labelledby="'aulas-tab-reposicoes'"
        >
          <AulasReposicoesTab v-if="activeTab === 'reposicoes'" />
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
