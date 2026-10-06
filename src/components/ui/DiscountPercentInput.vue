<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: number | null;
    label?: string;
    placeholder?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    id?: string;
    name?: string;
    precision?: number;
  }>(),
  {
    modelValue: null,
    placeholder: "0",
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    readonly: false,
    required: false,
    precision: 2,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
  change: [value: number | null];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);
const displayValue = ref("");

function clamp(val: number): number {
  const bounded = Math.min(Math.max(val, props.min), props.max);
  return Number(bounded.toFixed(props.precision));
}

function formatValue(val: number | null): string {
  if (val === null || val === undefined || Number.isNaN(val)) {
    return "";
  }
  // Convert number to string representation
  const fixed = Number(val.toFixed(props.precision));
  return String(fixed);
}

function parseInputString(str: string): number | null {
  const clean = str.trim().replace(",", ".");
  if (clean === "") return null;
  const parsed = Number.parseFloat(clean);
  if (Number.isNaN(parsed)) return null;
  return clamp(parsed);
}

// Keep displayValue synced with modelValue when not editing or when modelValue updates externally
watch(
  () => props.modelValue,
  (newVal) => {
    if (!isFocused.value) {
      displayValue.value = formatValue(newVal);
    }
  },
  { immediate: true }
);

function selectAll() {
  if (inputRef.value) {
    inputRef.value.select();
  }
}

function onFocus(event: FocusEvent) {
  if (props.disabled || props.readonly) return;
  isFocused.value = true;
  // If there's a model value, show standard format for easy direct-typing
  displayValue.value = formatValue(props.modelValue);
  nextTick(() => {
    selectAll();
  });
  emit("focus", event);
}

function onBlur(event: FocusEvent) {
  isFocused.value = false;
  const currentStr = displayValue.value;
  const parsed = parseInputString(currentStr);

  if (currentStr.trim() === "") {
    emit("update:modelValue", null);
    emit("change", null);
    displayValue.value = "";
  } else if (parsed !== null) {
    emit("update:modelValue", parsed);
    emit("change", parsed);
    displayValue.value = formatValue(parsed);
  } else {
    // If invalid string was left, reset to props.modelValue
    displayValue.value = formatValue(props.modelValue);
  }

  emit("blur", event);
}

function onBeforeInput(event: Event) {
  if (props.disabled || props.readonly) return;
  const inputEv = event as InputEvent;
  
  // Inserted characters via typing or paste
  const data = inputEv.data;
  if (!data) return; // deletions, undo, etc. don't have data

  const allowedChars = /^[0-9.,]$/;
  for (const char of data) {
    if (!allowedChars.test(char)) {
      event.preventDefault();
      return;
    }
  }

  // Prevent multiple decimal separators in the resulting value
  const target = event.target as HTMLInputElement;
  const start = target.selectionStart ?? 0;
  const end = target.selectionEnd ?? 0;
  const current = target.value;
  const incomingNormalized = data.replace(",", ".");
  const nextValue = current.slice(0, start) + incomingNormalized + current.slice(end);

  const separatorMatches = nextValue.match(/[.,]/g);
  if (separatorMatches && separatorMatches.length > 1) {
    event.preventDefault();
    return;
  }
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  let raw = target.value;

  // Normalize localized decimal separators (comma -> dot) in raw typing
  if (raw.includes(",")) {
    const start = target.selectionStart;
    const end = target.selectionEnd;
    raw = raw.replace(/,/g, ".");
    displayValue.value = raw;
    nextTick(() => {
      if (inputRef.value && start !== null && end !== null) {
        inputRef.value.setSelectionRange(start, end);
      }
    });
  } else {
    displayValue.value = raw;
  }

  const clean = raw.trim();
  if (clean === "") {
    emit("update:modelValue", null);
    emit("change", null);
    return;
  }

  // If user is actively typing an incomplete decimal like "12."
  if (clean.endsWith(".")) {
    const base = Number.parseFloat(clean.slice(0, -1));
    if (!Number.isNaN(base)) {
      const clamped = clamp(base);
      emit("update:modelValue", clamped);
      emit("change", clamped);
    }
    return;
  }

  const parsed = Number.parseFloat(clean);
  if (!Number.isNaN(parsed)) {
    const clamped = clamp(parsed);
    emit("update:modelValue", clamped);
    emit("change", clamped);
  }
}

function stepBy(amount: number) {
  if (props.disabled || props.readonly) return;
  const current = props.modelValue ?? 0;
  const next = clamp(current + amount);
  displayValue.value = formatValue(next);
  emit("update:modelValue", next);
  emit("change", next);
  nextTick(() => {
    selectAll();
  });
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) return;

  if (event.key === "ArrowUp") {
    event.preventDefault();
    stepBy(props.step);
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    stepBy(-props.step);
  }
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  select: selectAll,
});
</script>

<template>
  <div
    class="discount-percent-input"
    :class="{
      'discount-percent-input--focused': isFocused,
      'discount-percent-input--disabled': disabled,
      'discount-percent-input--error': Boolean(error),
    }"
  >
    <label v-if="label" :for="id" class="discount-percent-input__label">
      {{ label }}
      <span v-if="required" class="discount-percent-input__required">*</span>
    </label>

    <div class="discount-percent-input__wrapper input-group">
      <input
        :id="id"
        ref="inputRef"
        :name="name"
        :value="displayValue"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        class="form-control discount-percent-input__field"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        @focus="onFocus"
        @blur="onBlur"
        @beforeinput="onBeforeInput"
        @input="onInput"
        @keydown="onKeydown"
      />
      <span class="input-group-text discount-percent-input__suffix" aria-hidden="true">%</span>
    </div>

    <p
      v-if="error || hint"
      class="discount-percent-input__feedback"
      :class="error ? 'discount-percent-input__feedback--error' : 'discount-percent-input__feedback--hint'"
    >
      {{ error || hint }}
    </p>
  </div>
</template>

<style scoped>
.discount-percent-input {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.discount-percent-input__label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6c757d;
}

.discount-percent-input__required {
  color: var(--primary, #0d6efd);
}

.discount-percent-input__wrapper {
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
}

.discount-percent-input__field {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  padding-right: 0.75rem;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-color: #dfe3e8;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.discount-percent-input__field:focus {
  border-color: var(--primary, #0d6efd);
  box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--primary, #0d6efd) 18%, transparent);
  z-index: 2;
}

.discount-percent-input__suffix {
  font-weight: 600;
  background-color: #f8f9fa;
  border-color: #dfe3e8;
  color: #495057;
  padding: 0 0.85rem;
  user-select: none;
}

.discount-percent-input--focused .discount-percent-input__suffix {
  border-color: var(--primary, #0d6efd);
}

.discount-percent-input--error .discount-percent-input__field,
.discount-percent-input--error .discount-percent-input__suffix {
  border-color: #dc3545;
}

.discount-percent-input--disabled .discount-percent-input__field,
.discount-percent-input--disabled .discount-percent-input__suffix {
  background-color: #e9ecef;
  cursor: not-allowed;
  opacity: 0.85;
}

.discount-percent-input__feedback {
  margin: 0.45rem 0 0;
  font-size: 0.8125rem;
}

.discount-percent-input__feedback--error {
  color: #dc3545;
}

.discount-percent-input__feedback--hint {
  color: #6c757d;
}
</style>
