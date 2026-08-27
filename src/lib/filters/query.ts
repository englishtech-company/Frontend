import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";

export function createListQuery(
  page = 1,
  limit = DEFAULT_LIST_LIMIT
): URLSearchParams {
  return new URLSearchParams({
    "pagination[page]": String(page),
    "pagination[limit]": String(limit),
  });
}

export function appendLike(
  query: URLSearchParams,
  field: string,
  value?: string | null
): void {
  const trimmed = value?.trim();

  if (trimmed) {
    query.set(field, `%${trimmed}%`);
  }
}

export function appendExact(
  query: URLSearchParams,
  field: string,
  value?: string | number | null | boolean
): void {
  if (value === null || value === undefined || value === "") {
    return;
  }

  query.set(field, String(value));
}

export function appendDateRange(
  query: URLSearchParams,
  field: string,
  from?: string | null,
  to?: string | null
): void {
  if (from) {
    query.set(`${field}_from`, from);
  }

  if (to) {
    query.set(`${field}_to`, to);
  }
}

export function countActiveFilters(
  values: Array<string | number | null | undefined | boolean>
): number {
  return values.filter(
    (value) =>
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
  ).length;
}
