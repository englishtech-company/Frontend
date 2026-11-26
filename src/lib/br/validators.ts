import { onlyDigits } from "./masks";

/**
 * Validação de CPF brasileiro (Módulo 11) com bloqueio de repetições.
 */
export function isValidCpf(value: string | null | undefined): boolean {
  if (!value) return false;

  const cpf = onlyDigits(value);

  if (cpf.length !== 11) {
    return false;
  }

  // Bloqueia dígitos repetidos
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  // Validação dos dois dígitos verificadores
  for (let t = 9; t < 11; t++) {
    let d = 0;
    for (let c = 0; c < t; c++) {
      d += parseInt(cpf[c], 10) * (t + 1 - c);
    }

    d = ((10 * d) % 11) % 10;

    if (parseInt(cpf[t], 10) !== d) {
      return false;
    }
  }

  return true;
}

/**
 * Validação de telefone brasileiro (DDD válido, tamanho e celular iniciando com 9).
 */
export function isValidPhone(value: string | null | undefined): boolean {
  if (!value) return true; // Nullable se opcional

  let phone = onlyDigits(value);

  // Remove DDI 55
  if ((phone.length === 12 || phone.length === 13) && phone.startsWith("55")) {
    phone = phone.slice(2);
  }

  if (phone.length !== 10 && phone.length !== 11) {
    return false;
  }

  // Rejeita sequências repetidas
  if (/^(\d)\1+$/.test(phone)) {
    return false;
  }

  const ddd = parseInt(phone.slice(0, 2), 10);
  if (ddd < 11 || ddd > 99 || ddd % 10 === 0) {
    return false;
  }

  // Celular (11 dígitos) precisa começar com 9
  if (phone.length === 11 && phone[2] !== "9") {
    return false;
  }

  // Telefone fixo (10 dígitos) geralmente começa com 2, 3, 4 ou 5
  if (phone.length === 10 && !["2", "3", "4", "5"].includes(phone[2])) {
    return false;
  }

  return true;
}

/**
 * Retorna a data atual no fuso America/Fortaleza em formato YYYY-MM-DD.
 */
export function getTodayDateFortaleza(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Fortaleza",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}
