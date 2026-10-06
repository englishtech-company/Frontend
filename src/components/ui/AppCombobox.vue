<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
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
    readonly?: boolean;
    required?: boolean;
    clearable?: boolean;
    id?: string;
    name?: string;
  }>(),
  {
    modelValue: null,
    placeholder: "Selecione ou digite para buscar...",
    disabled: false,
    readonly: false,
    required: false,
    clearable: true,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string | number | null];
  change: [value: string | number | null];
  select: [option: SelectOption | null];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const rootRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const listboxRef = ref<HTMLElement | null>(null);

const isOpen = ref(false);
const searchQuery = ref("");
const isFocused = ref(false);
const highlightedIndex = ref(-1);

// Unique ID base for ARIA relations
const uniqueId = props.id || `app-combobox-${Math.random().toString(36).substring(2, 9)}`;
const listboxId = `${uniqueId}-listbox`;
const inputId = `${uniqueId}-input`;

function removeAccents(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue)
);

const filteredOptions = computed(() => {
  const term = removeAccents(searchQuery.value.trim());
  if (!term) return props.options;

  return props.options.filter((option) => {
    const labelNorm = removeAccents(option.label);
    const descNorm = option.description ? removeAccents(option.description) : "";
    return labelNorm.includes(term) || descNorm.includes(term);
  });
});

const activeDescendantId = computed(() => {
  if (!isOpen.value || highlightedIndex.value < 0) return undefined;
  const opt = filteredOptions.value[highlightedIndex.value];
  return opt ? `${uniqueId}-option-${highlightedIndex.value}` : undefined;
});

// Keep search input display text in sync with selected option when closed
watch(
  () => [props.modelValue, props.options],
  () => {
    if (!isOpen.value) {
      searchQuery.value = selectedOption.value?.label ?? "";
    }
  },
  { immediate: true }
);

function openListbox() {
  if (props.disabled || props.readonly || isOpen.value) return;
  isOpen.value = true;

  // Set initial highlight to currently selected item if exists in filtered list, else first item
  const selectedIdx = filteredOptions.value.findIndex(
    (opt) => opt.value === props.modelValue && !opt.disabled
  );
  highlightedIndex.value = selectedIdx >= 0 ? selectedIdx : 0;
  scrollToHighlighted();
}

function closeListbox() {
  if (!isOpen.value) return;
  isOpen.value = false;
  highlightedIndex.value = -1;
  // Restore search query to label of selected option
  searchQuery.value = selectedOption.value?.label ?? "";
}

function selectOption(option: SelectOption) {
  if (option.disabled || props.disabled || props.readonly) return;
  emit("update:modelValue", option.value);
  emit("change", option.value);
  emit("select", option);
  searchQuery.value = option.label;
  closeListbox();
  nextTick(() => {
    inputRef.value?.focus();
  });
}

function clearSelection(event?: Event) {
  event?.stopPropagation();
  if (props.disabled || props.readonly) return;
  emit("update:modelValue", null);
  emit("change", null);
  emit("select", null);
  searchQuery.value = "";
  if (isOpen.value) {
    highlightedIndex.value = 0;
  }
  nextTick(() => {
    inputRef.value?.focus();
  });
}

function scrollToHighlighted() {
  nextTick(() => {
    if (!listboxRef.value) return;
    const items = listboxRef.value.querySelectorAll<HTMLElement>('[role="option"]');
    const highlightedEl = items[highlightedIndex.value];
    if (highlightedEl) {
      highlightedEl.scrollIntoView({ block: "nearest" });
    }
  });
}

function moveHighlight(step: number) {
  if (!filteredOptions.value.length) return;
  const count = filteredOptions.value.length;
  let next = highlightedIndex.value;

  for (let i = 0; i < count; i++) {
    next = (next + step + count) % count;
    if (!filteredOptions.value[next]?.disabled) {
      highlightedIndex.value = next;
      scrollToHighlighted();
      break;
    }
  }
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;
  if (!isOpen.value) {
    isOpen.value = true;
  }
  highlightedIndex.value = 0;
  scrollToHighlighted();
}

function onFocus(event: FocusEvent) {
  isFocused.value = true;
  emit("focus", event);
  inputRef.value?.select();
  openListbox();
}

