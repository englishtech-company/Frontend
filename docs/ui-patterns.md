# Padrões de UI — Listagens, filtros e notificações

Componentes e fluxos **obrigatórios** para listagens admin e feedback de ações no EnglishTech.

> Referência visual geral: [template-base.md](./template-base.md).  
> Contrato de filtros no backend: [backend/docs/api-contract.md](../backend/docs/api-contract.md).

## Componentes padronizados

| Componente | Caminho | Uso |
|------------|---------|-----|
| `FilterPanel` | `@/components/ui/FilterPanel.vue` | Card colapsável **Filtros** (linha inteira, fora da tabela) |
| `FilterField` | `@/components/ui/FilterField.vue` | Label + slot do campo + hint opcional |
| `SingleSelect` | `@/components/ui/SingleSelect.vue` | **Todos** os selects de filtro e formulário |
| `ListPagination` | `@/components/ui/ListPagination.vue` | Paginação alinhada à **direita**, números pequenos |
| `ActionNotificationHost` | `@/components/ui/ActionNotificationHost.vue` | Montado em `App.vue` (não repetir nas views) |
| `notify` / helpers | `@/lib/actionNotification.ts` | Toast de ação no canto superior direito (5s) |

## Listagem — estrutura da página

Ordem obrigatória:

1. `page-titles` (título + botão "Novo …" se `canCreate`)
2. `alert alert-danger` para erro de listagem (se houver)
3. **`FilterPanel`** (fora do card da tabela)
4. Card com título `Lista de … ({{ total }})` **sem filtros no header**
5. Tabela
6. **`ListPagination`**

### Filtros (`FilterPanel`)

- Card colapsável em `col-12`, título **Filtros**
- Campos dentro de `row g-3` com `FilterField`
- Selects: sempre `SingleSelect` (`searchable: false` para listas curtas, ex.: status)
- Botões **Filtrar** e **Limpar** vêm do `FilterPanel` (não duplicar na view)
- `activeCount`: computed com quantidade de filtros aplicados
- `@filter` → `page = 1` + recarregar lista
- `@clear` → zerar filtros + `page = 1` + recarregar

Exemplo:

```vue
<FilterPanel
  :active-count="activeFilterCount"
  @filter="handleSearch"
  @clear="clearFilters"
>
  <div class="row g-3">
    <div class="col-md-6 col-lg-4">
      <FilterField label="Nome" id="entity-filter-search">
        <input
          id="entity-filter-search"
          v-model="search"
          type="text"
          class="form-control"
          @keyup.enter="handleSearch"
        />
      </FilterField>
    </div>
    <div class="col-md-6 col-lg-3">
      <FilterField label="Status" id="entity-filter-status">
        <SingleSelect
          id="entity-filter-status"
          v-model="statusFilter"
          :options="statusOptions"
          placeholder="Todos os status"
          :searchable="false"
        />
      </FilterField>
    </div>
  </div>
</FilterPanel>
```

Estado de filtros com select:

```typescript
const statusFilter = ref<string | number | null>(null);

const activeFilterCount = computed(() => {
  let count = 0;
  if (search.value.trim()) count += 1;
  if (statusFilter.value) count += 1;
  return count;
});
```

### Paginação (`ListPagination`)

- Substituir botões manuais "Anterior / Próxima"
- Alinhada à **direita**, `pagination-sm`, números de página clicáveis
- Oculta automaticamente quando `lastPage <= 1`

```vue
<ListPagination
  :page="page"
  :last-page="lastPage"
  :total="total"
  @update:page="goToPage"
/>
```

### API client — filtros na query

Use `URLSearchParams` com chaves **no nível raiz** (compatível com `HasFilter`):

```typescript
const query = new URLSearchParams({
  "pagination[page]": String(params.page ?? 1),
  "pagination[limit]": String(params.limit ?? DEFAULT_LIST_LIMIT),
});

if (search) {
  query.set("name", `%${search}%`); // LIKE parcial
}

if (status) {
  query.set("status", status);
}

await api(`/students?${query.toString()}`);
```

**Proibido:** `filter[name]=…` ou `filter[status]=…` — causa erro no backend (`Undefined array key 0`).

## Formulários — feedback de ação

Após **criar**, **editar** ou **excluir** com sucesso, usar notificação padronizada (não depender só de redirect silencioso).

```typescript
import { notify, notifySaved, notifyRemoved } from "@/lib/actionNotification";

// Form — antes do redirect
notifySaved("Professor", isEdit.value);
await router.push("/teachers");

// List — após delete
await deleteTeacher(teacher.id);
notifyRemoved("Professor");
await loadTeachers();

// Casos pontuais
notify.success("Link copiado!");
notify.warning("Pagamento salvo, mas o comprovante não foi enviado.");
notify.error("Erro ao salvar."); // opcional; erros de formulário podem manter alert inline
```

| Helper | Mensagem |
|--------|----------|
| `notifySaved("Aluno", false)` | `Aluno criado com sucesso!` |
| `notifySaved("Aluno", true)` | `Aluno atualizado com sucesso!` |
| `notifyRemoved("Aluno")` | `Aluno removido com sucesso!` |

- Posição: canto **superior direito**
- Duração: **5 segundos** (auto-close)
- Host global: `ActionNotificationHost` em `App.vue`

## Selects em formulários

- Preferir `SingleSelect` com `SelectOption[]`
- `MultiSelect` para seleção múltipla quando necessário
- Evitar `<select>` nativo em admin (exceto template legado em migração)

## Erros

| Contexto | Padrão |
|----------|--------|
| Erro ao **carregar** listagem/form | `alert alert-danger` na página |
| Erro ao **salvar** (validação/API) | `alert alert-danger` no form **e/ou** `notify.error()` |
| Sucesso de ação | **`notify` / `notifySaved` / `notifyRemoved`** |

## Checklist — nova listagem

- [ ] `FilterPanel` + `FilterField` fora do card da tabela
- [ ] Selects de filtro com `SingleSelect`
- [ ] `activeFilterCount` + `clearFilters`
- [ ] Query de listagem com `pagination[page]`, `pagination[limit]` e filtros na raiz
- [ ] Busca textual com `%termo%` em campos `LIKE` (ex.: `name`)
- [ ] `ListPagination` no rodapé da tabela
- [ ] `notifyRemoved` após delete bem-sucedido

## Checklist — novo formulário

- [ ] `notifySaved` antes de `router.push` após save
- [ ] `SingleSelect` nos campos de seleção
- [ ] `alert alert-danger` para erro de submit (manter)

## Referências no código

| Padrão | Arquivo |
|--------|---------|
| Listagem completa | `views/admin/students/StudentList.vue` |
| Form com notify | `views/admin/teachers/TeacherForm.vue` |
| Filtros múltiplos | `views/admin/charges/ChargeList.vue` |
