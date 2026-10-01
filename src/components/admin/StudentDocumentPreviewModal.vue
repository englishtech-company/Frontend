<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import MediaPreviewModal from "@/components/ui/MediaPreviewModal.vue";
import { useBlobPreviewSrc } from "@/composables/useBlobPreviewSrc";
import { downloadStudentDocument } from "@/lib/studentDocuments";
import type { StudentDocument } from "@/lib/types";

const props = defineProps<{
  document: StudentDocument | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const loading = ref(false);
const error = ref("");
const { previewSrc, releasePreviewSrc, setPreviewSrc } = useBlobPreviewSrc();

const isImage = computed(
  () => props.document?.mime_type.startsWith("image/") ?? false
);

const isPdf = computed(
  () => props.document?.mime_type === "application/pdf"
);

function closeModal() {
  emit("close");
}

async function downloadCurrentDocument() {
  if (!props.document) {
    return;
  }

  try {
    const blob = await downloadStudentDocument(props.document.id);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = props.document.original_name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao baixar o documento.";
  }
}

async function loadPreview(document: StudentDocument) {
  releasePreviewSrc();
  loading.value = true;
  error.value = "";

  const requestedDocumentId = document.id;

  try {
    const blob = await downloadStudentDocument(requestedDocumentId);

    if (props.document?.id !== requestedDocumentId) {
      return;
    }

    setPreviewSrc(URL.createObjectURL(blob));
  } catch (exception) {
    if (props.document?.id !== requestedDocumentId) {
      return;
    }

    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar a visualização do documento.";
  } finally {
    if (props.document?.id === requestedDocumentId) {
      loading.value = false;
    }
  }
}

watch(
  () => props.document,
  (document) => {
    if (!document) {
      releasePreviewSrc();
      error.value = "";
      loading.value = false;
      return;
    }

    loadPreview(document);
  }
);
</script>

<template>
  <MediaPreviewModal
    :open="!!document"
    :title="document?.original_name ?? ''"
    subtitle="Visualização privada"
    loading-label="Carregando documento..."
    :loading="loading"
    :error="error"
    :preview-src="previewSrc"
    :is-image="isImage"
    :is-pdf="isPdf"
    pdf-mode="iframe"
    :download-disabled="!previewSrc"
    @close="closeModal"
    @download="downloadCurrentDocument"
  />
</template>
