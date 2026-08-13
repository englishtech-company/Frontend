import { api } from "@/lib/api";
import type {
  ApiItemResponse,
  ApiListResponse,
  Enrollment,
  EnrollmentPaymentMethod,
  EnrollmentStatus,
  Paginated,
} from "@/lib/types";

type ListEnrollmentsParams = {
  page?: number;
  limit?: number;
  status?: EnrollmentStatus;
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
  const query = new URLSearchParams({
    "pagination[page]": String(params.page ?? 1),
    "pagination[limit]": String(params.limit ?? 20),
  });

  if (params.status) {
    query.set("status", params.status);
  }

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
