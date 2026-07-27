<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { SelectOption } from "@/components/ui/select.types";

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null;
    options: SelectOption[];
    label?: string;
    placeholder?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    searchable?: boolean;
    id?: string;
    name?: string;
  }>(),
  {
    placeholder: "Selecione uma opção",
    searchable: true,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string | number | null];
  change: [value: string | number | null];
}>();

const rootRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const search = ref("");
const highlightedIndex = ref(0);

const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue)
);

const displayLabel = computed(() => {
  if (selectedOption.value) return selectedOption.value.label;
  if (props.modelValue !== null && props.modelValue !== "") {
    return String(props.modelValue);
  }
  return props.placeholder;
});

const filteredOptions = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return props.options;

  return props.options.filter((option) => {
    const label = option.label.toLowerCase();
    const description = option.description?.toLowerCase() ?? "";
    return label.includes(term) || description.includes(term);
  });
});

const hasValue = computed(
  () => props.modelValue !== null && props.modelValue !== ""
);

function toggleOpen() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    search.value = "";
    syncHighlightedIndex();
  }
}

function close() {
  isOpen.value = false;
  search.value = "";
}

function selectOption(option: SelectOption) {
  if (option.disabled) return;
  emit("update:modelValue", option.value);
  emit("change", option.value);
  close();
}

function clearSelection(event: MouseEvent) {
  event.stopPropagation();
  if (props.disabled || props.required) return;
  emit("update:modelValue", null);
  emit("change", null);
}

function syncHighlightedIndex() {
  const index = filteredOptions.value.findIndex(
    (option) => option.value === props.modelValue
  );
  highlightedIndex.value = index >= 0 ? index : 0;
}

function moveHighlight(direction: 1 | -1) {
  if (!filteredOptions.value.length) return;

  let next = highlightedIndex.value;
  const total = filteredOptions.value.length;

  do {
    next = (next + direction + total) % total;
  } while (
    filteredOptions.value[next]?.disabled &&
    next !== highlightedIndex.value
  );

  highlightedIndex.value = next;
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (!isOpen.value) {
        isOpen.value = true;
        syncHighlightedIndex();
      } else {
        moveHighlight(1);
      }
      break;
    case "ArrowUp":
      event.preventDefault();
      if (isOpen.value) moveHighlight(-1);
      break;
    case "Enter":
    case " ":
      event.preventDefault();
      if (!isOpen.value) {
        isOpen.value = true;
        syncHighlightedIndex();
      } else {
        const option = filteredOptions.value[highlightedIndex.value];
        if (option) selectOption(option);
      }
      break;
    case "Escape":
      close();
      break;
  }
}

function onDocumentClick(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) {
    close();
  }
}

watch(filteredOptions, () => {
  if (highlightedIndex.value >= filteredOptions.value.length) {
    highlightedIndex.value = 0;
  }
});

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
});
</script>

<template>
  <div
    ref="rootRef"
    class="single-select"
    :class="{
      'single-select--open': isOpen,
      'single-select--disabled': disabled,
      'single-select--error': Boolean(error),
    }"
  >
    <label v-if="label" :for="id" class="single-select__label">
      {{ label }}
      <span v-if="required" class="single-select__required">*</span>
    </label>

    <input
      v-if="name"
      type="hidden"
      :name="name"
      :value="modelValue ?? ''"
      :required="required"
    />

    <button
      :id="id"
      type="button"
      class="single-select__trigger"
      :disabled="disabled"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggleOpen"
      @keydown="onKeydown"
    >
      <span
        class="single-select__value"
        :class="{ 'single-select__value--placeholder': !hasValue && !selectedOption }"
      >
        {{ displayLabel }}
      </span>
      <span class="single-select__actions">
        <span
          v-if="hasValue && !disabled && !required"
          role="button"
          tabindex="0"
          class="single-select__clear"
          aria-label="Limpar seleção"
          @click="clearSelection"
          @keydown.enter.prevent="clearSelection($event as unknown as MouseEvent)"
        >
          <i class="la la-times"></i>
        </span>
        <i
          class="single-select__chevron la"
          :class="isOpen ? 'la-angle-up' : 'la-angle-down'"
        ></i>
      </span>
    </button>

    <Transition name="single-select-fade">
      <div v-if="isOpen" class="single-select__dropdown">
        <div v-if="searchable" class="single-select__search-wrap">
          <i class="la la-search single-select__search-icon"></i>
          <input
            v-model="search"
            type="text"
            class="single-select__search"
            placeholder="Buscar..."
            @keydown.stop="onKeydown"
          />
        </div>

        <ul class="single-select__list" role="listbox">
          <li v-if="filteredOptions.length === 0" class="single-select__empty">
            Nenhuma opção encontrada
          </li>
          <li
            v-for="(option, index) in filteredOptions"
            :key="String(option.value)"
            role="option"
            :aria-selected="option.value === modelValue"
            class="single-select__option"
            :class="{
              'single-select__option--selected': option.value === modelValue,
              'single-select__option--highlighted': index === highlightedIndex,
              'single-select__option--disabled': option.disabled,
            }"
            @mouseenter="highlightedIndex = index"
            @click="selectOption(option)"
          >
            <span class="single-select__option-content">
              <span class="single-select__option-label">{{ option.label }}</span>
              <span v-if="option.description" class="single-select__option-desc">
                {{ option.description }}
              </span>
            </span>
            <i
              v-if="option.value === modelValue"
              class="single-select__option-check la la-check"
            ></i>
          </li>
        </ul>
      </div>
    </Transition>

    <p v-if="error" class="single-select__feedback single-select__feedback--error">
      {{ error }}
    </p>
    <p v-else-if="hint" class="single-select__feedback single-select__feedback--hint">
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
.single-select {
  position: relative;
  width: 100%;
}

