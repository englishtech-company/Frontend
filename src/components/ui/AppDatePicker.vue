<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string | null;
    label?: string;
    placeholder?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    clearable?: boolean;
    min?: string; // YYYY-MM-DD
    max?: string; // YYYY-MM-DD
    id?: string;
    name?: string;
  }>(),
  {
    modelValue: null,
    placeholder: "DD/MM/AAAA",
    disabled: false,
    readonly: false,
    required: false,
    clearable: true,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
  change: [value: string | null];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const rootRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const isFocused = ref(false);

const uniqueId = props.id || `app-datepicker-${Math.random().toString(36).substring(2, 9)}`;
const dialogId = `${uniqueId}-dialog`;
const inputId = `${uniqueId}-input`;

// Calendar navigation view state (pure integers, no Date timezone shifts)
const viewYear = ref<number>(new Date().getFullYear());
const viewMonth = ref<number>(new Date().getMonth() + 1); // 1-12
const typedText = ref<string>("");

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const WEEKDAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

// Pure parsing of YYYY-MM-DD to { year, month, day }
function parseIso(isoStr: string | null | undefined): { year: number; month: number; day: number } | null {
  if (!isoStr || !/^\d{4}-\d{2}-\d{2}$/.test(isoStr)) return null;
  const parts = isoStr.split("-").map((p) => Number.parseInt(p, 10));
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  
  // Validate day count in month (leap years supported purely)
  const maxDays = getDaysInMonth(year, month);
  if (day > maxDays) return null;

  return { year, month, day };
}

// Pure format to ISO-8601 YYYY-MM-DD
function formatIso(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

// Pure format to Brazilian DD/MM/YYYY
function isoToDisplay(isoStr: string | null | undefined): string {
  const parsed = parseIso(isoStr);
  if (!parsed) return "";
  return `${pad2(parsed.day)}/${pad2(parsed.month)}/${parsed.year}`;
}

// Pure parsing from DD/MM/YYYY or DDMMYYYY to ISO-8601 YYYY-MM-DD
function displayToIso(displayStr: string): string | null {
  const clean = displayStr.replace(/\D/g, "");
  if (clean.length !== 8) return null;
  const day = Number.parseInt(clean.slice(0, 2), 10);
  const month = Number.parseInt(clean.slice(2, 4), 10);
  const year = Number.parseInt(clean.slice(4, 8), 10);

  if (year < 1000 || month < 1 || month > 12 || day < 1) return null;
  const maxDays = getDaysInMonth(year, month);
  if (day > maxDays) return null;

  return formatIso(year, month, day);
}

function getDaysInMonth(year: number, month: number): number {
  // Pure leap year calculation
  if (month === 2) {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return isLeap ? 29 : 28;
  }
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

// Pure weekday calculation using Zeller's Congruence algorithm (0=Sunday, 1=Monday, ..., 6=Saturday)
function getFirstDayOfWeek(year: number, month: number): number {
  let m = month;
  let y = year;
  if (m < 3) {
    m += 12;
    y -= 1;
  }
  const k = y % 100;
  const j = Math.floor(y / 100);
  // Zeller's formula for Gregorian calendar (0=Saturday, 1=Sunday, 2=Monday, ..., 6=Friday)
  const h = (1 + Math.floor((13 * (m + 1)) / 5) + k + Math.floor(k / 4) + Math.floor(j / 4) + 5 * j) % 7;
  // Convert Zeller's (0=Sat) to standard JS (0=Sun, 1=Mon, ..., 6=Sat)
  return (h + 6) % 7;
}

// Sync typedText and calendar view month/year with modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    const parsed = parseIso(newVal);
    if (parsed) {
      typedText.value = isoToDisplay(newVal);
      viewYear.value = parsed.year;
      viewMonth.value = parsed.month;
    } else {
      typedText.value = "";
    }
  },
  { immediate: true }
);

interface CalendarDay {
  year: number;
  month: number;
  day: number;
  iso: string;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
}

// Pure calculation of calendar grid (42 days)
const calendarDays = computed<CalendarDay[]>(() => {
  const days: CalendarDay[] = [];
  const year = viewYear.value;
  const month = viewMonth.value;

  const firstDay = getFirstDayOfWeek(year, month);
  const daysInCurrent = getDaysInMonth(year, month);

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrev = getDaysInMonth(prevYear, prevMonth);

  // Today in pure local calendar
  const now = new Date();
  const todayIso = formatIso(now.getFullYear(), now.getMonth() + 1, now.getDate());

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const iso = formatIso(prevYear, prevMonth, d);
    days.push({
      year: prevYear,
      month: prevMonth,
      day: d,
      iso,
      isCurrentMonth: false,
      isSelected: props.modelValue === iso,
      isToday: iso === todayIso,
      isDisabled: isDateDisabled(iso),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInCurrent; d++) {
    const iso = formatIso(year, month, d);
    days.push({
      year,
      month,
      day: d,
      iso,
      isCurrentMonth: true,
      isSelected: props.modelValue === iso,
      isToday: iso === todayIso,
      isDisabled: isDateDisabled(iso),
    });
  }

  // Next month leading days (fill up to 42 cells)
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const iso = formatIso(nextYear, nextMonth, d);
    days.push({
      year: nextYear,
      month: nextMonth,
      day: d,
      iso,
      isCurrentMonth: false,
      isSelected: props.modelValue === iso,
      isToday: iso === todayIso,
      isDisabled: isDateDisabled(iso),
    });
  }

  return days;
});

function isDateDisabled(iso: string): boolean {
  if (props.min && iso < props.min) return true;
  if (props.max && iso > props.max) return true;
  return false;
}

function prevMonth() {
  if (viewMonth.value === 1) {
    viewMonth.value = 12;
    viewYear.value -= 1;
  } else {
    viewMonth.value -= 1;
  }
}

function nextMonth() {
  if (viewMonth.value === 12) {
    viewMonth.value = 1;
    viewYear.value += 1;
  } else {
    viewMonth.value += 1;
  }
}

function selectDay(cell: CalendarDay) {
  if (cell.isDisabled || props.disabled || props.readonly) return;
  emit("update:modelValue", cell.iso);
  emit("change", cell.iso);
  typedText.value = isoToDisplay(cell.iso);
  closePicker();
  nextTick(() => {
    inputRef.value?.focus();
  });
}

function selectToday() {
  const now = new Date();
  const todayIso = formatIso(now.getFullYear(), now.getMonth() + 1, now.getDate());
  if (isDateDisabled(todayIso)) return;
  emit("update:modelValue", todayIso);
  emit("change", todayIso);
  typedText.value = isoToDisplay(todayIso);
  viewYear.value = now.getFullYear();
  viewMonth.value = now.getMonth() + 1;
  closePicker();
  nextTick(() => {
    inputRef.value?.focus();
  });
}

function openPicker() {
  if (props.disabled || props.readonly || isOpen.value) return;
  const parsed = parseIso(props.modelValue);
  if (parsed) {
    viewYear.value = parsed.year;
    viewMonth.value = parsed.month;
  } else {
    const now = new Date();
    viewYear.value = now.getFullYear();
    viewMonth.value = now.getMonth() + 1;
  }
  isOpen.value = true;
}

function closePicker() {
  isOpen.value = false;
}

function clearValue(event?: Event) {
  event?.stopPropagation();
  if (props.disabled || props.readonly) return;
  emit("update:modelValue", null);
  emit("change", null);
  typedText.value = "";
  nextTick(() => {
    inputRef.value?.focus();
  });
}

// Auto-mask typed DD/MM/YYYY input
function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const raw = target.value.replace(/\D/g, "");
  let masked = "";

  if (raw.length > 0) {
    masked = raw.substring(0, 2);
    if (raw.length >= 3) {
      masked += "/" + raw.substring(2, 4);
    }
    if (raw.length >= 5) {
      masked += "/" + raw.substring(4, 8);
    }
  }

  typedText.value = masked;

  if (raw.length === 8) {
    const iso = displayToIso(masked);
    if (iso && !isDateDisabled(iso)) {
      emit("update:modelValue", iso);
      emit("change", iso);
      const parsed = parseIso(iso);
      if (parsed) {
        viewYear.value = parsed.year;
        viewMonth.value = parsed.month;
      }
    }
  } else if (raw.length === 0) {
    emit("update:modelValue", null);
    emit("change", null);
  }
}

