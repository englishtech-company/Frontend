<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import {
  createGroupClass,
  getGroupClass,
  updateGroupClass,
} from "@/lib/groupClasses";

const route = useRoute();
const router = useRouter();
const { canCreateGroupClasses, canUpdateGroupClasses } = usePermissions();

const isEdit = computed(() => Boolean(route.params.id));
const entityId = computed(() => Number(route.params.id));

const loading = ref(false);
const error = ref("");
const initialLoading = ref(isEdit.value);

const form = ref({});

async function loadData() {
  if (!isEdit.value) {
    initialLoading.value = false;
    return;
  }

  try {
    const data = await getGroupClass(entityId.value);
    form.value = { ...data };
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar turma";
  } finally {
    initialLoading.value = false;
  }
}

async function submit() {
  if (isEdit.value && !canUpdateGroupClasses.value) {
    error.value = "Sem permissão para editar.";
    return;
  }
  if (!isEdit.value && !canCreateGroupClasses.value) {
    error.value = "Sem permissão para criar.";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    if (isEdit.value) {
      await updateGroupClass(entityId.value, form.value);
    } else {
      await createGroupClass(form.value);
    }
    router.push("/group-classes");
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao salvar turma";
  } finally {
    loading.value = false;
  }
}

onMounted(loadData);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>{{ isEdit ? "Editar Turma" : "Nova Turma" }}</h4>
          <p class="mb-0">
            {{ isEdit ? `Editando turma #${entityId}` : "Crie uma nova turma" }}
          </p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <button class="btn btn-outline-primary" @click="router.back()">
          Voltar
        </button>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row">
      <div class="col-xl-12 col-xxl-12 col-sm-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Detalhes da Turma</h5>
          </div>
          <div class="card-body">
            <div v-if="initialLoading" class="text-center py-4">
              Carregando...
            </div>
            <form v-else @submit.prevent="submit">
              <div class="row">
                <div class="col-12 mb-3">
                  <p class="text-muted">
                    Atualmente, as turmas não possuem campos adicionais personalizáveis. Clique em salvar para confirmar a criação da turma.
                  </p>
                </div>
              </div>

              <div class="row">
                <div class="col-12 text-end">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="loading"
                  >
                    {{ loading ? "Salvando..." : "Salvar" }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
