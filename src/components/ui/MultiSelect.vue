<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { SelectOption } from "@/components/ui/select.types";

const props = withDefaults(
  defineProps<{
    modelValue: (string | number)[];
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
    placeholder: "Selecione opções",
    searchable: true,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: (string | number)[]];
  change: [value: (string | number)[]];
}>();

const rootRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const search = ref("");
const highlightedIndex = ref(0);

const selectedOptions = computed(() =>
  props.options.filter((option) => props.modelValue.includes(option.value))
);

const displayLabel = computed(() => {
  if (selectedOptions.value.length === 0) return props.placeholder;
  if (selectedOptions.value.length === 1) return selectedOptions.value[0].label;
  if (selectedOptions.value.length <= 3) return selectedOptions.value.map(o => o.label).join(", ");
  return `${selectedOptions.value.length} itens selecionados`;
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

const hasValue = computed(() => props.modelValue && props.modelValue.length > 0);

function toggleOpen() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    search.value = "";
    highlightedIndex.value = 0;
  }
}

function close() {
  isOpen.value = false;
  search.value = "";
}

function selectOption(option: SelectOption) {
  if (option.disabled) return;
  
  const newValue = [...props.modelValue];
  const index = newValue.indexOf(option.value);
  
  if (index === -1) {
    newValue.push(option.value);
  } else {
    newValue.splice(index, 1);
  }
  
  emit("update:modelValue", newValue);
  emit("change", newValue);
  // Don't close on select so user can select multiple
}

function clearSelection(event: Event) {
  event.stopPropagation();
  if (props.disabled || props.required) return;
  emit("update:modelValue", []);
  emit("change", []);
}

function removeOption(event: Event, value: string | number) {
  event.stopPropagation();
  if (props.disabled) return;
  
  const newValue = props.modelValue.filter(v => v !== value);
  emit("update:modelValue", newValue);
  emit("change", newValue);
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
        highlightedIndex.value = 0;
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
        highlightedIndex.value = 0;
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
    class="multi-select"
    :class="{
      'multi-select--open': isOpen,
      'multi-select--disabled': disabled,
      'multi-select--error': Boolean(error),
    }"
  >
    <label v-if="label" :for="id" class="multi-select__label">
      {{ label }}
      <span v-if="required" class="multi-select__required">*</span>
    </label>

    <select
      v-if="name"
      multiple
      class="d-none"
      :name="name"
      :required="required"
    >
      <option v-for="val in modelValue" :key="String(val)" :value="val" selected></option>
    </select>

    <div
      :id="id"
      class="multi-select__trigger"
      :class="{ 'multi-select__trigger--disabled': disabled }"
      tabindex="0"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggleOpen"
      @keydown="onKeydown"
    >
      <div class="multi-select__values">
        <span
          v-if="!hasValue"
          class="multi-select__placeholder"
        >
          {{ displayLabel }}
        </span>
        <template v-else>
          <span v-for="option in selectedOptions" :key="String(option.value)" class="multi-select__tag" @click.stop>
            {{ option.label }}
            <button type="button" class="multi-select__tag-remove" @click="(e) => removeOption(e, option.value)" :disabled="disabled">
              <i class="la la-times"></i>
            </button>
          </span>
        </template>
      </div>
      
      <span class="multi-select__actions">
        <span
          v-if="hasValue && !disabled && !required"
          role="button"
          tabindex="0"
          class="multi-select__clear"
          aria-label="Limpar seleção"
          @click="clearSelection"
          @keydown.enter.prevent="clearSelection($event)"
        >
          <i class="la la-times"></i>
        </span>
        <i
          class="multi-select__chevron la"
          :class="isOpen ? 'la-angle-up' : 'la-angle-down'"
        ></i>
      </span>
    </div>

    <Transition name="multi-select-fade">
      <div v-if="isOpen" class="multi-select__dropdown" @click.stop>
        <div v-if="searchable" class="multi-select__search-wrap">
          <i class="la la-search multi-select__search-icon"></i>
          <input
            v-model="search"
            type="text"
            class="multi-select__search"
            placeholder="Buscar..."
            @keydown.stop="onKeydown"
          />
        </div>

        <ul class="multi-select__list" role="listbox" aria-multiselectable="true">
          <li v-if="filteredOptions.length === 0" class="multi-select__empty">
            Nenhuma opção encontrada
          </li>
          <li
            v-for="(option, index) in filteredOptions"
            :key="String(option.value)"
            role="option"
            :aria-selected="modelValue.includes(option.value)"
            class="multi-select__option"
            :class="{
              'multi-select__option--selected': modelValue.includes(option.value),
              'multi-select__option--highlighted': index === highlightedIndex,
              'multi-select__option--disabled': option.disabled,
            }"
            @mouseenter="highlightedIndex = index"
            @click="selectOption(option)"
          >
            <div class="multi-select__checkbox-wrapper">
               <input type="checkbox" :checked="modelValue.includes(option.value)" class="multi-select__checkbox" tabindex="-1" />
            </div>
            <span class="multi-select__option-content">
              <span class="multi-select__option-label">{{ option.label }}</span>
              <span v-if="option.description" class="multi-select__option-desc">
                {{ option.description }}
              </span>
            </span>
          </li>
        </ul>
      </div>
    </Transition>

    <p v-if="error" class="multi-select__feedback multi-select__feedback--error">
      {{ error }}
    </p>
    <p v-else-if="hint" class="multi-select__feedback multi-select__feedback--hint">
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
.multi-select {
  position: relative;
  width: 100%;
}