function onBlur(event: FocusEvent) {
  setTimeout(() => {
    if (!rootRef.value?.contains(document.activeElement)) {
      isFocused.value = false;
      closePicker();
      
      // If user typed incomplete or invalid date, reset to actual modelValue
      if (typedText.value.length > 0 && typedText.value.length < 10) {
        typedText.value = isoToDisplay(props.modelValue);
      } else if (typedText.value.length === 10) {
        const iso = displayToIso(typedText.value);
        if (!iso || isDateDisabled(iso)) {
          typedText.value = isoToDisplay(props.modelValue);
        }
      }

      emit("blur", event);
    }
  }, 150);
}

function onFocus(event: FocusEvent) {
  if (props.disabled || props.readonly) return;
  isFocused.value = true;
  emit("focus", event);
  inputRef.value?.select();
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) return;

  if (event.key === "Escape" && isOpen.value) {
    event.preventDefault();
    closePicker();
  } else if (event.key === "ArrowDown" && !isOpen.value) {
    event.preventDefault();
    openPicker();
  }
}

function onDocumentClick(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) {
    closePicker();
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
  clear: clearValue,
  open: openPicker,
  close: closePicker,
});
</script>

<template>
  <div
    ref="rootRef"
    class="app-date-picker"
    :class="{
      'app-date-picker--open': isOpen,
      'app-date-picker--focused': isFocused,
      'app-date-picker--disabled': disabled,
      'app-date-picker--error': Boolean(error),
    }"
  >
    <label v-if="label" :for="inputId" class="app-date-picker__label">
      {{ label }}
      <span v-if="required" class="app-date-picker__required">*</span>
    </label>

    <input
      v-if="name"
      type="hidden"
      :name="name"
      :value="modelValue ?? ''"
      :required="required"
    />

    <div class="app-date-picker__control">
      <div class="app-date-picker__input-wrapper">
        <i class="la la-calendar app-date-picker__calendar-icon" aria-hidden="true"></i>
        <input
          :id="inputId"
          ref="inputRef"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          class="form-control app-date-picker__input"
          :value="typedText"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required && !modelValue"
          maxlength="10"
          :aria-expanded="isOpen"
          :aria-controls="dialogId"
          aria-haspopup="dialog"
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput"
          @keydown="onKeydown"
        />
      </div>

      <div class="app-date-picker__actions">
        <button
          v-if="clearable && modelValue && !disabled && !readonly"
          type="button"
          class="app-date-picker__btn-clear"
          aria-label="Limpar data"
          tabindex="-1"
          @click="clearValue"
          @mousedown.prevent
        >
          <i class="la la-times" aria-hidden="true"></i>
        </button>

        <button
          type="button"
          class="app-date-picker__btn-toggle"
          :aria-label="isOpen ? 'Fechar calendário' : 'Abrir calendário'"
          tabindex="-1"
          :disabled="disabled || readonly"
          @click="isOpen ? closePicker() : openPicker()"
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

    <Transition name="app-date-picker-fade">
      <div
        v-if="isOpen"
        :id="dialogId"
        class="app-date-picker__popup"
        role="dialog"
        aria-modal="false"
        :aria-label="label || 'Selecionar data'"
      >
        <!-- Calendar Header -->
        <div class="app-date-picker__nav">
          <button
            type="button"
            class="app-date-picker__nav-btn"
            aria-label="Mês anterior"
            @click="prevMonth"
            @mousedown.prevent
          >
            <i class="la la-chevron-left" aria-hidden="true"></i>
          </button>

          <span class="app-date-picker__nav-title">
            {{ MONTH_NAMES[viewMonth - 1] }} {{ viewYear }}
          </span>

          <button
            type="button"
            class="app-date-picker__nav-btn"
            aria-label="Próximo mês"
            @click="nextMonth"
            @mousedown.prevent
          >
            <i class="la la-chevron-right" aria-hidden="true"></i>
          </button>
        </div>

        <!-- Weekdays Header -->
        <div class="app-date-picker__weekdays">
          <span
            v-for="wd in WEEKDAY_NAMES"
            :key="wd"
            class="app-date-picker__weekday"
          >
            {{ wd }}
          </span>
        </div>

        <!-- Days Grid -->
        <div class="app-date-picker__grid">
          <button
            v-for="cell in calendarDays"
            :key="cell.iso"
            type="button"
            class="app-date-picker__day"
            :class="{
              'app-date-picker__day--other-month': !cell.isCurrentMonth,
              'app-date-picker__day--selected': cell.isSelected,
              'app-date-picker__day--today': cell.isToday,
              'app-date-picker__day--disabled': cell.isDisabled,
            }"
            :disabled="cell.isDisabled"
            :aria-selected="cell.isSelected"
            :aria-label="isoToDisplay(cell.iso)"
            @click="selectDay(cell)"
            @mousedown.prevent
          >
            {{ cell.day }}
          </button>
        </div>

        <!-- Today Quick Button -->
        <div class="app-date-picker__footer">
          <button
            type="button"
            class="app-date-picker__btn-today"
            @click="selectToday"
            @mousedown.prevent
          >
            Hoje
          </button>
        </div>
      </div>
    </Transition>

    <p
      v-if="error || hint"
      class="app-date-picker__feedback"
      :class="error ? 'app-date-picker__feedback--error' : 'app-date-picker__feedback--hint'"
    >
      {{ error || hint }}
    </p>
  </div>
