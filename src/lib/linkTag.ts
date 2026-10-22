export const PUBLIC_LEAD_LINK_TAG_PRESETS = [
  { value: "instagram", label: "Instagram" },
  { value: "site", label: "Site" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "google", label: "Google" },
  { value: "tiktok", label: "TikTok" },
  { value: "indicacao", label: "Indicação" },
] as const;

export function normalizeLinkTag(value?: string | null): string {
  const slug = (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  return slug;
}

export function publicLeadLinkCode(value?: string | null): string {
  const digits = (value ?? "").replace(/\D/g, "");

  return digits.length === 10 ? digits : "";
}

export function buildPublicLeadFormUrl(code?: string | null): string {
  const origin = window.location.origin;
  const path = "/aula-experimental";
  const digits = publicLeadLinkCode(code);

  if (!digits) {
    return `${origin}${path}`;
  }

  return `${origin}${path}?t=${digits}`;
}

export function formatLinkTagLabel(tag?: string | null): string {
  const normalized = normalizeLinkTag(tag);

  if (!normalized) {
    return "";
  }

  const preset = PUBLIC_LEAD_LINK_TAG_PRESETS.find(
    (item) => item.value === normalized
  );

  return preset?.label ?? normalized;
}
