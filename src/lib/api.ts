const API_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "englishtech_token";

export type ApiError = Error & {
  status?: number;
  payload?: Record<string, unknown>;
};

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function api<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers, auth = true, ...rest } = options;
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && auth) {
      setToken(null);
    }

    const payloadRecord = payload as {
      msg?: string;
      message?: string;
      errors?: unknown;
    };

    let detail = payloadRecord.msg || payloadRecord.message || `HTTP ${response.status}`;

    if (typeof payloadRecord.errors === "string" && payloadRecord.errors.trim()) {
      detail = payloadRecord.errors;
    } else if (payloadRecord.errors && typeof payloadRecord.errors === "object") {
      const fieldErrors = Object.values(payloadRecord.errors as Record<string, unknown>)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .filter((value): value is string => typeof value === "string" && value.trim().length > 0);

      if (fieldErrors.length > 0) {
        detail = fieldErrors[0];
      }
    }

    const error = new Error(detail) as ApiError;
    error.status = response.status;
    error.payload = payload as Record<string, unknown>;
    throw error;
  }

  return payload as T;
}