.multi-select__label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6c757d;
}

.multi-select__required {
  color: var(--primary);
}

.multi-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  min-height: 3rem;
  padding: 0.4rem 0.9rem;
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

.multi-select__trigger:hover:not(.multi-select__trigger--disabled) {
  border-color: color-mix(in srgb, var(--primary) 35%, #dfe3e8);
}

.multi-select--open .multi-select__trigger,
.multi-select__trigger:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--primary) 18%, transparent);
}

.multi-select--error .multi-select__trigger {
  border-color: #dc3545;
}

.multi-select__trigger--disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.multi-select__values {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
  min-height: 24px;
}

.multi-select__placeholder {
  color: #98a2b3;
  font-size: 0.95rem;
  font-weight: 400;
}

.multi-select__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #f1f3f5;
  border: 1px solid #e9ecef;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #495057;
}

.multi-select__tag-remove {
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  cursor: pointer;
  border-radius: 50%;
  width: 16px;
  height: 16px;
}
.multi-select__tag-remove:hover {
  color: #495057;
  background: #e9ecef;
}

.multi-select__actions {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

.multi-select__clear {
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

.multi-select__clear:hover {
  background: #e9ecef;
  color: #343a40;
}

.multi-select__chevron {
  font-size: 1rem;
  color: #6c757d;
}

.multi-select__dropdown {
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

.multi-select__search-wrap {
  position: relative;
  padding: 0.75rem 0.75rem 0.5rem;
  border-bottom: 1px solid #f1f3f5;
}

.multi-select__search-icon {
  position: absolute;
  top: 50%;
  left: 1.25rem;
  transform: translateY(-30%);
  color: #98a2b3;
}

.multi-select__search {
  width: 100%;
  padding: 0.55rem 0.75rem 0.55rem 2.25rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.multi-select__search:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 0.15rem color-mix(in srgb, var(--primary) 15%, transparent);
}

.multi-select__list {
  list-style: none;
  margin: 0;
  padding: 0.35rem;
  max-height: 16rem;
  overflow-y: auto;
}

.multi-select__option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.8rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.15s ease;
}

.multi-select__checkbox-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.multi-select__checkbox {
  width: 1rem;
  height: 1rem;
  margin: 0;
  cursor: pointer;
  pointer-events: none; /* Let the li handle click */
}

.multi-select__option:hover,
.multi-select__option--highlighted {
  background: color-mix(in srgb, var(--primary) 8%, #fff);
}

.multi-select__option--selected {
  background: color-mix(in srgb, var(--primary) 4%, #fff);
}

.multi-select__option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.multi-select__option-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.multi-select__option-label {
  font-size: 0.925rem;
  font-weight: 500;
  color: #212529;
}

.multi-select__option-desc {
  font-size: 0.78rem;
  color: #6c757d;
}

.multi-select__empty {
  padding: 1rem;
  text-align: center;
  color: #98a2b3;
  font-size: 0.875rem;
}

.multi-select__feedback {
  margin: 0.45rem 0 0;
  font-size: 0.8125rem;
}

.multi-select__feedback--error {
  color: #dc3545;
}

.multi-select__feedback--hint {
  color: #6c757d;
}

.multi-select-fade-enter-active,
.multi-select-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.multi-select-fade-enter-from,
.multi-select-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
