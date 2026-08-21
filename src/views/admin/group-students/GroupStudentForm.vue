<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import {
  createGroupStudent,
  getGroupStudent,
  updateGroupStudent,
} from "@/lib/groupStudents";
import { listGroupClasses } from "@/lib/groupClasses";
import { listStudents } from "@/lib/students";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";

const route = useRoute();
const router = useRouter();
const { canCreateGroupStudents, canUpdateGroupStudents } = usePermissions();

const isEdit = computed(() => Boolean(route.params.id));
const entityId = computed(() => Number(route.params.id));

const loading = ref(false);
const error = ref("");
const initialLoading = ref(true);

const form = ref({
  group_class_id: null as number | null,
  student_id: null as number | null,
});

const groupClassOptions = ref<SelectOption[]>([]);
const studentOptions = ref<SelectOption[]>([]);

async function loadOptions() {
  try {
    const [gcResult, stResult] = await Promise.all([
      listGroupClasses({ per_page: 999 }),
      listStudents({ per_page: 999 }),
    ]);

    groupClassOptions.value = gcResult.data.map((gc) => ({
      value: gc.id,
      label: `Turma #${gc.id}`,
    }));

    studentOptions.value = stResult.data.map((s) => ({
      value: s.id,
      label: s.name,
      description: s.email,
    }));
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar opções";
  }
}

async function loadData() {
  await loadOptions();

  if (isEdit.value) {
    try {
      const data = await getGroupStudent(entityId.value);
      form.value = {
        group_class_id: data.group_class_id,
        student_id: data.student_id,
      };
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Erro ao carregar vínculo";
    }
  }

  initialLoading.value = false;
}

async function submit() {
  if (isEdit.value && !canUpdateGroupStudents.value) {
    error.value = "Sem permissão para editar.";
    return;
  }
  if (!isEdit.value && !canCreateGroupStudents.value) {
    error.value = "Sem permissão para criar.";
    return;
  }

  if (!form.value.group_class_id || !form.value.student_id) {
    error.value = "Selecione uma turma e um aluno.";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    if (isEdit.value) {
      await updateGroupStudent(entityId.value, form.value);
    } else {
      await createGroupStudent(form.value);
    }
    router.push("/group-students");
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao salvar vínculo";
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
          <h4>{{ isEdit ? "Editar Vínculo" : "Novo Vínculo de Aluno" }}</h4>
          <p class="mb-0">
            {{ isEdit ? `Editando vínculo #${entityId}` : "Vincule um aluno a uma turma" }}
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
      <div class="col-xl-6 col-xxl-6 col-sm-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Dados do Vínculo</h5>
          </div>
          <div class="card-body">
            <div v-if="initialLoading" class="text-center py-4">
              Carregando...
            </div>
            <form v-else @submit.prevent="submit">
              <div class="row">
                <div class="col-12 mb-3">
                  <SingleSelect
                    id="group_class_id"
                    v-model="form.group_class_id"
                    label="Turma"
                    placeholder="Selecione uma turma"
                    :options="groupClassOptions"
                    :required="true"
                  />
                </div>

                <div class="col-12 mb-3">
                  <SingleSelect
                    id="student_id"
                    v-model="form.student_id"
                    label="Aluno"
                    placeholder="Selecione um aluno"
                    :options="studentOptions"
                    :required="true"
                  />
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
