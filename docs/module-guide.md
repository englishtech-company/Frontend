# Guia de Módulo CRUD

Checklist para criar um novo módulo no frontend. Use `users/` como referência.

## 1. Tipo — `lib/types.ts`

```typescript
export type Client = {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  relationships?: {
    // relações opcionais
  };
};
```

## 2. API client — `lib/clients.ts`

Implemente: `listClients`, `getClient`, `createClient`, `updateClient`, `deleteClient`.

Opcional: `getClientOptions()` via `/clients/plucks`.

## 3. Permissões — `lib/permissions/access.ts`

```typescript
export const PERMISSIONS = {
  // ...
  clients: {
    view: "clients.view",
    create: "clients.create",
    update: "clients.update",
    delete: "clients.delete",
  },
} as const;
```

Atualize `PermissionName`, `resolveRoutePermission()` e `canAccessPath()`.

## 4. Composable — `composables/usePermissions.ts`

```typescript
canViewClients: computed(() => auth.hasPermission(PERMISSIONS.clients.view)),
canCreateClients: computed(() => auth.hasPermission(PERMISSIONS.clients.create)),
canUpdateClients: computed(() => auth.hasPermission(PERMISSIONS.clients.update)),
canDeleteClients: computed(() => auth.hasPermission(PERMISSIONS.clients.delete)),
```

## 5. Views — `views/admin/clients/`

Use o template como base visual antes de implementar:

- Lista → `template/src/views/students/AllStudents.vue` ou `app/User/UserList.vue`
- Form → `template/src/views/students/AddStudents.vue` ou `EditStudents.vue`

Ver [template-base.md](./template-base.md).

### `ClientList.vue`

- Título + botão "Novo Cliente" (`RouterLink` → `/clients/create`) se `canCreateClients`
- Tabela com paginação
- Ações: Editar (`/clients/:id/edit`), Excluir com confirm
- Badge "Somente leitura" se sem update/delete

### `ClientForm.vue`

- Detecta create vs edit por `route.params.id`
- Form com `@submit.prevent="submit"`
- Botão Voltar → `/clients`
- Redirect após sucesso

## 6. Rotas — `router/index.ts`

```typescript
{
  path: "/clients",
  name: "Clients",
  component: () => import("../views/admin/clients/ClientList.vue"),
  meta: { layout3: "layout3", permission: PERMISSIONS.clients.view },
},
{
  path: "/clients/create",
  name: "ClientCreate",
  component: () => import("../views/admin/clients/ClientForm.vue"),
  meta: { layout3: "layout3", permission: PERMISSIONS.clients.create },
},
{
  path: "/clients/:id/edit",
  name: "ClientEdit",
  component: () => import("../views/admin/clients/ClientForm.vue"),
  meta: { layout3: "layout3", permission: PERMISSIONS.clients.update },
},
```

## 7. Menu — `layouts/Menu.ts`

```typescript
{ menu: "Clientes", to: "/clients", permission: PERMISSIONS.clients.view },
```

## 8. Labels de permissão (opcional)

Se usar `PermissionModulePicker`, adicione em `lib/permissionGroups.ts`:

```typescript
clients: "Clientes",
```

## Módulo somente leitura

Como `permissions/` ou `audits/`:

- Apenas `{Entity}List.vue`
- Uma rota com `{modulo}.view`
- Sem botões create/edit/delete
- Filtros opcionais com `SingleSelect`

## Formatadores

Módulos com exibição complexa podem ter `lib/{modulo}/format.ts` (ver `lib/audits/format.ts`).

## Backend

O módulo backend deve existir antes. Siga [backend/docs/module-guide.md](../../backend/docs/module-guide.md).
