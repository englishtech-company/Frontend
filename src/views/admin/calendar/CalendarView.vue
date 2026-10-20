<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  watch,
} from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import type {
  CalendarApi,
  CalendarOptions,
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventHoveringArg,
  EventInput,
} from "@fullcalendar/core";
import CalendarCreateModal from "@/components/admin/calendar/CalendarCreateModal.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { notify } from "@/lib/actionNotification";
import { loadCalendarEvents } from "@/lib/calendar/events";
import {
  CALENDAR_EVENT_LEGEND,
  CALENDAR_EVENT_LEGEND_DARK,
  getCalendarEventBackground,
  getCalendarEventColor,
  getCalendarEventPresentation,
  getCalendarLegendItem,
} from "@/lib/calendar/theme";
import { useBodyThemeVersion } from "@/composables/useBodyThemeVersion";
import type { CalendarEventKind, CalendarMockEvent } from "@/lib/calendar/types";
import { confirmAction } from "@/lib/confirm";
import {
  connectGoogleCalendar,
  disconnectGoogleCalendar,
  getGoogleCalendarStatus,
  syncGoogleCalendarEvents,
  type GoogleCalendarStatus,
} from "@/lib/googleCalendar";
import { getStudentOptions } from "@/lib/students";
import { listTeachers } from "@/lib/teachers";

type CalendarViewMode = "timeGridWeek" | "dayGridMonth" | "timeGridDay";

const {
  canCreateLessons,
  canCreateExperimentalClasses,
  canUpdateLessons,
  canUpdateExperimentalClasses,
  canViewGoogleCalendar,
  canUpdateGoogleCalendar,
  canViewStudents,
} = usePermissions();
const { isDark: isDarkTheme } = useBodyThemeVersion();

const route = useRoute();
const router = useRouter();
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const calendarApi = shallowRef<CalendarApi | null>(null);

const allEvents = ref<CalendarMockEvent[]>([]);
const loadingEvents = ref(false);
const selectedEvent = ref<CalendarMockEvent | null>(null);
const showCreateModal = ref(false);
const editEvent = ref<CalendarMockEvent | null>(null);
const createInitialDateTime = ref("");
const currentTitle = ref("");
const currentView = ref<CalendarViewMode>("timeGridWeek");
const sidebarOpen = ref(true);
const currentRange = shallowRef<{ start: Date; end: Date } | null>(null);
const selectedTeacherId = ref<string | number | null>(null);
const selectedStudentId = ref<string | number | null>(null);
const teacherOptions = ref<SelectOption[]>([]);
const studentOptions = ref<SelectOption[]>([]);
const googleStatus = ref<GoogleCalendarStatus | null>(null);
const googleBusy = ref(false);
let refreshToken = 0;

const HOVER_PREVIEW_DELAY_MS = 2000;
const quickPreviewEvent = ref<CalendarMockEvent | null>(null);
const quickPreviewPos = ref({ x: 0, y: 0 });
let hoverPreviewTimer: ReturnType<typeof setTimeout> | null = null;
let hideQuickPreviewTimer: ReturnType<typeof setTimeout> | null = null;

const canCreateEvents = computed(
  () => canCreateLessons.value || canCreateExperimentalClasses.value
);

const visibleKinds = ref<Record<CalendarEventKind, boolean>>({
  group_lesson: true,
  individual_lesson: true,
  experimental_class: true,
  makeup_lesson: true,
  google_event: true,
});

const filteredEvents = computed(() =>
  allEvents.value.filter((event) => visibleKinds.value[event.kind])
);

const eventLegend = computed(() =>
  isDarkTheme.value ? CALENDAR_EVENT_LEGEND_DARK : CALENDAR_EVENT_LEGEND
);

const upcomingEvents = computed(() => {
  const now = Date.now();

  return [...filteredEvents.value]
    .filter((event) => new Date(event.end).getTime() >= now)
    .sort(
      (left, right) =>
        new Date(left.start).getTime() - new Date(right.start).getTime()
    )
    .slice(0, 6);
});

const calendarEvents = computed<EventInput[]>(() =>
  filteredEvents.value.map((event) => {
    const presentation = getCalendarEventPresentation(
      event.kind,
      event.statusKey,
      isDarkTheme.value
    );

    return {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: Boolean(event.allDay),
      backgroundColor: presentation.backgroundColor,
      borderColor: presentation.borderColor,
      textColor: presentation.textColor,
      classNames: presentation.classNames,
      extendedProps: { ...event },
    };
  })
);

const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  locales: [ptBrLocale],
  locale: "pt-br",
  headerToolbar: false as const,
  initialView: currentView.value,
  events: calendarEvents.value,
  editable: false,
  selectable: canCreateEvents.value,
  selectMirror: true,
  dayMaxEvents: 4,
  height: "100%",
  expandRows: true,
  slotMinTime: "06:00:00",
  // Exclusivo no FullCalendar: 24:00 inclui faixas até 23:30 (aulas noturnas).
  slotMaxTime: "24:00:00",
  slotDuration: "00:30:00",
  scrollTime: "07:00:00",
  scrollTimeReset: false,
  allDaySlot: true,
  nowIndicator: true,
  firstDay: 0,
  weekNumbers: false,
  stickyHeaderDates: true,
  eventTimeFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },
  slotLabelFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },
  dayHeaderFormat: {
    weekday: "short",
    day: "numeric",
    omitCommas: true,
  },
  datesSet: handleDatesSet,
  eventClick: handleEventClick,
  eventMouseEnter: handleEventMouseEnter,
  eventMouseLeave: handleEventMouseLeave,
  select: handleDateSelect,
  dateClick: handleDateClick,
}));

function getApi(): CalendarApi | null {
  return calendarRef.value?.getApi() ?? calendarApi.value;
}

async function handleDatesSet(info: DatesSetArg) {
  calendarApi.value = info.view.calendar;
  currentTitle.value = info.view.title;
  currentView.value = info.view.type as CalendarViewMode;

  const sameRange =
    currentRange.value !== null &&
    currentRange.value.start.getTime() === info.start.getTime() &&
    currentRange.value.end.getTime() === info.end.getTime();

  currentRange.value = {
    start: info.start,
    end: info.end,
  };

  if (sameRange) {
    return;
  }

  await refreshEvents(info.start, info.end);
}

