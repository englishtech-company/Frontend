<script lang="ts" setup>
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import LibraryMaterialPreviewModal from "@/components/admin/LibraryMaterialPreviewModal.vue";
import { useLibraryMaterialPreview } from "@/composables/useLibraryMaterialPreview";
import {
  formatFileSize,
  getLibraryFileIcon,
  getLibraryFileKind,
  getLibraryFileLabel,
  getLibraryMaterialCategory,
} from "@/lib/library";
import type { LibraryMaterial } from "@/lib/types";

const props = withDefaults(
  defineProps<{
    material: LibraryMaterial;
    showCategory?: boolean;
    showStudentCount?: boolean;
    accessLabel?: string | null;
    canAssign?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
  }>(),
  {
    showCategory: true,
    showStudentCount: true,
    accessLabel: null,
    canAssign: false,
    canEdit: false,
    canDelete: false,
  }
);

defineEmits<{
  download: [];
  assign: [];
  delete: [];
}>();

const previewOpen = ref(false);

const kind = computed(() => getLibraryFileKind(props.material));
const category = computed(() => getLibraryMaterialCategory(props.material));
const studentCount = computed(
  () => props.material.students_count ?? props.material.students?.length ?? 0
);

const {
  previewSrc,
  loading: previewLoading,
  failed: previewFailed,
  rootRef,
  isPreviewable,
} = useLibraryMaterialPreview(() => props.material);

function openPreview() {
  if (!isPreviewable()) {
    return;
  }

  previewOpen.value = true;
}
</script>

<template>
  <article ref="rootRef" class="library-file-card" :data-kind="kind">
    <button
      type="button"
      class="library-file-card__preview"
      :class="{
        'has-thumbnail': Boolean(previewSrc),
        'is-loading': previewLoading,
      }"
      :disabled="!isPreviewable()"
      :title="isPreviewable() ? 'Visualizar material' : undefined"
      @click="openPreview"
    >
      <img
        v-if="previewSrc"
        :src="previewSrc"
        :alt="`Pré-visualização de ${material.title}`"
        class="library-file-card__thumbnail"
      />

      <div
        v-else-if="previewLoading"
        class="library-file-card__preview-state"
      >
        <span class="library-file-card__spinner" aria-hidden="true"></span>
      </div>

      <template v-else>
        <i :class="getLibraryFileIcon(kind)" aria-hidden="true"></i>
        <span class="library-file-card__kind">
          {{ previewFailed ? "Sem preview" : getLibraryFileLabel(kind) }}
        </span>
      </template>

      <span
        v-if="previewSrc && kind === 'pdf'"
        class="library-file-card__preview-badge"
      >
        PDF
      </span>
    </button>

    <div class="library-file-card__body">
      <h3 class="library-file-card__title" :title="material.title">
        {{ material.title }}
      </h3>
      <p v-if="material.description" class="library-file-card__description">
        {{ material.description }}
      </p>

      <div class="library-file-card__meta">
        <RouterLink
          v-if="showCategory && category"
          :to="`/library/categories/${category.id}`"
          class="library-file-card__badge"
        >
          {{ category.name }}
        </RouterLink>
        <span v-if="accessLabel" class="library-file-card__badge is-access">
          {{ accessLabel }}
        </span>
        <span
          v-if="showStudentCount"
          class="library-file-card__badge is-muted"
        >
          {{ studentCount }}
          {{ studentCount === 1 ? "aluno" : "alunos" }}
        </span>
      </div>

      <p class="library-file-card__file" :title="material.original_name">
        {{ material.original_name }}
        <span>{{ formatFileSize(material.size) }}</span>
      </p>
    </div>

    <div class="library-file-card__actions">
      <button
        type="button"
        class="btn btn-xs sharp btn-info"
        title="Baixar"
        @click="$emit('download')"
      >
        <i class="la la-download"></i>
      </button>
      <button
        v-if="canAssign"
        type="button"
        class="btn btn-xs sharp btn-success"
        title="Atribuir material aos alunos"
        @click="$emit('assign')"
      >
        <i class="la la-user-plus"></i>
      </button>
      <RouterLink
        v-if="canEdit"
        :to="`/library/materials/${material.id}/edit`"
        class="btn btn-xs sharp btn-primary"
        title="Editar"
      >
        <i class="fa fa-pencil"></i>
      </RouterLink>
      <button
        v-if="canDelete"
        type="button"
        class="btn btn-xs sharp btn-danger"
        title="Remover"
        @click="$emit('delete')"
      >
        <i class="fa fa-trash"></i>
      </button>
    </div>

    <LibraryMaterialPreviewModal
      v-if="previewOpen"
      :material="material"
      @close="previewOpen = false"
    />
  </article>
