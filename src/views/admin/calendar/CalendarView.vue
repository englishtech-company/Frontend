<script lang="ts" setup>
import { computed, onMounted, ref, shallowRef, watch } from "vue";
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
  getCalendarEventBackground,
  getCalendarEventColor,
  getCalendarLegendItem,
} from "@/lib/calendar/mockEvents";
import type { CalendarEventKind, CalendarMockEvent } from "@/lib/calendar/types";
import { confirmAction } from "@/lib/confirm";
import {
  connectGoogleCalendar,
  disconnectGoogleCalendar,
  getGoogleCalendarStatus,
  type GoogleCalendarStatus,
} from "@/lib/googleCalendar";
import { listTeachers } from "@/lib/teachers";

type CalendarViewMode = "timeGridWeek" | "dayGridMonth" | "timeGridDay";

const { canCreateLessons, canCreateExperimentalClasses, canViewGoogleCalendar, canUpdateGoogleCalendar } =
  usePermissions();

const route = useRoute();
const router = useRouter();
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const calendarApi = shallowRef<CalendarApi | null>(null);

const allEvents = ref<CalendarMockEvent[]>([]);
const loadingEvents = ref(false);
const selectedEvent = ref<CalendarMockEvent | null>(null);
const showCreateModal = ref(false);
const createInitialDateTime = ref("");
const currentTitle = ref("");
const currentView = ref<CalendarViewMode>("timeGridWeek");
const sidebarOpen = ref(true);
const currentRange = shallowRef<{ start: Date; end: Date } | null>(null);
const selectedTeacherId = ref<string | number | null>(null);
const teacherOptions = ref<SelectOption[]>([]);
const googleStatus = ref<GoogleCalendarStatus | null>(null);
const googleBusy = ref(false);
let refreshToken = 0;

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
    const legend = getCalendarLegendItem(event.kind);

    return {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: Boolean(event.allDay),
      backgroundColor: legend.background,
      borderColor: legend.color,
      textColor: legend.color,
      classNames: [`gcal-event--${event.kind}`],
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
  slotMinTime: "07:00:00",
  slotMaxTime: "22:00:00",
  slotDuration: "00:30:00",
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

watch(selectedTeacherId, async () => {
  if (!currentRange.value) {
    return;
  }

  await refreshEvents(currentRange.value.start, currentRange.value.end);
});

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

onMounted(() => {
  void loadTeacherOptions();
  void loadGoogleStatus();
  void handleGoogleCallbackQuery();
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

  createInitialDateTime.value = date ? toDateTimeLocalValue(date) : "";
  showCreateModal.value = true;
}

function closeCreateModal() {
  showCreateModal.value = false;
  createInitialDateTime.value = "";
}

async function handleEventCreated() {
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
  selectedEvent.value = clickInfo.event.extendedProps as CalendarMockEvent;
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
  return getCalendarLegendItem(kind).label;
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
</script>

<template>
  <div class="gcal-app">
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

        <div v-if="canUpdateGoogleCalendar" class="gcal-toolbar__google">
          <button
            v-if="!googleStatus?.connected"
            type="button"
            class="gcal-toolbar__google-btn"
            :disabled="googleBusy || !googleStatus || googleStatus.configured === false"
            :title="googleStatus?.message || 'Vincular Google Calendar'"
            @click="connectGoogleAccount"
          >
            Vincular conta
          </button>
          <button
            v-else
            type="button"
            class="gcal-toolbar__google-btn gcal-toolbar__google-btn--connected"
            :disabled="googleBusy"
            :title="googleStatus.google_email || 'Desvincular Google Calendar'"
            @click="disconnectGoogleAccount"
          >
            {{ googleStatus.google_email || "Desvincular" }}
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
          />
        </section>

        <section class="gcal-sidebar__section">
          <h2>Meus calendários</h2>
          <ul class="gcal-calendars list-unstyled mb-0">
            <li v-for="item in CALENDAR_EVENT_LEGEND" :key="item.kind">
              <label class="gcal-calendars__item">
                <input
                  v-model="visibleKinds[item.kind]"
                  type="checkbox"
                  class="gcal-calendars__checkbox"
                />
                <span
                  class="gcal-calendars__swatch"
                  :style="{ backgroundColor: item.color }"
                ></span>
                <span>{{ item.label }}</span>
              </label>
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
                :style="{ backgroundColor: getCalendarEventColor(event.kind) }"
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
          :style="{ backgroundColor: getCalendarEventColor(selectedEvent.kind) }"
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
                  :style="{
                    color: getCalendarEventColor(selectedEvent.kind),
                    backgroundColor: getCalendarEventBackground(selectedEvent.kind),
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
            <RouterLink
              v-if="selectedEventHref"
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
      v-if="showCreateModal"
      :initial-date-time="createInitialDateTime"
      @close="closeCreateModal"
      @created="handleEventCreated"
    />
  </div>
</template>

<style scoped>
.gcal-app {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 7.5rem);
  margin: -0.5rem -0.25rem 0;
  background: #fff;
  border: 1px solid #dadce0;
  border-radius: 16px;
  overflow: hidden;
}

.gcal-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 64px;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #dadce0;
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
  color: #5f6368;
}

.gcal-toolbar__menu:hover,
.gcal-toolbar__nav button:hover {
  background: #f1f3f4;
}

.gcal-toolbar__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-right: 0.25rem;
  color: #5f6368;
  font-size: 1.35rem;
}

