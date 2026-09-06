<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { notifySaved } from "@/lib/actionNotification";
import { usePermissions } from "@/composables/usePermissions";
import {
  createLibraryCategory,
  getLibraryCategory,
  updateLibraryCategory,
} from "@/lib/library";

const route = useRoute();
const router = useRouter();

const {
  canCreateLibraryCategories,
  canUpdateLibraryCategories,
} = usePermissions();

const isEdit = computed(() => Boolean(route.params.id));
const recordId = computed(() => Number(route.params.id));
const canSave = computed(() =>
  isEdit.value ? canUpdateLibraryCategories.value : canCreateLibraryCategories.value
);

const name = ref("");
const description = ref("");
const sortOrder = ref(0);
const loading = ref(false);
const saving = ref(false);
const error = ref("");

async function loadForm() {
  if (!isEdit.value) return;

  loading.value = true;
  error.value = "";

  try {
    const item = await getLibraryCategory(recordId.value);
    name.value = item.name;
    description.value = item.description ?? "";
    sortOrder.value = item.sort_order ?? 0;
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar a categoria";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!canSave.value) {
    error.value = "Você não tem permissão para salvar categorias.";
    return;
  }

  if (!name.value.trim()) {
    error.value = "Informe o nome da categoria.";
    return;
  }

  saving.value = true;
  error.value = "";

  try {
    if (isEdit.value) {
      await updateLibraryCategory(recordId.value, {
        name: name.value.trim(),
        description: description.value.trim() || null,
        sort_order: sortOrder.value,
      });
    } else {
      await createLibraryCategory({
        name: name.value.trim(),
        description: description.value.trim() || null,
        sort_order: sortOrder.value,
      });
    }

    notifySaved("Categoria", isEdit.value);
    await router.push("/library/categories");
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao salvar a categoria";
  } finally {
    saving.value = false;
  }
}

onMounted(loadForm);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>{{ isEdit ? "Editar categoria" : "Nova categoria" }}</h4>
          <p class="mb-0">Defina o agrupamento dos materiais didáticos</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <RouterLink to="/library/categories" class="btn btn-outline-primary">
          Voltar
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">Dados da categoria</h5>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">Carregando...</div>

        <form v-else @submit.prevent="submit">
          <div class="row">
            <div class="col-md-8">
              <div class="form-group">
                <label class="form-label" for="library-category-name">Nome *</label>
                <input
                  id="library-category-name"
                  v-model="name"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label class="form-label" for="library-category-order">Ordem</label>
                <input
                  id="library-category-order"
                  v-model.number="sortOrder"
                  type="number"
                  min="0"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-12">
              <div class="form-group">
                <label class="form-label" for="library-category-description">
                  Descrição
                </label>
                <textarea
                  id="library-category-description"
                  v-model="description"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="saving || !canSave">
            {{ saving ? "Salvando..." : "Salvar" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
