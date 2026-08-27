<script lang="ts" setup>
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    activeCount?: number;
    defaultOpen?: boolean;
    showActions?: boolean;
    filterLabel?: string;
    clearLabel?: string;
  }>(),
  {
    title: "Filtros",
    activeCount: 0,
    defaultOpen: false,
    showActions: true,
    filterLabel: "Filtrar",
    clearLabel: "Limpar",
  }
);

const emit = defineEmits<{
  filter: [];
  clear: [];
}>();

const isOpen = ref(props.defaultOpen);

watch(
  () => props.activeCount,
  (count) => {
    if (count > 0 && !isOpen.value) {
      isOpen.value = true;
    }
  }
);

function toggle() {
  isOpen.value = !isOpen.value;
}

function handleFilter() {
  emit("filter");
}

function handleClear() {
  emit("clear");
}
</script>

<template>
  <div class="row">
    <div class="col-12">
      <div class="filter cm-content-box box-primary filter-panel">
        <button
          type="button"
          class="content-title SlideToolHeader w-100 border-0 bg-transparent"
          :aria-expanded="isOpen"
          @click="toggle"
        >
          <div class="cpa d-flex align-items-center gap-2">
            <i class="fa fa-filter" aria-hidden="true"></i>
            <span>{{ title }}</span>
            <span
              v-if="activeCount > 0"
              class="badge badge-primary"
            >
              {{ activeCount }}
            </span>
          </div>
          <div class="tools">
            <span
              class="filter-panel__toggle"
              :class="{ expand: isOpen }"
              aria-hidden="true"
            >
              <i class="fa fa-angle-down"></i>
            </span>
          </div>
        </button>

        <div
          v-show="isOpen"
          class="cm-content-body form excerpt filter-panel__body"
        >
          <div class="card-body">
            <slot />

            <div
              v-if="showActions"
              class="filter-panel__actions d-flex flex-wrap gap-2 mt-3"
            >
              <button
                type="button"
                class="btn btn-sm btn-primary"
                @click="handleFilter"
              >
                <i class="fa fa-search me-1" aria-hidden="true"></i>
                {{ filterLabel }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-light"
                @click="handleClear"
              >
                {{ clearLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-panel .content-title {
  text-align: left;
}

.filter-panel__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.filter-panel__toggle i {
  font-size: 1.25rem;
  color: #c2c2c2;
}

.filter-panel__toggle.expand {
  transform: rotate(-180deg);
}

.filter-panel__body {
  border-top: 1px solid var(--border) !important;
}
</style>
