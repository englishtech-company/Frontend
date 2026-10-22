import { api } from "@/lib/api";
import type { ApiItemResponse, PublicEnrollment } from "@/lib/types";

export type PublicLeadMatch = {
  id: number;
  name: string;
  whatsapp_phone: string;
  email?: string | null;
};

export type PublicEnrollmentSubmitPayload = {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  address?: string;
  birthdate: string;
  answers?: Record<string, string | string[]>;
  contract_accepted: boolean;
  coupon_name?: string | null;
};

export async function getPublicEnrollment(token: string): Promise<PublicEnrollment> {
  const response = await api<ApiItemResponse<"enrollment", PublicEnrollment>>(
    `/public/enrollments/${token}`,
    { auth: false }
  );

  return response.enrollment;
}

export async function applyPublicEnrollmentCoupon(
  token: string,
  couponName: string
): Promise<PublicEnrollment> {
  const response = await api<ApiItemResponse<"enrollment", PublicEnrollment>>(
    `/public/enrollments/${token}/coupon`,
    {
      method: "POST",
      body: { coupon_name: couponName },
      auth: false,
    }
  );

  return response.enrollment;
}

export async function lookupPublicEnrollmentLeads(
  token: string,
  params: { name?: string; whatsapp_phone?: string }
): Promise<PublicLeadMatch[]> {
  const query = new URLSearchParams();

  if (params.name?.trim()) {
    query.set("name", params.name.trim());
  }

  if (params.whatsapp_phone?.trim()) {
    query.set("whatsapp_phone", params.whatsapp_phone.trim());
  }

  const response = await api<{ leads: PublicLeadMatch[] }>(
    `/public/enrollments/${token}/leads?${query.toString()}`,
    { auth: false }
  );

  return response.leads;
}

export async function attachPublicEnrollmentLead(
  token: string,
  leadId: number
): Promise<PublicEnrollment> {
  const response = await api<ApiItemResponse<"enrollment", PublicEnrollment>>(
    `/public/enrollments/${token}/lead`,
    {
      method: "POST",
      body: { lead_id: leadId },
      auth: false,
    }
  );

  return response.enrollment;
}

export async function submitPublicEnrollment(
  token: string,
  data: PublicEnrollmentSubmitPayload
): Promise<{ enrollment: PublicEnrollment; message?: string }> {
  const response = await api<
    ApiItemResponse<"enrollment", PublicEnrollment> & { message?: string }
  >(`/public/enrollments/${token}`, {
    method: "POST",
    body: data,
    auth: false,
  });

  return {
    enrollment: response.enrollment,
    message: response.message,
  };
}
