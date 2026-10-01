<script lang="ts" setup>
import { onBeforeUnmount, onMounted, watch } from "vue";

export type MediaPreviewPdfMode = "image" | "iframe";

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    subtitle?: string;
    loading?: boolean;
    error?: string;
    previewSrc?: string;
    isImage?: boolean;
    isPdf?: boolean;
    pdfMode?: MediaPreviewPdfMode;
    downloadDisabled?: boolean;
    downloadLabel?: string;
    closeLabel?: string;
    loadingLabel?: string;
    unavailableLabel?: string;
  }>(),
  {
    subtitle: "",
    loading: false,
    error: "",
    previewSrc: "",
    isImage: false,
    isPdf: false,
    pdfMode: "iframe",
    downloadDisabled: false,
    downloadLabel: "Baixar",
    closeLabel: "Fechar",
    loadingLabel: "Carregando visualização...",
    unavailableLabel: "Visualização indisponível para este tipo de arquivo.",
  }
);

const emit = defineEmits<{
  close: [];
  download: [];
}>();

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.open) {
    emit("close");
  }
}

function syncBodyScroll(open: boolean) {
  window.document.body.style.overflow = open ? "hidden" : "";
}

watch(
  () => props.open,
  (open) => syncBodyScroll(open),
  { immediate: true }
);

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  syncBodyScroll(false);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="media-preview-modal"
      role="presentation"
      @click.self="emit('close')"
    >
      <section
        class="media-preview-modal__dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <header class="media-preview-modal__header">
          <div class="media-preview-modal__titles min-width-0">
            <h5 class="mb-1 text-truncate">{{ title }}</h5>
            <p v-if="subtitle" class="text-muted mb-0 small">
              {{ subtitle }}
            </p>
          </div>

          <div class="d-flex gap-2 flex-shrink-0">
            <button
              type="button"
              class="btn btn-sm btn-outline-primary"
              :disabled="downloadDisabled || loading"
              @click="emit('download')"
            >
              <i class="la la-download me-1"></i>
              {{ downloadLabel }}
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              :aria-label="closeLabel"
              @click="emit('close')"
            >
              <i class="la la-times"></i>
            </button>
          </div>
        </header>

        <div class="media-preview-modal__body">
          <div
            v-if="loading"
            class="media-preview-modal__state"
          >
            <span
              class="spinner-border text-primary"
              aria-hidden="true"
            ></span>
            <span>{{ loadingLabel }}</span>
          </div>

          <div
            v-else-if="error"
            class="media-preview-modal__state"
          >
            <div class="alert alert-danger mb-0">{{ error }}</div>
          </div>

          <img
            v-else-if="previewSrc && isImage"
            :src="previewSrc"
            :alt="title"
            class="media-preview-modal__image"
          />

          <img
            v-else-if="previewSrc && isPdf && pdfMode === 'image'"
            :src="previewSrc"
            :alt="title"
            class="media-preview-modal__image"
          />

          <iframe
            v-else-if="previewSrc && isPdf && pdfMode === 'iframe'"
            :src="previewSrc"
            :title="title"
            class="media-preview-modal__pdf"
          ></iframe>

          <div
            v-else
            class="media-preview-modal__state"
          >
            <div class="alert alert-warning mb-0">
              {{ unavailableLabel }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.media-preview-modal {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(2px);
}

.media-preview-modal__dialog {
  display: flex;
  flex-direction: column;
  width: min(1100px, 92vw);
  height: min(850px, 88vh);
  max-height: calc(100vh - 3rem);
  overflow: hidden;
  background: var(--card, #fff);
  border-radius: 12px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
}

.media-preview-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border, #e5e5e5);
}

.media-preview-modal__body {
  display: flex;
  flex: 1;
  min-height: 0;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 1rem;
  background: #f4f6f8;
}

.media-preview-modal__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 220px;
  padding: 1rem;
  text-align: center;
}

.media-preview-modal__image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  background: #fff;
}

.media-preview-modal__pdf {
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
  .media-preview-modal {
    padding: 0.5rem;
  }

  .media-preview-modal__dialog {
    width: 100%;
    height: 94vh;
  }

  .media-preview-modal__header {
    flex-direction: column;
    align-items: stretch;
  }

  .media-preview-modal__pdf {
    min-height: 400px;
  }
}
</style>
