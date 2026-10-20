export type CalendarEventKind =
  | "group_lesson"
  | "individual_lesson"
  | "experimental_class"
  | "makeup_lesson"
  | "google_event";

export type CalendarEventSource = "lesson" | "experimental" | "meet" | "google";

/** Chave normalizada para cor/estilo no calendário (aula, experimental ou Google). */
export type CalendarEventStatusKey =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "postponed"
  | "makeup"
  | "agendada"
  | "realizada"
  | "cancelada"
  | "google_cancelled"
  | "google_tentative";

export type CalendarMockEvent = {
  id: string;
  kind: CalendarEventKind;
  title: string;
  start: string;
  end: string;
  teacherName: string;
  teacherId?: number | null;
  contextLabel: string;
  statusLabel: string;
  /** Status bruto do backend / Google para estilo e sync visual. */
  statusKey?: CalendarEventStatusKey;
  observation?: string;
  sourceType?: CalendarEventSource;
  sourceId?: number;
  href?: string;
  allDay?: boolean;
  googleHtmlLink?: string;
  meetUrl?: string;
};

export type CalendarCreateKind = Exclude<CalendarEventKind, "google_event">;