</template>

<style scoped>
.library-file-card {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border, #eee);
  border-radius: 12px;
  box-shadow: 0 6px 24px 0 rgba(53, 55, 81, 0.06);
}

.library-file-card__preview {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  min-height: 168px;
  padding: 0;
  border: 0;
  color: #fff;
  background: #448ee4;
  cursor: pointer;
  overflow: hidden;
}

.library-file-card__preview:disabled {
  cursor: default;
}

.library-file-card__preview.has-thumbnail {
  background: #f4f6f8;
}

.library-file-card__preview.is-loading {
  background: #eef2f6;
}

.library-file-card[data-kind="pdf"] .library-file-card__preview:not(.has-thumbnail):not(.is-loading) {
  background: #c0392b;
}

.library-file-card[data-kind="image"] .library-file-card__preview:not(.has-thumbnail):not(.is-loading) {
  background: #8e44ad;
}

.library-file-card[data-kind="audio"] .library-file-card__preview:not(.has-thumbnail):not(.is-loading) {
  background: #16a085;
}

.library-file-card[data-kind="video"] .library-file-card__preview:not(.has-thumbnail):not(.is-loading) {
  background: #2980b9;
}

.library-file-card[data-kind="word"] .library-file-card__preview:not(.has-thumbnail):not(.is-loading) {
  background: #2b579a;
}

.library-file-card[data-kind="excel"] .library-file-card__preview:not(.has-thumbnail):not(.is-loading) {
  background: #217346;
}

.library-file-card[data-kind="powerpoint"] .library-file-card__preview:not(.has-thumbnail):not(.is-loading) {
  background: #b7472a;
}

.library-file-card[data-kind="archive"] .library-file-card__preview:not(.has-thumbnail):not(.is-loading) {
  background: #d68910;
}

.library-file-card[data-kind="text"] .library-file-card__preview:not(.has-thumbnail):not(.is-loading) {
  background: #5d6d7e;
}

.library-file-card__thumbnail {
  display: block;
  width: 100%;
  height: 168px;
  object-fit: cover;
  object-position: top center;
  background: #fff;
}

.library-file-card__preview-state {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 168px;
}

.library-file-card__spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid rgba(68, 142, 228, 0.2);
  border-top-color: #448ee4;
  border-radius: 50%;
  animation: library-preview-spin 0.8s linear infinite;
}

.library-file-card__preview i {
  font-size: 2.4rem;
  line-height: 1;
}

.library-file-card__kind {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.library-file-card__preview-badge {
  position: absolute;
  top: 0.55rem;
  left: 0.55rem;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: rgba(192, 57, 43, 0.92);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.library-file-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.45rem;
  padding: 1rem 1rem 0.5rem;
}

.library-file-card__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--text-dark);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.library-file-card__description {
  margin: 0;
  font-size: 0.82rem;
  color: var(--text, #888);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.library-file-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.library-file-card__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(68, 142, 228, 0.12);
  color: #448ee4;
  font-size: 0.72rem;
  font-weight: 600;
  text-decoration: none;
}

.library-file-card__badge.is-access {
  background: rgba(39, 174, 96, 0.12);
  color: #1e8449;
}

.library-file-card__badge.is-muted {
  background: rgba(0, 0, 0, 0.06);
  color: var(--text, #666);
}

.library-file-card__file {
  margin: auto 0 0;
  padding-top: 0.35rem;
  font-size: 0.75rem;
  color: var(--text, #888);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.library-file-card__file span {
  display: block;
  margin-top: 0.1rem;
}

.library-file-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: 0.75rem 1rem 1rem;
}

@keyframes library-preview-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<style>
.library-file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}
</style>
