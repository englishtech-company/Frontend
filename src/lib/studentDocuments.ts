import { api } from "@/lib/api";
import type {
  ApiItemResponse,
  ApiListResponse,
  Paginated,
  StudentDocument,
  StudentDocumentCategory,
} from "@/lib/types";

export type ListStudentDocumentsParams = {
  page?: number;
  limit?: number;
  studentId?: number;
  paymentId?: number;
  category?: StudentDocumentCategory;
};

export type CreateStudentDocumentPayload = {
  student_id: number;
  payment_id?: number | null;
  category: StudentDocumentCategory;
  description?: string | null;
  document: File;
};

export type UpdateStudentDocumentPayload = {
  payment_id?: number | null;
  category?: StudentDocumentCategory;
  description?: string | null;
};

export type StudentDocumentCategories =
  Record<StudentDocumentCategory, string>;

type StudentDocumentPlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    categories: StudentDocumentCategories;
  };
};

export async function listStudentDocuments(
  params: ListStudentDocumentsParams = {}
): Promise<Paginated<StudentDocument>> {
  const query = new URLSearchParams({
    "pagination[page]": String(params.page ?? 1),
    "pagination[limit]": String(params.limit ?? 20),
  });

  if (params.studentId !== undefined) {
    query.set("student_id", String(params.studentId));
  }

  if (params.paymentId !== undefined) {
    query.set("payment_id", String(params.paymentId));
  }

  if (params.category) {
    query.set("category", params.category);
  }

  const response = await api<
    ApiListResponse<
      "student_documents",
      StudentDocument
    >
  >(`/student-documents?${query.toString()}`);

  return response.student_documents;
}

export async function getStudentDocument(
  id: number
): Promise<StudentDocument> {
  const response = await api<
    ApiItemResponse<
      "student_document",
      StudentDocument
    >
  >(`/student-documents/${id}`);

  return response.student_document;
}

export async function createStudentDocument(
  data: CreateStudentDocumentPayload
): Promise<StudentDocument> {
  const formData = new FormData();

  formData.append(
    "student_id",
    String(data.student_id)
  );
  formData.append("category", data.category);
  formData.append("document", data.document);

  if (
    data.payment_id !== undefined &&
    data.payment_id !== null
  ) {
    formData.append(
      "payment_id",
      String(data.payment_id)
    );
  }

  if (
    data.description !== undefined &&
    data.description !== null
  ) {
    formData.append(
      "description",
      data.description
    );
  }

  const response = await api<
    ApiItemResponse<
      "student_document",
      StudentDocument
    >
  >("/student-documents/create", {
    method: "POST",
    body: formData,
  });

  return response.student_document;
}

export async function updateStudentDocument(
  id: number,
  data: UpdateStudentDocumentPayload
): Promise<StudentDocument> {
  const response = await api<
    ApiItemResponse<
      "student_document",
      StudentDocument
    >
  >(`/student-documents/${id}`, {
    method: "PUT",
    body: data,
  });

  return response.student_document;
}

export async function replaceStudentDocument(
  id: number,
  document: File
): Promise<StudentDocument> {
  const formData = new FormData();

  formData.append("document", document);

  const response = await api<
    ApiItemResponse<
      "student_document",
      StudentDocument
    >
  >(`/student-documents/${id}/replace`, {
    method: "POST",
    body: formData,
  });

  return response.student_document;
}

export async function downloadStudentDocument(
  id: number
): Promise<Blob> {
  return api<Blob>(
    `/student-documents/${id}/download`,
    {
      responseType: "blob",
    }
  );
}

export async function deleteStudentDocument(
  id: number,
  deletionReason: string
): Promise<void> {
  await api(`/student-documents/${id}`, {
    method: "DELETE",
    body: {
      deletion_reason: deletionReason,
    },
  });
}

export async function getStudentDocumentCategories():
Promise<StudentDocumentCategories> {
  const response =
    await api<StudentDocumentPlucksResponse>(
      "/student-documents/plucks"
    );

  return response.plucks.categories;
}
