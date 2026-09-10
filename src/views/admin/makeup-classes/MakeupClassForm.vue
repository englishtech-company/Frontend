<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getMakeupClass,
  createMakeupClass,
  updateMakeupClass,
  getMakeupClassPlucks,
} from "@/lib/makeupClasses";
import { listEnrollments } from "@/lib/enrollments";
import { listTeachers } from "@/lib/teachers";
import { listGroupClasses } from "@/lib/groupClasses";
import type { MakeupClassStatus, Enrollment, Teacher, GroupClass } from "@/lib/types";
import { notifySaved, notify } from "@/lib/actionNotification";
import SingleSelect from "@/components/ui/SingleSelect.vue";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);
const submitting = ref(false);
const errorMessage = ref("");

const form = ref({
  enrollment_id: null as number | null,
  group_class_id: null as number | null,
  teacher_id: null as number | null,
  original_date: "",
  expired_date: "",
  new_date: "" as string | null,
  status: "available" as MakeupClassStatus,
});

const enrollmentsList = ref<Enrollment[]>([]);
const teachersList = ref<Teacher[]>([]);
const groupClassesList = ref<GroupClass[]>([]);

const enrollmentOptions = computed(() =>
  enrollmentsList.value.map((e) => ({
    value: e.id,
    label: `#${e.id} - ${e.student?.name || 'Sem nome'}`,
  }))
);

const teacherOptions = computed(() =>
  teachersList.value.map((t) => ({
    value: t.id,
    label: t.name,
  }))
);

const groupClassOptions = computed(() =>
  groupClassesList.value.map((g) => ({
    value: g.id,
    label: g.name,
  }))
);

const statusOptions = [
  { value: "available", label: "Disponível" },
  { value: "scheduled", label: "Agendada" },
  { value: "concluded", label: "Concluída" },
  { value: "expired", label: "Expirada" },
];

const loadSelectOptions = async () => {
  try {
    const [enrRes, teachRes, grpRes] = await Promise.all([
      listEnrollments({ limit: 100 }),
      listTeachers({ limit: 100 }),
      listGroupClasses({ limit: 100 }),
    ]);
    enrollmentsList.value = enrRes.data;
    teachersList.value = teachRes.data;
    groupClassesList.value = grpRes.data;
  } catch (err) {
    console.error(err);
  }
};

const loadData = async () => {
  if (!isEdit.value) return;
  loading.value = true;
  try {
    const item = await getMakeupClass(Number(route.params.id));
    form.value.enrollment_id = item.enrollment_id ?? null;
    form.value.group_class_id = item.group_class_id ?? null;
    form.value.teacher_id = item.teacher_id ?? null;
    form.value.original_date = item.original_date ? item.original_date.slice(0, 16) : "";
    form.value.expired_date = item.expired_date ? item.expired_date.slice(0, 16) : "";
    form.value.new_date = item.new_date ? item.new_date.slice(0, 16) : null;
    form.value.status = item.status;
  } catch (err) {
    console.error(err);
    errorMessage.value = "Erro ao carregar os dados da aula de reposição.";
  } finally {
    loading.value = false;
  }
};

const submit = async () => {
  submitting.value = true;
  errorMessage.value = "";
  try {
    const payload = {
      enrollment_id: form.value.enrollment_id,
      group_class_id: form.value.group_class_id,
      teacher_id: form.value.teacher_id,
      original_date: form.value.original_date,
      expired_date: form.value.expired_date,
      new_date: form.value.new_date || null,
      status: form.value.status,
    };

    if (isEdit.value) {
      await updateMakeupClass(Number(route.params.id), payload);
    } else {
      await createMakeupClass(payload);
    }

    notifySaved("Aula de Reposição", isEdit.value);
    router.push("/makeup-classes");
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err?.message || "Erro ao salvar a aula de reposição.";
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  loadSelectOptions();
  loadData();
});
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>{{ isEdit ? "Editar Reposição" : "Nova Aula de Reposição" }}</h4>
          <p class="mb-0">Preencha os dados da falta/reposição de aula</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <RouterLink to="/makeup-classes" class="btn btn-outline-secondary">
          Voltar
        </RouterLink>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Carregando...</span>
          </div>
        </div>

        <form v-else @submit.prevent="submit">
          <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>

          <div class="row">
            <div class="col-md-6 form-group">
              <label>Matrícula / Aluno</label>
              <SingleSelect
                v-model="form.enrollment_id"
                :options="enrollmentOptions"
                placeholder="Selecione a matrícula"
              />
            </div>

            <div class="col-md-6 form-group">
              <label>Turma (opcional)</label>
              <SingleSelect
                v-model="form.group_class_id"
                :options="groupClassOptions"
                placeholder="Selecione a turma"
              />
            </div>

            <div class="col-md-6 form-group">
              <label>Professor Responsável</label>
              <SingleSelect
                v-model="form.teacher_id"
                :options="teacherOptions"
                placeholder="Selecione o professor"
              />
            </div>

            <div class="col-md-6 form-group">
              <label>Status da Reposição</label>
              <SingleSelect
                v-model="form.status"
                :options="statusOptions"
                placeholder="Selecione o status"
              />
            </div>

            <div class="col-md-4 form-group">
              <label>Data Original da Falta *</label>
              <input
                v-model="form.original_date"
                type="datetime-local"
                class="form-control"
                required
              />
            </div>

            <div class="col-md-4 form-group">
              <label>Data Limite Expiração *</label>
              <input
                v-model="form.expired_date"
                type="datetime-local"
                class="form-control"
                required
              />
            </div>

            <div class="col-md-4 form-group">
              <label>Nova Data Agendada</label>
              <input
                v-model="form.new_date"
                type="datetime-local"
                class="form-control"
              />
            </div>
          </div>

          <div class="mt-4 text-right">
            <RouterLink to="/makeup-classes" class="btn btn-secondary mr-2">
              Cancelar
            </RouterLink>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? "Salvando..." : isEdit ? "Atualizar" : "Cadastrar" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
