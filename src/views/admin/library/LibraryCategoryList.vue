<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import LibraryAssignModal from "@/components/admin/LibraryAssignModal.vue";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { notify, notifyRemoved, notifySaved } from "@/lib/actionNotification";
import { countActiveFilters } from "@/lib/filters/query";
import {
  deleteLibraryCategory,
  getLibraryCategory,
  getLibraryCategoryPlucks,
  getLibraryCategoryStudents,
  listLibraryCategories,
  updateLibraryCategory,
} from "@/lib/library";
import type { LibraryCategory } from "@/lib/types";

const {
  canViewLibraryCategories,
  canCreateLibraryCategories,
  canUpdateLibraryCategories,
  canDeleteLibraryCategories,
} = usePermissions();

const categories = ref<LibraryCategory[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);
const nameFilter = ref("");

const assigning = ref<LibraryCategory | null>(null);
const studentOptions = ref<SelectOption[]>([]);
const assignedStudentIds = ref<(string | number)[]>([]);
const assignSaving = ref(false);
const assignError = ref("");

const activeFilterCount = computed(() => countActiveFilters([nameFilter.value]));

const showActions = computed(
  () => canUpdateLibraryCategories.value || canDeleteLibraryCategories.value
);

async function loadList() {
  if (!canViewLibraryCategories.value) {
    error.value = "Você não tem permissão para listar categorias da biblioteca.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listLibraryCategories({
      page: page.value,
      name: nameFilter.value.trim() || undefined,
    });

    categories.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar categorias da biblioteca";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  page.value = 1;
  loadList();
}

function clearFilters() {
  nameFilter.value = "";
  page.value = 1;
  loadList();
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;
  page.value = nextPage;
  loadList();
}

async function openAssign(item: LibraryCategory) {
  assignError.value = "";
  assigning.value = item;
  assignedStudentIds.value = [];

  try {
    const [detail, plucks] = await Promise.all([
      getLibraryCategory(item.id),
      studentOptions.value.length
        ? Promise.resolve({ students: {} as Record<string, string> })
        : getLibraryCategoryPlucks(),
    ]);

    if (!studentOptions.value.length) {
      studentOptions.value = Object.entries(plucks.students).map(([value, label]) => ({
        value: Number(value),
        label,
      }));
    }

    assignedStudentIds.value = getLibraryCategoryStudents(detail).map((student) => student.id);
  } catch (e) {
    assignError.value =
      e instanceof Error ? e.message : "Erro ao carregar alunos da categoria";
  }
}

async function saveAssign() {
  if (!assigning.value) return;

  assignSaving.value = true;
  assignError.value = "";

  try {
    await updateLibraryCategory(assigning.value.id, {
      student_ids: assignedStudentIds.value.map(Number),
    });
    notifySaved("Atribuição", true);
    assigning.value = null;
    await loadList();
  } catch (e) {
    assignError.value =
      e instanceof Error ? e.message : "Erro ao atribuir a categoria";
  } finally {
    assignSaving.value = false;
  }
}

async function removeCategory(item: LibraryCategory) {
  if (!canDeleteLibraryCategories.value) {
    error.value = "Você não tem permissão para excluir categorias.";
    return;
  }

  if (!confirm(`Remover a categoria "${item.name}"?`)) return;

  try {
    await deleteLibraryCategory(item.id);
    notifyRemoved("Categoria");
    await loadList();
  } catch (e) {
    notify.error(
      e instanceof Error ? e.message : "Erro ao remover a categoria"
    );
  }
}

onMounted(loadList);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Biblioteca · Categorias</h4>
          <p class="mb-0">Organize o material didático por categoria</p>
        </div>
      </div>

      <div
        v-if="canCreateLibraryCategories"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/library/categories/create" class="btn btn-primary">
          <i class="la la-plus me-1"></i>
          Nova categoria
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
          <FilterField label="Nome" id="library-category-filter-name">
            <input
              id="library-category-filter-name"
              v-model="nameFilter"
              type="text"
              class="form-control"
              placeholder="Nome da categoria..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
      </div>
    </FilterPanel>

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="card-title mb-0">Categorias ({{ total }})</h4>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">Carregando...</div>

        <div v-else class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Materiais</th>
                <th>Alunos</th>
                <th v-if="showActions" class="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="categories.length === 0">
                <td :colspan="showActions ? 5 : 4" class="text-center text-muted">
                  Nenhuma categoria encontrada
                </td>
              </tr>
              <tr v-for="item in categories" :key="item.id">
                <td>{{ item.id }}</td>
                <td>
                  <RouterLink :to="`/library/categories/${item.id}`" class="fw-semibold">
                    {{ item.name }}
                  </RouterLink>
                  <div v-if="item.description" class="small text-muted">
                    {{ item.description }}
                  </div>
                </td>
                <td>{{ item.materials_count ?? 0 }}</td>
                <td>{{ item.students_count ?? 0 }}</td>
                <td v-if="showActions" class="text-end text-nowrap">
                  <button
                    v-if="canUpdateLibraryCategories"
                    type="button"
                    class="btn btn-xs sharp btn-success me-1"
                    title="Atribuir categoria aos alunos"
                    :aria-label="`Atribuir categoria ${item.name} aos alunos`"
                    @click="openAssign(item)"
                  >
                    <i class="la la-user-plus"></i>
                  </button>
                  <RouterLink
                    v-if="canUpdateLibraryCategories"
                    :to="`/library/categories/${item.id}/edit`"
                    class="btn btn-xs sharp btn-primary me-1"
                    :aria-label="`Editar categoria ${item.name}`"
                  >
                    <i class="fa fa-pencil"></i>
                  </RouterLink>
                  <button
                    v-if="canDeleteLibraryCategories"
                    type="button"
                    class="btn btn-xs sharp btn-danger"
                    :aria-label="`Excluir categoria ${item.name}`"
                    @click="removeCategory(item)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
      :title="`Atribuir “${assigning.name}”`"
      subtitle="Quem receber a categoria passa a ter acesso a todos os materiais dela, inclusive os que forem adicionados depois."
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