function onBlur(event: FocusEvent) {
  // Let click events resolve before closing
  setTimeout(() => {
    if (!rootRef.value?.contains(document.activeElement)) {
      isFocused.value = false;
      closeListbox();
      emit("blur", event);
    }
  }, 150);
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (!isOpen.value) {
        openListbox();
      } else {
        moveHighlight(1);
      }
      break;

    case "ArrowUp":
      event.preventDefault();
      if (!isOpen.value) {
        openListbox();
      } else {
        moveHighlight(-1);
      }
      break;

    case "Enter":
      if (isOpen.value) {
        event.preventDefault();
        const option = filteredOptions.value[highlightedIndex.value];
        if (option && !option.disabled) {
          selectOption(option);
        }
      }
      break;

    case "Escape":
      if (isOpen.value) {
        event.preventDefault();
        event.stopPropagation();
        closeListbox();
      }
      break;

    case "Tab":
      if (isOpen.value) {
        closeListbox();
      }
      break;

    case "Home":
      if (isOpen.value) {
        event.preventDefault();
        highlightedIndex.value = 0;
        scrollToHighlighted();
      }
      break;

    case "End":
      if (isOpen.value) {
        event.preventDefault();
        highlightedIndex.value = filteredOptions.value.length - 1;
        scrollToHighlighted();
      }
      break;
  }
}

function onDocumentClick(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) {
    closeListbox();
  }
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
});

defineExpose({
  focus: () => inputRef.value?.focus(),
  select: () => inputRef.value?.select(),
  clear: clearSelection,
});
</script>

<template>
  <div
    ref="rootRef"
    class="app-combobox"
    :class="{
      'app-combobox--open': isOpen,
      'app-combobox--focused': isFocused,
      'app-combobox--disabled': disabled,
      'app-combobox--error': Boolean(error),
    }"
  >
    <label v-if="label" :for="inputId" class="app-combobox__label">
      {{ label }}
      <span v-if="required" class="app-combobox__required">*</span>
    </label>

    <input
      v-if="name"
      type="hidden"
      :name="name"
      :value="modelValue ?? ''"
      :required="required"
    />

    <div class="app-combobox__control">
      <div class="app-combobox__input-wrapper">
        <i class="la la-search app-combobox__search-icon" aria-hidden="true"></i>
        <input
          :id="inputId"
          ref="inputRef"
          type="text"
          role="combobox"
          autocomplete="off"
          class="form-control app-combobox__input"
          :value="searchQuery"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required && !modelValue"
          :aria-expanded="isOpen"
          :aria-controls="listboxId"
          :aria-activedescendant="activeDescendantId"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput"
          @keydown="onKeydown"
        />
      </div>

      <div class="app-combobox__actions">
        <button
          v-if="clearable && modelValue !== null && modelValue !== '' && !disabled && !readonly"
          type="button"
          class="app-combobox__btn-clear"
          aria-label="Limpar valor"
          tabindex="-1"
          @click="clearSelection"
          @mousedown.prevent
        >
          <i class="la la-times" aria-hidden="true"></i>
        </button>

        <button
          type="button"
          class="app-combobox__btn-toggle"
          :aria-label="isOpen ? 'Fechar lista' : 'Abrir lista'"
          tabindex="-1"
          :disabled="disabled || readonly"
          @click="isOpen ? closeListbox() : openListbox()"
          @mousedown.prevent
        >
          <i
            class="la"
            :class="isOpen ? 'la-angle-up' : 'la-angle-down'"
            aria-hidden="true"
          ></i>
        </button>
      </div>
    </div>

    <Transition name="app-combobox-fade">
      <div
        v-if="isOpen"
        :id="listboxId"
        ref="listboxRef"
        class="app-combobox__dropdown"
        role="listbox"
        :aria-label="label || 'Opções'"
      >
        <div v-if="filteredOptions.length === 0" class="app-combobox__empty" role="status">
          Nenhuma opção encontrada
        </div>

        <ul v-else class="app-combobox__list">
          <li
            v-for="(option, index) in filteredOptions"
            :id="`${uniqueId}-option-${index}`"
            :key="String(option.value)"
            role="option"
            :aria-selected="option.value === modelValue"
            :aria-disabled="option.disabled"
            class="app-combobox__option"
            :class="{
              'app-combobox__option--selected': option.value === modelValue,
              'app-combobox__option--highlighted': index === highlightedIndex,
              'app-combobox__option--disabled': option.disabled,
            }"
            @mousedown.prevent="selectOption(option)"
            @mouseenter="highlightedIndex = index"
          >
            <div class="app-combobox__option-body">
              <span class="app-combobox__option-label">{{ option.label }}</span>
              <span v-if="option.description" class="app-combobox__option-desc">
                {{ option.description }}
              </span>
            </div>

            <i
              v-if="option.value === modelValue"
              class="la la-check app-combobox__option-check"
              aria-hidden="true"
            ></i>
          </li>
        </ul>
      </div>
    </Transition>

    <p
      v-if="error || hint"
      class="app-combobox__feedback"
      :class="error ? 'app-combobox__feedback--error' : 'app-combobox__feedback--hint'"
    >
      {{ error || hint }}
    </p>
  </div>
