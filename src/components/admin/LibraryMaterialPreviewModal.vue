<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import {
  downloadLibraryMaterial,
  getLibraryFileKind,
} from "@/lib/library";
import { blobToDataUrl, renderPdfFirstPage } from "@/lib/pdfPreview";
import { getCachedLibraryMaterialPreview } from "@/composables/useLibraryMaterialPreview";
import type { LibraryMaterial } from "@/lib/types";

const props = defineProps<{
  material: LibraryMaterial | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const previewSrc = ref("");
const loading = ref(false);
const error = ref("");

const kind = computed(() =>
  props.material ? getLibraryFileKind(props.material) : "other"
);

const isImage = computed(() => kind.value === "image");
const isPdf = computed(() => kind.value === "pdf");

function releasePreviewUrl() {
  if (!previewSrc.value || previewSrc.value.startsWith("data:")) {
    previewSrc.value = "";
    return;
  }

  URL.revokeObjectURL(previewSrc.value);
  previewSrc.value = "";
}

function closeModal() {
  emit("close");
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.material) {
    closeModal();
  }
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
  releasePreviewUrl();
  loading.value = true;
  error.value = "";

  const requestedId = material.id;

  try {
    const cached = getCachedLibraryMaterialPreview(requestedId);

    if (cached) {
      if (props.material?.id === requestedId) {
        previewSrc.value = cached;
      }
      return;
    }

    const blob = await downloadLibraryMaterial(requestedId);

    if (props.material?.id !== requestedId) {
      return;
    }

    previewSrc.value =
      getLibraryFileKind(material) === "pdf"
        ? await renderPdfFirstPage(blob, 960)
        : await blobToDataUrl(blob);
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

    releasePreviewUrl();
    loading.value = false;
    error.value = "";
  },
  { immediate: true }
);

onMounted(() => {
  window.document.body.style.overflow = "hidden";
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.document.body.style.overflow = "";
  window.removeEventListener("keydown", handleKeydown);
  releasePreviewUrl();
});
</script>

<template>
  <div
    v-if="material"
    class="library-material-preview"
    @click.self="closeModal"
  >
    <div
      class="library-material-preview__dialog"
      role="dialog"
      aria-modal="true"
      :aria-label="material.title"
    >
      <header class="library-material-preview__header">
        <div>
          <h5 class="mb-1">{{ material.title }}</h5>
          <p class="text-muted mb-0 small">
            {{ material.original_name }}
          </p>
        </div>

        <div class="d-flex gap-2">
          <button
            type="button"
            class="btn btn-sm btn-outline-primary"
            :disabled="loading"
            @click="downloadCurrentMaterial"
          >
            <i class="la la-download me-1"></i>
            Baixar
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="closeModal"
          >
            Fechar
          </button>
        </div>
      </header>

      <div class="library-material-preview__body">
        <div
          v-if="loading"
          class="library-material-preview__state"
        >
          Carregando visualização...
        </div>

        <div
          v-else-if="error"
          class="library-material-preview__state text-danger"
        >
          {{ error }}
        </div>

        <img
          v-else-if="previewSrc && isImage"
          :src="previewSrc"
          :alt="material.title"
          class="library-material-preview__image"
        />

        <img
          v-else-if="previewSrc && isPdf"
          :src="previewSrc"
          :alt="material.title"
          class="library-material-preview__pdf"
        />

        <div
          v-else
          class="library-material-preview__state"
        >
          Visualização indisponível para este tipo de arquivo.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.library-material-preview {
  position: fixed;
  inset: 0;
  z-index: 1060;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.72);
}

.library-material-preview__dialog {
  display: flex;
  flex-direction: column;
  width: min(960px, 100%);
  max-height: calc(100vh - 3rem);
  overflow: hidden;
  background: var(--card, #fff);
  border-radius: 16px;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.28);
}

.library-material-preview__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border, #eee);
}

.library-material-preview__body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  padding: 1.25rem;
  overflow: auto;
  background: #f4f6f8;
}

.library-material-preview__state {
  padding: 2rem;
  text-align: center;
  color: var(--text, #666);
}

.library-material-preview__image,
.library-material-preview__pdf {
  display: block;
  max-width: 100%;
  max-height: calc(100vh - 12rem);
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  background: #fff;
}

@media (max-width: 767px) {
  .library-material-preview {
    padding: 0.75rem;
  }

  .library-material-preview__header {
    flex-direction: column;
  }
}
</style>
