<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import MediaPreviewModal from "@/components/ui/MediaPreviewModal.vue";
import { useBlobPreviewSrc } from "@/composables/useBlobPreviewSrc";
import { getCachedLibraryMaterialPreview } from "@/composables/useLibraryMaterialPreview";
import {
  downloadLibraryMaterial,
  getLibraryFileKind,
} from "@/lib/library";
import { blobToDataUrl, renderPdfFirstPage } from "@/lib/pdfPreview";
import type { LibraryMaterial } from "@/lib/types";

const props = defineProps<{
  material: LibraryMaterial | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const loading = ref(false);
const error = ref("");
const { previewSrc, releasePreviewSrc, setPreviewSrc } = useBlobPreviewSrc();

const kind = computed(() =>
  props.material ? getLibraryFileKind(props.material) : "other"
);

const isImage = computed(() => kind.value === "image");
const isPdf = computed(() => kind.value === "pdf");

function closeModal() {
  emit("close");
}

async function downloadCurrentMaterial() {
  if (!props.material) {
    return;
  }

  try {
    const blob = await downloadLibraryMaterial(props.material.id);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = props.material.original_name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao baixar o material.";
  }
}

async function loadPreview(material: LibraryMaterial) {
  releasePreviewSrc();
  loading.value = true;
  error.value = "";

  const requestedId = material.id;

  try {
    const cached = getCachedLibraryMaterialPreview(requestedId);

    if (cached) {
      if (props.material?.id === requestedId) {
        setPreviewSrc(cached);
      }
      return;
    }

    const blob = await downloadLibraryMaterial(requestedId);

    if (props.material?.id !== requestedId) {
      return;
    }

    const src =
      getLibraryFileKind(material) === "pdf"
        ? await renderPdfFirstPage(blob, 960)
        : await blobToDataUrl(blob);

    setPreviewSrc(src);
  } catch (exception) {
    if (props.material?.id !== requestedId) {
      return;
    }

    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar a visualização do material.";
  } finally {
    if (props.material?.id === requestedId) {
      loading.value = false;
    }
  }
}

watch(
  () => props.material,
  (material) => {
    if (material) {
      loadPreview(material);
      return;
    }

    releasePreviewSrc();
    loading.value = false;
    error.value = "";
  },
  { immediate: true }
);
</script>

<template>
  <MediaPreviewModal
    :open="!!material"
    :title="material?.title ?? ''"
    :subtitle="material?.original_name"
    :loading="loading"
    :error="error"
    :preview-src="previewSrc"
    :is-image="isImage"
    :is-pdf="isPdf"
    pdf-mode="image"
    @close="closeModal"
    @download="downloadCurrentMaterial"
  />
</template>
