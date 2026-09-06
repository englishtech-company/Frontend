import { api } from "@/lib/api";
import {
  appendDateRange,
  appendExact,
  appendLike,
  createListQuery,
} from "@/lib/filters/query";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type {
  ApiItemResponse,
  ApiListResponse,
  ExperimentalClass,
  Lead,
  Paginated,
} from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const MODULE = "experimental-classes";

export type ListExperimentalClassesParams = {
  page?: number;
  limit?: number;
  id?: number;
  interestedName?: string;
  teacherName?: string;
  dateClassFrom?: string;
  dateClassTo?: string;
  status_class?: string;
  conversion?: boolean;
};

type ExperimentalClassPlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    interested: Record<string, string>;
    teachers: Record<string, string>;
  };
};

export type ExperimentalClassPayload = {
  interested_id: number;
  teacher_id?: number | null;
  date_class: string;
  status_class: string;
  conversao?: boolean;
  self_declared_level?: string | null;
  evaluation_listening?: string | null;
  evaluation_speaking?: string | null;
  evaluation_vocabulary?: string | null;
  evaluation_grammar?: string | null;
  observations_feedback?: string | null;
};

export async function getExperimentalClassPlucks(): Promise<{
  interested: Record<string, string>;
  teachers: Record<string, string>;
}> {
  const response = await api<ExperimentalClassPlucksResponse>(`/${MODULE}/plucks`);

  return response.plucks;
}

export async function listExperimentalClasses(
  params: ListExperimentalClassesParams = {}
): Promise<Paginated<ExperimentalClass>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  appendExact(query, "id", params.id);
  appendLike(query, "interested_name", params.interestedName);
  appendLike(query, "teacher_name", params.teacherName);
  appendDateRange(query, "date_class", params.dateClassFrom, params.dateClassTo);
  appendExact(query, "status_class", params.status_class);

  if (params.conversion !== undefined) {
    query.set("conversion", params.conversion ? "1" : "0");
  }

  const response = await api<ApiListResponse<"experimental-classes", ExperimentalClass>>(
    `/${MODULE}?${query.toString()}`
  );

  return response["experimental-classes"];
}

export async function getExperimentalClass(id: number): Promise<ExperimentalClass> {
  const response = await api<ApiItemResponse<"experimental-class", ExperimentalClass>>(
    `/${MODULE}/${id}`
  );

  return response["experimental-class"];
}

export async function createExperimentalClass(
  data: ExperimentalClassPayload
): Promise<ExperimentalClass> {
  const response = await api<ApiItemResponse<"experimental-class", ExperimentalClass>>(
    `/${MODULE}/create`,
    { method: "POST", body: data }
  );

  return response["experimental-class"];
}

export async function updateExperimentalClass(
  id: number,
  data: Partial<ExperimentalClassPayload>
): Promise<ExperimentalClass> {
  const response = await api<ApiItemResponse<"experimental-class", ExperimentalClass>>(
    `/${MODULE}/${id}`,
    { method: "PUT", body: data }
  );

  return response["experimental-class"];
}

export async function deleteExperimentalClass(id: number): Promise<void> {
  await api(`/${MODULE}/${id}`, { method: "DELETE" });
}

export function getExperimentalClassInterested(
  item: ExperimentalClass
): Lead | null {
  return item.relationships?.interested ?? item.interested ?? null;
}

export function getExperimentalClassWhatsAppPhone(
  item: ExperimentalClass
): string | null {
  const phone = getExperimentalClassInterested(item)?.whatsapp_phone?.trim();

  return phone || null;
}

export function toDateTimeLocalValue(value: string | undefined): string {
  if (!value) {
    return "";
  }

  return value.replace(" ", "T").slice(0, 16);
}

function parseClassDate(value: string): Date | null {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function firstName(name: string): string {
  const trimmed = name.trim();

  if (!trimmed) {
    return "";
  }

  return trimmed.split(/\s+/)[0] ?? trimmed;
}

function formatWhatsAppDate(value: string): string {
  const date = parseClassDate(value);

  if (!date) {
    return "—";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}`;
}

function formatWhatsAppTime(value: string): string {
  const date = parseClassDate(value);

  if (!date) {
    return "—";
  }

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}h${minutes}`;
}

function greetingName(name: string): string {
  return name ? `Olá, ${name}!` : "Olá!";
}

export function buildExperimentalClassReminderMessage(
  item: ExperimentalClass
): string {
  const interested = getExperimentalClassInterested(item);
  const name = interested?.name?.trim() ?? "";
  const date = formatWhatsAppDate(item.date_class);
  const time = formatWhatsAppTime(item.date_class);

  return [
    `${greetingName(name)} Tudo bem? Passando aqui rapidinho para lembrar da nossa aula experimental que está agendada!`,
    "",
    `📅 Data: ${date}`,
    `⏰ Horário: ${time}`,
    "",
    "Se acontecer algum imprevisto e precisar reagendar, é só me dar um toque por aqui, tá bom? Até lá!",
  ].join("\n");
}

export function buildExperimentalClassFollowUpMessage(
  item: ExperimentalClass
): string {
  const interested = getExperimentalClassInterested(item);
  const name = firstName(interested?.name ?? "");

  return [
    `${greetingName(name)} Tudo bem?`,
    "E aí, como foi sua experiência na aula? 😊",
    "Conseguiu se imaginar nesse formato de aula?",
    "Qualquer dúvida, estou por aqui!",
  ].join("\n");
}

export function getExperimentalClassWhatsAppUrl(
  item: ExperimentalClass,
  kind: "reminder" | "follow-up"
): string | null {
  const phone = getExperimentalClassWhatsAppPhone(item);

  if (!phone) {
    return null;
  }

  const message =
    kind === "reminder"
      ? buildExperimentalClassReminderMessage(item)
      : buildExperimentalClassFollowUpMessage(item);

  return buildWhatsAppUrl(phone, message);
}
