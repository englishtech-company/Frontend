<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  page: number;
  lastPage: number;
  total?: number;
}>();

const emit = defineEmits<{
  "update:page": [page: number];
}>();

type PageItem = number | "ellipsis";

const pageItems = computed<PageItem[]>(() => {
  const current = props.page;
  const last = props.lastPage;

  if (last <= 1) return [];
  if (last <= 7) {
    return Array.from({ length: last }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);

  if (start > 2) {
    items.push("ellipsis");
  }

  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    items.push(pageNumber);
  }

  if (end < last - 1) {
    items.push("ellipsis");
  }

  if (last > 1) {
    items.push(last);
  }

  return items;
});

function goTo(nextPage: number) {
  if (nextPage < 1 || nextPage > props.lastPage || nextPage === props.page) {
    return;
  }

  emit("update:page", nextPage);
}
</script>

<template>
  <nav
    v-if="lastPage > 1"
    class="list-pagination"
    aria-label="Paginação da listagem"
  >
    <div class="list-pagination__meta text-muted">
      <span v-if="total !== undefined">{{ total }} registro(s)</span>
      <span class="list-pagination__indicator">
        Página {{ page }} de {{ lastPage }}
      </span>
    </div>

    <ul class="pagination pagination-sm pagination-primary mb-0">
      <li class="page-item" :class="{ disabled: page <= 1 }">
        <button
          type="button"
          class="page-link"
          aria-label="Página anterior"
          :disabled="page <= 1"
          @click="goTo(page - 1)"
        >
          <i class="fa fa-angle-left" aria-hidden="true"></i>
        </button>
      </li>

      <li
        v-for="(item, index) in pageItems"
        :key="`${item}-${index}`"
        class="page-item"
        :class="{
          active: item === page,
          disabled: item === 'ellipsis',
        }"
      >
        <button
          v-if="item !== 'ellipsis'"
          type="button"
          class="page-link"
          :aria-label="`Ir para página ${item}`"
          :aria-current="item === page ? 'page' : undefined"
          @click="goTo(item)"
        >
          {{ item }}
        </button>
        <span v-else class="page-link list-pagination__ellipsis">…</span>
      </li>

      <li class="page-item" :class="{ disabled: page >= lastPage }">
        <button
          type="button"
          class="page-link"
          aria-label="Próxima página"
          :disabled="page >= lastPage"
          @click="goTo(page + 1)"
        >
          <i class="fa fa-angle-right" aria-hidden="true"></i>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.list-pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem 1rem;
  margin-top: 1rem;
}

.list-pagination__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.75rem;
  font-size: 0.75rem;
  line-height: 1.2;
}

.list-pagination__indicator {
  font-weight: 500;
}

.list-pagination__ellipsis {
  pointer-events: none;
  padding-top: 0;
  padding-bottom: 0;
  line-height: 1.775rem;
}

.list-pagination .page-link {
  min-width: 1.875rem;
  text-align: center;
}

.list-pagination .page-item.disabled .page-link {
  pointer-events: none;
}
</style>
