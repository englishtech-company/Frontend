<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
} from "vue";
import ProfileTabListCard from "@/components/admin/ProfileTabListCard.vue";
import StudentDocumentPreviewModal from "@/components/admin/StudentDocumentPreviewModal.vue";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDeleteWithReason } from "@/lib/confirm";
import {
  createStudentDocument,
  deleteStudentDocument,
  downloadStudentDocument,
  getStudentDocumentCategories,
  listStudentDocuments,
  replaceStudentDocument,
} from "@/lib/studentDocuments";
import type {
  StudentDocumentCategories,
} from "@/lib/studentDocuments";
import { formatStudentDateTime } from "@/lib/students/format";
import type {
  Payment,
  StudentDocument,
  StudentDocumentCategory,
  User,
} from "@/lib/types";

const props = defineProps<{
  studentId: number;
}>();

const {
  canViewStudentDocuments,
  canCreateStudentDocuments,
  canUpdateStudentDocuments,
  canDeleteStudentDocuments,
} = usePermissions();

const documents = ref<StudentDocument[]>([]);
const categories = ref<StudentDocumentCategories>(
  {} as StudentDocumentCategories
);

const loading = ref(true);
const uploading = ref(false);
const actionDocumentId = ref<number | null>(null);
const error = ref("");
const success = ref("");

const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const showUploadForm = ref(false);
const uploadCategory =
  ref<StudentDocumentCategory>("contract");
const uploadDescription = ref("");
const uploadFile = ref<File | null>(null);
const uploadInput = ref<HTMLInputElement | null>(
  null
);

const replacementDocument =
  ref<StudentDocument | null>(null);
const replacementInput =
  ref<HTMLInputElement | null>(null);

const previewedDocument =
  ref<StudentDocument | null>(null);

const categoryOptions = computed(() =>
  Object.entries(categories.value) as Array<
    [StudentDocumentCategory, string]
  >
);

const showActions = computed(
  () => canViewStudentDocuments.value
);

function clearMessages() {
  error.value = "";
  success.value = "";
}

function getCategoryLabel(
  category: StudentDocumentCategory
): string {
  return categories.value[category] ?? category;
}

function getPayment(
  document: StudentDocument
): Payment | null {
  return (
    document.relationships?.payment ??
    document.payment ??
    null
  );
}

function getUploader(
  document: StudentDocument
): User | null {
  return (
    document.relationships?.uploaded_by ??
    document.uploader ??
    null
  );
}

function formatFileSize(size: number): string {
  if (!Number.isFinite(size) || size < 0) {
    return "—";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(
    size /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function validateFile(file: File): string | null {
  const allowedMimeTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
  ];

  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() ?? "";

  const allowedExtensions = [
    "pdf",
    "png",
    "jpg",
    "jpeg",
  ];

  if (
    !allowedMimeTypes.includes(file.type) ||
    !allowedExtensions.includes(extension)
  ) {
    return "Selecione um arquivo PDF, PNG, JPG ou JPEG.";
  }

  if (file.size > 10 * 1024 * 1024) {
    return "O documento não pode ser maior que 10 MB.";
  }

  return null;
}

function handleUploadFile(
  event: Event
) {
  clearMessages();

  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;

  if (!file) {
    uploadFile.value = null;
    return;
  }

  const validationError = validateFile(file);

  if (validationError) {
    error.value = validationError;
    uploadFile.value = null;
    input.value = "";
    return;
  }

  uploadFile.value = file;
}

function resetUploadForm() {
  uploadCategory.value = "contract";
  uploadDescription.value = "";
  uploadFile.value = null;

  if (uploadInput.value) {
    uploadInput.value.value = "";
  }
}

async function loadDocuments() {
  const result = await listStudentDocuments({
    page: page.value,
    limit: 10,
    studentId: props.studentId,
  });

  documents.value = result.data;
  lastPage.value = result.last_page;
  total.value = result.total;
}

async function loadPanel() {
  if (!canViewStudentDocuments.value) {
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const [
      loadedCategories,
    ] = await Promise.all([
      getStudentDocumentCategories(),
      loadDocuments(),
    ]);

    categories.value = loadedCategories;
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar os documentos do aluno.";
  } finally {
    loading.value = false;
  }
}

async function submitUpload() {
  clearMessages();

  if (!canCreateStudentDocuments.value) {
    error.value =
      "Você não tem permissão para enviar documentos.";
    return;
  }

  if (!uploadFile.value) {
    error.value = "Selecione um documento.";
    return;
  }

  if (
    uploadCategory.value === "other" &&
    !uploadDescription.value.trim()
  ) {
    error.value =
      "Informe a descrição para a categoria Outro.";
    return;
  }

  uploading.value = true;

  try {
    await createStudentDocument({
      student_id: props.studentId,
      category: uploadCategory.value,
      description:
        uploadDescription.value.trim() || null,
      document: uploadFile.value,
    });

    resetUploadForm();
    showUploadForm.value = false;
    page.value = 1;

    await loadDocuments();

    success.value =
      "Documento enviado com sucesso.";
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao enviar o documento.";
  } finally {
    uploading.value = false;
  }
}

function openPreview(
  document: StudentDocument
) {
  clearMessages();
  previewedDocument.value = document;
}

async function downloadDocument(
  document: StudentDocument
) {
  clearMessages();

  if (!canViewStudentDocuments.value) {
    error.value =
      "Você não tem permissão para baixar documentos.";
    return;
  }

  actionDocumentId.value = document.id;

  try {
    const blob = await downloadStudentDocument(
      document.id
    );
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement(
      "a"
    );

    link.href = url;
    link.download = document.original_name;
    window.document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 0);
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao baixar o documento.";
  } finally {
    actionDocumentId.value = null;
  }
}

function chooseReplacement(
  document: StudentDocument
) {
  clearMessages();

  if (!canUpdateStudentDocuments.value) {
    error.value =
      "Você não tem permissão para substituir documentos.";
    return;
  }

  replacementDocument.value = document;

  if (replacementInput.value) {
    replacementInput.value.value = "";
    replacementInput.value.click();
  }
}

async function handleReplacementFile(
  event: Event
) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;
  const document = replacementDocument.value;

  if (!file || !document) {
    return;
  }

  const validationError = validateFile(file);

  if (validationError) {
    error.value = validationError;
    input.value = "";
    replacementDocument.value = null;
    return;
  }

  actionDocumentId.value = document.id;
  clearMessages();

  try {
    await replaceStudentDocument(
      document.id,
      file
    );

    await loadDocuments();

    success.value =
      "Arquivo substituído com sucesso.";
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao substituir o arquivo.";
  } finally {
    actionDocumentId.value = null;
    replacementDocument.value = null;
    input.value = "";
  }
}