async function refreshEvents(start: Date, end: Date) {
  const token = ++refreshToken;
  loadingEvents.value = true;

  try {
    const events = await loadCalendarEvents(start, end, {
      teacherId: selectedTeacherId.value,
      studentId: selectedStudentId.value,
      googleConnected: googleStatus.value?.connected === true,
    });

    if (token !== refreshToken) {
      return;
    }

    allEvents.value = events;
  } catch (error) {
    if (token !== refreshToken) {
      return;
    }

    allEvents.value = [];
    notify.error(
      error instanceof Error
        ? error.message
        : "Não foi possível carregar as aulas do calendário."
    );
  } finally {
    if (token === refreshToken) {
      loadingEvents.value = false;
    }
  }
}

async function loadTeacherOptions() {
  try {
    const result = await listTeachers({ status: "active", limit: 200 });
    teacherOptions.value = result.data.map((teacher) => ({
      value: teacher.id,
      label: teacher.name,
    }));
  } catch {
    teacherOptions.value = [];
  }
}

async function loadStudentOptionsList() {
  if (!canViewStudents.value) {
    studentOptions.value = [];
    return;
  }

  try {
    const options = await getStudentOptions();
    studentOptions.value = Object.entries(options).map(([value, label]) => ({
      value,
      label,
    }));
  } catch {
    studentOptions.value = [];
  }
}

watch(selectedTeacherId, async () => {
  if (!currentRange.value) {
    return;
  }

  await refreshEvents(currentRange.value.start, currentRange.value.end);
});

watch(selectedStudentId, async () => {
  if (!currentRange.value) {
    return;
  }

  await refreshEvents(currentRange.value.start, currentRange.value.end);
});

function reflowCalendar() {
  nextTick(() => {
    getApi()?.updateSize();
  });
}

watch(sidebarOpen, reflowCalendar);
watch(selectedEvent, reflowCalendar);
watch(isDarkTheme, reflowCalendar);

async function loadGoogleStatus() {
  if (!canViewGoogleCalendar.value) {
    googleStatus.value = null;
    return;
  }

  try {
    googleStatus.value = await getGoogleCalendarStatus();
  } catch {
    googleStatus.value = null;
  }
}

async function handleGoogleCallbackQuery() {
  const google = route.query.google;
  const reason = route.query.reason;

  if (google !== "connected" && google !== "error") {
    return;
  }

  if (google === "connected") {
    notify.success("Google Calendar vinculado com sucesso.");
  } else {
    notify.error(googleCallbackError(typeof reason === "string" ? reason : null));
  }

  await router.replace({ path: "/calendar", query: {} });
  await loadGoogleStatus();

  if (currentRange.value) {
    await refreshEvents(currentRange.value.start, currentRange.value.end);
  }
}

function googleCallbackError(reason: string | null): string {
  if (reason === "not_configured") {
    return "As credenciais do Google Calendar ainda não foram configuradas no servidor.";
  }

  if (reason === "access_denied") {
    return "A vinculação com o Google Calendar foi cancelada.";
  }

  if (reason === "missing_code" || reason === "invalid_state") {
    return "Não foi possível concluir a autorização do Google Calendar. Tente novamente.";
  }

  if (reason === "token_exchange_failed") {
    return "O Google recusou as credenciais do servidor (Client Secret inválido ou desatualizado). Gere uma nova chave no Google Cloud e atualize o backend/.env.";
  }

  return "Não foi possível vincular o Google Calendar. Tente novamente.";
}

async function connectGoogleAccount() {
  if (!canUpdateGoogleCalendar.value || googleBusy.value) {
    return;
  }

  if (googleStatus.value && !googleStatus.value.configured) {
    notify.warning(
      googleStatus.value.message ||
        "Configure as credenciais do Google Calendar no servidor para vincular a conta."
    );
    return;
  }

  googleBusy.value = true;

  try {
    const authorizationUrl = await connectGoogleCalendar();
    window.location.href = authorizationUrl;
  } catch (error) {
    notify.error(
      error instanceof Error
        ? error.message
        : "Não foi possível iniciar a vinculação com o Google Calendar."
    );
    googleBusy.value = false;
  }
}

async function pullGoogleEvents() {
  if (!canViewGoogleCalendar.value || googleBusy.value || !googleStatus.value?.connected) {
    return;
  }

  if (!currentRange.value) {
    notify.warning("Aguarde o calendário carregar o período atual.");
    return;
  }

  googleBusy.value = true;

  try {
    const result = await syncGoogleCalendarEvents({
      rangeStart: currentRange.value.start,
      rangeEnd: currentRange.value.end,
    });

    googleStatus.value = result.google_calendar;
    await refreshEvents(currentRange.value.start, currentRange.value.end);

    const count = result.imported_count ?? result.google_calendar_events?.length ?? 0;
    notify.success(
      count > 0
        ? `${count} evento(s) do Google importados para este período.`
        : "Sincronizado. Nenhum evento do Google neste período."
    );
  } catch (error) {
    notify.error(
      error instanceof Error
        ? error.message
        : "Não foi possível puxar os eventos do Google Calendar."
    );
  } finally {
    googleBusy.value = false;
  }
}

async function disconnectGoogleAccount() {
  if (!canUpdateGoogleCalendar.value || googleBusy.value) {
    return;
  }

  const confirmed = await confirmAction({
    title: "Desvincular Google Calendar?",
    message:
      "Os eventos do Google deixam de aparecer no calendário até a conta ser vinculada de novo.",
    confirmButtonText: "Desvincular",
  });

  if (!confirmed) {
    return;
  }

  googleBusy.value = true;

  try {
    googleStatus.value = await disconnectGoogleCalendar();
    notify.success("Google Calendar desvinculado.");

    if (currentRange.value) {
      await refreshEvents(currentRange.value.start, currentRange.value.end);
    }
  } catch (error) {
    notify.error(
      error instanceof Error
        ? error.message
        : "Não foi possível desvincular o Google Calendar."
    );
  } finally {
    googleBusy.value = false;
  }
}

watch(
  () => googleStatus.value?.connected,
  (connected, wasConnected) => {
    if (connected && !wasConnected && currentRange.value) {
      void refreshEvents(currentRange.value.start, currentRange.value.end);
    }
  }
);

watch(
  () => route.path,
  (path) => {
    if (path === "/calendar" && currentRange.value) {
      void refreshEvents(currentRange.value.start, currentRange.value.end);
    }
  }
);

onMounted(async () => {
  void loadTeacherOptions();
  void loadStudentOptionsList();
  await loadGoogleStatus();
  await handleGoogleCallbackQuery();
});

function toDateTimeLocalValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function openCreateModal(date?: Date) {
  if (!canCreateEvents.value) {
    return;
  }

  editEvent.value = null;
  createInitialDateTime.value = date ? toDateTimeLocalValue(date) : "";
  showCreateModal.value = true;
}

function closeEventModal() {
  showCreateModal.value = false;
  createInitialDateTime.value = "";
  editEvent.value = null;
}

function toggleCalendarKind(kind: CalendarEventKind) {
  visibleKinds.value[kind] = !visibleKinds.value[kind];
}

function canEditEventInCalendar(event: CalendarMockEvent): boolean {
  if (!event.sourceId) {
    return false;
  }

  if (
    event.sourceType === "experimental" ||
    event.kind === "experimental_class" ||
    event.id.startsWith("experimental-")
  ) {
    return canUpdateExperimentalClasses.value;
  }

  if (event.id.startsWith("lesson-") || event.sourceType === "lesson") {
    return canUpdateLessons.value;
  }

  return false;
}

function normalizeEditCalendarEvent(event: CalendarMockEvent): CalendarMockEvent {
  if (event.sourceType) {
    return event;
  }

  if (event.kind === "experimental_class" || event.id.startsWith("experimental-")) {
    const sourceId =
      event.sourceId ??
      Number.parseInt(event.id.replace(/^experimental-/, ""), 10);

    return {
      ...event,
      sourceType: "experimental",
      sourceId: Number.isFinite(sourceId) ? sourceId : event.sourceId,
    };
  }

  if (event.id.startsWith("lesson-")) {
    const sourceId =
      event.sourceId ?? Number.parseInt(event.id.replace(/^lesson-/, ""), 10);

    return {
      ...event,
      sourceType: "lesson",
      sourceId: Number.isFinite(sourceId) ? sourceId : event.sourceId,
    };
  }

  return event;
}

function openEditEventModal(event: CalendarMockEvent) {
  const normalized = normalizeEditCalendarEvent(event);

  if (!canEditEventInCalendar(normalized)) {
    return;
  }

  showCreateModal.value = false;
  createInitialDateTime.value = "";
  editEvent.value = normalized;
  selectedEvent.value = null;
  closeQuickPreview();
}

async function handleEventCreated() {
  selectedEvent.value = null;
  if (currentRange.value) {
    await refreshEvents(currentRange.value.start, currentRange.value.end);
  }
}

function handleDateSelect(selectInfo: DateSelectArg) {
  if (!canCreateEvents.value) {
    return;
  }

  openCreateModal(selectInfo.start);
  getApi()?.unselect();
}

function handleDateClick(clickInfo: DateClickArg) {
  if (!canCreateEvents.value) {
    return;
  }

  openCreateModal(clickInfo.date);
}

function handleEventClick(clickInfo: EventClickArg) {
  clearHoverPreviewTimers();
  quickPreviewEvent.value = null;
  selectedEvent.value = clickInfo.event.extendedProps as CalendarMockEvent;
}

function clearHoverPreviewTimers() {
  if (hoverPreviewTimer) {
    clearTimeout(hoverPreviewTimer);
    hoverPreviewTimer = null;
  }
  if (hideQuickPreviewTimer) {
    clearTimeout(hideQuickPreviewTimer);
    hideQuickPreviewTimer = null;
  }
}

function updateQuickPreviewPosition(jsEvent: MouseEvent) {
  const margin = 12;
  const maxWidth = 320;
  const maxHeight = 280;
  let x = jsEvent.clientX + margin;
  let y = jsEvent.clientY + margin;

  if (x + maxWidth > window.innerWidth) {
    x = jsEvent.clientX - maxWidth - margin;
  }
  if (y + maxHeight > window.innerHeight) {
    y = jsEvent.clientY - maxHeight - margin;
  }

  quickPreviewPos.value = { x: Math.max(margin, x), y: Math.max(margin, y) };
}

function handleEventMouseEnter(info: EventHoveringArg) {
  clearHoverPreviewTimers();
  quickPreviewEvent.value = null;

  const eventData = info.event.extendedProps as CalendarMockEvent;
  const jsEvent = info.jsEvent;

  hoverPreviewTimer = setTimeout(() => {
    quickPreviewEvent.value = eventData;
    updateQuickPreviewPosition(jsEvent);
  }, HOVER_PREVIEW_DELAY_MS);
}

function handleEventMouseLeave() {
  if (hoverPreviewTimer) {
    clearTimeout(hoverPreviewTimer);
    hoverPreviewTimer = null;
  }

  hideQuickPreviewTimer = setTimeout(() => {
    quickPreviewEvent.value = null;
  }, 180);
}

function keepQuickPreviewOpen() {
  if (hideQuickPreviewTimer) {
    clearTimeout(hideQuickPreviewTimer);
    hideQuickPreviewTimer = null;
  }
}

function closeQuickPreview() {
  clearHoverPreviewTimers();
  quickPreviewEvent.value = null;
}

function openQuickPreviewInPanel() {
  if (!quickPreviewEvent.value) return;
  selectedEvent.value = quickPreviewEvent.value;
  closeQuickPreview();
}

function closeEventPanel() {
  selectedEvent.value = null;
}

function goToday() {
  getApi()?.today();
}

function goPrev() {
  getApi()?.prev();
}

function goNext() {
  getApi()?.next();
}

function setView(view: CalendarViewMode) {
  currentView.value = view;
  getApi()?.changeView(view);
}

