<script lang="ts" setup>
defineProps<{
  label?: string;
  hint?: string;
  id?: string;
}>();
</script>

<template>
  <div class="filter-field">
    <label v-if="label" class="form-label" :for="id">{{ label }}</label>
    <slot />
    <small v-if="hint" class="filter-field__hint text-muted">{{ hint }}</small>
  </div>
</template>

<style scoped>
.filter-field__hint {
  display: block;
  font-size: 0.8125rem;
  margin-top: 0.25rem;
}
</style>
