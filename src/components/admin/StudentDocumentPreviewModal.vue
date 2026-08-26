<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { downloadStudentDocument } from "@/lib/studentDocuments";
import type { StudentDocument } from "@/lib/types";

const props = defineProps<{
  document: StudentDocument | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const previewUrl = ref("");
const loading = ref(false);
const error = ref("");

const isImage = computed(() =>
  props.document?.mime_type.startsWith(
    "image/"
  ) ?? false
);

const isPdf = computed(
  () =>
    props.document?.mime_type ===
    "application/pdf"
);

function releasePreviewUrl() {
  if (!previewUrl.value) {
    return;
  }

  URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = "";
}

function restorePageScroll() {
  window.document.body.style.overflow = "";
}

function closeModal() {
  emit("close");
}

function handleKeydown(event: KeyboardEvent) {
  if (
    event.key === "Escape" &&
    props.document
  ) {
    closeModal();
  }
}

function downloadCurrentDocument() {
  if (
    !props.document ||
    !previewUrl.value
  ) {
    return;
  }

  const link = window.document.createElement(
    "a"
  );

  link.href = previewUrl.value;
  link.download = props.document.original_name;
  window.document.body.appendChild(link);
  link.click();
  link.remove();
}

async function loadPreview(
  document: StudentDocument
) {
  releasePreviewUrl();
  loading.value = true;
  error.value = "";

  const requestedDocumentId = document.id;

  try {
    const blob = await downloadStudentDocument(
      requestedDocumentId
    );

    if (
      props.document?.id !==
      requestedDocumentId
    ) {
      return;
    }

    previewUrl.value =
      URL.createObjectURL(blob);
  } catch (exception) {
    if (
      props.document?.id !==
      requestedDocumentId
    ) {
      return;
    }

    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar a visualização do documento.";
  } finally {
    if (
      props.document?.id ===
      requestedDocumentId
    ) {
      loading.value = false;
    }
  }
}

watch(
  () => props.document,
  (document) => {
    if (!document) {
      releasePreviewUrl();
      restorePageScroll();
      error.value = "";
      loading.value = false;
      return;
    }

    window.document.body.style.overflow =
      "hidden";

    loadPreview(document);
  }
);

onMounted(() => {
  window.addEventListener(
    "keydown",
    handleKeydown
  );
});

onBeforeUnmount(() => {
  window.removeEventListener(
    "keydown",
    handleKeydown
  );

  releasePreviewUrl();
  restorePageScroll();
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="document"
      class="student-document-preview"
      role="presentation"
      @click.self="closeModal"
    >
      <section
        class="student-document-preview__dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="`Visualização de ${document.original_name}`"
      >
        <header
          class="student-document-preview__header"
        >
          <div class="min-width-0">
            <h5 class="mb-1 text-truncate">
              {{ document.original_name }}
            </h5>

            <span class="small text-muted">
              Visualização privada
            </span>
          </div>

          <div class="d-flex gap-2">
            <button
              type="button"
              class="btn btn-sm btn-outline-primary"
              :disabled="!previewUrl"
              title="Baixar documento"
              @click="downloadCurrentDocument"
            >
              <i class="la la-download me-1"></i>
              Baixar
            </button>

            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              title="Fechar visualização"
              aria-label="Fechar visualização"
              @click="closeModal"
            >
              <i class="la la-times"></i>
            </button>
          </div>
        </header>

        <div
          class="student-document-preview__body"
        >
          <div
            v-if="loading"
            class="student-document-preview__state"
          >
            <span
              class="spinner-border text-primary"
              aria-hidden="true"
            ></span>
            <span>Carregando documento...</span>
          </div>

          <div
            v-else-if="error"
            class="student-document-preview__state"
          >
            <div
              class="alert alert-danger mb-0"
            >
              {{ error }}
            </div>
          </div>

          <img
            v-else-if="previewUrl && isImage"
            :src="previewUrl"
            :alt="document.original_name"
            class="student-document-preview__image"
          />

          <iframe
            v-else-if="previewUrl && isPdf"
            :src="previewUrl"
            :title="document.original_name"
            class="student-document-preview__pdf"
          ></iframe>

          <div
            v-else
            class="student-document-preview__state"
          >
            <div
              class="alert alert-warning mb-0"
            >
              Este formato não possui visualização
              disponível.
            </div>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.student-document-preview {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(20, 20, 20, 0.72);
  backdrop-filter: blur(2px);
}

.student-document-preview__dialog {
  display: flex;
  flex-direction: column;
  width: min(1100px, 92vw);
  height: min(850px, 88vh);
  overflow: hidden;
  background: #fff;
  border-radius: 12px;
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.35);
}

.student-document-preview__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e5e5;
}

.student-document-preview__body {
  display: flex;
  flex: 1;
  min-height: 0;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 16px;
  background: #f4f4f4;
}

.student-document-preview__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 220px;
}

.student-document-preview__image {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.student-document-preview__pdf {
  width: 100%;
  height: 100%;
  min-height: 500px;
  border: 0;
  background: #fff;
}

.min-width-0 {
  min-width: 0;
}

@media (max-width: 767.98px) {
  .student-document-preview {
    padding: 8px;
  }

  .student-document-preview__dialog {
    width: 100%;
    height: 94vh;
  }

  .student-document-preview__header {
    align-items: flex-start;
    padding: 12px;
  }

  .student-document-preview__body {
    padding: 8px;
  }

  .student-document-preview__pdf {
    min-height: 400px;
  }
}
</style>