.gcal-toolbar__brand span {
  display: none;
}

.gcal-toolbar__today {
  padding: 0.45rem 1rem;
  border: 1px solid #dadce0;
  border-radius: 999px;
  background: #fff;
  color: #3c4043;
  font-size: 0.875rem;
  font-weight: 500;
}

.gcal-toolbar__today:hover {
  background: #f8f9fa;
}

.gcal-toolbar__title {
  margin: 0;
  color: #3c4043;
  font-size: 1.35rem;
  font-weight: 400;
  white-space: nowrap;
}

.gcal-view-switch {
  display: inline-flex;
  padding: 0.15rem;
  border: 1px solid #dadce0;
  border-radius: 999px;
  background: #fff;
}

.gcal-view-switch button {
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #5f6368;
  font-size: 0.82rem;
  font-weight: 500;
  padding: 0.4rem 0.9rem;
}

.gcal-toolbar__google-btn {
  display: inline-flex;
  align-items: center;
  max-width: 16rem;
  padding: 0.45rem 0.95rem;
  border: 1px solid #dadce0;
  border-radius: 999px;
  background: #fff;
  color: #3c4043;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gcal-toolbar__google-btn:hover:not(:disabled) {
  background: #f8f9fa;
}

.gcal-toolbar__google-btn:disabled {
  opacity: 0.55;
}

.gcal-toolbar__google-btn--connected {
  border-color: #ceead6;
  background: #e6f4ea;
  color: #137333;
}

.gcal-view-switch button.is-active {
  background: #e8f0fe;
  color: #1a73e8;
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
  border-right: 1px solid #dadce0;
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
  background: #fff;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  color: #3c4043;
  font-weight: 500;
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
  color: #70757a;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.gcal-calendars__item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.35rem 0.25rem;
  color: #3c4043;
  font-size: 0.88rem;
  cursor: pointer;
}

.gcal-calendars__checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.gcal-calendars__swatch {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 3px;
  flex-shrink: 0;
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
  background: #f1f3f4;
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
  color: #3c4043;
}

.gcal-upcoming__content small {
  color: #70757a;
  font-size: 0.72rem;
  line-height: 1.35;
}

.gcal-upcoming__empty {
  margin: 0;
  padding: 0.15rem 0.35rem 0;
  color: #9aa0a6;
  font-size: 0.78rem;
  line-height: 1.4;
}

.gcal-sidebar__note {
  margin: 1rem 0 0;
  color: #9aa0a6;
  font-size: 0.75rem;
  line-height: 1.45;
}

.gcal-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.gcal-main__loading,
.gcal-main__empty {
  padding: 0.5rem 1rem;
  color: #70757a;
  font-size: 0.82rem;
}

.gcal-main__canvas {
  flex: 1;
  min-height: 640px;
  padding: 0.35rem 0.5rem 0.75rem;
}

.gcal-event-panel {
  width: 360px;
  flex-shrink: 0;
  border-left: 1px solid #dadce0;
  background: #fff;
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
  color: #3c4043;
  font-size: 1.35rem;
  font-weight: 500;
  line-height: 1.35;
}

.gcal-event-panel__datetime {
  margin-bottom: 1.25rem;
  color: #70757a;
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
  color: #70757a;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.gcal-event-panel__details dd {
  margin: 0;
  color: #3c4043;
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
  border-radius: 999px;
  background: #e8f0fe;
  color: #1a73e8;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
}

.gcal-event-panel__open:hover {
  background: #d2e3fc;
  color: #174ea6;
}

.gcal-event-panel__links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gcal-event-panel__open--secondary {
  background: #f1f3f4;
  color: #3c4043;
}

.gcal-event-panel__open--secondary:hover {
  background: #e8eaed;
  color: #202124;
}

:deep(.fc) {
  --fc-border-color: #dadce0;
  --fc-today-bg-color: rgba(26, 115, 232, 0.08);
  --fc-neutral-bg-color: #fff;
  --fc-page-bg-color: #fff;
  --fc-event-border-color: transparent;
  font-family: inherit;
}

:deep(.fc .fc-timegrid-slot-label),
:deep(.fc .fc-col-header-cell-cushion),
:deep(.fc .fc-daygrid-day-number) {
  color: #70757a;
  font-size: 0.78rem;
  font-weight: 500;
  text-decoration: none;
}

:deep(.fc .fc-col-header-cell-cushion) {
  text-transform: capitalize;
}

:deep(.fc .fc-timegrid-axis-cushion),
:deep(.fc .fc-timegrid-slot-label-cushion) {
  color: #70757a;
  font-size: 0.72rem;
}

:deep(.fc .fc-event) {
  border: 0 !important;
  border-left: 4px solid transparent !important;
  border-radius: 6px !important;
  box-shadow: none !important;
  padding: 0.1rem 0.35rem !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
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

@media (max-width: 991.98px) {
  .gcal-sidebar {
    position: absolute;
    z-index: 5;
    top: 64px;
    left: 0;
    bottom: 0;
    background: #fff;
    box-shadow: 0 8px 24px rgba(60, 64, 67, 0.18);
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
    box-shadow: -8px 0 24px rgba(60, 64, 67, 0.18);
  }
}
</style>
