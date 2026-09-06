<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import LibraryMaterialCard from "@/components/admin/LibraryMaterialCard.vue";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { notify } from "@/lib/actionNotification";
import { countActiveFilters } from "@/lib/filters/query";
import {
  downloadLibraryMaterial,
  getLibraryMaterialCategory,
  listLibraryCategories,
  listLibraryMaterials,
} from "@/lib/library";
import type { LibraryCategory, LibraryMaterial } from "@/lib/types";

const props = defineProps<{
  studentId: number;
}>();

const { canViewLibraryMaterials, canViewLibraryCategories } = usePermissions();

const loading = ref(true);
const error = ref("");
const assignedCategories = ref<LibraryCategory[]>([]);
const materials = ref<LibraryMaterial[]>([]);
const categoryOptions = ref<SelectOption[]>([]);

const page = ref(1);
const lastPage = ref(1);
const total = ref(0);
const titleFilter = ref("");
const categoryFilter = ref<string | number | null>(null);

const activeFilterCount = computed(() =>
  countActiveFilters([titleFilter.value, categoryFilter.value])
);

const assignedCategoryIds = computed(
  () => new Set(assignedCategories.value.map((category) => category.id))
);

async function loadAssignedCategories() {
  if (!canViewLibraryCategories.value) {
    assignedCategories.value = [];
    return;
  }

  const result = await listLibraryCategories({
    studentId: props.studentId,
    limit: 100,
  });

  assignedCategories.value = result.data;
}

async function loadCategoryOptions() {
  const optionsMap = new Map<number, string>();

  for (const category of assignedCategories.value) {
    optionsMap.set(category.id, category.name);
  }

  if (canViewLibraryMaterials.value) {
    const result = await listLibraryMaterials({
      studentId: props.studentId,
      limit: 500,
    });

    for (const material of result.data) {
      const category = getLibraryMaterialCategory(material);

      if (category) {
        optionsMap.set(category.id, category.name);
      }
    }
  }

  categoryOptions.value = [...optionsMap.entries()]
    .sort((left, right) => left[1].localeCompare(right[1], "pt-BR"))
    .map(([value, label]) => ({
      value,
      label,
    }));
}

async function loadMaterials() {
  if (!canViewLibraryMaterials.value) {
    materials.value = [];
    total.value = 0;
    lastPage.value = 1;
    return;
  }

  const result = await listLibraryMaterials({
    page: page.value,
    studentId: props.studentId,
    title: titleFilter.value.trim() || undefined,
    categoryId: categoryFilter.value ? Number(categoryFilter.value) : undefined,
  });

  materials.value = result.data;
  lastPage.value = result.last_page;
  total.value = result.total;
}

async function loadLibrary() {
  if (!canViewLibraryMaterials.value && !canViewLibraryCategories.value) {
    error.value = "Você não tem permissão para ver a biblioteca deste aluno.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await loadAssignedCategories();
    await Promise.all([loadCategoryOptions(), loadMaterials()]);
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar a biblioteca do aluno";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  page.value = 1;
  loading.value = true;
  error.value = "";

  loadMaterials()
    .catch((e) => {
      error.value =
        e instanceof Error ? e.message : "Erro ao filtrar os materiais do aluno";
    })
    .finally(() => {
      loading.value = false;
    });
}

function clearFilters() {
  titleFilter.value = "";
  categoryFilter.value = null;
  page.value = 1;
  handleSearch();
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) {
    return;
  }

  page.value = nextPage;
  loading.value = true;
  error.value = "";

  loadMaterials()
    .catch((e) => {
      error.value =
        e instanceof Error ? e.message : "Erro ao carregar os materiais do aluno";
    })
    .finally(() => {
      loading.value = false;
    });
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

onMounted(loadLibrary);
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="text-primary mb-1">Biblioteca do aluno</h4>
        <p class="text-muted mb-0">
          Categorias completas e materiais avulsos liberados para este aluno.
        </p>
      </div>
      <RouterLink
        v-if="canViewLibraryCategories"
        to="/library/categories"
        class="btn btn-sm btn-outline-primary"
      >
        Abrir biblioteca
      </RouterLink>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <template v-else>
      <div v-if="assignedCategories.length" class="mb-4">
        <h5 class="mb-2">Categorias atribuídas</h5>
        <div class="d-flex flex-wrap gap-2">
          <RouterLink
            v-for="category in assignedCategories"
            :key="category.id"
            :to="`/library/categories/${category.id}`"
            class="badge badge-primary"
          >
            {{ category.name }}
          </RouterLink>
        </div>
      </div>

      <FilterPanel
        v-if="canViewLibraryMaterials"
        :active-count="activeFilterCount"
        class="mb-4"
        @filter="handleSearch"
        @clear="clearFilters"
      >
        <div class="row g-3">
          <div class="col-md-6 col-lg-4">
            <FilterField label="Título" id="student-library-filter-title">
              <input
                id="student-library-filter-title"
                v-model="titleFilter"
                type="text"
                class="form-control"
                placeholder="Buscar por título..."
                @keyup.enter="handleSearch"
              />
            </FilterField>
          </div>
          <div class="col-md-6 col-lg-4">
            <FilterField label="Categoria" id="student-library-filter-category">
              <SingleSelect
                id="student-library-filter-category"
                v-model="categoryFilter"
                :options="categoryOptions"
                placeholder="Todas as categorias"
                aria-label="Filtrar por categoria"
              />
            </FilterField>
          </div>
        </div>
      </FilterPanel>

      <div v-if="loading" class="text-center py-4">Carregando...</div>

      <template v-else-if="canViewLibraryMaterials">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">Materiais ({{ total }})</h5>
        </div>

        <div v-if="materials.length === 0" class="text-muted py-3">
          Nenhum material encontrado para este aluno.
        </div>

        <div v-else class="library-file-grid">
          <LibraryMaterialCard
            v-for="item in materials"
            :key="item.id"
            :material="item"
            :show-student-count="false"
            :access-label="
              assignedCategoryIds.has(item.category_id) ? 'Categoria' : 'Material'
            "
            @download="downloadMaterial(item)"
          />
        </div>

        <ListPagination
          :page="page"
          :last-page="lastPage"
          :total="total"
          @update:page="goToPage"
        />
      </template>
    </template>
  </div>
</template>
