import { api } from "@/lib/api";
import type { CalendarMockEvent } from "@/lib/calendar/types";

export type GoogleCalendarStatus = {
  configured: boolean;
  connected: boolean;
  google_email: string | null;
  calendar_id: string | null;
  last_synced_at: string | null;
  connected_at: string | null;
  status: string;
  message: string | null;
};

export type GoogleCalendarEvent = {
  id: number;
  google_event_id: string;
  title: string;
  description: string | null;
  html_link: string | null;
  hangout_link: string | null;
  location: string | null;
  status: string | null;
  start_at: string | null;
  end_at: string | null;
  all_day: boolean;
  organizer_email: string | null;
  teacher_id: number | null;
  teacher_name: string | null;
};

type GoogleCalendarStatusResponse = {
  google_calendar: GoogleCalendarStatus;
};

type GoogleCalendarConnectResponse = {
  authorization_url: string;
};

type GoogleCalendarEventsResponse = {
  google_calendar_events: GoogleCalendarEvent[];
};

const GOOGLE_STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmado",
  tentative: "Provisório",
  cancelled: "Cancelado",
};

function formatApiDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getGoogleCalendarStatus(): Promise<GoogleCalendarStatus> {
  const response = await api<GoogleCalendarStatusResponse>("/google-calendar");

  return response.google_calendar;
}

export async function connectGoogleCalendar(): Promise<string> {
  const response = await api<GoogleCalendarConnectResponse>(
    "/google-calendar/connect",
    { method: "POST" }
  );

  return response.authorization_url;
}

export async function disconnectGoogleCalendar(): Promise<GoogleCalendarStatus> {
  const response = await api<GoogleCalendarStatusResponse>(
    "/google-calendar/disconnect",
    { method: "POST" }
  );

  return response.google_calendar;
}

type GoogleCalendarSyncResponse = {
  google_calendar: GoogleCalendarStatus;
  google_calendar_events: GoogleCalendarEvent[];
  imported_count: number;
};

export async function syncGoogleCalendarEvents(params: {
  rangeStart: Date;
  rangeEnd: Date;
}): Promise<GoogleCalendarSyncResponse> {
  const query = new URLSearchParams({
    from: formatApiDate(params.rangeStart),
    to: formatApiDate(params.rangeEnd),
  });

  return api<GoogleCalendarSyncResponse>(
    `/google-calendar/sync?${query.toString()}`,
    { method: "POST" }
  );
}

export async function listGoogleCalendarEvents(params: {
  rangeStart: Date;
  rangeEnd: Date;
}): Promise<GoogleCalendarEvent[]> {
  const query = new URLSearchParams({
    from: formatApiDate(params.rangeStart),
    to: formatApiDate(params.rangeEnd),
  });

  const response = await api<GoogleCalendarEventsResponse>(
    `/google-calendar/events?${query.toString()}`
  );

  return response.google_calendar_events ?? [];
}

export function googleEventToCalendarEvent(
  event: GoogleCalendarEvent
): CalendarMockEvent | null {
  if (!event.start_at) {
    return null;
  }

  const location = event.location?.trim();
  const organizer = event.organizer_email?.trim();

  return {
    id: `google-${event.id}`,
    kind: "google_event",
    title: event.title || "(Sem título)",
    start: event.start_at,
    end: event.end_at || event.start_at,
    teacherName: event.teacher_name ?? organizer ?? "Google Calendar",
    teacherId: event.teacher_id,
    contextLabel: location
      ? `Google Calendar · ${location}`
      : "Google Calendar",
    statusLabel:
      GOOGLE_STATUS_LABELS[event.status ?? ""] ?? event.status ?? "Google",
    statusKey:
      event.status === "cancelled"
        ? "google_cancelled"
        : event.status === "tentative"
          ? "google_tentative"
          : undefined,
    observation: event.description ?? undefined,
    sourceType: "google",
    sourceId: event.id,
    allDay: event.all_day,
    googleHtmlLink: event.html_link ?? undefined,
    meetUrl: event.hangout_link ?? undefined,
  };
}
