import { onlyDigits } from "@/lib/br/masks";

export function toWhatsAppE164(phone: string): string | null {
  const digits = onlyDigits(phone);

  if (digits.length < 10) {
    return null;
  }

  if (digits.startsWith("55") && digits.length >= 12) {
    return digits;
  }

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string): string | null {
  const e164 = toWhatsAppE164(phone);

  if (!e164) {
    return null;
  }

  return `https://wa.me/${e164}?text=${encodeURIComponent(message)}`;
}
