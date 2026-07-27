# Permissões no Frontend

## Constantes — `lib/permissions/access.ts`

```typescript
export const PERMISSIONS = {
  users: { view, create, update, delete },
  roles: { view, create, update, delete },
  permissions: { view },
  audits: { view },
} as const;
```

Formato: `{modulo}.{acao}` — deve espelhar o backend.

## Store — `stores/auth.ts`

```typescript
function hasPermission(permission: string): boolean {
  if (isSuperadmin.value) return true;
  return permissions.value.includes(permission);
}
```

Dados vêm de `GET /auth/me`.

## Composable — `composables/usePermissions.ts`

Expõe computeds por módulo:

```typescript
const { canViewUsers, canCreateUsers, canUpdateUsers, canDeleteUsers } = usePermissions();
```

Use nas views para controlar botões, colunas de ação e mensagens de erro.

## Router guard — `router/index.ts`

1. Bootstrap auth (`fetchMe`)
2. Rotas públicas: login, erros
3. Não autenticado → `/page-login?redirect=...`
4. Permissão: `to.meta.permission ?? resolveRoutePermission(to.path)`
5. Sem permissão → `/page-error-403`

## Mapeamento rota → permissão

| Rota | Permissão |
|------|-----------|
| `/users` | `users.view` |
| `/users/create` | `users.create` |
| `/users/:id/edit` | `users.update` |
| `/roles` | `roles.view` |
| `/audits` | `audits.view` |

Funções: `resolveRoutePermission()`, `canAccessPath()`.

## Menu — `layouts/Menu.ts` + `useFilteredMenu.ts`

Cada item pode ter `permission`:

```typescript
{ menu: "Usuários", to: "/users", permission: PERMISSIONS.users.view }
```

`useFilteredMenu` remove itens sem permissão e esconde grupos vazios.

## Regras de UI

| Elemento | Permissão |
|----------|-----------|
| Item no menu | `{modulo}.view` |
| Botão "Novo" | `{modulo}.create` |
| Botão "Editar" | `{modulo}.update` |
| Botão "Excluir" | `{modulo}.delete` |
| Links para editar (ex.: auditoria) | `{modulo}.update` |

Superadmin bypassa tudo via `hasPermission()`.

## Superadmin

Role `superadmin` é oculta na UI (`isProtectedRole()` em `roles.ts`). Não exibir nem permitir edição.

## Ao adicionar módulo

1. `PERMISSIONS` em `access.ts`
2. `resolveRoutePermission` + `canAccessPath`
3. `usePermissions` — `canView/Create/Update/Delete`
4. `meta.permission` nas rotas
5. Item no `Menu.ts`
6. Permissões no backend (`PermissionSeeder`)