async function removeDocument(
  document: StudentDocument
) {
  clearMessages();

  if (!canDeleteStudentDocuments.value) {
    error.value =
      "Você não tem permissão para excluir documentos.";
    return;
  }

  const reason = await confirmDeleteWithReason({
    entityLabel: "documento",
    itemName: document.original_name,
    message:
      "O arquivo será removido do armazenamento, mas os metadados de auditoria serão preservados.",
    reasonLabel: "Motivo da exclusão",
    reasonPlaceholder:
      "Exemplo: documento enviado ao aluno incorreto.",
  });

  if (!reason) {
    return;
  }

  actionDocumentId.value = document.id;

  try {
    await deleteStudentDocument(
      document.id,
      reason
    );

    if (
      documents.value.length === 1 &&
      page.value > 1
    ) {
      page.value -= 1;
    }

    await loadDocuments();

    success.value =
      "Documento excluído com sucesso.";
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao excluir o documento.";
  } finally {
    actionDocumentId.value = null;
  }
}

async function goToPage(nextPage: number) {
  if (
    nextPage < 1 ||
    nextPage > lastPage.value ||
    nextPage === page.value
  ) {
    return;
  }

  clearMessages();
  page.value = nextPage;
  loading.value = true;

  try {
    await loadDocuments();
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar os documentos.";
  } finally {
    loading.value = false;
  }
}

onMounted(loadPanel);
</script>

