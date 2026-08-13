import { maskCep } from "@/lib/br/masks";

export type AddressParts = {
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
};

export function composeAddress(parts: AddressParts): string {
  const streetLine = [parts.street?.trim(), parts.number?.trim()].filter(Boolean).join(", ");
  const cityLine = [parts.neighborhood?.trim(), parts.city?.trim(), parts.state?.trim()]
    .filter(Boolean)
    .join(", ");
  const cepLine = parts.cep?.trim() ? `CEP ${maskCep(parts.cep)}` : "";

  return [streetLine, parts.complement?.trim(), cityLine, cepLine].filter(Boolean).join(" — ");
}
