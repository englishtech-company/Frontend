# Arquitetura do Frontend

## Camadas

```
View (Vue SFC)
    ↓
lib/{modulo}.ts        → funções async de API
    ↓
lib/api.ts             → cliente HTTP (token, erros)
    ↓
Backend /api/*
```

## Estrutura de pastas

```
src/
├── views/
│   ├── admin/{modulo}/     # Módulos administrativos
│   │   ├── {Entity}List.vue
│   │   └── {Entity}Form.vue
│   ├── dashboard/
│   └── pages/              # Login, erros (layout4)
│
├── lib/
│   ├── api.ts              # Cliente base
│   ├── types.ts            # Tipos compartilhados
│   ├── {modulo}.ts         # API por módulo
│   ├── {modulo}/format.ts  # Formatadores (opcional)
│   └── permissions/
│       └── access.ts
│
├── composables/            # Lógica reutilizável
├── components/
│   ├── ui/                 # FilterPanel, ListPagination, SingleSelect, ActionNotificationHost
│   └── admin/              # Domínio admin
├── stores/
│   └── auth.ts
├── router/
│   └── index.ts
└── layouts/
    ├── Menu.ts
    ├── useFilteredMenu.ts
    └── Sidebar.vue
```

## Responsabilidades

| Camada | Faz | Não faz |
|--------|-----|---------|
| **View** | UI, estado local, chama lib | Fetch direto sem `api.ts` |
| **lib/{modulo}.ts** | CRUD async, parse de resposta | Lógica de UI |
| **lib/types.ts** | Tipos de entidade e envelope | — |
| **composables/** | Permissões, lógica compartilhada | Chamadas HTTP |
| **stores/auth.ts** | Sessão, token, `hasPermission()` | — |
| **router/** | Rotas lazy, guards | — |
| **layouts/Menu.ts** | Navegação estática | — |

## Padrão de View — Listagem

Detalhes em [ui-patterns.md](./ui-patterns.md).

```typescript
const search = ref("");
const statusFilter = ref<string | number | null>(null);

const activeFilterCount = computed(() => {
  let count = 0;
  if (search.value.trim()) count += 1;
  if (statusFilter.value) count += 1;
  return count;
});

async function load() {
  if (!canViewX.value) { error.value = "Sem permissão"; return; }
  const result = await listEntities({
    page: page.value,
    search: search.value.trim() || undefined,
    status: statusFilter.value ? String(statusFilter.value) : undefined,
  });
  items.value = result.data;
  lastPage.value = result.last_page;
  total.value = result.total;
}

function handleSearch() {
  page.value = 1;
  load();
}

function clearFilters() {
  search.value = "";
  statusFilter.value = null;
  page.value = 1;
  load();
}
```

Template: `page-titles` → `FilterPanel` → card (tabela) → `ListPagination`.

## Padrão de View — Formulário

Form único para create e edit:

```typescript
const isEdit = computed(() => Boolean(route.params.id));
const entityId = computed(() => Number(route.params.id));

async function submit() {
  if (isEdit.value) await updateEntity(entityId.value, form);
  else await createEntity(form);
  notifySaved("Entidade", isEdit.value);
  router.push("/entities");
}
```

Usar `notifySaved` / `notifyRemoved` / `notify` — ver [ui-patterns.md](./ui-patterns.md).

## Convenções de nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| List view | `{Entity}List.vue` | `UserList.vue` |
| Form view | `{Entity}Form.vue` | `RoleForm.vue` |
| API client | `lib/{plural}.ts` | `lib/users.ts` |
| Função list | `list{Entities}` | `listUsers` |
| Função get | `get{Entity}` | `getUser` |
| Rota list | `/{plural}` | `/users` |
| Rota create | `/{plural}/create` | `/users/create` |
| Rota edit | `/{plural}/:id/edit` | `/users/:id/edit` |

## Componentes

### 1. Template base (prioridade)

Antes de criar qualquer UI, consulte **`template/src/`** (`@template/`).  
Ver [template-base.md](./template-base.md) — mapa de views, components, bootstrap, plugins.

Fluxo: buscar no template → copiar/adaptar para `frontend/src/` → integrar API e permissões.

**Não modificar** arquivos em `template/`.

### 2. Componentes EnglishTech

Após consultar o template, use ou estenda:

- `components/ui/` — widgets genéricos: `FilterPanel`, `FilterField`, `ListPagination`, `SingleSelect`, `MultiSelect`, `ActionNotificationHost`
- `lib/actionNotification.ts` — `notify`, `notifySaved`, `notifyRemoved`
- `components/admin/` — widgets de domínio (`PermissionModulePicker`)
- Layouts já adaptados em `frontend/src/layouts/`

## Layouts

| Contexto | meta |
|----------|------|
| Admin | `{ layout3: "layout3" }` |
| Login/erros | `{ layout4: "layout4" }` |
