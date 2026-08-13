export type NumberQuestionConstraints = {
  min?: number;
  max?: number;
};

export function parseNumberRangeFromLabel(
  text: string | null | undefined
): NumberQuestionConstraints | null {
  if (!text?.trim()) {
    return null;
  }

  const match = text.match(/de\s*(\d+)\s*a(?:\s*|\s*o\s*)(\d+)/i);

  if (!match) {
    return null;
  }

  const min = Number(match[1]);
  const max = Number(match[2]);

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return null;
  }

  return min <= max ? { min, max } : { min: max, max: min };
}

export function getNumberQuestionConstraints(
  label: string,
  helpText?: string | null
): NumberQuestionConstraints | null {
  return parseNumberRangeFromLabel(label) ?? parseNumberRangeFromLabel(helpText);
}

export function sanitizeNumericInput(
  value: string,
  constraints?: NumberQuestionConstraints | null
): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  let numeric = Number(digits);

  if (!Number.isFinite(numeric)) {
    return "";
  }

  if (constraints?.max !== undefined && numeric > constraints.max) {
    numeric = constraints.max;
  }

  return String(numeric);
}

export function finalizeNumericInput(
  value: string,
  constraints?: NumberQuestionConstraints | null
): string {
  const sanitized = sanitizeNumericInput(value, constraints);

  if (!sanitized) {
    return "";
  }

  let numeric = Number(sanitized);

  if (constraints?.min !== undefined && numeric < constraints.min) {
    numeric = constraints.min;
  }

  if (constraints?.max !== undefined && numeric > constraints.max) {
    numeric = constraints.max;
  }

  return String(numeric);
}

export function isValidNumericAnswer(
  value: string,
  constraints?: NumberQuestionConstraints | null
): boolean {
  if (!/^\d+$/.test(value)) {
    return false;
  }

  const numeric = Number(value);

  if (constraints?.min !== undefined && numeric < constraints.min) {
    return false;
  }

  if (constraints?.max !== undefined && numeric > constraints.max) {
    return false;
  }

  return true;
}

export function getNumberQuestionHint(
  constraints?: NumberQuestionConstraints | null
): string | null {
  if (constraints?.min === undefined && constraints?.max === undefined) {
    return null;
  }

  if (constraints.min !== undefined && constraints.max !== undefined) {
    return `Informe um número de ${constraints.min} a ${constraints.max}.`;
  }

  if (constraints.min !== undefined) {
    return `Informe um número maior ou igual a ${constraints.min}.`;
  }

  return `Informe um número menor ou igual a ${constraints?.max}.`;
}
