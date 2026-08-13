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

export function buildEnrollmentContract(data: EnrollmentContractData): string {
  const name = data.name.trim() || "[NOME DO ALUNO]";
  const cpf = formatCpf(data.cpf);
  const address = data.address.trim() || "[ENDEREÇO DO ALUNO]";

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

export const ENROLLMENT_CONTRACT_TITLE =
  "Contrato de Prestação de Serviços Educacionais";
