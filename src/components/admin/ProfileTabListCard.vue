<script lang="ts" setup>
import ListPagination from "@/components/ui/ListPagination.vue";

defineProps<{
  title: string;
  total: number;
  loading?: boolean;
  page?: number;
  lastPage?: number;
  readOnly?: boolean;
}>();

const emit = defineEmits<{
  "update:page": [page: number];
}>();
</script>

<template>
  <div class="profile-tab-list-card">
    <div class="card">
      <div
        class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"
      >
        <h4 class="card-title mb-0">{{ title }} ({{ total }})</h4>

        <div class="d-flex flex-wrap align-items-center gap-2">
          <span
            v-if="readOnly"
            class="badge bg-light text-dark"
          >
            Somente leitura
          </span>
          <slot name="actions" />
        </div>
      </div>

      <div class="card-body">
        <div
          v-if="loading"
          class="text-center py-4"
        >
          Carregando...
        </div>

        <template v-else>
          <div class="table-responsive">
            <table class="table table-striped table-responsive-sm mb-0">
              <slot />
            </table>
          </div>

          <ListPagination
            v-if="page && lastPage && lastPage > 1"
            :page="page"
            :last-page="lastPage"
            :total="total"
            @update:page="emit('update:page', $event)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-tab-list-card {
  padding-top: 1rem;
}
</style>