</template>

<style scoped>
.app-combobox {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.app-combobox__label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6c757d;
}

.app-combobox__required {
  color: var(--primary, #0d6efd);
}

.app-combobox__control {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.app-combobox__input-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.app-combobox__search-icon {
  position: absolute;
  left: 0.85rem;
  font-size: 1.1rem;
  color: #98a2b3;
  pointer-events: none;
  z-index: 3;
}

.app-combobox__input {
  width: 100%;
  min-height: 2.85rem;
  padding-left: 2.5rem;
  padding-right: 4.5rem;
  border: 1px solid #dfe3e8;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #212529;
  font-size: 0.9375rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.app-combobox__input:focus {
  border-color: var(--primary, #0d6efd);
  box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--primary, #0d6efd) 18%, transparent);
  outline: none;
}

.app-combobox__actions {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  z-index: 3;
}

.app-combobox__btn-clear,
.app-combobox__btn-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: none;
  background: transparent;
  color: #98a2b3;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.app-combobox__btn-clear:hover,
.app-combobox__btn-toggle:hover {
  color: #495057;
  background-color: #f1f3f5;
}

.app-combobox__btn-toggle {
  font-size: 0.95rem;
}

.app-combobox__btn-clear {
  font-size: 0.85rem;
}

.app-combobox__dropdown {
  position: absolute;
  top: calc(100% + 0.35rem);
  left: 0;
  right: 0;
  z-index: 1050;
  background: #ffffff;
  border: 1px solid #dfe3e8;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  max-height: 16rem;
  overflow-y: auto;
}

.app-combobox__list {
  list-style: none;
  padding: 0.35rem 0;
  margin: 0;
}

.app-combobox__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.9rem;
  font-size: 0.9rem;
  color: #212529;
  cursor: pointer;
  transition: background-color 0.1s ease;
}

.app-combobox__option--highlighted {
  background-color: #f0f4f8;
}

.app-combobox__option--selected {
  font-weight: 600;
  background-color: #e8f0fe;
  color: var(--primary, #0d6efd);
}

.app-combobox__option--selected.app-combobox__option--highlighted {
  background-color: #dbe7fc;
}

.app-combobox__option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-combobox__option-body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.app-combobox__option-label {
  line-height: 1.3;
}

.app-combobox__option-desc {
  font-size: 0.78rem;
  color: #6c757d;
}

.app-combobox__option-check {
  color: var(--primary, #0d6efd);
  font-size: 1.1rem;
  flex-shrink: 0;
  margin-left: 0.5rem;
}

.app-combobox__empty {
  padding: 1.25rem;
  text-align: center;
  color: #98a2b3;
  font-size: 0.875rem;
}

.app-combobox--error .app-combobox__input {
  border-color: #dc3545;
}

.app-combobox--disabled .app-combobox__input {
  background-color: #e9ecef;
  cursor: not-allowed;
  opacity: 0.85;
}

.app-combobox__feedback {
  margin: 0.45rem 0 0;
  font-size: 0.8125rem;
}

.app-combobox__feedback--error {
  color: #dc3545;
}

.app-combobox__feedback--hint {
  color: #6c757d;
}

.app-combobox-fade-enter-active,
.app-combobox-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.app-combobox-fade-enter-from,
.app-combobox-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
