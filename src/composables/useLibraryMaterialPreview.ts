import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  downloadLibraryMaterial,
  getLibraryFileKind,
} from "@/lib/library";
import { blobToDataUrl, renderPdfFirstPage } from "@/lib/pdfPreview";
import type { LibraryMaterial } from "@/lib/types";

const previewCache = new Map<number, string>();

let activeLoads = 0;
const loadQueue: Array<() => void> = [];
const MAX_CONCURRENT_LOADS = 2;

async function acquireLoadSlot(): Promise<void> {
  if (activeLoads < MAX_CONCURRENT_LOADS) {
    activeLoads += 1;
    return;
  }

  await new Promise<void>((resolve) => {
    loadQueue.push(resolve);
  });

  activeLoads += 1;
}

function releaseLoadSlot(): void {
  activeLoads = Math.max(0, activeLoads - 1);
  const next = loadQueue.shift();

  next?.();
}

export function useLibraryMaterialPreview(
  material: () => LibraryMaterial,
  options: { enabled?: () => boolean } = {}
) {
  const previewSrc = ref<string | null>(null);
  const loading = ref(false);
  const failed = ref(false);
  const rootRef = ref<HTMLElement | null>(null);

  let observer: IntersectionObserver | null = null;
  let cancelled = false;
  let hasRequested = false;

  const isPreviewable = () => {
    const kind = getLibraryFileKind(material());

    return kind === "pdf" || kind === "image";
  };

  async function loadPreview() {
    const item = material();

    if (
      !isPreviewable() ||
      previewSrc.value ||
      loading.value ||
      failed.value ||
      cancelled ||
      hasRequested
    ) {
      return;
    }

    hasRequested = true;

    const cached = previewCache.get(item.id);

    if (cached) {
      previewSrc.value = cached;
      return;
    }

    loading.value = true;

    try {
      await acquireLoadSlot();

      if (cancelled) {
        return;
      }

      const blob = await downloadLibraryMaterial(item.id);

      if (cancelled) {
        return;
      }

      const kind = getLibraryFileKind(item);
      const src =
        kind === "pdf"
          ? await renderPdfFirstPage(blob)
          : await blobToDataUrl(blob);

      if (cancelled) {
        return;
      }

      previewCache.set(item.id, src);
      previewSrc.value = src;
    } catch {
      if (!cancelled) {
        failed.value = true;
      }
    } finally {
      releaseLoadSlot();

      if (!cancelled) {
        loading.value = false;
      }
    }
  }

  function setupObserver() {
    observer?.disconnect();
    observer = null;

    if (cancelled || !rootRef.value || !isPreviewable()) {
      return;
    }

    const cached = previewCache.get(material().id);

    if (cached) {
      previewSrc.value = cached;
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadPreview();
          observer?.disconnect();
        }
      },
      { rootMargin: "120px" }
    );

    observer.observe(rootRef.value);
  }

  onMounted(() => {
    if (options.enabled && !options.enabled()) {
      return;
    }

    setupObserver();
  });

  watch(
    () => material().id,
    () => {
      previewSrc.value = previewCache.get(material().id) ?? null;
      failed.value = false;
      hasRequested = false;
      setupObserver();
    }
  );

  onBeforeUnmount(() => {
    cancelled = true;
    observer?.disconnect();
  });

  return {
    previewSrc,
    loading,
    failed,
    rootRef,
    isPreviewable,
    loadPreview,
  };
}

export function getCachedLibraryMaterialPreview(
  materialId: number
): string | null {
  return previewCache.get(materialId) ?? null;
}
