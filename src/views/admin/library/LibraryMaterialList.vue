<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import LibraryAssignModal from "@/components/admin/LibraryAssignModal.vue";
import LibraryMaterialCard from "@/components/admin/LibraryMaterialCard.vue";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { notify, notifyRemoved, notifySaved } from "@/lib/actionNotification";
import { countActiveFilters } from "@/lib/filters/query";
import {
  deleteLibraryMaterial,
  downloadLibraryMaterial,
  getLibraryMaterial,
  getLibraryMaterialPlucks,
  getLibraryMaterialStudents,
  listLibraryMaterials,
  updateLibraryMaterial,
} from "@/lib/library";
import type { LibraryMaterial } from "@/lib/types";

const {
  canViewLibraryMaterials,
  canCreateLibraryMaterials,
  canUpdateLibraryMaterials,
  canDeleteLibraryMaterials,
} = usePermissions();

const materials = ref<LibraryMaterial[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);
const titleFilter = ref("");
const categoryFilter = ref<string | number | null>(null);
const categoryOptions = ref<SelectOption[]>([]);
const studentOptions = ref<SelectOption[]>([]);

const assigning = ref<LibraryMaterial | null>(null);
const assignedStudentIds = ref<(string | number)[]>([]);
const assignSaving = ref(false);
const assignError = ref("");

const activeFilterCount = computed(() =>
  countActiveFilters([titleFilter.value, categoryFilter.value])
);

async function loadOptions() {
  const plucks = await getLibraryMaterialPlucks();
  categoryOptions.value = Object.entries(plucks.categories).map(([value, label]) => ({
    value,
    label,
  }));
  studentOptions.value = Object.entries(plucks.students).map(([value, label]) => ({
    value: Number(value),
    label,
  }));
}

async function loadList() {
  if (!canViewLibraryMaterials.value) {
    error.value = "Você não tem permissão para listar materiais da biblioteca.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listLibraryMaterials({
      page: page.value,
      title: titleFilter.value.trim() || undefined,
      categoryId: categoryFilter.value ? Number(categoryFilter.value) : undefined,
    });

    materials.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar materiais da biblioteca";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  page.value = 1;
  loadList();
}

function clearFilters() {
  titleFilter.value = "";
  categoryFilter.value = null;
  page.value = 1;
  loadList();
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;
  page.value = nextPage;
  loadList();
}

async function openAssign(item: LibraryMaterial) {
  assignError.value = "";
  assigning.value = item;

  try {
    const detail = await getLibraryMaterial(item.id);
    assignedStudentIds.value = getLibraryMaterialStudents(detail).map(
      (student) => student.id
    );
  } catch (e) {
    assignError.value =
      e instanceof Error ? e.message : "Erro ao carregar alunos do material";
  }
}

async function saveAssign() {
  if (!assigning.value) return;

  assignSaving.value = true;
  assignError.value = "";

  try {
    await updateLibraryMaterial(assigning.value.id, {
      student_ids: assignedStudentIds.value.map(Number),
    });
    notifySaved("Atribuição", true);
    assigning.value = null;
    await loadList();
  } catch (e) {
    assignError.value =
      e instanceof Error ? e.message : "Erro ao atribuir o material";
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
  if (!canDeleteLibraryMaterials.value) return;
  if (!confirm(`Remover o material "${item.title}"?`)) return;

  try {
    await deleteLibraryMaterial(item.id);
    notifyRemoved("Material");
    await loadList();
  } catch (e) {
    notify.error(e instanceof Error ? e.message : "Erro ao remover o material");
  }
}

onMounted(async () => {
  await loadOptions();
  await loadList();
});
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Biblioteca · Materiais</h4>
          <p class="mb-0">Cadastre arquivos e atribua a alunos ou categorias</p>
        </div>
      </div>
      <div
        v-if="canCreateLibraryMaterials"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/library/materials/create" class="btn btn-primary">
          <i class="la la-plus me-1"></i>
          Novo material
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <FilterPanel
      :active-count="activeFilterCount"
      @filter="handleSearch"
      @clear="clearFilters"
    >
      <div class="row g-3">
        <div class="col-md-6 col-lg-4">
          <FilterField label="Título" id="library-material-filter-title">
            <input
              id="library-material-filter-title"
              v-model="titleFilter"
              type="text"
              class="form-control"
              placeholder="Título do material..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-4">
          <FilterField label="Categoria" id="library-material-filter-category">
            <SingleSelect
              id="library-material-filter-category"
              v-model="categoryFilter"
              :options="categoryOptions"
              placeholder="Todas as categorias"
              aria-label="Filtrar por categoria"
            />
          </FilterField>
        </div>
      </div>
    </FilterPanel>

    <div class="card">
      <div class="card-header">
        <h4 class="card-title mb-0">Materiais ({{ total }})</h4>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">Carregando...</div>
        <div v-else-if="materials.length === 0" class="text-center text-muted py-5">
          Nenhum material encontrado
        </div>
        <div v-else class="library-file-grid">
          <LibraryMaterialCard
            v-for="item in materials"
            :key="item.id"
            :material="item"
            :can-assign="canUpdateLibraryMaterials"
            :can-edit="canUpdateLibraryMaterials"
            :can-delete="canDeleteLibraryMaterials"
            @download="downloadMaterial(item)"
            @assign="openAssign(item)"
            @delete="removeMaterial(item)"
          />
        </div>

        <ListPagination
          :page="page"
          :last-page="lastPage"
          :total="total"
          @update:page="goToPage"
        />
      </div>
    </div>

    <LibraryAssignModal
      v-if="assigning"
      :title="`Atribuir “${assigning.title}”`"
      subtitle="O aluno recebe só este arquivo. Para liberar a pasta inteira, atribua a categoria."
      :student-ids="assignedStudentIds"
      :options="studentOptions"
      :saving="assignSaving"
      :error="assignError"
      @update:student-ids="assignedStudentIds = $event"
      @close="assigning = null"
      @save="saveAssign"
    />
  </div>
</template>
