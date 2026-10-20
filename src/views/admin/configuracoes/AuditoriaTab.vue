<script lang="ts" setup>
/**
 * AuditoriaTab.vue
 *
 * Aba de Auditoria dentro de ConfiguracoesHostView.
 * Renderiza AuditList inline.
 *
 * INTENCIONALMENTE excluída do keep-alive no host:
 *   Registros de auditoria são um stream de atividade em tempo real.
 *   Preservar o cache entre trocas de aba entregaria dados obsoletos ao
 *   usuário, que espera ver o log mais recente a cada visita à aba.
 */
import AuditList from "@/views/admin/audits/AuditList.vue";
</script>

<template>
  <AuditList />
</template>
