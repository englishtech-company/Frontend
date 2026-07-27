# Regras para IA — Frontend

Instruções obrigatórias ao criar ou modificar código frontend neste projeto.

## Antes de codar

1. **Consulte o template base** → [template-base.md](./template-base.md) (`template/src/`)
2. Leia [architecture.md](./architecture.md) e [api-client.md](./api-client.md)
3. Consulte [backend/docs/api-contract.md](../../backend/docs/api-contract.md) para paths e envelope JSON
4. Use `users/` como referência CRUD EnglishTech e `audits/` para read-only com filtros

## Obrigatório em todo módulo

- [ ] Tipo em `lib/types.ts`
- [ ] Client em `lib/{modulo}.ts` usando `api()` — **nunca** fetch direto
- [ ] `PERMISSIONS` + `resolveRoutePermission` + `canAccessPath`
- [ ] `canView/Create/Update/Delete` em `usePermissions.ts`
- [ ] Views `{Entity}List.vue` e `{Entity}Form.vue` (ou só List se read-only)
- [ ] 3 rotas em `router/index.ts` com `layout3` e `meta.permission`
- [ ] Item em `layouts/Menu.ts` com `permission`
- [ ] UI em português

## Proibido

- Ignorar `template/` e criar UI do zero quando existir equivalente no Edumin
- Modificar arquivos em `template/` (somente leitura)
- Chamadas HTTP fora de `lib/api.ts` / `lib/{modulo}.ts`
- Rotas create em `/recurso/new` (usar `/recurso/create`)
- Ignorar permissões na UI (botões sempre visíveis)
- Hardcodar token ou credenciais

## Template base (UI)

1. Buscar em `template/src/views/` e `template/src/components/` telas similares
2. Reutilizar classes Bootstrap e estrutura HTML do Edumin
3. Copiar componente para `frontend/src/` e adaptar (imports `@/`, API, permissões, PT)
4. Ver mapa completo em [template-base.md](./template-base.md)

## Padrões de UI

- **Fonte visual:** `template/src/` (Edumin) — ver [template-base.md](./template-base.md)
- List: `page-titles` + card + `table-striped` + paginação manual (padrão template)
- Form: create/edit no mesmo componente via `route.params.id`
- Erros: `alert alert-danger`
- Selects de formulário admin: `SingleSelect` (`@/components/ui/`) ou select do template adaptado
- Redirect após save: `router.push("/recurso-plural")`

## Nomenclatura

- Views: PascalCase (`UserList.vue`)
- API functions: camelCase (`listUsers`, `getRole`)
- Rotas: plural inglês (`/users`, `/clients`)
- Route names: PascalCase (`UserCreate`)

## Relacionamentos

Sempre preferir:

```typescript
entity.relationships?.roles ?? entity.roles ?? []
```

## Permissões na view

```typescript
const { canViewUsers, canCreateUsers, canUpdateUsers, canDeleteUsers } = usePermissions();
```

Condicionar botões, colunas de ação e load inicial.

## Comunicação com backend

Paths e chaves JSON devem ser **idênticos** ao backend:

- List → chave plural
- Item → chave singular
- Create → `POST /{recurso}/create`

## Escopo

Altere apenas o necessário. Não refatore módulos não relacionados à tarefa.
