<script lang="ts" setup>
/**
 * UsuariosTab.vue
 *
 * Aba de Usuários dentro de ConfiguracoesHostView.
 * Renderiza UserList inline; o keep-alive no host preserva o estado
 * do formulário de filtros entre trocas de aba.
 */
import UserList from "@/views/admin/users/UserList.vue";
</script>

<template>
  <UserList />
</template>
