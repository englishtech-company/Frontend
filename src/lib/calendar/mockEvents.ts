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

export function getCalendarLegendItem(
  kind: CalendarEventKind
): CalendarLegendItem {
  return (
    CALENDAR_EVENT_LEGEND.find((item) => item.kind === kind) ??
    CALENDAR_EVENT_LEGEND[0]
  );
}

export function getCalendarEventColor(kind: CalendarEventKind): string {
  return getCalendarLegendItem(kind).color;
}

export function getCalendarEventBackground(kind: CalendarEventKind): string {
  return getCalendarLegendItem(kind).background;
}
