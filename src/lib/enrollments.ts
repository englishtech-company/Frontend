import { api } from "@/lib/api";
import {
  appendExact,
  appendLike,
  createListQuery,
} from "@/lib/filters/query";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type {
  ApiItemResponse,
  ApiListResponse,
  Enrollment,
  EnrollmentPaymentMethod,
  EnrollmentStatus,
  Paginated,
} from "@/lib/types";

export type ListEnrollmentsParams = {
  page?: number;
  limit?: number;
  id?: number;
  studentName?: string;
  planName?: string;
  paymentMethod?: EnrollmentPaymentMethod;
  status?: EnrollmentStatus;
  publicToken?: string;
};

export type EnrollmentPayload = {
  student_id?: number | null;
  plan_variant_id: number;
  discount_percent?: number | null;
  payment_method: EnrollmentPaymentMethod;
  status?: EnrollmentStatus;
};

type EnrollmentPlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    students: Record<string, string>;
    statuses: Record<string, string>;
    payment_methods: Record<string, string>;
  };
};

export async function listEnrollments(
  params: ListEnrollmentsParams = {}
): Promise<Paginated<Enrollment>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  appendExact(query, "id", params.id);
  appendLike(query, "student_name", params.studentName);
  appendLike(query, "plan_name", params.planName);
  appendExact(query, "payment_method", params.paymentMethod);
  appendExact(query, "status", params.status);
  appendLike(query, "public_token", params.publicToken);

  const response = await api<ApiListResponse<"enrollments", Enrollment>>(
    `/enrollments?${query.toString()}`
  );

  return response.enrollments;
}

export async function getEnrollment(id: number): Promise<Enrollment> {
  const response = await api<ApiItemResponse<"enrollment", Enrollment>>(
    `/enrollments/${id}`
  );

  return response.enrollment;
}

export async function createEnrollment(data: EnrollmentPayload): Promise<Enrollment> {
  const response = await api<ApiItemResponse<"enrollment", Enrollment>>(
    "/enrollments/create",
    {
      method: "POST",
      body: data,
    }
  );

  return response.enrollment;
}

export async function updateEnrollment(
  id: number,
  data: Partial<EnrollmentPayload>
): Promise<Enrollment> {
  const response = await api<ApiItemResponse<"enrollment", Enrollment>>(
    `/enrollments/${id}`,
    {
      method: "PUT",
      body: data,
    }
  );

  return response.enrollment;
}

export async function deleteEnrollment(id: number): Promise<void> {
  await api(`/enrollments/${id}`, {
    method: "DELETE",
  });
}

export async function regenerateEnrollmentLink(id: number): Promise<Enrollment> {
  const response = await api<ApiItemResponse<"enrollment", Enrollment>>(
    `/enrollments/${id}/regenerate-link`,
    {
      method: "POST",
    }
  );

  return response.enrollment;
}

export async function getEnrollmentPlucks(): Promise<EnrollmentPlucksResponse["plucks"]> {
  const response = await api<EnrollmentPlucksResponse>("/enrollments/plucks");

  return response.plucks;
}
