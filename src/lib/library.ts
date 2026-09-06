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
  LibraryCategory,
  LibraryMaterial,
  Paginated,
} from "@/lib/types";

const CATEGORIES = "library-categories";
const MATERIALS = "library-materials";

export type ListLibraryCategoriesParams = {
  page?: number;
  limit?: number;
  name?: string;
  studentId?: number;
};

export type ListLibraryMaterialsParams = {
  page?: number;
  limit?: number;
  title?: string;
  categoryId?: number;
  categoryName?: string;
  studentId?: number;
};

export type LibraryCategoryPayload = {
  name: string;
  description?: string | null;
  sort_order?: number;
  student_ids?: number[];
};

export type LibraryMaterialPayload = {
  category_id: number;
  title: string;
  description?: string | null;
  file?: File;
  student_ids?: number[];
};

type LibraryPlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    categories: Record<string, string>;
    students: Record<string, string>;
  };
};

export async function getLibraryCategoryPlucks(): Promise<{
  categories: Record<string, string>;
  students: Record<string, string>;
}> {
  const response = await api<LibraryPlucksResponse>(`/${CATEGORIES}/plucks`);

  return response.plucks;
}

export async function getLibraryMaterialPlucks(): Promise<{
  categories: Record<string, string>;
  students: Record<string, string>;
}> {
  const response = await api<LibraryPlucksResponse>(`/${MATERIALS}/plucks`);

  return response.plucks;
}

export async function listLibraryCategories(
  params: ListLibraryCategoriesParams = {}
): Promise<Paginated<LibraryCategory>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  appendLike(query, "name", params.name);
  appendExact(query, "student_id", params.studentId);

  const response = await api<
    ApiListResponse<"library-categories", LibraryCategory>
  >(`/${CATEGORIES}?${query.toString()}`);

  return response["library-categories"];
}

export async function getLibraryCategory(id: number): Promise<LibraryCategory> {
  const response = await api<
    ApiItemResponse<"library-category", LibraryCategory>
  >(`/${CATEGORIES}/${id}`);

  return response["library-category"];
}

export async function createLibraryCategory(
  data: LibraryCategoryPayload
): Promise<LibraryCategory> {
  const response = await api<
    ApiItemResponse<"library-category", LibraryCategory>
  >(`/${CATEGORIES}/create`, { method: "POST", body: data });

  return response["library-category"];
}

export async function updateLibraryCategory(
  id: number,
  data: Partial<LibraryCategoryPayload>
): Promise<LibraryCategory> {
  const response = await api<
    ApiItemResponse<"library-category", LibraryCategory>
  >(`/${CATEGORIES}/${id}`, { method: "PUT", body: data });

  return response["library-category"];
}

export async function deleteLibraryCategory(id: number): Promise<void> {
  await api(`/${CATEGORIES}/${id}`, { method: "DELETE" });
}

export async function listLibraryMaterials(
  params: ListLibraryMaterialsParams = {}
): Promise<Paginated<LibraryMaterial>> {
  const query = createListQuery(params.page, params.limit ?? DEFAULT_LIST_LIMIT);

  appendLike(query, "title", params.title);
  appendExact(query, "category_id", params.categoryId);
  appendLike(query, "category_name", params.categoryName);
  appendExact(query, "student_id", params.studentId);

  const response = await api<
    ApiListResponse<"library-materials", LibraryMaterial>
  >(`/${MATERIALS}?${query.toString()}`);

  return response["library-materials"];
}

export async function getLibraryMaterial(id: number): Promise<LibraryMaterial> {
  const response = await api<
    ApiItemResponse<"library-material", LibraryMaterial>
  >(`/${MATERIALS}/${id}`);

  return response["library-material"];
}

export async function createLibraryMaterial(
  data: LibraryMaterialPayload
): Promise<LibraryMaterial> {
  const formData = new FormData();

  formData.append("category_id", String(data.category_id));
  formData.append("title", data.title);

  if (data.description) {
    formData.append("description", data.description);
  }

  if (data.file) {
    formData.append("file", data.file);
  }

  data.student_ids?.forEach((studentId, index) => {
    formData.append(`student_ids[${index}]`, String(studentId));
  });

  const response = await api<
    ApiItemResponse<"library-material", LibraryMaterial>
  >(`/${MATERIALS}/create`, { method: "POST", body: formData });

  return response["library-material"];
}

