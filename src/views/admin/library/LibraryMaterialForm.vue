<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { notifySaved } from "@/lib/actionNotification";
import {
  createLibraryMaterial,
  getLibraryMaterial,
  getLibraryMaterialPlucks,
  replaceLibraryMaterial,
  updateLibraryMaterial,
} from "@/lib/library";

const route = useRoute();
const router = useRouter();

const {
  canCreateLibraryMaterials,
  canUpdateLibraryMaterials,
} = usePermissions();

const isEdit = computed(() => Boolean(route.params.id));
const recordId = computed(() => Number(route.params.id));
const canSave = computed(() =>
  isEdit.value ? canUpdateLibraryMaterials.value : canCreateLibraryMaterials.value
);

const categoryId = ref<string | number | null>(
  typeof route.query.category === "string" ? route.query.category : null
);
const title = ref("");
const description = ref("");
const file = ref<File | null>(null);
const currentFileName = ref("");
const categoryOptions = ref<SelectOption[]>([]);

const loading = ref(false);
const saving = ref(false);
const error = ref("");

async function loadOptions() {
  const plucks = await getLibraryMaterialPlucks();
  categoryOptions.value = Object.entries(plucks.categories).map(([value, label]) => ({
    value,
    label,
  }));
}

async function loadForm() {
  if (!isEdit.value) return;

  loading.value = true;
  error.value = "";

  try {
    const item = await getLibraryMaterial(recordId.value);
    categoryId.value = String(item.category_id);
    title.value = item.title;
    description.value = item.description ?? "";
    currentFileName.value = item.original_name;
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar o material";
  } finally {
    loading.value = false;
  }
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  file.value = input.files?.[0] ?? null;
}

async function submit() {
  if (!canSave.value) {
    error.value = "Você não tem permissão para salvar materiais.";
    return;
  }

  if (!categoryId.value) {
    error.value = "Selecione a categoria.";
    return;
  }

  if (!title.value.trim()) {
    error.value = "Informe o título do material.";
    return;
  }

  if (!isEdit.value && !file.value) {
    error.value = "Selecione o arquivo do material.";
    return;
  }

  saving.value = true;
  error.value = "";

  try {
    if (isEdit.value) {
      await updateLibraryMaterial(recordId.value, {
        category_id: Number(categoryId.value),
        title: title.value.trim(),
        description: description.value.trim() || null,
      });

      if (file.value) {
        await replaceLibraryMaterial(recordId.value, file.value);
      }
    } else {
      await createLibraryMaterial({
        category_id: Number(categoryId.value),
        title: title.value.trim(),
        description: description.value.trim() || null,
        file: file.value ?? undefined,
      });
    }

    notifySaved("Material", isEdit.value);
    await router.push("/library/materials");
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao salvar o material";
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  try {
    await loadOptions();
    await loadForm();
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar opções da biblioteca";
  }
});
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>{{ isEdit ? "Editar material" : "Novo material" }}</h4>
          <p class="mb-0">Cadastre o arquivo didático e vincule a uma categoria</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <RouterLink to="/library/materials" class="btn btn-outline-primary">
          Voltar
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">Dados do material</h5>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">Carregando...</div>

        <form v-else @submit.prevent="submit">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <SingleSelect
                  id="library-material-category"
                  v-model="categoryId"
                  label="Categoria"
                  :options="categoryOptions"
                  placeholder="Selecione uma categoria"
                  required
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label" for="library-material-title">Título *</label>
                <input
                  id="library-material-title"
                  v-model="title"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
            </div>
            <div class="col-12">
              <div class="form-group">
                <label class="form-label" for="library-material-description">
                  Descrição
                </label>
                <textarea
                  id="library-material-description"
                  v-model="description"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div class="col-12">
              <div class="form-group">
                <label class="form-label" for="library-material-file">
                  Arquivo {{ isEdit ? "" : "*" }}
                </label>
                <input
                  id="library-material-file"
                  type="file"
                  class="form-control"
                  :required="!isEdit"
                  @change="onFileChange"
                />
                <small v-if="isEdit && currentFileName" class="text-muted">
                  Arquivo atual: {{ currentFileName }}. Envie outro apenas se quiser substituir.
                </small>
                <small v-else class="text-muted">
                  PDF, imagens, áudio, vídeo, Office, ZIP ou TXT. Máximo 50 MB.
                </small>
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