function formatEventRange(event: CalendarMockEvent): string {
  const start = new Date(event.start);
  const end = new Date(event.end);

  const date = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(start);

  if (event.allDay) {
    return `${date} · Dia inteiro`;
  }

  const time = `${start.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })} – ${end.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return `${date} · ${time}`;
}

function getKindLabel(kind: CalendarEventKind): string {
  return getCalendarLegendItem(kind, isDarkTheme.value).label;
}

function eventHref(event: CalendarMockEvent): string | null {
  if (event.href) {
    return event.href;
  }

  if (event.sourceType === "lesson" && event.sourceId) {
    return `/lessons/${event.sourceId}/edit`;
  }

  if (event.sourceType === "experimental" && event.sourceId) {
    return `/experimental-classes/${event.sourceId}/edit`;
  }

  return null;
}

const selectedEventHref = computed(() =>
  selectedEvent.value ? eventHref(selectedEvent.value) : null
);

const quickPreviewHref = computed(() =>
  quickPreviewEvent.value ? eventHref(quickPreviewEvent.value) : null
);

onUnmounted(clearHoverPreviewTimers);
</script>

<template>
  <div class="gcal-app" :class="{ 'gcal-app--dark': isDarkTheme }">
    <header class="gcal-toolbar">
      <div class="gcal-toolbar__left">
        <button
          type="button"
          class="gcal-toolbar__menu"
          title="Alternar painel"
          @click="sidebarOpen = !sidebarOpen"
        >
          <i class="la la-bars"></i>
        </button>

        <div class="gcal-toolbar__brand">
          <i class="la la-calendar"></i>
          <span>Calendário</span>
        </div>

        <button type="button" class="gcal-toolbar__today" @click="goToday">
          Hoje
        </button>

        <div class="gcal-toolbar__nav">
          <button type="button" aria-label="Período anterior" @click="goPrev">
            <i class="la la-angle-left"></i>
          </button>
          <button type="button" aria-label="Próximo período" @click="goNext">
            <i class="la la-angle-right"></i>
          </button>
        </div>

        <h1 class="gcal-toolbar__title">{{ currentTitle }}</h1>
      </div>

      <div class="gcal-toolbar__right">
        <div class="gcal-view-switch" role="tablist" aria-label="Visualização">
          <button
            type="button"
            role="tab"
            :class="{ 'is-active': currentView === 'timeGridDay' }"
            @click="setView('timeGridDay')"
          >
            Dia
          </button>
          <button
            type="button"
            role="tab"
            :class="{ 'is-active': currentView === 'timeGridWeek' }"
            @click="setView('timeGridWeek')"
          >
            Semana
          </button>
          <button
            type="button"
            role="tab"
            :class="{ 'is-active': currentView === 'dayGridMonth' }"
            @click="setView('dayGridMonth')"
          >
            Mês
          </button>
        </div>

        <div
          v-if="canViewGoogleCalendar || canUpdateGoogleCalendar"
          class="gcal-toolbar__google"
        >
          <span class="gcal-toolbar__google-label">Minha conta Google</span>
          <template v-if="canUpdateGoogleCalendar">
            <button
              v-if="!googleStatus?.connected"
              type="button"
              class="gcal-toolbar__google-btn"
              :disabled="googleBusy || !googleStatus || googleStatus.configured === false"
              :title="googleStatus?.message || 'Vincular a sua conta Google'"
              @click="connectGoogleAccount"
            >
              Vincular
            </button>
            <button
              v-else
              type="button"
              class="gcal-toolbar__google-btn gcal-toolbar__google-btn--connected"
              :disabled="googleBusy"
              :title="googleStatus.google_email || 'Desvincular conta Google'"
              @click="disconnectGoogleAccount"
            >
              {{ googleStatus.google_email || "Desvincular" }}
            </button>
          </template>
          <button
            v-if="googleStatus?.connected && canViewGoogleCalendar"
            type="button"
            class="gcal-toolbar__google-btn gcal-toolbar__google-btn--pull"
            :disabled="googleBusy || loadingEvents"
            title="Buscar eventos do Google Calendar neste período"
            @click="pullGoogleEvents"
          >
            Puxar do Google
          </button>
        </div>
      </div>
    </header>

    <div class="gcal-body">
      <aside v-show="sidebarOpen" class="gcal-sidebar">
        <button
          type="button"
          class="gcal-create-btn"
          :disabled="!canCreateEvents"
          @click="openCreateModal()"
        >
          <i class="la la-plus"></i>
          Criar
        </button>

        <section class="gcal-sidebar__section">
          <h2>Professor</h2>
          <SingleSelect
            v-model="selectedTeacherId"
            :options="teacherOptions"
            placeholder="Todos os professores"
            :searchable="true"
          />
        </section>

        <section v-if="canViewStudents" class="gcal-sidebar__section">
          <h2>Aluno</h2>
          <SingleSelect
            v-model="selectedStudentId"
            :options="studentOptions"
            placeholder="Todos os alunos"
            :searchable="true"
          />
          <p v-if="selectedStudentId" class="gcal-sidebar__filter-hint">
            Mostrando aulas individuais e de turma deste aluno. Experimentais e
            Google ficam ocultos neste filtro.
          </p>
        </section>

        <section class="gcal-sidebar__section">
          <h2>Meus calendários</h2>
          <ul class="gcal-calendars list-unstyled mb-0">
            <li v-for="item in eventLegend" :key="item.kind">
              <button
                type="button"
                class="gcal-calendars__item"
                :class="{
                  'gcal-calendars__item--off': !visibleKinds[item.kind],
                }"
                :aria-pressed="visibleKinds[item.kind]"
                @click="toggleCalendarKind(item.kind)"
              >
                <span
                  class="gcal-calendars__swatch"
                  :style="{ backgroundColor: item.color }"
                ></span>
                <span class="gcal-calendars__label">{{ item.label }}</span>
              </button>
            </li>
          </ul>
        </section>

        <section class="gcal-sidebar__section">
          <h2>Próximas aulas</h2>
          <div v-if="upcomingEvents.length" class="gcal-upcoming">
            <button
              v-for="event in upcomingEvents"
              :key="event.id"
              type="button"
              class="gcal-upcoming__item"
              @click="selectedEvent = event"
            >
              <span
                class="gcal-upcoming__bar"
                :style="{ backgroundColor: getCalendarEventColor(event.kind, isDarkTheme) }"
              ></span>
              <span class="gcal-upcoming__content">
                <strong>{{ event.title }}</strong>
                <small>{{ formatEventRange(event) }}</small>
              </span>
            </button>
          </div>
          <p v-else class="gcal-upcoming__empty">
            Nenhuma aula próxima neste período.
          </p>
        </section>

        <p class="gcal-sidebar__note">
          Clique em um horário vazio ou use Criar para agendar uma aula.
        </p>
      </aside>

      <main class="gcal-main">
        <div v-if="loadingEvents" class="gcal-main__loading">Atualizando aulas...</div>
        <div
          v-else-if="!filteredEvents.length"
          class="gcal-main__empty"
        >
          Nenhuma aula neste período.
        </div>
        <div class="gcal-main__canvas">
          <FullCalendar ref="calendarRef" :options="calendarOptions" />
        </div>
      </main>

      <aside v-if="selectedEvent" class="gcal-event-panel">
        <div
          class="gcal-event-panel__stripe"
          :style="{ backgroundColor: getCalendarEventColor(selectedEvent.kind, isDarkTheme) }"
        ></div>

        <div class="gcal-event-panel__header">
          <button
            type="button"
            class="btn-close"
            aria-label="Fechar"
            @click="closeEventPanel"
          ></button>
        </div>

        <div class="gcal-event-panel__body">
          <h2>{{ selectedEvent.title }}</h2>
          <p class="gcal-event-panel__datetime">
            {{ formatEventRange(selectedEvent) }}
          </p>

          <dl class="gcal-event-panel__details">
            <div>
              <dt>Tipo</dt>
              <dd>{{ getKindLabel(selectedEvent.kind) }}</dd>
            </div>
            <div>
              <dt>Professor</dt>
              <dd>{{ selectedEvent.teacherName }}</dd>
            </div>
            <div>
              <dt>Contexto</dt>
              <dd>{{ selectedEvent.contextLabel }}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <span
                  class="gcal-event-panel__status"
                  :class="{
                    'gcal-event-panel__status--cancelled':
                      selectedEvent.statusKey === 'cancelled' ||
                      selectedEvent.statusKey === 'cancelada' ||
                      selectedEvent.statusKey === 'google_cancelled',
                  }"
                  :style="{
                    color: getCalendarEventPresentation(
                      selectedEvent.kind,
                      selectedEvent.statusKey,
                      isDarkTheme
                    ).textColor,
                    backgroundColor: getCalendarEventPresentation(
                      selectedEvent.kind,
                      selectedEvent.statusKey,
                      isDarkTheme
                    ).backgroundColor,
                    borderColor: getCalendarEventPresentation(
                      selectedEvent.kind,
                      selectedEvent.statusKey,
                      isDarkTheme
                    ).borderColor,
                  }"
                >
                  {{ selectedEvent.statusLabel }}
                </span>
              </dd>
            </div>
            <div v-if="selectedEvent.observation">
              <dt>Observação</dt>
              <dd>{{ selectedEvent.observation }}</dd>
            </div>
          </dl>

          <div class="gcal-event-panel__links">
            <a
              v-if="selectedEvent.meetUrl"
              :href="selectedEvent.meetUrl"
              class="gcal-event-panel__open"
              target="_blank"
              rel="noreferrer"
            >
              Abrir Google Meet
            </a>
            <a
              v-if="selectedEvent.googleHtmlLink"
              :href="selectedEvent.googleHtmlLink"
              class="gcal-event-panel__open gcal-event-panel__open--secondary"
              target="_blank"
              rel="noreferrer"
            >
              Abrir no Google Calendar
            </a>
            <button
              v-if="selectedEvent && canEditEventInCalendar(selectedEvent)"
              type="button"
              class="gcal-event-panel__open"
              @click="openEditEventModal(selectedEvent)"
            >
              Abrir aula
            </button>
            <RouterLink
              v-else-if="selectedEventHref"
              :to="selectedEventHref"
              class="gcal-event-panel__open"
            >
              Abrir aula
            </RouterLink>
          </div>
        </div>
      </aside>
    </div>

    <CalendarCreateModal
      v-if="showCreateModal || editEvent"
      :initial-date-time="createInitialDateTime"
      :edit-event="editEvent"
      @close="closeEventModal"
      @created="handleEventCreated"
    />

    <Teleport to="body">
      <div
        v-if="quickPreviewEvent"
        class="gcal-quick-preview"
        :class="{ 'gcal-quick-preview--dark': isDarkTheme }"
        :style="{
          left: `${quickPreviewPos.x}px`,
          top: `${quickPreviewPos.y}px`,
        }"
        role="tooltip"
        @mouseenter="keepQuickPreviewOpen"
        @mouseleave="closeQuickPreview"
      >
        <div
          class="gcal-quick-preview__stripe"
          :style="{
            backgroundColor: getCalendarEventColor(
              quickPreviewEvent.kind,
              isDarkTheme
            ),
          }"
        ></div>
        <div class="gcal-quick-preview__body">
          <h3 class="gcal-quick-preview__title">{{ quickPreviewEvent.title }}</h3>
          <p class="gcal-quick-preview__time">
            {{ formatEventRange(quickPreviewEvent) }}
          </p>
          <dl class="gcal-quick-preview__meta">
            <div>
              <dt>Tipo</dt>
              <dd>{{ getKindLabel(quickPreviewEvent.kind) }}</dd>
            </div>
            <div>
              <dt>Professor</dt>
              <dd>{{ quickPreviewEvent.teacherName }}</dd>
            </div>
            <div>
              <dt>Contexto</dt>
              <dd>{{ quickPreviewEvent.contextLabel }}</dd>
            </div>
          </dl>
          <div class="gcal-quick-preview__actions">
            <button
              type="button"
              class="gcal-quick-preview__btn gcal-quick-preview__btn--ghost"
              @click="openQuickPreviewInPanel"
            >
              Ver detalhes
            </button>
            <button
              v-if="quickPreviewEvent && canEditEventInCalendar(quickPreviewEvent)"
              type="button"
              class="gcal-quick-preview__btn"
              @click="openEditEventModal(quickPreviewEvent)"
            >
              Abrir aula
            </button>
            <RouterLink
              v-else-if="quickPreviewHref"
              :to="quickPreviewHref"
              class="gcal-quick-preview__btn"
              @click="closeQuickPreview"
            >
              Abrir aula
            </RouterLink>
            <a
              v-else-if="quickPreviewEvent.meetUrl"
              :href="quickPreviewEvent.meetUrl"
              class="gcal-quick-preview__btn"
              target="_blank"
              rel="noreferrer"
              @click="closeQuickPreview"
            >
              Abrir Meet
            </a>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.gcal-app {
  --gcal-surface: #fff;
  --gcal-surface-muted: #f8f9fa;
  --gcal-surface-hover: #f1f3f4;
  --gcal-border: #dadce0;
  --gcal-text: #3c4043;
  --gcal-text-secondary: #5f6368;
  --gcal-text-muted: #70757a;
  --gcal-text-faint: #9aa0a6;
  --gcal-accent: #1a73e8;
  --gcal-accent-soft: #e8f0fe;
  --gcal-accent-hover: #d2e3fc;
  --gcal-success-soft: #e6f4ea;
  --gcal-success-text: #137333;
  --gcal-shadow: rgba(60, 64, 67, 0.18);
  --gcal-fc-border: #dadce0;
  --gcal-fc-page-bg: #fff;
  --gcal-fc-neutral-bg: #fff;
  --gcal-fc-today-bg: rgba(26, 115, 232, 0.08);
  --gcal-fc-more-link: #70757a;
  --gcal-fc-non-business: transparent;

  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 7.5rem);
  margin: -0.5rem -0.25rem 0;
  background: var(--gcal-surface);
  border: 1px solid var(--gcal-border);
  border-radius: 16px;
  overflow: hidden;
}

.gcal-app--dark {
  --gcal-surface: var(--card, #212130);
  --gcal-surface-muted: #1a1a24;
  --gcal-surface-hover: rgba(255, 255, 255, 0.06);
  --gcal-border: var(--border, #3d3d4e);
  --gcal-text: var(--text-dark, #fff);
  --gcal-text-secondary: var(--text-gray, #b3b3b3);
  --gcal-text-muted: #9aa0a6;
  --gcal-text-faint: #828690;
  --gcal-accent: var(--bs-primary, #9596f6);
  --gcal-accent-soft: rgba(149, 150, 246, 0.2);
  --gcal-accent-hover: rgba(149, 150, 246, 0.32);
  --gcal-success-soft: rgba(129, 201, 149, 0.18);
  --gcal-success-text: #81c995;
  --gcal-shadow: rgba(0, 0, 0, 0.45);
  --gcal-fc-border: var(--border, #3d3d4e);
  --gcal-fc-page-bg: var(--body-bg, #17171e);
  --gcal-fc-neutral-bg: var(--card, #212130);
  --gcal-fc-today-bg: rgba(149, 150, 246, 0.14);
  --gcal-fc-more-link: var(--text-gray, #b3b3b3);
  --gcal-fc-non-business: rgba(0, 0, 0, 0.12);
}

.gcal-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 64px;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--gcal-border);
  background: var(--gcal-surface);
}

.gcal-toolbar__left,
.gcal-toolbar__right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.gcal-toolbar__menu,
.gcal-toolbar__nav button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--gcal-text-secondary);
}

.gcal-toolbar__menu:hover,
.gcal-toolbar__nav button:hover {
  background: var(--gcal-surface-hover);
}

.gcal-toolbar__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-right: 0.25rem;
  color: var(--gcal-text-secondary);
  font-size: 1.35rem;
}

.gcal-toolbar__brand span {
  display: none;
}

.gcal-toolbar__today {
  padding: 0.45rem 1rem;
  border: 1px solid var(--gcal-border);
  border-radius: 999px;
  background: var(--gcal-surface);
  color: var(--gcal-text);
  font-size: 0.875rem;
  font-weight: 500;
}

.gcal-toolbar__today:hover {
  background: var(--gcal-surface-muted);
}

.gcal-toolbar__title {
  margin: 0;
  color: var(--gcal-text);
  font-size: 1.35rem;
  font-weight: 400;
  white-space: nowrap;
}

.gcal-view-switch {
  display: inline-flex;
  padding: 0.15rem;
  border: 1px solid var(--gcal-border);
  border-radius: 999px;
  background: var(--gcal-surface);
}

.gcal-view-switch button {
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--gcal-text-secondary);
  font-size: 0.82rem;
  font-weight: 500;
  padding: 0.4rem 0.9rem;
}

.gcal-toolbar__google {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.gcal-toolbar__google-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gcal-text-secondary);
  white-space: nowrap;
}

.gcal-toolbar__google-btn {
  display: inline-flex;
  align-items: center;
  max-width: 16rem;
  padding: 0.45rem 0.95rem;
  border: 1px solid var(--gcal-border);
  border-radius: 999px;
  background: var(--gcal-surface);
  color: var(--gcal-text);
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gcal-toolbar__google-btn:hover:not(:disabled) {
  background: var(--gcal-surface-muted);
}

.gcal-toolbar__google-btn:disabled {
  opacity: 0.55;
}

.gcal-toolbar__google-btn--connected {
  border-color: rgba(129, 201, 149, 0.45);
  background: var(--gcal-success-soft);
  color: var(--gcal-success-text);
}

.gcal-toolbar__google-btn--pull {
  border-color: rgba(210, 227, 252, 0.9);
  background: #e8f0fe;
  color: #1a73e8;
}

.gcal-view-switch button.is-active {
  background: var(--gcal-accent-soft);
  color: var(--gcal-accent);
}

.gcal-body {
  display: flex;
  min-height: 0;
  flex: 1;
}

.gcal-sidebar {
  width: 256px;
  flex-shrink: 0;
  padding: 1rem 1rem 1.25rem;
  border-right: 1px solid var(--gcal-border);
  background: var(--gcal-surface);
  overflow: auto;
}

.gcal-create-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  margin-bottom: 1.25rem;
  padding: 0.8rem 1rem;
  border: 0;
  border-radius: 999px;
  background: var(--gcal-surface);
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  color: var(--gcal-text);
  font-weight: 500;
}

.gcal-app--dark .gcal-create-btn {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  border: 1px solid var(--gcal-border);
}

.gcal-create-btn:disabled {
  opacity: 0.72;
}

.gcal-sidebar__section + .gcal-sidebar__section {
  margin-top: 1.15rem;
}

.gcal-sidebar :deep(.single-select__trigger) {
  min-height: 2.4rem;
  font-size: 0.85rem;
}

.gcal-sidebar__section h2 {
  margin: 0 0 0.75rem;
  padding-left: 0.35rem;
  color: var(--gcal-text-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.gcal-calendars__item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.45rem 0.5rem;
  border: 0;
  border-radius: 8px;
  background: var(--gcal-surface-muted);
  color: var(--gcal-text);
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition:
    opacity 0.15s ease,
    background 0.15s ease,
    color 0.15s ease;
}

.gcal-calendars__item:hover:not(.gcal-calendars__item--off) {
  background: var(--gcal-surface-hover);
}

.gcal-calendars__item--off {
  opacity: 0.38;
  background: transparent;
  color: var(--gcal-text-faint);
}

.gcal-calendars__item--off .gcal-calendars__label {
  text-decoration: line-through;
  text-decoration-color: var(--gcal-text-faint);
}

.gcal-calendars__item--off .gcal-calendars__swatch {
  opacity: 0.45;
  filter: grayscale(0.85);
}

.gcal-calendars__swatch {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 3px;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
  transition:
    opacity 0.15s ease,
    filter 0.15s ease;
}

.gcal-app--dark .gcal-calendars__swatch {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}

.gcal-calendars__label {
  flex: 1;
  min-width: 0;
}

.gcal-upcoming {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.gcal-upcoming__item {
  display: flex;
  gap: 0.65rem;
  width: 100%;
  padding: 0.55rem 0.35rem;
  border: 0;
  border-radius: 8px;
  background: transparent;
  text-align: left;
}

.gcal-upcoming__item:hover {
  background: var(--gcal-surface-hover);
}

.gcal-upcoming__bar {
  width: 0.25rem;
  border-radius: 999px;
  flex-shrink: 0;
}

.gcal-upcoming__content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.gcal-upcoming__content strong {
  font-size: 0.82rem;
  line-height: 1.35;
  color: var(--gcal-text);
}

.gcal-upcoming__content small {
  color: var(--gcal-text-muted);
  font-size: 0.72rem;
  line-height: 1.35;
}

.gcal-upcoming__empty {
  margin: 0;
  padding: 0.15rem 0.35rem 0;
  color: var(--gcal-text-faint);
  font-size: 0.78rem;
  line-height: 1.4;
}

.gcal-sidebar__note {
  margin: 1rem 0 0;
  color: var(--gcal-text-faint);
  font-size: 0.75rem;
  line-height: 1.45;
}

.gcal-sidebar__filter-hint {
  margin: 0.55rem 0 0;
  padding-left: 0.35rem;
  color: var(--gcal-text-faint);
  font-size: 0.72rem;
  line-height: 1.4;
}

.gcal-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--gcal-fc-page-bg);
}

.gcal-main__loading,
.gcal-main__empty {
  padding: 0.5rem 1rem;
  color: var(--gcal-text-muted);
  font-size: 0.82rem;
}

.gcal-main__canvas {
  flex: 1;
  width: 100%;
  min-height: 640px;
  padding: 0.35rem 0.5rem 0.75rem;
}

.gcal-main__canvas :deep(.fc) {
  width: 100%;
}

.gcal-event-panel {
  width: 360px;
  flex-shrink: 0;
  border-left: 1px solid var(--gcal-border);
  background: var(--gcal-surface);
  overflow: auto;
}

.gcal-event-panel__stripe {
  height: 0.45rem;
}

.gcal-event-panel__header {
  display: flex;
  justify-content: flex-end;
  padding: 0.75rem 0.85rem 0;
}

.gcal-event-panel__body {
  padding: 0 1.25rem 1.5rem;
}

.gcal-event-panel__body h2 {
  margin: 0 0 0.5rem;
  color: var(--gcal-text);
  font-size: 1.35rem;
  font-weight: 500;
  line-height: 1.35;
}

.gcal-event-panel__datetime {
  margin-bottom: 1.25rem;
  color: var(--gcal-text-muted);
  font-size: 0.88rem;
}

.gcal-event-panel__details {
  margin: 0;
}

.gcal-event-panel__details div {
  margin-bottom: 0.9rem;
}

.gcal-event-panel__details dt {
  margin-bottom: 0.2rem;
  color: var(--gcal-text-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.gcal-event-panel__details dd {
  margin: 0;
  color: var(--gcal-text);
  font-size: 0.92rem;
}

.gcal-event-panel__status {
  display: inline-flex;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
}

.gcal-event-panel__open {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.35rem;
  padding: 0.55rem 0.9rem;
  border: 0;
  border-radius: 999px;
  background: var(--gcal-accent-soft);
  color: var(--gcal-accent);
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
}

.gcal-event-panel__open:hover {
  background: var(--gcal-accent-hover);
  color: var(--gcal-accent);
}

.gcal-event-panel__links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gcal-event-panel__open--secondary {
  background: var(--gcal-surface-hover);
  color: var(--gcal-text);
}

.gcal-event-panel__open--secondary:hover {
  background: var(--gcal-surface-muted);
  color: var(--gcal-text);
}

.gcal-app--dark .gcal-event-panel__header :deep(.btn-close) {
  filter: invert(1) grayscale(1);
  opacity: 0.75;
}

:deep(.fc) {
  --fc-border-color: var(--gcal-fc-border);
  --fc-today-bg-color: var(--gcal-fc-today-bg);
  --fc-neutral-bg-color: var(--gcal-fc-neutral-bg);
  --fc-page-bg-color: var(--gcal-fc-page-bg);
  --fc-non-business-color: var(--gcal-fc-non-business);
  --fc-event-border-color: transparent;
  font-family: inherit;
}

:deep(.fc .fc-timegrid-slot-label),
:deep(.fc .fc-col-header-cell-cushion),
:deep(.fc .fc-daygrid-day-number) {
  color: var(--gcal-text-muted);
  font-size: 0.78rem;
  font-weight: 500;
  text-decoration: none;
}

:deep(.fc .fc-daygrid-more-link) {
  color: var(--gcal-fc-more-link);
  font-weight: 600;
}

:deep(.fc .fc-scrollgrid),
:deep(.fc .fc-scrollgrid-section-body td),
:deep(.fc .fc-col-header-cell) {
  background: var(--gcal-fc-page-bg);
}

/* Grade: borda externa + mês (daygrid). Semana/dia: divisórias verticais no bloco global abaixo. */
.gcal-main__canvas :deep(.fc-theme-standard .fc-scrollgrid) {
  border: 1px solid var(--gcal-fc-border) !important;
}

.gcal-main__canvas :deep(.fc-theme-standard .fc-scrollgrid-sync-table) {
  border-collapse: collapse !important;
}

.gcal-main__canvas :deep(.fc-dayGridMonth-view .fc-scrollgrid-sync-table td),
.gcal-main__canvas :deep(.fc-dayGridMonth-view .fc-scrollgrid-sync-table th) {
  border: 1px solid var(--gcal-fc-border) !important;
}

:deep(.fc .fc-daygrid-day-frame) {
  background: var(--gcal-fc-neutral-bg);
}

:deep(.fc .fc-col-header-cell-cushion) {
  text-transform: capitalize;
}

:deep(.fc .fc-timegrid-axis-cushion),
:deep(.fc .fc-timegrid-slot-label-cushion) {
  color: var(--gcal-text-muted);
  font-size: 0.72rem;
}

:deep(.fc .fc-event),
:deep(.fc .fc-event *),
:deep(.fc .fc-daygrid-event),
:deep(.fc .fc-timegrid-event) {
  cursor: pointer !important;
}

:deep(.fc .fc-event) {
  border: 0 !important;
  border-left: 4px solid transparent !important;
  border-radius: 6px !important;
  box-shadow: none !important;
  padding: 0.1rem 0.35rem !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  transition: filter 0.12s ease;
}

:deep(.fc .fc-event:hover) {
  filter: brightness(1.06);
}

.gcal-app--dark :deep(.fc .fc-event:hover) {
  filter: brightness(1.12);
}

:deep(.fc .fc-daygrid-event) {
  margin-top: 2px !important;
}

:deep(.fc .gcal-event--group_lesson) {
  border-left-color: #1a73e8 !important;
}

:deep(.fc .gcal-event--individual_lesson) {
  border-left-color: #0b8043 !important;
}

:deep(.fc .gcal-event--experimental_class) {
  border-left-color: #e37400 !important;
}

:deep(.fc .gcal-event--makeup_lesson) {
  border-left-color: #9334e6 !important;
}

:deep(.fc .gcal-event--google_event) {
  border-left-color: #d50000 !important;
}

:deep(.fc .gcal-event--status-cancelled) {
  border-left-width: 4px !important;
  opacity: 0.92;
}

:deep(.fc .gcal-event--status-cancelled .fc-event-title),
:deep(.fc .gcal-event--status-cancelled .fc-event-time) {
  text-decoration: line-through;
}

:deep(.fc .gcal-event--status-completed) {
  opacity: 0.78;
}

:deep(.fc .gcal-event--status-postponed) {
  border-left-width: 4px !important;
  border-style: dashed !important;
}

.gcal-event-panel__status {
  border: 1px solid transparent;
}

.gcal-event-panel__status--cancelled {
  font-weight: 600;
}

:deep(.fc .fc-timegrid-now-indicator-line) {
  border-color: #ea4335;
  border-width: 2px 0 0;
}

:deep(.fc .fc-timegrid-now-indicator-arrow) {
  border-color: #ea4335;
}

@media (min-width: 992px) {
  .gcal-toolbar__brand span {
    display: inline;
  }
}

.gcal-quick-preview {
  position: fixed;
  z-index: 1080;
  width: min(320px, calc(100vw - 24px));
  border: 1px solid var(--gcal-border, #dadce0);
  border-radius: 12px;
  background: var(--gcal-surface, #fff);
  box-shadow: 0 8px 28px rgba(60, 64, 67, 0.22);
  overflow: hidden;
  pointer-events: auto;
}

.gcal-quick-preview--dark {
  --gcal-surface: var(--card, #212130);
  --gcal-border: var(--border, #3d3d4e);
  --gcal-text: var(--text-dark, #fff);
  --gcal-text-muted: var(--text-gray, #b3b3b3);
  --gcal-accent: var(--bs-primary, #9596f6);
  --gcal-accent-soft: rgba(149, 150, 246, 0.22);
  --gcal-surface-hover: rgba(255, 255, 255, 0.08);
  background: var(--gcal-surface);
  border-color: var(--gcal-border);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.45);
}

.gcal-quick-preview__stripe {
  height: 4px;
}

.gcal-quick-preview__body {
  padding: 0.85rem 1rem 1rem;
}

.gcal-quick-preview__title {
  margin: 0 0 0.35rem;
  color: var(--gcal-text, #3c4043);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.35;
}

.gcal-quick-preview__time {
  margin: 0 0 0.75rem;
  color: var(--gcal-text-muted, #70757a);
  font-size: 0.78rem;
  line-height: 1.4;
}

.gcal-quick-preview__meta {
  margin: 0 0 0.85rem;
  display: grid;
  gap: 0.45rem;
}

.gcal-quick-preview__meta div {
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 0.35rem;
  align-items: baseline;
}

.gcal-quick-preview__meta dt {
  margin: 0;
  color: var(--gcal-text-muted, #70757a);
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.gcal-quick-preview__meta dd {
  margin: 0;
  color: var(--gcal-text, #3c4043);
  font-size: 0.82rem;
}

.gcal-quick-preview__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.gcal-quick-preview__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.75rem;
  border: 0;
  border-radius: 999px;
  background: var(--gcal-accent-soft, #e8f0fe);
  color: var(--gcal-accent, #1a73e8);
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.gcal-quick-preview__btn--ghost {
  background: var(--gcal-surface-hover, #f1f3f4);
  color: var(--gcal-text, #3c4043);
}

.gcal-quick-preview__btn:hover {
  filter: brightness(1.05);
}

@media (max-width: 991.98px) {
  .gcal-sidebar {
    position: absolute;
    z-index: 5;
    top: 64px;
    left: 0;
    bottom: 0;
    background: var(--gcal-surface);
    box-shadow: 0 8px 24px var(--gcal-shadow);
  }

  .gcal-body {
    position: relative;
  }

  .gcal-toolbar__title {
    font-size: 1rem;
  }

  .gcal-event-panel {
    position: absolute;
    z-index: 6;
    top: 64px;
    right: 0;
    bottom: 0;
    box-shadow: -8px 0 24px var(--gcal-shadow);
  }
}
</style>

<!-- Sem scoped: linhas verticais na semana/dia (camadas absolute do timegrid cobrem border das td) -->
<style>
.gcal-app .gcal-main__canvas .fc-timeGridWeek-view .fc-timegrid-cols td.fc-timegrid-col,
.gcal-app .gcal-main__canvas .fc-timeGridDay-view .fc-timegrid-cols td.fc-timegrid-col {
  position: relative;
}

.gcal-app .gcal-main__canvas .fc-timeGridWeek-view .fc-timegrid-cols td.fc-timegrid-col:not(:last-child)::after,
.gcal-app .gcal-main__canvas .fc-timeGridDay-view .fc-timegrid-cols td.fc-timegrid-col:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1px;
  background: var(--gcal-fc-border, #dadce0);
  pointer-events: none;
  z-index: 5;
}

.gcal-app .gcal-main__canvas .fc-timeGridWeek-view .fc-col-header .fc-col-header-cell:not(:last-child),
.gcal-app .gcal-main__canvas .fc-timeGridDay-view .fc-col-header .fc-col-header-cell:not(:last-child) {
  border-right: 1px solid var(--gcal-fc-border, #dadce0) !important;
}

.gcal-app .gcal-main__canvas .fc-timeGridWeek-view .fc-daygrid-body .fc-daygrid-day:not(:last-child),
.gcal-app .gcal-main__canvas .fc-timeGridDay-view .fc-daygrid-body .fc-daygrid-day:not(:last-child) {
  border-right: 1px solid var(--gcal-fc-border, #dadce0) !important;
}
</style>
