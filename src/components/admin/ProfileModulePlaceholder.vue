<script lang="ts" setup>
export type ProfileModuleExample = {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeClass?: string;
};

defineProps<{
  title: string;
  description: string;
  icon: string;
  examples?: ProfileModuleExample[];
}>();
</script>

<template>
  <div class="pt-4 pb-3">
    <div class="alert alert-light border mb-4">
      <div class="d-flex align-items-start gap-3">
        <span
          class="rounded-circle bg-primary-light d-inline-flex align-items-center justify-content-center flex-shrink-0"
          style="width: 42px; height: 42px; min-width: 42px;"
        >
          <i :class="icon" class="text-primary fs-18"></i>
        </span>
        <div>
          <h5 class="mb-2">{{ title }}</h5>
          <p class="mb-2 text-muted">{{ description }}</p>
          <span class="badge badge-light text-dark">Em breve</span>
        </div>
      </div>
    </div>

    <div v-if="examples?.length" class="card border mb-0">
      <div class="card-header py-3">
        <h6 class="mb-0 text-muted">Exemplo de visualização</h6>
      </div>
      <ul class="list-group list-group-flush">
        <li
          v-for="(example, index) in examples"
          :key="index"
          class="list-group-item d-flex justify-content-between align-items-start gap-3"
        >
          <div>
            <strong>{{ example.title }}</strong>
            <div
              v-if="example.subtitle"
              class="text-muted small"
            >
              {{ example.subtitle }}
            </div>
          </div>
          <span
            v-if="example.badge"
            class="badge flex-shrink-0"
            :class="example.badgeClass ?? 'badge-light text-dark'"
          >
            {{ example.badge }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
