<!-- @format -->
<!--
  RbacAuditPanel.vue
  Dev-only floating panel to inspect and switch RBAC personas live in the browser.
  Only rendered if import.meta.env.DEV is true.
-->
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRoleEmulator } from "@/lib/rbac/useRoleEmulator";
import { type PersonaKey, PERSONAS } from "@/lib/rbac/rbac.personas";
import { useFilteredMenu } from "@/layouts/useFilteredMenu";

const route = useRoute();
const router = useRouter();
const { activePersonaKey, activePersona, emulate, resetEmulation, personaCanRoute } = useRoleEmulator();
const { menuEntries, canAccessSettings } = useFilteredMenu();

const isCollapsed = ref(true);

const currentRoutePermission = computed(() => {
  return (route.meta?.permission as string) || "(Nenhuma / Livre)";
});

const canCurrentPersonaAccessRoute = computed(() => {
  if (!activePersona.value) return true;
  return personaCanRoute(activePersona.value, route.meta?.permission as string | undefined);
});

function handleSelectPersona(key: PersonaKey | "none") {
  if (key === "none") {
    resetEmulation();
  } else {
    emulate(key);
  }
}
</script>

<template>
  <div class="rbac-audit-panel" :class="{ collapsed: isCollapsed }">
    <div class="panel-header" @click="isCollapsed = !isCollapsed">
      <div class="header-title">
        <span class="badge-role">🛡️ RBAC Dev Audit</span>
        <span v-if="activePersona" class="badge-active">{{ activePersona.label }}</span>
        <span v-else class="badge-default">Real Auth</span>
      </div>
      <button class="btn-toggle" :title="isCollapsed ? 'Expandir' : 'Recolher'">
        <i :class="isCollapsed ? 'fa fa-chevron-up' : 'fa fa-chevron-down'"></i>
      </button>
    </div>

    <div v-show="!isCollapsed" class="panel-body">
      <!-- Selector -->
      <div class="section">
        <label class="section-label">Simular Persona:</label>
        <select
          :value="activePersonaKey || 'none'"
          class="form-select form-select-sm"
          @change="handleSelectPersona(($event.target as HTMLSelectElement).value as PersonaKey | 'none')"
        >
          <option value="none">-- Autenticação Real --</option>
          <option v-for="p in PERSONAS" :key="p.key" :value="p.key">
            {{ p.label }} ({{ p.backendRole }})
          </option>
        </select>
      </div>

      <!-- Route Status -->
      <div class="section route-status">
        <div class="stat-row">
          <span class="stat-label">Rota Atual:</span>
          <span class="stat-val font-mono">{{ route.path }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Permissão da Rota:</span>
          <span class="stat-val font-mono">{{ currentRoutePermission }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Acesso Persona:</span>
          <span
            class="stat-badge"
            :class="canCurrentPersonaAccessRoute ? 'text-success' : 'text-danger'"
          >
            {{ canCurrentPersonaAccessRoute ? '✅ Autorizado' : '❌ Não Autorizado' }}
          </span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Acesso Configurações:</span>
          <span
            class="stat-badge"
            :class="canAccessSettings ? 'text-success' : 'text-muted'"
          >
            {{ canAccessSettings ? '✅ Engrenagem Visível' : '🚫 Engrenagem Oculta' }}
          </span>
        </div>
      </div>

      <!-- Menu Items Visible -->
      <div class="section menu-summary">
        <label class="section-label">Grupos de Menu Visíveis:</label>
        <div class="menu-chips">
          <span
            v-for="item in menuEntries"
            :key="item.kind === 'group' ? item.key : item.to"
            class="badge bg-light text-dark border me-1 mb-1"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rbac-audit-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  border: 1px solid #e2e8f0;
  z-index: 999999;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  color: #1e293b;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

.rbac-audit-panel.collapsed {
  width: auto;
  min-width: 200px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0f172a;
  color: #f8fafc;
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-role {
  font-weight: 600;
  font-size: 12px;
}

.badge-active {
  background: #3b82f6;
  color: #fff;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
}

.badge-default {
  background: #64748b;
  color: #fff;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
}

.btn-toggle {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  padding: 4px;
}

.panel-body {
  padding: 12px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
}

.section-label {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 12px;
  color: #475569;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.stat-label {
  color: #64748b;
  font-size: 11px;
}

.stat-val {
  font-weight: 500;
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stat-badge {
  font-weight: 600;
  font-size: 11px;
}

.menu-chips {
  display: flex;
  flex-wrap: wrap;
  margin-top: 4px;
}
</style>
