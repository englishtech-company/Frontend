import type { CalendarEventKind } from "@/lib/calendar/types";

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
