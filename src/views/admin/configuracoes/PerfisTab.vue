<script lang="ts" setup>
/**
 * PerfisTab.vue
 *
 * Aba de Perfis (Roles) dentro de ConfiguracoesHostView.
 * Renderiza RoleList inline; keep-alive no host preserva estado.
 */
import RoleList from "@/views/admin/roles/RoleList.vue";
</script>

<template>
  <RoleList />
</template>