</template>

<style scoped>
.app-date-picker {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.app-date-picker__label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6c757d;
}

.app-date-picker__required {
  color: var(--primary, #0d6efd);
}

.app-date-picker__control {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.app-date-picker__input-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.app-date-picker__calendar-icon {
  position: absolute;
  left: 0.85rem;
  font-size: 1.15rem;
  color: #98a2b3;
  pointer-events: none;
  z-index: 3;
}

.app-date-picker__input {
  width: 100%;
  min-height: 2.85rem;
  padding-left: 2.5rem;
  padding-right: 4.5rem;
  border: 1px solid #dfe3e8;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #212529;
  font-size: 0.9375rem;
  font-variant-numeric: tabular-nums;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.app-date-picker__input:focus {
  border-color: var(--primary, #0d6efd);
  box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--primary, #0d6efd) 18%, transparent);
  outline: none;
}

.app-date-picker__actions {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  z-index: 3;
}

.app-date-picker__btn-clear,
.app-date-picker__btn-toggle {
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

.app-date-picker__btn-clear:hover,
.app-date-picker__btn-toggle:hover {
  color: #495057;
  background-color: #f1f3f5;
}

.app-date-picker__btn-toggle {
  font-size: 0.95rem;
}

.app-date-picker__btn-clear {
  font-size: 0.85rem;
}

.app-date-picker__popup {
  position: absolute;
  top: calc(100% + 0.35rem);
  left: 0;
  z-index: 1050;
  width: 18.5rem;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #dfe3e8;
  border-radius: 0.65rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  user-select: none;
}

.app-date-picker__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.app-date-picker__nav-title {
  font-weight: 600;
  font-size: 0.9375rem;
  color: #212529;
}

.app-date-picker__nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.85rem;
  height: 1.85rem;
  padding: 0;
  border: 1px solid #dfe3e8;
  border-radius: 0.375rem;
  background: #ffffff;
  color: #495057;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.app-date-picker__nav-btn:hover {
  background: #f8f9fa;
  border-color: #ced4da;
}

.app-date-picker__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.2rem;
  margin-bottom: 0.35rem;
}

.app-date-picker__weekday {
  text-align: center;
  font-size: 0.72rem;
  font-weight: 600;
  color: #98a2b3;
  text-transform: uppercase;
  padding: 0.25rem 0;
}

.app-date-picker__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.2rem;
}

.app-date-picker__day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.15rem;
  padding: 0;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  color: #212529;
  cursor: pointer;
  transition: background-color 0.12s ease, color 0.12s ease;
}

.app-date-picker__day:hover:not(:disabled) {
  background-color: #e9ecef;
}

.app-date-picker__day--other-month {
  color: #ced4da;
}

.app-date-picker__day--today {
  font-weight: 700;
  color: var(--primary, #0d6efd);
  position: relative;
}

.app-date-picker__day--today::after {
  content: "";
  position: absolute;
  bottom: 2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--primary, #0d6efd);
}

.app-date-picker__day--selected {
  background-color: var(--primary, #0d6efd) !important;
  color: #ffffff !important;
  font-weight: 600;
}

.app-date-picker__day--selected::after {
  background-color: #ffffff;
}

.app-date-picker__day--disabled {
  color: #e9ecef;
  cursor: not-allowed;
  opacity: 0.4;
}

.app-date-picker__footer {
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f1f3f5;
  display: flex;
  justify-content: center;
}

.app-date-picker__btn-today {
  border: none;
  background: transparent;
  color: var(--primary, #0d6efd);
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease;
}

.app-date-picker__btn-today:hover {
  background-color: #e8f0fe;
}

.app-date-picker--error .app-date-picker__input {
  border-color: #dc3545;
}

.app-date-picker--disabled .app-date-picker__input {
  background-color: #e9ecef;
  cursor: not-allowed;
  opacity: 0.85;
}

.app-date-picker__feedback {
  margin: 0.45rem 0 0;
  font-size: 0.8125rem;
}

.app-date-picker__feedback--error {
  color: #dc3545;
}

.app-date-picker__feedback--hint {
  color: #6c757d;
}

.app-date-picker-fade-enter-active,
.app-date-picker-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.app-date-picker-fade-enter-from,
.app-date-picker-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
