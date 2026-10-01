export const EMPTY_DATE_LABEL = "—";

export function formatDatePt(value?: string | null): string {
  if (!value) return EMPTY_DATE_LABEL;
  return new Date(value).toLocaleDateString("pt-BR");
}

export function formatDateTimePt(value?: string | null): string {
  if (!value) return EMPTY_DATE_LABEL;
  return new Date(value).toLocaleString("pt-BR");
}

export function formatDateTimeShortPt(value?: string | null): string {
  if (!value) return EMPTY_DATE_LABEL;
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
