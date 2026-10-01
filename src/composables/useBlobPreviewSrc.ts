import { ref } from "vue";

export function useBlobPreviewSrc() {
  const previewSrc = ref("");

  function releasePreviewSrc() {
    if (!previewSrc.value) {
      return;
    }

    if (!previewSrc.value.startsWith("data:")) {
      URL.revokeObjectURL(previewSrc.value);
    }

    previewSrc.value = "";
  }

  function setPreviewSrc(value: string) {
    releasePreviewSrc();
    previewSrc.value = value;
  }

  return {
    previewSrc,
    releasePreviewSrc,
    setPreviewSrc,
  };
}
