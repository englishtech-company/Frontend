export type EnrollmentContractData = {
  name: string;
  cpf: string;
  address: string;
};

function formatCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");

  if (digits.length !== 11) {
    return cpf.trim() || "[CPF DO ALUNO]";
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function buildEnrollmentContract(
  data: EnrollmentContractData,
  isGroupClass = false
): string {
  const name = data.name.trim() || "[NOME DO ALUNO]";
  const cpf = formatCpf(data.cpf);
  const address = data.address.trim() || "[ENDEREÇO DO ALUNO]";

  if (isGroupClass) {
    return buildGroupEnrollmentContract(name, cpf, address);
  }

  return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS

ENGLISHTECH, pessoa jurídica de direito privado, inscrita no CNPJ n° 55.832.510/0001-17, com sede na Rua Radialista Antônio Assunção, 380, Jardim Cidade Universitária, João Pessoa/PB, doravante denominada CONTRATADA; e

CONTRATANTE (ALUNO): ${name}, CPF: ${cpf}, residente e domiciliado na ${address}.

As partes resolvem celebrar o presente Contrato de Prestação de Serviços Educacionais, que se regerá pelas cláusulas e condições abaixo.

CLÁUSULA 1ª – OBJETO
O presente contrato tem por objeto a prestação de aulas particulares de língua inglesa, na modalidade online, com foco em desenvolvimento linguístico aplicado ao contexto profissional, conforme metodologia própria da CONTRATADA.

CLÁUSULA 2ª – MODALIDADE E PLATAFORMA
As aulas serão realizadas exclusivamente de forma online, por meio da plataforma Google Meet ou outra que venha a substituí-la. É responsabilidade de ambas as partes dispor de conexão de internet adequada. Problemas técnicos isolados poderão ensejar remarcação; falhas recorrentes não obrigam a CONTRATADA à reposição automática.

CLÁUSULA 3ª – VIGÊNCIA E CARGA HORÁRIA
O CONTRATANTE adere, por meio deste instrumento, ao plano de prestação de serviços educacionais selecionado no momento da contratação e aceite digital.

Quando contratado Plano com prazo determinado (trimestral ou semestral), a vigência estender-se-á pelo período integral pactuado, encerrando-se automaticamente ao término do prazo estipulado, sem renovação automática.

Na hipótese de Plano Mensal, a vigência será de 1 (um) mês, renovando-se automaticamente por iguais períodos, salvo manifestação expressa de cancelamento nos termos deste contrato.

O eventual parcelamento do valor total ajustado constitui mera facilidade de pagamento concedida ao CONTRATANTE, não descaracterizando a contratação pelo período completo acordado. O valor contratado corresponde à reserva exclusiva de horário na agenda da CONTRATADA durante toda a vigência pactuada.

CLÁUSULA 4ª – VALORES E FORMA DE PAGAMENTO
O CONTRATANTE pagará à CONTRATADA os valores descritos no plano escolhido no momento da contratação, através do método de pagamento selecionado (PIX, Boleto Bancário ou Cartão de Crédito).

O pagamento deverá ser realizado até 1 (um) dia útil antes do início de cada período contratado. A ausência de pagamento autoriza a CONTRATADA a não iniciar ou suspender as aulas até a regularização.

A suspensão por inadimplência não caracteriza cancelamento do contrato, permanecendo as obrigações financeiras até a formalização do cancelamento pelo CONTRATANTE.

CLÁUSULA 5ª – OBRIGAÇÕES DO CONTRATANTE
● Comparecer pontualmente às aulas agendadas;
● Comunicar impossibilidade de comparecimento dentro dos prazos estabelecidos;
● Utilizar os materiais exclusivamente para fins pessoais, sendo vedada reprodução, gravação ou compartilhamento;
● Manter os pagamentos em dia.

CLÁUSULA 6ª – OBRIGAÇÕES DA CONTRATADA
● Ministrar as aulas conforme metodologia apresentada;
● Disponibilizar professor qualificado;
● Informar previamente eventuais impossibilidades operacionais;
● Prestar informações sobre o progresso pedagógico quando solicitado.

CLÁUSULA 6ª-A – SUBSTITUIÇÃO DE PROFESSOR
A CONTRATADA poderá, a qualquer tempo, realizar a substituição do professor responsável pelas aulas, por motivos pedagógicos, operacionais, administrativos ou estratégicos, sem que tal alteração caracterize descumprimento contratual. A substituição não implicará alteração do objeto do contrato, da carga horária ou dos valores ajustados.

CLÁUSULA 7ª – FALTAS, ATRASOS E REPOSIÇÕES
A aula será considerada ministrada caso o CONTRATANTE se atrase por mais de 15 (quinze) minutos.

REPOSIÇÕES SOMENTE OCORRERÃO QUANDO A AUSÊNCIA FOR COMUNICADA COM ANTECEDÊNCIA MÍNIMA DE 4 (QUATRO) HORAS OU EM CASOS EXCEPCIONAIS DEVIDAMENTE COMPROVADOS. As reposições dependem de disponibilidade da agenda da CONTRATADA e têm prazo de 30 dias após a falta para serem cumpridas.

CLÁUSULA 8ª – FERIADOS E RECESSOS
A CONTRATADA poderá estabelecer recessos pedagógicos ou administrativos, mediante comunicação prévia. As aulas que coincidirem com feriados não serão automaticamente repostas, considerando-se que o valor contratado corresponde à reserva de horário.

CLÁUSULA 9ª – CANCELAMENTO E RESCISÃO
No Plano Mensal, o CONTRATANTE poderá solicitar o cancelamento mediante comunicação formal com antecedência mínima de 7 (sete) dias da data do próximo vencimento.

NOS PLANOS COM PRAZO DETERMINADO (TRIMESTRAL OU SEMESTRAL), O CANCELAMENTO ANTES DO TÉRMINO DA VIGÊNCIA CARACTERIZA RESCISÃO ANTECIPADA. NESSA HIPÓTESE, AS AULAS JÁ USUFRUÍDAS SERÃO RECALCULADAS COM BASE NO VALOR DO PLANO MENSAL VIGENTE À ÉPOCA DA CONTRATAÇÃO, APURANDO-SE A DIFERENÇA ENTRE O VALOR MENSAL PADRÃO E O VALOR EFETIVAMENTE CONTRATADO, MULTIPLICADA PELO NÚMERO DE MESES EXECUTADOS. DO VALOR APURADO SERÃO DESCONTADAS AS QUANTIAS JÁ PAGAS, PODENDO RESULTAR SALDO REMANESCENTE A SER QUITADO PELO CONTRATANTE.

A ausência do CONTRATANTE nas aulas, bem como eventual suspensão por inadimplência, não o isenta das obrigações financeiras assumidas.

CLÁUSULA 10ª – INADIMPLÊNCIA E COBRANÇA ADMINISTRATIVA
O ATRASO NO PAGAMENTO SUJEITARÁ O CONTRATANTE À INCIDÊNCIA DE MULTA MORATÓRIA DE 2% (DOIS POR CENTO) SOBRE O VALOR DEVIDO, ACRESCIDA DE JUROS DE 1% (UM POR CENTO) AO MÊS, CALCULADOS PRO RATA DIE.

A inadimplência superior a 7 (sete) dias poderá ensejar a suspensão das aulas. Persistindo o débito por prazo superior a 15 (quinze) dias, a CONTRATADA poderá adotar medidas de cobrança extrajudicial e possível registro nos órgãos de proteção ao crédito.

CLÁUSULA 11ª – CONDIÇÕES PROMOCIONAIS E PERMANÊNCIA MÍNIMA
NOS CASOS DE CONTRATAÇÃO COM DESCONTO PROMOCIONAL, CONDIÇÃO ESPECIAL OU VALOR DIFERENCIADO VINCULADO A PRAZO MÍNIMO DE PERMANÊNCIA, O CANCELAMENTO ANTECIPADO IMPLICARÁ O RECÁLCULO DAS AULAS JÁ USUFRUÍDAS COM BASE NO VALOR DO PLANO MENSAL VIGENTE À ÉPOCA DA CONTRATAÇÃO.

CLÁUSULA 12ª – USO DE IMAGEM E VOZ
O uso de imagem e voz do CONTRATANTE para fins institucionais ou promocionais somente ocorrerá mediante consentimento expresso em termo específico, opcional e separado (checkbox opcional na plataforma), não sendo condição para a prestação dos serviços.

CLÁUSULA 13ª – PROTEÇÃO DE DADOS (LGPD)
As partes declaram estar cientes de que os dados pessoais fornecidos serão tratados exclusivamente para fins de execução deste contrato, em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados).

CLÁUSULA 14ª - CASO FORTUITO E FORÇA MAIOR
Nenhuma das partes será responsabilizada por falhas ou impossibilidades de cumprimento decorrentes de caso fortuito ou força maior.

CLÁUSULA 15ª - ASSINATURA ELETRÔNICA
O presente contrato poderá ser firmado por meio eletrônico, inclusive mediante aceite digital dentro da plataforma da CONTRATADA, produzindo todos os efeitos legais (Art. 10, § 2º, Medida Provisória nº 2.200-2/2001).

CLÁUSULA 16ª – DISPOSIÇÕES GERAIS
A tolerância de uma parte para com a outra não implicará novação ou renúncia de direitos. Este contrato é celebrado em caráter educacional, não garantindo resultados específicos.

CLÁUSULA 17ª – FORO
Fica eleito o foro do domicílio do CONTRATANTE (consumidor) para dirimir quaisquer controvérsias oriundas deste contrato, garantindo a facilitação da defesa de seus direitos, conforme Art. 101, I, da Lei 8.078/1990 (Código de Defesa do Consumidor).`;
}

function buildGroupEnrollmentContract(
  name: string,
  cpf: string,
  address: string
): string {
  return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS - TURMAS

ENGLISHTECH, pessoa jurídica de direito privado, inscrita no CNPJ n° 55.832.510/0001-17, com sede na Rua Radialista Antônio Assunção, 380, Jardim Cidade Universitária, João Pessoa/PB, doravante denominada CONTRATADA; e

CONTRATANTE (ALUNO): ${name}, CPF: ${cpf}, residente e domiciliado na ${address}.

As partes resolvem celebrar o presente Contrato de Prestação de Serviços Educacionais, que se regerá pelas cláusulas e condições abaixo.

CLÁUSULA 1ª – OBJETO
O presente contrato tem por objeto a prestação de aulas de língua inglesa em turmas (aulas em grupo), na modalidade online, com foco em desenvolvimento linguístico aplicado ao contexto profissional, conforme metodologia própria da CONTRATADA.

CLÁUSULA 2ª – MODALIDADE E PLATAFORMA
As aulas serão realizadas exclusivamente de forma online, por meio da plataforma Google Meet ou outra que venha a substituí-la. É responsabilidade de ambas as partes dispor de conexão de internet adequada. Problemas técnicos isolados do CONTRATANTE não obrigam a CONTRATADA à reposição da aula ministrada ao grupo.

CLÁUSULA 3ª – VIGÊNCIA E CARGA HORÁRIA
O CONTRATANTE adere, por meio deste instrumento, ao plano de prestação de serviços educacionais em turma selecionado no momento da contratação e aceite digital.

A vigência do presente contrato estender-se-á pelo período integral do plano escolhido, renovando-se automaticamente por períodos iguais e sucessivos, salvo manifestação expressa de cancelamento ou não renovação pelo CONTRATANTE nos termos deste contrato.

O eventual parcelamento do valor total ajustado constitui mera facilidade de pagamento concedida ao CONTRATANTE, não descaracterizando a contratação pelo período completo acordado.

CLÁUSULA 4ª – VALORES E FORMA DE PAGAMENTO
O CONTRATANTE pagará à CONTRATADA os valores descritos no plano escolhido no momento da contratação, por meio do método de pagamento selecionado (PIX, Boleto Bancário ou Cartão de Crédito).

O pagamento deverá ser realizado até 1 (um) dia útil antes do início de cada período contratado. A ausência de pagamento autoriza a CONTRATADA a não iniciar ou suspender o acesso do aluno às aulas até a regularização.

Em caso de atraso, incidirá multa moratória de 2% sobre o valor devido, acrescida de juros de 1% ao mês, pro rata die.

A inadimplência superior a 7 (sete) dias autoriza a suspensão temporária do aluno, sem prejuízo da cobrança dos valores em aberto. A suspensão por inadimplência não caracteriza cancelamento do contrato.

CLÁUSULA 5ª – OBRIGAÇÕES DO CONTRATANTE
● Comparecer pontualmente às aulas agendadas para a sua turma;
● Manter comportamento respeitoso e colaborativo com o professor e demais colegas de turma;
● Utilizar os materiais exclusivamente para fins pessoais, sendo vedada reprodução, gravação ou compartilhamento;
● Manter os pagamentos em dia.

CLÁUSULA 6ª – OBRIGAÇÕES DA CONTRATADA
● Ministrar as aulas conforme metodologia apresentada;
● Disponibilizar professor qualificado;
● Informar previamente eventuais impossibilidades operacionais.

CLÁUSULA 7ª – FALTAS E AUSÊNCIA DE REPOSIÇÃO
Atrasos: o CONTRATANTE poderá acessar a sala de aula virtual em caso de atrasos de até 15 minutos, porém a aula será encerrada no horário previsto para a turma, não havendo prorrogação do horário para compensação.

Ausência de reposição: por se tratar de modalidade educacional em grupo com cronograma fixo, não haverá reposição de aulas exclusivas ou individuais caso o CONTRATANTE falte, independentemente do motivo da ausência, incluindo atestados médicos ou problemas técnicos pessoais.

Acompanhamento: em caso de falta, o CONTRATANTE poderá solicitar à CONTRATADA o material didático utilizado ou o resumo dos tópicos abordados para estudo autônomo, não cabendo redução ou desconto no valor da mensalidade.

CLÁUSULA 8ª – QUÓRUM MÍNIMO E REMANEJAMENTO DE TURMAS
A manutenção da turma está condicionada a um quórum mínimo de alunos matriculados, definido a critério da CONTRATADA.

Caso a turma não atinja ou não mantenha o quórum mínimo ao longo de sua vigência, a CONTRATADA reserva-se o direito de encerrar a turma, oferecendo ao CONTRATANTE a opção de:
(a) migrar para outra turma em horário equivalente;
(b) migrar para a modalidade de aulas particulares, com ajuste de valores; ou
(c) rescindir o contrato sem qualquer multa ou penalidade para ambas as partes, com a devolução de eventuais valores pagos antecipadamente por aulas não ministradas.

CLÁUSULA 9ª – FERIADOS E RECESSOS
A CONTRATADA poderá estabelecer recessos pedagógicos ou administrativos ao longo do calendário anual, informando os alunos com a devida antecedência.

As aulas que coincidirem com feriados nacionais ou recessos expressamente comunicados pela escola não serão ministradas. O cronograma acadêmico já contempla essas pausas, de modo que não haverá reposição automática, compensação de carga horária ou desconto no valor do plano.

Por se tratar de serviço educacional online com turmas de abrangência nacional, feriados estaduais ou municipais serão considerados dias letivos normais. As aulas ocorrerão regularmente nessas datas.

Caso o CONTRATANTE opte por não comparecer à aula em virtude de feriado exclusivo de sua cidade ou estado, a ausência será registrada normalmente, aplicando-se a regra de não reposição prevista na Cláusula 7ª.

CLÁUSULA 10ª – CANCELAMENTO, RESCISÃO E NÃO RENOVAÇÃO
Para que não ocorra a renovação automática para um novo ciclo, o CONTRATANTE deverá manifestar o desejo de encerrar o contrato mediante comunicação formal com antecedência mínima de 15 (quinze) dias do término do período de vigência atual.

O cancelamento solicitado antes do término do período de vigência configurará rescisão antecipada. Incidirá multa compensatória de 10% (dez por cento) sobre a soma das parcelas vincendas. As parcelas já quitadas e aulas usufruídas no ciclo vigente serão recalculadas com base na tarifa sem desconto vigente à época da contratação, sendo a diferença cobrada do aluno ou descontada de eventual saldo a restituir.

O valor final resultante da apuração de débitos e créditos deverá ser quitado no ato do cancelamento. A ausência do CONTRATANTE nas aulas não o isenta das obrigações financeiras assumidas até a formalização do cancelamento.

CLÁUSULA 11ª – INADIMPLÊNCIA E COBRANÇA ADMINISTRATIVA
Persistindo o débito por prazo superior a 15 (quinze) dias, a CONTRATADA poderá adotar medidas administrativas de cobrança. Não havendo regularização após notificação com prazo mínimo de 5 (cinco) dias, a CONTRATADA poderá proceder ao registro do débito junto a órgãos de proteção ao crédito.

CLÁUSULA 12ª – USO DE IMAGEM E VOZ
O uso de imagem e voz do CONTRATANTE para fins institucionais somente ocorrerá mediante termo específico.

CLÁUSULA 13ª – PROTEÇÃO DE DADOS (LGPD)
As partes declaram estar cientes de que os dados pessoais fornecidos serão tratados exclusivamente para fins de execução deste contrato, em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados).

CLÁUSULA 14ª – CASO FORTUITO E FORÇA MAIOR
Nenhuma das partes será responsabilizada por falhas ou impossibilidades de cumprimento decorrentes de caso fortuito ou força maior.

CLÁUSULA 15ª – ASSINATURA ELETRÔNICA
O presente contrato poderá ser firmado por meio eletrônico, inclusive mediante aceite digital dentro da plataforma da CONTRATADA, produzindo todos os efeitos legais, nos termos da legislação vigente.

CLÁUSULA 16ª – DISPOSIÇÕES GERAIS E FORO
A tolerância de uma parte para com a outra não implicará novação ou renúncia de direitos. Fica eleito o foro da Comarca de João Pessoa/PB para dirimir quaisquer controvérsias oriundas deste contrato.`;
}

export const ENROLLMENT_CONTRACT_TITLE =
  "Contrato de Prestação de Serviços Educacionais";