.single-select__label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6c757d;
}

.single-select__required {
  color: var(--primary);
}

.single-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  min-height: 3rem;
  padding: 0.65rem 0.9rem;
  border: 1px solid #dfe3e8;
  border-radius: 0.5rem;
  background: #fff;
  color: #212529;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.single-select__trigger:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--primary) 35%, #dfe3e8);
}

.single-select--open .single-select__trigger,
.single-select__trigger:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--primary) 18%, transparent);
}

.single-select--error .single-select__trigger {
  border-color: #dc3545;
}

.single-select--disabled .single-select__trigger {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.single-select__value {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.single-select__value--placeholder {
  color: #98a2b3;
  font-weight: 400;
}

.single-select__actions {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

.single-select__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: #f1f3f5;
  color: #6c757d;
  cursor: pointer;
}

.single-select__clear:hover {
  background: #e9ecef;
  color: #343a40;
}

.single-select__chevron {
  font-size: 1rem;
  color: #6c757d;
}

.single-select__dropdown {
  position: absolute;
  z-index: 30;
  top: calc(100% + 0.35rem);
  left: 0;
  right: 0;
  overflow: hidden;
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 0.75rem 2rem rgba(16, 24, 40, 0.12);
}

.single-select__search-wrap {
  position: relative;
  padding: 0.75rem 0.75rem 0.5rem;
  border-bottom: 1px solid #f1f3f5;
}

.single-select__search-icon {
  position: absolute;
  top: 50%;
  left: 1.25rem;
  transform: translateY(-30%);
  color: #98a2b3;
}

.single-select__search {
  width: 100%;
  padding: 0.55rem 0.75rem 0.55rem 2.25rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.single-select__search:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 0.15rem color-mix(in srgb, var(--primary) 15%, transparent);
}

.single-select__list {
  list-style: none;
  margin: 0;
  padding: 0.35rem;
  max-height: 16rem;
  overflow-y: auto;
}

.single-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.7rem 0.8rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.15s ease;
}

.single-select__option:hover,
.single-select__option--highlighted {
  background: color-mix(in srgb, var(--primary) 8%, #fff);
}

.single-select__option--selected {
  background: color-mix(in srgb, var(--primary) 12%, #fff);
}

.single-select__option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.single-select__option-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.single-select__option-label {
  font-size: 0.925rem;
  font-weight: 500;
  color: #212529;
}

.single-select__option-desc {
  font-size: 0.78rem;
  color: #6c757d;
}

.single-select__option-check {
  color: var(--primary);
  font-size: 1rem;
}

.single-select__empty {
  padding: 1rem;
  text-align: center;
  color: #98a2b3;
  font-size: 0.875rem;
}

.single-select__feedback {
  margin: 0.45rem 0 0;
  font-size: 0.8125rem;
}

.single-select__feedback--error {
  color: #dc3545;
}

.single-select__feedback--hint {
  color: #6c757d;
}

.single-select-fade-enter-active,
.single-select-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.single-select-fade-enter-from,
.single-select-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
