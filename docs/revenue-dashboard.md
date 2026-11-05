# Receita e LTV

## Acesso e dependências

- Rota: `/students/revenue-dashboard`.
- Acesso por Financeiro > Painéis, mantendo um único item no menu lateral.
- Exige simultaneamente `students.view`, `payments.view`, `charges.view` e `enrollments.view`, tanto na navegação quanto na rota e na API.
- A ação Novo aluno exige adicionalmente `students.create`.
- Esta entrega foi iniciada sobre `origin/feature/financial-student-dashboards`, que contém a navegação compartilhada e o painel de vencimentos (PR frontend #22).
- Requer os endpoints de Receita e LTV da branch backend `feature/revenue-ltv-dashboard`.
- O backend local dessa branch foi iniciado sobre `origin/develop`, sem o backend de vencimentos do PR backend #20. Enquanto essa dependência não estiver integrada, a aba Vencimentos pode retornar 404 nesse ambiente. Esta entrega não remove nem altera esses endpoints e não faz merge das branches automaticamente.

## Funcionalidades e critérios

- Indicadores de alunos atuais, alunos ativos, MRR contratual e LTV recebido.
- Separação entre principal, multa e juros recebidos.
- Evolução de novos alunos pela primeira matrícula confirmada, sem contar renovações como novos alunos.
- Distribuição pelos status realmente cadastrados, sem inventar categorias operacionais.
- Top 6 por receita histórica recebida e distribuição de MRR por pacote e carga horária.
- Abas locais Visão geral e Alunos; Ver todos no ranking abre a lista e direciona o foco à busca.
- Lista paginada com busca por nome ou número do aluno. Buscar, limpar e paginar não mudam os indicadores nem o ranking.
- Detalhamento por aluno de LTV, principal, multa, juros, MRR e último recebimento.
- Alunos arquivados com recebimentos continuam no histórico, mas não recebem links para cadastros indisponíveis.

LTV representa pagamentos válidos de todo o histórico, não previsão de receita futura. MRR representa a base contratual atual, não dinheiro recebido. A média de LTV usa alunos pagantes; a média mensal contratual usa contratos. O frontend apresenta os valores calculados pela API, sem recalcular regras financeiras.

Ausência de dados ainda não carregados aparece como travessão; uma consulta bem-sucedida sem registros tem estado vazio próprio. Avisos da API explicitam limitações, inclusive falta de pausa/suspensão por matrícula e confirmações sem data. Não há exportação Excel nesta etapa.

## Padrões técnicos

- Cliente HTTP compartilhado `api`, tipos explícitos e paginação comum do projeto.
- Componentes existentes FilterPanel, FilterField e PageTable, Chart.js já instalado e variáveis do tema.
- Layout responsivo com reorganização dos cards e rolagem horizontal restrita à tabela.
- Atualização a cada 30 segundos somente com a aba visível, atualização ao retornar e cancelamento no encerramento do componente.
- Cancelamento e descarte de respostas antigas após mudança de busca ou página.
- Falha de rede preserva a última consulta bem-sucedida do mesmo escopo, com aviso e horário da consulta. Mudanças de busca/página limpam a lista anterior.
- Perda das permissões ou resposta 401/403 cancela consultas e limpa os dados do painel.
- Nenhuma nova dependência, alteração de banco ou mudança nos módulos de outros desenvolvedores.

## Verificações em 22/10/2026

- `npm run test:financial`: 59 testes passaram, incluindo 22 novos testes de Receita e LTV.
- Cobertura: cliente HTTP, permissões e menu/rota, filtros locais, paginação, formatação, componentes reais, respostas fora de ordem, erros, perda de acesso, visibilidade, polling e limpeza de recursos.
- `npm run build-only`: passou. Permanecem avisos do projeto sobre assets legados, importação estática/dinâmica de auth e chunks maiores que 500 kB.
- `npm run type-check`: bloqueado somente pelos quatro erros preexistentes de `classDatetime` em CalendarCreateModal.vue, nas linhas 206, 228, 369 e 382. O módulo do calendário não foi alterado.
- Conferência manual no Safari local: carregamento com a API real, cards, gráficos, ranking, pacotes, busca DEMO (10 registros), limpar (34 registros) e página 2 (registros 11 a 20), preservando os indicadores globais.
- Os dados de demonstração existentes foram usados sem gerar, excluir ou atualizar cadastros pelo frontend.

Antes de publicar, validar novamente os testes após a integração das branches dependentes. Não interpretar o build isolado bem-sucedido como aprovação da verificação global de tipos.