export async function updateLibraryMaterial(
  id: number,
  data: Partial<Omit<LibraryMaterialPayload, "file">>
): Promise<LibraryMaterial> {
  const response = await api<
    ApiItemResponse<"library-material", LibraryMaterial>
  >(`/${MATERIALS}/${id}`, { method: "PUT", body: data });

  return response["library-material"];
}

export async function replaceLibraryMaterial(
  id: number,
  file: File
): Promise<LibraryMaterial> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api<
    ApiItemResponse<"library-material", LibraryMaterial>
  >(`/${MATERIALS}/${id}/replace`, { method: "POST", body: formData });

  return response["library-material"];
}

export async function downloadLibraryMaterial(id: number): Promise<Blob> {
  return api<Blob>(`/${MATERIALS}/${id}/download`, {
    responseType: "blob",
  });
}

export async function deleteLibraryMaterial(id: number): Promise<void> {
  await api(`/${MATERIALS}/${id}`, { method: "DELETE" });
}

export function getLibraryCategoryStudents(
  item: LibraryCategory
): NonNullable<LibraryCategory["students"]> {
  return item.relationships?.students ?? item.students ?? [];
}

export function getLibraryMaterialCategory(
  item: LibraryMaterial
): LibraryCategory | null {
  return item.relationships?.category ?? item.category ?? null;
}

export function getLibraryMaterialStudents(
  item: LibraryMaterial
): NonNullable<LibraryMaterial["students"]> {
  return item.relationships?.students ?? item.students ?? [];
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;

  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }

  return `${size.toFixed(size >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

export type LibraryFileKind =
  | "pdf"
  | "image"
  | "audio"
  | "video"
  | "word"
  | "excel"
  | "powerpoint"
  | "archive"
  | "text"
  | "other";

export function getLibraryFileKind(
  material: Pick<LibraryMaterial, "mime_type" | "original_name">
): LibraryFileKind {
  const mime = material.mime_type.toLowerCase();
  const name = material.original_name.toLowerCase();

  if (mime.includes("pdf") || name.endsWith(".pdf")) return "pdf";
  if (mime.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg|bmp)$/.test(name)) {
    return "image";
  }
  if (mime.startsWith("audio/") || /\.(mp3|wav|ogg|m4a|aac)$/.test(name)) {
    return "audio";
  }
  if (mime.startsWith("video/") || /\.(mp4|webm|mov|avi|mkv)$/.test(name)) {
    return "video";
  }
  if (mime.includes("word") || /\.(docx?)$/.test(name)) return "word";
  if (
    mime.includes("excel") ||
    mime.includes("spreadsheet") ||
    /\.(xlsx?|csv)$/.test(name)
  ) {
    return "excel";
  }
  if (
    mime.includes("powerpoint") ||
    mime.includes("presentation") ||
    /\.(pptx?)$/.test(name)
  ) {
    return "powerpoint";
  }
  if (
    mime.includes("zip") ||
    mime.includes("compressed") ||
    /\.(zip|rar|7z)$/.test(name)
  ) {
    return "archive";
  }
  if (mime.startsWith("text/") || name.endsWith(".txt")) return "text";

  return "other";
}

export function getLibraryFileIcon(kind: LibraryFileKind): string {
  switch (kind) {
    case "pdf":
      return "la la-file-pdf";
    case "image":
      return "la la-file-image";
    case "audio":
      return "la la-file-audio";
    case "video":
      return "la la-file-video";
    case "word":
      return "la la-file-word";
    case "excel":
      return "la la-file-excel";
    case "powerpoint":
      return "la la-file-powerpoint";
    case "archive":
      return "la la-file-archive";
    case "text":
      return "la la-file-alt";
    default:
      return "la la-file";
  }
}

export function getLibraryFileLabel(kind: LibraryFileKind): string {
  switch (kind) {
    case "pdf":
      return "PDF";
    case "image":
      return "Imagem";
    case "audio":
      return "Áudio";
    case "video":
      return "Vídeo";
    case "word":
      return "Word";
    case "excel":
      return "Excel";
    case "powerpoint":
      return "PowerPoint";
    case "archive":
      return "Arquivo";
    case "text":
      return "Texto";
    default:
      return "Arquivo";
  }
}
