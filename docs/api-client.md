# Cliente API

## Cliente base — `lib/api.ts`

```typescript
export async function api<T>(path: string, options?: {
  method?: string;
  body?: unknown;
  auth?: boolean;  // default true; false para login
}): Promise<T>
```

- Base URL: `VITE_API_URL` ou `/api` (proxy Vite)
- Token: `localStorage` key `englishtech_token`
- Header: `Authorization: Bearer {token}`
- Erros: classe `ApiError` com `status` e `payload`
- 401 com auth: limpa token automaticamente

## Tipos de resposta — `lib/types.ts`

```typescript
export type Paginated<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
};

export type ApiListResponse<TKey extends string, T> = {
  action: string;
  status: number;
  msg: string;
} & Record<TKey, Paginated<T>>;

export type ApiItemResponse<TKey extends string, T> = {
  action: string;
  status: number;
  msg: string;
} & Record<TKey, T>;
```

## Padrão por módulo — `lib/users.ts`

```typescript
import { api } from "@/lib/api";
import type { ApiItemResponse, ApiListResponse, Paginated, User } from "@/lib/types";

export async function listUsers(params = {}): Promise<Paginated<User>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  const response = await api<ApiListResponse<"users", User>>(
    `/users?pagination[page]=${page}&pagination[limit]=${limit}`
  );

  return response.users;
}

export async function getUser(id: number): Promise<User> {
  const response = await api<ApiItemResponse<"user", User>>(`/users/${id}`);
  return response.user;
}

export async function createUser(data: Partial<User>): Promise<User> {
  const response = await api<ApiItemResponse<"user", User>>("/users/create", {
    method: "POST",
    body: data,
  });
  return response.user;
}

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  const response = await api<ApiItemResponse<"user", User>>(`/users/${id}`, {
    method: "PUT",
    body: data,
  });
  return response.user;
}

export async function deleteUser(id: number): Promise<void> {
  await api(`/users/${id}`, { method: "DELETE" });
}
```

## Endpoints (devem espelhar o backend)

| Operação | Método | Path | Chave resposta |
|----------|--------|------|----------------|
| Listar | GET | `/{recurso}?pagination[page]=N&pagination[limit]=N` | plural |
| Obter | GET | `/{recurso}/{id}` | singular |
| Criar | POST | `/{recurso}/create` | singular |
| Atualizar | PUT | `/{recurso}/{id}` | singular |
| Excluir | DELETE | `/{recurso}/{id}` | — |
| Plucks | GET | `/{recurso}/plucks` | `plucks` |

Defaults: `page=1`, `limit=20`.

## Relacionamentos

Backend envia em `relationships`. Preferir:

```typescript
entity.relationships?.roles ?? entity.roles ?? []
```

## Tratamento de erros nas views

```typescript
try {
  await createUser(form);
} catch (e) {
  error.value = e instanceof Error ? e.message : "Erro ao salvar";
}
```

Mensagens de validação vêm em `errors` (array) no payload 422.

## Auth

| Função | Arquivo | Endpoint |
|--------|---------|----------|
| Login | `lib/auth.ts` ou store | `POST /auth/login` |
| Me | `stores/auth.ts` | `GET /auth/me` |
| Logout | store | `POST /auth/logout` |

Permissões do usuário vêm de `/auth/me` e alimentam `hasPermission()`.
