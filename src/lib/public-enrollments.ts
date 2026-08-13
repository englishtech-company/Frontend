import { api } from "@/lib/api";
import type { ApiItemResponse, PublicEnrollment } from "@/lib/types";

export type PublicEnrollmentSubmitPayload = {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  address?: string;
  birthdate: string;
  answers?: Record<string, string | string[]>;
  contract_accepted: boolean;
};

export async function getPublicEnrollment(token: string): Promise<PublicEnrollment> {
  const response = await api<ApiItemResponse<"enrollment", PublicEnrollment>>(
    `/public/enrollments/${token}`,
    { auth: false }
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
