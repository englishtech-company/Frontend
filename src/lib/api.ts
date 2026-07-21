const API_URL = import.meta.env.VITE_API_URL || "/api";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function api<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
