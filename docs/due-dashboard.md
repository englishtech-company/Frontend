# Vencimentos e renovações

Interface de consulta da API descrita em `../../backend/docs/due-dashboard.md`.
Não cadastra pagamentos, não renova contratos e não altera matrículas.

## Acesso e navegação

- Rota lazy `/charges/dashboard`, nome `DueDashboard`, `layout3` e permissão
  existente `charges.view`. O guard global continua responsável pela rota.
- Financeiro mantém um único item **Painéis**. O item resolve seu destino pelas
  permissões: Pagamentos ou Vencimentos. No painel atual, permanece selecionado,
  sem selecionar ao mesmo tempo a gestão de cobranças/pagamentos.
- Abas internas usam as permissões de cada API; Receita e LTV continua desabilitada
  como **Em breve**. Não adicionar uma rota fictícia para a próxima entrega.
- Novo aluno exige `students.create`; detalhes de matrícula exigem
  `enrollments.view`. Detalhes de cobrança usam a rota existente `/charges/:id`.

## Tela e componentes

Referência: Edumin (`template/src/elements/CardChart.vue` e listagens do template)
e o painel de pagamentos já adaptado. Usa os componentes existentes `FilterPanel`,
`FilterField`, `SingleSelect`, `AppDatePicker`, `ListPagination` e `vue-chartjs`.
Sem dependências novas e sem alterações no template.

- Filtros aplicados explicitamente: referência, plano e situação da cobrança.
- Hoje/null acompanha o dia corrente em Fortaleza; data passada não é aceita
  pelo calendário e continua protegida pela validação do backend.
- Referência futura projeta prazos/encargos de dívidas existentes. MRR e volume
  mostram o recorte de hoje retornado em `contract_reference_date`.
- A situação afeta somente as dívidas; busca e paginação são independentes por
  lista. Não recalcular indicadores somando páginas no navegador.
- Alunos por status refere-se somente aos ciclos conhecidos, não ao cadastro
  escolar completo. Não inventar categorias/status ausentes.
- Meios de pagamento são contratados, não transações recebidas.
- Valores monetários e saldos vêm da API. Razões numéricas locais servem apenas
  para largura visual das barras; o frontend não recalcula regras financeiras.
- Aviso visível de base contratual parcial e detalhes dos avisos do backend:
  pausa/suspensão por matrícula ainda não está registrada. Não exibir volume
  pausado como zero quando a API informa ausência de base.

## Atualização e erros

O composable consulta as três seções a cada 30 segundos com a aba visível,
ao retornar à aba/focar a janela e ao clicar em Atualizar. Não é push/WebSocket.
Busca e paginação consultam apenas sua lista.

Requisições anteriores são canceladas em mudança de filtro, busca, permissão,
visibilidade ou desmontagem. Respostas atrasadas não sobrescrevem o recorte
atual. Após exclusões externas, páginas fora do limite voltam à última página.

Falhas de rede mantêm a última resposta bem-sucedida do mesmo recorte, identificada
pelo erro e pelos horários por seção. Filtros novos limpam dados anteriores.
401/403 limpam todos os dados financeiros e interrompem o polling até nova
tentativa; perda da permissão reativa também cancela e limpa o painel.

Se uma referência fixa passa a ser ontem durante o uso, o painel volta para Hoje
com aviso. Não consultar retrospectivamente a situação da dívida.

## Verificação

```bash
npm run test:financial
npm run type-check
npm run build
git diff --check
```

Os testes nativos Node compilam os módulos reais com Vite, sem porta HTTP/HMR,
e verificam cliente, navegação, renderização SSR e ciclo de vida do composable.
Não utilizam credenciais nem fazem chamadas reais à API.

O calendário possui erros preexistentes de `classDatetime` que podem impedir
o type-check/build completo; não corrigi-los silenciosamente nesta entrega.
`npm run build-only` verifica o bundle separadamente, sem substituir o type-check.

Homologação: conferir filtros/Hoje, busca de cada lista, paginação, referência
futura, links existentes, temas claro/escuro e largura reduzida. A base local
pode conter datas antigas de teste, refletidas nos encargos; não corrigi-las
automaticamente. Exportação XLSX e Receita/LTV permanecem para etapas próprias.
