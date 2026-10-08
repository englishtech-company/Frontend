import type {
  CalendarEventKind,
  CalendarEventStatusKey,
  CalendarMockEvent,
} from "@/lib/calendar/types";
import {
  listExperimentalClasses,
  type ListExperimentalClassesParams,
} from "@/lib/experimentalClasses";
import {
  googleEventToCalendarEvent,
  listGoogleCalendarEvents,
} from "@/lib/googleCalendar";
import {
  listLessons,
  listLessonsForStudent,
  type ListLessonsParams,
} from "@/lib/lessons";
import { listMakeupClasses } from "@/lib/makeupClasses";
import type {
  ExperimentalClass,
  Lesson,
  LessonStatus,
  MakeupClass,
  Paginated,
} from "@/lib/types";

const LESSON_STATUS_LABELS: Record<LessonStatus, string> = {
  scheduled: "Agendada",
  completed: "Concluída",
  cancelled: "Cancelada",
  postponed: "Adiada",
  makeup: "Reposição",
};

const EXPERIMENTAL_STATUS_LABELS: Record<string, string> = {
  agendada: "Agendada",
  realizada: "Realizada",
  cancelada: "Cancelada",
};

const CALENDAR_PAGE_SIZE = 200;
const CALENDAR_MAX_PAGES = 25;

export type LoadCalendarEventsParams = {
  teacherId?: string | number | null;
  studentId?: string | number | null;
  googleConnected?: boolean;
};

function addMinutes(isoDate: string, minutes = 60): string {
  const date = new Date(isoDate);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

function formatApiDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeOptionalId(
  value?: string | number | null
): number | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function lessonStatusKey(status: LessonStatus): CalendarEventStatusKey {
  return status;
}

function experimentalStatusKey(statusClass: string): CalendarEventStatusKey {
  const normalized = statusClass.toLowerCase();

  if (normalized === "cancelada") {
    return "cancelada";
  }

  if (normalized === "realizada") {
    return "realizada";
  }

  return "agendada";
}

function getLessonKind(lesson: Lesson): CalendarEventKind {
  if (lesson.status === "makeup") {
    return "makeup_lesson";
  }

  return lesson.group_class_id ? "group_lesson" : "individual_lesson";
}

function lessonTitle(
  lesson: Lesson,
  groupClassName?: string | null,
  studentName?: string | null
): string {
  const topic = lesson.topic?.trim() || "Aula";

  if (groupClassName) {
    return `${groupClassName} — ${topic}`;
  }

  if (studentName) {
    return `${studentName} — ${topic}`;
  }

  return topic;
}

async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<Paginated<T>>
): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const result = await fetchPage(page);
    items.push(...result.data);
    lastPage = Math.max(1, result.last_page || 1);
    page += 1;
  } while (page <= lastPage && page <= CALENDAR_MAX_PAGES);

  return items;
}

export function lessonToCalendarEvent(lesson: Lesson): CalendarMockEvent {
  const groupClass =
    lesson.group_class ?? lesson.relationships?.group_class ?? null;
  const student = lesson.student ?? lesson.relationships?.student ?? null;
  const teacher = lesson.teacher ?? lesson.relationships?.teacher ?? null;
  const teacherId = teacher?.id ?? lesson.teacher_id ?? null;

  return {
    id: `lesson-${lesson.id}`,
    kind: getLessonKind(lesson),
    title: lessonTitle(lesson, groupClass?.name, student?.name),
    start: lesson.class_datetime,
    end: addMinutes(lesson.class_datetime),
    teacherName: teacher?.name ?? "—",
    teacherId,
    contextLabel: groupClass
      ? `Turma · ${groupClass.name}`
      : `Aluno · ${student?.name ?? "—"}`,
    statusLabel: LESSON_STATUS_LABELS[lesson.status] ?? lesson.status,
    statusKey: lessonStatusKey(lesson.status),
    observation: lesson.observation ?? undefined,
    sourceType: "lesson",
    sourceId: lesson.id,
    href: `/lessons/${lesson.id}/edit`,
  };
}

