# Template base (Edumin)

> **⚠️ ALERTA — OBRIGATÓRIO NO FRONTEND**  
> Antes de criar qualquer tela, componente ou estilo novo, **consulte sempre** a pasta `template/` na raiz do repositório.  
> Ela é a **fonte visual oficial** (DexignLab Edumin) que **todos os devs têm localmente**.  
> Não invente UI do zero se já existir equivalente no template.

## O que é `template/`

```
englishtech-system/
├── template/          ← Template base (referência, NÃO alterar)
│   └── src/
│       ├── components/
│       ├── views/
│       ├── layouts/
│       ├── elements/
│       └── assets/scss/
└── frontend/          ← App EnglishTech (onde se desenvolve)
    └── src/
```

| Pasta | Papel |
|-------|-------|
| `template/` | Cópia intacta do tema Edumin — **somente leitura** |
| `frontend/` | Aplicação real integrada à API EnglishTech |

**Alias lógico:** `@template/` = `template/src/` (caminho no monorepo).

No editor, use `@template/components/...` como referência de caminho. Os arquivos ficam em `../template/src/` a partir de `frontend/`.

---

## Fluxo obrigatório antes de desenvolver UI

```
1. Identificar o que precisa (listagem, formulário, modal, gráfico…)
2. Buscar equivalente em template/src/
3. Copiar estrutura HTML/CSS/classes Bootstrap do template
4. Adaptar em frontend/src/ (API, permissões, português)
5. Só criar componente novo se não existir no template
```

### Para IA / Cursor

Ao receber tarefa de frontend:

1. **Explorar** `template/src/views/` e `template/src/components/` por telas similares
2. **Reutilizar** classes Bootstrap, estrutura de card/table/form do template
3. **Não** criar design system paralelo
4. **Não** modificar arquivos em `template/`

---

## Mapa de referência rápida

### Listagens / CRUD

| Necessidade | Ver em `@template/` |
|-------------|---------------------|
| Lista com tabela | `views/students/AllStudents.vue`, `views/app/User/UserList.vue` |
| Formulário criar | `views/students/AddStudents.vue`, `views/app/userManeger/AddUser.vue` |
| Formulário editar | `views/students/EditStudents.vue` |
| Perfil / detalhe | `views/students/AboutStudents.vue`, `views/app/userManeger/AppProfile1.vue` |

### Componentes reutilizáveis

| Necessidade | Ver em `@template/` |
|-------------|---------------------|
| Tabela genérica | `components/AppTable.vue` |
| DataTable | `elements/tableDataContent/DataTable.vue`, `DataTableResponsive.vue` |
| Modal | `elements/ModalBox.vue` |
| Select | `components/FormSelectOptin.vue`, `CustomSelectOption.vue` |
| Cards / widgets | `components/widgitData/*`, `elements/CardChart.vue` |
| Formulários | `views/Forms/FormElement.vue`, `FormValidation.vue`, `FormWizard.vue` |

### Bootstrap / UI kit

| Necessidade | Ver em `@template/` |
|-------------|---------------------|
| Botões, badges, alerts | `views/bootstrap/Buttons.vue`, `Badge.vue`, `Alerts.vue` |
| Cards, modals, tabs | `views/bootstrap/Card.vue`, `Modal.vue`, `Tab.vue` |
| Tabelas Bootstrap | `views/table/TableBootstrap.vue` |

### Layout (já adaptado no frontend)

| Item | Template | Frontend (uso atual) |
|------|----------|----------------------|
| Sidebar | `layouts/Sidebar.vue` | `frontend/src/layouts/Sidebar.vue` |
| Header | `layouts/Header.vue` | `frontend/src/layouts/Header.vue` |
| Menu | `layouts/Menu.ts` | `frontend/src/layouts/Menu.ts` |

### Plugins (se precisar)

| Plugin | `@template/views/plugins/` |
|--------|---------------------------|
| SweetAlert | `Sweetalert.vue` |
| Toastr | `Toastr.vue` |
| Select2 | `Select2.vue` |
| LightGallery | `LightGallery.vue` |

---

## Como trazer um componente do template

**Não importe diretamente** de `template/` no build — os arquivos usam `@/` apontando para o próprio template.

### Passo a passo

1. Localize o componente em `template/src/components/Exemplo.vue`
2. Copie para `frontend/src/components/` (ou `components/ui/`, `components/admin/`)
3. Ajuste imports: `@/` continua apontando para `frontend/src/`
4. Remova lógica demo/mock do template
5. Conecte à API via `lib/{modulo}.ts`
6. Adicione permissões (`usePermissions`)
7. Traduza textos para português

### Exemplo

```
template/src/components/AppTable.vue
    → copiar/adaptar →
frontend/src/components/AppTable.vue  (se ainda não existir)
    → usar em →
frontend/src/views/admin/clients/ClientList.vue
```

---

## O que manter do EnglishTech (não vem do template)

Mesmo usando UI do template, **sempre** aplicar os padrões do projeto:

| Camada | Onde |
|--------|------|
| API | `lib/{modulo}.ts` + `api()` |
| Permissões | `usePermissions`, guards, menu |
| Tipos | `lib/types.ts` |
| Select padronizado do projeto | `components/ui/SingleSelect.vue` (preferir quando for select de formulário admin; senão usar select do template) |
| Regras de negócio | Services/views admin em `views/admin/` |

---

## Regras

### ✅ Fazer

- Consultar `template/` antes de cada tela nova
- Reutilizar classes Bootstrap e estrutura HTML do Edumin
- Copiar componentes para `frontend/src/` e adaptar
- Manter `template/` intacto para referência futura
- Seguir [module-guide.md](./module-guide.md) para integração API/permissões

### ❌ Não fazer

- Modificar arquivos em `template/`
- Criar UI com biblioteca/componente externo se o template já tem equivalente
- Ignorar o template e criar layout do zero
- Desenvolver features de negócio dentro de `template/`

---

## Busca no template

```bash
# Exemplos — rodar na raiz do repositório
ls template/src/views/students/
rg "table-striped" template/src/views/
rg "page-titles" template/src/
```

No Cursor/IA: explorar `template/src/views/` e `template/src/components/` com busca por palavra-chave (student, user, form, table, modal).

---

## Referências cruzadas

- Padrões EnglishTech: [architecture.md](./architecture.md), [module-guide.md](./module-guide.md)
- Nomenclatura: [../docs/naming-conventions.md](../docs/naming-conventions.md)
- Regras IA: [RULES.md](./RULES.md)