<template>
  <div class="student-documents">
    <div
      v-if="!canViewStudentDocuments"
      class="alert alert-warning mt-3 mb-0"
    >
      Você não tem permissão para visualizar os documentos deste aluno.
    </div>

    <template v-else>
      <div v-if="error" class="alert alert-danger mt-3 mb-0">
        {{ error }}
      </div>

      <div v-if="success" class="alert alert-success mt-3 mb-0">
        {{ success }}
      </div>

      <form
        v-if="
          showUploadForm &&
          canCreateStudentDocuments
        "
        class="card border mt-3 mb-3"
        @submit.prevent="submitUpload"
      >
        <div class="card-body">
          <h5 class="mb-3">
            Novo documento
          </h5>

          <div class="row">
            <div class="col-md-5 mb-3">
              <label
                for="student-document-category"
                class="form-label"
              >
                Categoria
                <span class="text-danger">*</span>
              </label>

              <select
                id="student-document-category"
                v-model="uploadCategory"
                class="form-select"
                required
              >
                <option
                  v-for="[
                    value,
                    label,
                  ] in categoryOptions"
                  :key="value"
                  :value="value"
                >
                  {{ label }}
                </option>
              </select>
            </div>

            <div class="col-md-7 mb-3">
              <label
                for="student-document-file"
                class="form-label"
              >
                Arquivo
                <span class="text-danger">*</span>
              </label>

              <input
                id="student-document-file"
                ref="uploadInput"
                type="file"
                class="form-control"
                accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                required
                @change="handleUploadFile"
              />

              <small class="text-muted">
                PDF, PNG ou JPEG, com no máximo
                10 MB.
              </small>
            </div>

            <div
              v-if="uploadCategory === 'other'"
              class="col-12 mb-3"
            >
              <label
                for="student-document-description"
                class="form-label"
              >
                Descrição
                <span class="text-danger">*</span>
              </label>

              <textarea
                id="student-document-description"
                v-model="uploadDescription"
                class="form-control"
                rows="3"
                maxlength="2000"
                required
                placeholder="Descreva o conteúdo do documento."
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="uploading"
          >
            <span
              v-if="uploading"
              class="spinner-border spinner-border-sm me-1"
              aria-hidden="true"
            ></span>
            {{
              uploading
                ? "Enviando..."
                : "Enviar documento"
            }}
          </button>
        </div>
      </form>

      <input
        ref="replacementInput"
        type="file"
        class="d-none"
        accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
        @change="handleReplacementFile"
      />

      <ProfileTabListCard
        title="Lista de documentos"
        :total="total"
        :loading="loading"
        :page="page"
        :last-page="lastPage"
        :read-only="!showActions"
        @update:page="goToPage"
      >
        <template #actions>
          <button
            v-if="canCreateStudentDocuments"
            type="button"
            class="btn btn-primary btn-sm"
            @click="
              showUploadForm = !showUploadForm;
              clearMessages();
            "
          >
            <i
              class="la me-1"
              :class="showUploadForm ? 'la-times' : 'la-upload'"
            ></i>
            {{ showUploadForm ? "Cancelar" : "Enviar documento" }}
          </button>
        </template>

        <thead>
          <tr>
            <th>Documento</th>
            <th>Enviado por</th>
            <th class="text-nowrap">Data</th>
            <th v-if="showActions" class="text-end text-nowrap">Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="!documents.length">
            <td
              :colspan="showActions ? 4 : 3"
              class="text-center text-muted"
            >
              Nenhum documento foi vinculado a este aluno.
            </td>
          </tr>

          <tr v-for="document in documents" :key="document.id">
            <td>
              <div class="document-summary">
                <div class="document-icon" aria-hidden="true">
                  <i class="la la-file-alt"></i>
                </div>

                <div class="document-details">
                  <button
                    type="button"
                    class="document-name"
                    :title="document.original_name"
                    @click="openPreview(document)"
                  >
                    {{ document.original_name }}
                  </button>

                  <div class="document-metadata">
                    <span class="badge badge-light text-dark">
                      {{ getCategoryLabel(document.category) }}
                    </span>

                    <span class="document-size">
                      {{ formatFileSize(document.size) }}
                    </span>

                    <span
                      v-if="getPayment(document)"
                      class="badge badge-info"
                    >
                      Pagamento #{{ getPayment(document)?.id }}
                    </span>
                  </div>

                  <div
                    v-if="document.description"
                    class="document-description"
                  >
                    {{ document.description }}
                  </div>
                </div>
              </div>
            </td>

            <td>
              {{
                getUploader(document)?.name ??
                `Usuário #${document.uploaded_by}`
              }}
            </td>

            <td class="text-nowrap">
              {{ formatStudentDateTime(document.created_at) }}
            </td>

            <td v-if="showActions" class="text-end text-nowrap">
              <button
                type="button"
                class="btn btn-xs sharp btn-primary me-1"
                title="Baixar documento"
                aria-label="Baixar documento"
                :disabled="actionDocumentId === document.id"
                @click="downloadDocument(document)"
              >
                <i class="fa fa-download"></i>
              </button>

              <button
                v-if="canUpdateStudentDocuments"
                type="button"
                class="btn btn-xs sharp btn-primary me-1"
                title="Substituir arquivo"
                aria-label="Substituir arquivo"
                :disabled="actionDocumentId === document.id"
                @click="chooseReplacement(document)"
              >
                <i class="fa fa-sync"></i>
              </button>

              <button
                v-if="canDeleteStudentDocuments"
                type="button"
                class="btn btn-xs sharp btn-danger"
                title="Excluir documento"
                aria-label="Excluir documento"
                :disabled="actionDocumentId === document.id"
                @click="removeDocument(document)"
              >
                <i class="fa fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </ProfileTabListCard>
    </template>

    <StudentDocumentPreviewModal
      :document="previewedDocument"
      @close="previewedDocument = null"
    />
  </div>
</template>

<style scoped>
.student-documents .document-summary {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}

.student-documents .document-icon {
  display: flex;
  flex: 0 0 36px;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-top: 1px;
  color: var(--primary);
  font-size: 22px;
  background-color: #f7edf1;
  border-radius: 8px;
}

.student-documents .document-details {
  min-width: 0;
}

.student-documents .document-name {
  display: -webkit-box;
  max-width: 100%;
  padding: 0;
  overflow: hidden;
  color: var(--primary);
  font: inherit;
  font-weight: 700;
  line-height: 1.35;
  text-align: left;
  text-decoration: none;
  overflow-wrap: anywhere;
  background: transparent;
  border: 0;
  cursor: pointer;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.student-documents .document-name:hover,
.student-documents .document-name:focus-visible {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.student-documents .document-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 7px;
}

.student-documents .document-size {
  color: #7e7e7e;
  font-size: 0.875rem;
}

.student-documents .document-size::before {
  margin-right: 6px;
  color: #b5b5b5;
  content: "•";
}

.student-documents .document-description {
  display: -webkit-box;
  margin-top: 6px;
  overflow: hidden;
  color: #7e7e7e;
  font-size: 0.875rem;
  line-height: 1.4;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.student-documents .badge-light {
  background-color: #f2f2f2;
}
</style>
