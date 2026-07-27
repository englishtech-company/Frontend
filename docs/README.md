# Documentação do Frontend — EnglishTech

Padrões oficiais para desenvolvimento e criação de módulos no frontend Vue 3.

> **⚠️ Antes de qualquer UI:** consulte o template base em [`template-base.md`](./template-base.md) (`template/src/` — Edumin local).

## Índice

| Documento | Conteúdo |
|-----------|----------|
| [template-base.md](./template-base.md) | **Template Edumin — fonte visual obrigatória** |
| [architecture.md](./architecture.md) | Camadas, pastas e responsabilidades |
| [api-client.md](./api-client.md) | Cliente HTTP e integração com backend |
| [module-guide.md](./module-guide.md) | Passo a passo para criar um módulo CRUD |
| [permissions.md](./permissions.md) | Permissões, guards e menu |
| [RULES.md](./RULES.md) | Regras para agentes de IA |

## Stack

- Vue 3 + TypeScript + Vite
- Pinia (auth)
- Vue Router (guards de permissão)
- Bootstrap 5 (template Edumin em `../template/`)

## Alias

| Alias | Caminho |
|-------|---------|
| `@` | `frontend/src/` (app EnglishTech) |
| `@template/` | `template/src/` (referência visual — ver [template-base.md](./template-base.md)) |

## Módulos de referência

| Tipo | Referência EnglishTech | Referência visual template |
|------|------------------------|----------------------------|
| CRUD completo | `users/` | `template/src/views/app/userManeger/AddUser.vue` |
| CRUD + relações | `roles/` | `template/src/views/app/userManeger/AddRole.vue` |
| Somente leitura | `permissions/`, `audits/` | `template/src/views/table/TableBootstrap.vue` |
| Listagem | `UserList.vue` | `template/src/views/students/AllStudents.vue` |

## Contrato com backend

Ver também [backend/docs/api-contract.md](../backend/docs/api-contract.md).