export function experimentalClassToCalendarEvent(
  item: ExperimentalClass
): CalendarMockEvent {
  const teacher = item.teacher ?? item.relationships?.teacher ?? null;
  const lead = item.interested ?? item.relationships?.interested ?? null;
  const teacherId = teacher?.id ?? item.teacher_id ?? null;

  return {
    id: `experimental-${item.id}`,
    kind: "experimental_class",
    title: `Aula experimental — ${lead?.name ?? "Interessado"}`,
    start: item.date_class,
    end: addMinutes(item.date_class, 45),
    teacherName: teacher?.name ?? "—",
    teacherId,
    contextLabel: `Interessado · ${lead?.name ?? "—"}`,
    statusLabel:
      EXPERIMENTAL_STATUS_LABELS[item.status_class] ?? item.status_class,
    statusKey: experimentalStatusKey(String(item.status_class)),
    observation: item.observations_feedback ?? undefined,
    sourceType: "experimental",
    sourceId: item.id,
    href: `/experimental-classes/${item.id}/edit`,
  };
}

export function makeupClassToCalendarEvent(item: MakeupClass): CalendarMockEvent {
  const teacher = item.teacher ?? item.relationships?.teacher ?? null;
  const student =
    item.enrollment?.student ??
    item.relationships?.enrollment?.student ??
    null;
  const groupClass =
    item.group_class ?? item.relationships?.group_class ?? null;
  const teacherId = teacher?.id ?? item.teacher_id ?? null;
  const start = item.new_date!;

  return {
    id: `makeup-${item.id}`,
    kind: "makeup_lesson",
    title: student
      ? `Reposição — ${student.name}`
      : groupClass
        ? `Reposição — ${groupClass.name}`
        : "Reposição agendada",
    start,
    end: addMinutes(start),
    teacherName: teacher?.name ?? "—",
    teacherId,
    contextLabel: student
      ? `Aluno · ${student.name}`
      : groupClass
        ? `Turma · ${groupClass.name}`
        : "Reposição",
    statusLabel: "Agendada",
    statusKey: "scheduled",
    sourceType: "lesson",
    sourceId: item.id,
    href: `/makeup-classes/${item.id}/edit`,
  };
}

export async function loadCalendarEvents(
  rangeStart: Date,
  rangeEnd: Date,
  params: LoadCalendarEventsParams = {}
): Promise<CalendarMockEvent[]> {
  const from = formatApiDate(rangeStart);
  const to = formatApiDate(rangeEnd);
  const teacherId = normalizeOptionalId(params.teacherId);
  const studentId = normalizeOptionalId(params.studentId);
  const googleConnected = params.googleConnected === true;

  const lessonParams: ListLessonsParams = {
    limit: CALENDAR_PAGE_SIZE,
    class_datetime_from: from,
    class_datetime_to: to,
    ...(teacherId !== undefined ? { teacher_id: teacherId } : {}),
  };

  const experimentalParams: ListExperimentalClassesParams = {
    limit: CALENDAR_PAGE_SIZE,
    dateClassFrom: from,
    dateClassTo: to,
    ...(teacherId !== undefined ? { teacher_id: teacherId } : {}),
  };

  const lessonsPromise = studentId
    ? fetchAllPages((page) =>
        listLessonsForStudent(studentId, { ...lessonParams, page })
      )
    : fetchAllPages((page) => listLessons({ ...lessonParams, page }));

  const includeExperimental = studentId === undefined;
  const includeGoogle = studentId === undefined && googleConnected;
  const includeMakeup = studentId === undefined;

  const makeupPromise = includeMakeup
    ? fetchAllPages((page) =>
        listMakeupClasses({
          page,
          limit: CALENDAR_PAGE_SIZE,
          status: "scheduled",
          new_date_from: `${from} 00:00:00`,
          new_date_to: `${to} 23:59:59`,
          ...(teacherId !== undefined ? { teacher_id: teacherId } : {}),
        })
      )
    : Promise.resolve([]);

  const [lessons, experimentalClasses, makeupClasses, googleEvents] =
    await Promise.all([
      lessonsPromise,
      includeExperimental
        ? fetchAllPages((page) =>
            listExperimentalClasses({ ...experimentalParams, page })
          )
        : Promise.resolve([]),
      makeupPromise,
      includeGoogle
        ? listGoogleCalendarEvents({ rangeStart, rangeEnd })
        : Promise.resolve([]),
    ]);

  const scheduledMakeups = makeupClasses.filter((item) => item.new_date);

  return [
    ...lessons.map(lessonToCalendarEvent),
    ...experimentalClasses.map(experimentalClassToCalendarEvent),
    ...scheduledMakeups.map(makeupClassToCalendarEvent),
    ...googleEvents
      .map(googleEventToCalendarEvent)
      .filter((event): event is CalendarMockEvent => event !== null),
  ];
}
