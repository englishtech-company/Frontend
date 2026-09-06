<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import LibraryAssignModal from "@/components/admin/LibraryAssignModal.vue";
import LibraryMaterialCard from "@/components/admin/LibraryMaterialCard.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { notify, notifyRemoved, notifySaved } from "@/lib/actionNotification";
import {
  deleteLibraryMaterial,
  downloadLibraryMaterial,
  getLibraryCategory,
  getLibraryCategoryPlucks,
  getLibraryCategoryStudents,
  getLibraryMaterial,
  getLibraryMaterialStudents,
  listLibraryMaterials,
  updateLibraryCategory,
  updateLibraryMaterial,
} from "@/lib/library";
import type { LibraryCategory, LibraryMaterial } from "@/lib/types";

const route = useRoute();
const categoryId = computed(() => Number(route.params.id));

const {
  canViewLibraryCategories,
  canUpdateLibraryCategories,
  canCreateLibraryMaterials,
  canUpdateLibraryMaterials,
  canDeleteLibraryMaterials,
} = usePermissions();

const category = ref<LibraryCategory | null>(null);
const materials = ref<LibraryMaterial[]>([]);
const loading = ref(true);
const error = ref("");

const studentOptions = ref<SelectOption[]>([]);
const assigningCategory = ref(false);
const assigningMaterial = ref<LibraryMaterial | null>(null);
const assignedStudentIds = ref<(string | number)[]>([]);
const assignSaving = ref(false);
const assignError = ref("");

async function loadPage() {
  if (!canViewLibraryCategories.value) {
    error.value = "Você não tem permissão para ver esta categoria.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const [detail, materialResult] = await Promise.all([
      getLibraryCategory(categoryId.value),
      listLibraryMaterials({ categoryId: categoryId.value, limit: 100 }),
    ]);

    category.value = detail;
    materials.value = materialResult.data;
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar a categoria";
  } finally {
    loading.value = false;
  }
}

async function ensureStudentOptions() {
  if (studentOptions.value.length) return;

  const plucks = await getLibraryCategoryPlucks();
  studentOptions.value = Object.entries(plucks.students).map(([value, label]) => ({
    value: Number(value),
    label,
  }));
}

async function openCategoryAssign() {
  if (!category.value) return;

  assignError.value = "";
  assigningCategory.value = true;
  assigningMaterial.value = null;

  try {
    await ensureStudentOptions();
    const detail = await getLibraryCategory(category.value.id);
    assignedStudentIds.value = getLibraryCategoryStudents(detail).map(
      (student) => student.id
    );
  } catch (e) {
    assignError.value =
      e instanceof Error ? e.message : "Erro ao carregar alunos";
  }
}

async function openMaterialAssign(item: LibraryMaterial) {
  assignError.value = "";
  assigningCategory.value = false;
  assigningMaterial.value = item;

  try {
    await ensureStudentOptions();
    const detail = await getLibraryMaterial(item.id);
    assignedStudentIds.value = getLibraryMaterialStudents(detail).map(
      (student) => student.id
    );
  } catch (e) {
    assignError.value =
      e instanceof Error ? e.message : "Erro ao carregar alunos";
  }
}

async function saveAssign() {
  assignSaving.value = true;
  assignError.value = "";

  try {
    if (assigningMaterial.value) {
      await updateLibraryMaterial(assigningMaterial.value.id, {
        student_ids: assignedStudentIds.value.map(Number),
      });
    } else if (category.value) {
      await updateLibraryCategory(category.value.id, {
        student_ids: assignedStudentIds.value.map(Number),
      });
    }

    notifySaved("Atribuição", true);
    assigningCategory.value = false;
    assigningMaterial.value = null;
    await loadPage();
  } catch (e) {
    assignError.value =
      e instanceof Error ? e.message : "Erro ao salvar a atribuição";
  } finally {
    assignSaving.value = false;
  }
}

async function downloadMaterial(item: LibraryMaterial) {
  try {
    const blob = await downloadLibraryMaterial(item.id);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = item.original_name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  } catch (e) {
    notify.error(e instanceof Error ? e.message : "Erro ao baixar o arquivo");
  }
}

async function removeMaterial(item: LibraryMaterial) {
  if (!confirm(`Remover o material "${item.title}"?`)) return;

  try {
    await deleteLibraryMaterial(item.id);
    notifyRemoved("Material");
    await loadPage();
  } catch (e) {
    notify.error(e instanceof Error ? e.message : "Erro ao remover o material");
  }
}

onMounted(loadPage);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>{{ category?.name ?? "Categoria" }}</h4>
          <p class="mb-0">
            {{ category?.description || "Materiais e alunos desta categoria" }}
          </p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex gap-2">
        <RouterLink to="/library/categories" class="btn btn-outline-primary">
          Voltar
        </RouterLink>
        <RouterLink
          v-if="canUpdateLibraryCategories && category"
          :to="`/library/categories/${category.id}/edit`"
          class="btn btn-outline-secondary"
        >
          Editar
        </RouterLink>
        <button
          v-if="canUpdateLibraryCategories"
          type="button"
          class="btn btn-success"
          @click="openCategoryAssign"
        >
          <i class="la la-user-plus me-1"></i>
          Atribuir categoria
        </button>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="loading" class="text-center py-4">Carregando...</div>

    <template v-else-if="category">
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <p class="text-muted mb-1">Materiais</p>
              <h3 class="mb-0">{{ materials.length }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <p class="text-muted mb-2">Alunos com a categoria completa</p>
              <div v-if="getLibraryCategoryStudents(category).length === 0" class="text-muted">
                Nenhum aluno atribuído a esta categoria.
              </div>
              <div v-else class="d-flex flex-wrap gap-2">
                <span
                  v-for="student in getLibraryCategoryStudents(category)"
                  :key="student.id"
                  class="badge badge-secondary"
                >
                  {{ student.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h4 class="card-title mb-0">Materiais</h4>
          <RouterLink
            v-if="canCreateLibraryMaterials"
            :to="`/library/materials/create?category=${category.id}`"
            class="btn btn-sm btn-primary"
          >
            <i class="la la-plus me-1"></i>
            Novo material
          </RouterLink>
        </div>
        <div class="card-body">
          <div v-if="materials.length === 0" class="text-center text-muted py-4">
            Nenhum material nesta categoria
          </div>
          <div v-else class="library-file-grid">
            <LibraryMaterialCard
              v-for="item in materials"
              :key="item.id"
              :material="item"
              :show-category="false"
              :can-assign="canUpdateLibraryMaterials"
              :can-edit="canUpdateLibraryMaterials"
              :can-delete="canDeleteLibraryMaterials"
              @download="downloadMaterial(item)"
              @assign="openMaterialAssign(item)"
              @delete="removeMaterial(item)"
            />
          </div>
        </div>
      </div>
    </template>

    <LibraryAssignModal
      v-if="assigningCategory || assigningMaterial"
      :title="
        assigningMaterial
          ? `Atribuir “${assigningMaterial.title}”`
          : `Atribuir “${category?.name}”`
      "
      :subtitle="
        assigningMaterial
          ? 'O aluno recebe só este arquivo, mesmo sem a categoria completa.'
          : 'Quem receber a categoria passa a ter acesso a todos os materiais dela.'
      "
      :student-ids="assignedStudentIds"
      :options="studentOptions"
      :saving="assignSaving"
      :error="assignError"
      @update:student-ids="assignedStudentIds = $event"
      @close="assigningCategory = false; assigningMaterial = null"
      @save="saveAssign"
    />
  </div>
</template>
