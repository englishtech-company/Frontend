<script lang="ts" setup>
import { RouterLink, useRoute } from "vue-router";
import type { FinancialDashboardNavigationItem } from "@/lib/financialDashboardNavigation";

defineProps<{
  items: FinancialDashboardNavigationItem[];
}>();

const route = useRoute();
</script>

<template>
  <nav class="financial-dashboard-nav" aria-label="Painéis financeiros">
    <ul class="nav nav-tabs">
      <li v-for="item in items" :key="item.key" class="nav-item">
        <RouterLink
          v-if="item.path !== null"
          :to="item.path"
          class="nav-link"
          :class="{ active: route.path === item.path }"
          :aria-current="route.path === item.path ? 'page' : undefined"
        >
          {{ item.label }}
        </RouterLink>

        <button
          v-else
          type="button"
          class="nav-link financial-dashboard-nav__pending"
          disabled
          aria-disabled="true"
          :title="`${item.label}: implementação pendente`"
        >
          {{ item.label }}
          <span class="financial-dashboard-nav__status">Em breve</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.financial-dashboard-nav {
  margin-bottom: 0.75rem;
}

.financial-dashboard-nav .nav-tabs {
  flex-wrap: wrap;
  gap: 0.25rem;
  border-bottom: 1px solid var(--border, #edf0f2);
}

.financial-dashboard-nav .nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--text-gray, #6c757d);
  font-size: 0.8125rem;
  line-height: 1.4;
}

.financial-dashboard-nav .nav-link.active {
  border-bottom-color: var(--primary, #600022);
  color: var(--primary, #600022);
  font-weight: 600;
}

.financial-dashboard-nav a.nav-link:hover {
  color: var(--primary, #600022);
}

.financial-dashboard-nav a.nav-link:focus-visible {
  outline: 2px solid var(--primary, #600022);
  outline-offset: 2px;
}

.financial-dashboard-nav__pending {
  cursor: not-allowed;
}

.financial-dashboard-nav__status {
  padding: 0.0625rem 0.3125rem;
  border: 1px solid var(--border, #edf0f2);
  border-radius: 4px;
  font-size: 0.625rem;
  white-space: nowrap;
}
</style>
