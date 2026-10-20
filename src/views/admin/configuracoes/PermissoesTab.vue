<script lang="ts" setup>
/**
 * PermissoesTab.vue
 *
 * Aba de Permissões (catálogo read-only) dentro de ConfiguracoesHostView.
 * Renderiza PermissionList inline; keep-alive no host preserva estado.
 */
import PermissionList from "@/views/admin/permissions/PermissionList.vue";
</script>

<template>
  <PermissionList />
</template>
