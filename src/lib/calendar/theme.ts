import type {
  CalendarEventKind,
  CalendarEventStatusKey,
} from "@/lib/calendar/types";

export type CalendarLegendItem = {
  kind: CalendarEventKind;
  label: string;
  color: string;
  background: string;
};

export const CALENDAR_EVENT_LEGEND: CalendarLegendItem[] = [
  {
    kind: "group_lesson",
    label: "Aulas em turma",
    color: "#1a73e8",
    background: "#d2e3fc",
  },
  {
    kind: "individual_lesson",
    label: "Aulas individuais",
    color: "#0b8043",
    background: "#ceead6",
  },
  {
    kind: "experimental_class",
    label: "Aulas experimentais",
    color: "#e37400",
    background: "#fce8b2",
  },
  {
    kind: "makeup_lesson",
    label: "Reposições",
    color: "#9334e6",
    background: "#e9d2fd",
  },
  {
    kind: "google_event",
    label: "Google Calendar",
    color: "#d50000",
    background: "#fce8e6",
  },
];

/** Legenda com contraste adequado sobre fundo escuro do calendário. */
export const CALENDAR_EVENT_LEGEND_DARK: CalendarLegendItem[] = [
  {
    kind: "group_lesson",
    label: "Aulas em turma",
    color: "#c5d9ff",
    background: "rgba(138, 180, 248, 0.28)",
  },
  {
    kind: "individual_lesson",
    label: "Aulas individuais",
    color: "#b7e1c8",
    background: "rgba(129, 201, 149, 0.26)",
  },
  {
    kind: "experimental_class",
    label: "Aulas experimentais",
    color: "#fdd663",
    background: "rgba(253, 214, 99, 0.22)",
  },
  {
    kind: "makeup_lesson",
    label: "Reposições",
    color: "#d7aefb",
    background: "rgba(197, 138, 249, 0.26)",
  },
  {
    kind: "google_event",
    label: "Google Calendar",
    color: "#f28b82",
    background: "rgba(242, 139, 130, 0.24)",
  },
];

function legendList(dark: boolean): CalendarLegendItem[] {
  return dark ? CALENDAR_EVENT_LEGEND_DARK : CALENDAR_EVENT_LEGEND;
}

export function getCalendarLegendItem(
  kind: CalendarEventKind,
  dark = false
): CalendarLegendItem {
  const list = legendList(dark);
  return list.find((item) => item.kind === kind) ?? list[0];
}

export function getCalendarEventColor(
  kind: CalendarEventKind,
  dark = false
): string {
  return getCalendarLegendItem(kind, dark).color;
}

export function getCalendarEventBackground(
  kind: CalendarEventKind,
  dark = false
): string {
  return getCalendarLegendItem(kind, dark).background;
}

export type CalendarEventPresentation = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  classNames: string[];
};

const STATUS_CANCELLED: Record<"light" | "dark", Omit<CalendarEventPresentation, "classNames">> = {
  light: {
    backgroundColor: "#fce8e6",
    borderColor: "#d93025",
    textColor: "#c5221f",
  },
  dark: {
    backgroundColor: "rgba(242, 139, 130, 0.35)",
    borderColor: "#f28b82",
    textColor: "#f9dedc",
  },
};

const STATUS_COMPLETED: Record<"light" | "dark", Omit<CalendarEventPresentation, "classNames">> = {
  light: {
    backgroundColor: "#e8eaed",
    borderColor: "#5f6368",
    textColor: "#3c4043",
  },
  dark: {
    backgroundColor: "rgba(154, 160, 166, 0.28)",
    borderColor: "#9aa0a6",
    textColor: "#e8eaed",
  },
};

const STATUS_POSTPONED: Record<"light" | "dark", Omit<CalendarEventPresentation, "classNames">> = {
  light: {
    backgroundColor: "#fef7e0",
    borderColor: "#f9ab00",
    textColor: "#e37400",
  },
  dark: {
    backgroundColor: "rgba(253, 214, 99, 0.22)",
    borderColor: "#fdd663",
    textColor: "#fdd663",
  },
};

function isCancelledStatus(statusKey?: CalendarEventStatusKey): boolean {
  return (
    statusKey === "cancelled" ||
    statusKey === "cancelada" ||
    statusKey === "google_cancelled"
  );
}

function isCompletedStatus(statusKey?: CalendarEventStatusKey): boolean {
  return statusKey === "completed" || statusKey === "realizada";
}

function isPostponedStatus(statusKey?: CalendarEventStatusKey): boolean {
  return statusKey === "postponed";
}

export function getCalendarEventPresentation(
  kind: CalendarEventKind,
  statusKey: CalendarEventStatusKey | undefined,
  dark = false
): CalendarEventPresentation {
  const mode = dark ? "dark" : "light";
  const classNames = [`gcal-event--${kind}`];

  if (statusKey) {
    classNames.push(`gcal-event--status-${statusKey}`);
  }

  if (isCancelledStatus(statusKey)) {
    classNames.push("gcal-event--status-cancelled");
    return { ...STATUS_CANCELLED[mode], classNames };
  }

  if (isCompletedStatus(statusKey)) {
    classNames.push("gcal-event--status-completed");
    return { ...STATUS_COMPLETED[mode], classNames };
  }

  if (isPostponedStatus(statusKey)) {
    classNames.push("gcal-event--status-postponed");
    return { ...STATUS_POSTPONED[mode], classNames };
  }

  const legend = getCalendarLegendItem(kind, dark);

  return {
    backgroundColor: legend.background,
    borderColor: legend.color,
    textColor: legend.color,
    classNames,
  };
}
