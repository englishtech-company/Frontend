import { api } from "@/lib/api";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type {
  ApiItemResponse,
  ApiListResponse,
  EnrollmentQuestion,
  EnrollmentQuestionType,
  Paginated,
} from "@/lib/types";

type ListEnrollmentQuestionsParams = {
  page?: number;
  limit?: number;
  active?: boolean;
};

export type EnrollmentQuestionPayload = {
  label: string;
  help_text?: string | null;
  type: EnrollmentQuestionType;
  required: boolean;
  options?: string[] | null;
  sort_order?: number;
  active: boolean;
};

type EnrollmentQuestionPlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    types: Record<string, string>;
  };
};

export async function listEnrollmentQuestions(
  params: ListEnrollmentQuestionsParams = {}
): Promise<Paginated<EnrollmentQuestion>> {
  const query = new URLSearchParams({
    "pagination[page]": String(params.page ?? 1),
    "pagination[limit]": String(params.limit ?? DEFAULT_LIST_LIMIT),
  });

  if (params.active !== undefined) {
    query.set("active", params.active ? "1" : "0");
  }

  const response = await api<ApiListResponse<"enrollment_questions", EnrollmentQuestion>>(
    `/enrollment-questions?${query.toString()}`
  );

  return response.enrollment_questions;
}

export async function getEnrollmentQuestion(id: number): Promise<EnrollmentQuestion> {
  const response = await api<ApiItemResponse<"enrollment_question", EnrollmentQuestion>>(
    `/enrollment-questions/${id}`
  );

  return response.enrollment_question;
}

export async function createEnrollmentQuestion(
  data: EnrollmentQuestionPayload
): Promise<EnrollmentQuestion> {
  const response = await api<ApiItemResponse<"enrollment_question", EnrollmentQuestion>>(
    "/enrollment-questions/create",
    {
      method: "POST",
      body: data,
    }
  );

  return response.enrollment_question;
}

export async function updateEnrollmentQuestion(
  id: number,
  data: Partial<EnrollmentQuestionPayload>
): Promise<EnrollmentQuestion> {
  const response = await api<ApiItemResponse<"enrollment_question", EnrollmentQuestion>>(
    `/enrollment-questions/${id}`,
    {
      method: "PUT",
      body: data,
    }
  );

  return response.enrollment_question;
}

export async function deleteEnrollmentQuestion(id: number): Promise<void> {
  await api(`/enrollment-questions/${id}`, {
    method: "DELETE",
  });
}

export async function reorderEnrollmentQuestions(
  order: number[]
): Promise<EnrollmentQuestion[]> {
  const response = await api<
    ApiItemResponse<"enrollment_questions", EnrollmentQuestion[]>
  >("/enrollment-questions/reorder", {
    method: "POST",
    body: { order },
  });

  return response.enrollment_questions;
}

export async function getEnrollmentQuestionPlucks(): Promise<
  EnrollmentQuestionPlucksResponse["plucks"]
> {
  const response = await api<EnrollmentQuestionPlucksResponse>(
    "/enrollment-questions/plucks"
  );

  return response.plucks;
}
