<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import {
  getMakeupClass,
  createMakeupClass,
  updateMakeupClass,
} from "@/lib/makeupClasses";
import { listEnrollments } from "@/lib/enrollments";
import { listTeachers } from "@/lib/teachers";
import { listGroupClasses } from "@/lib/groupClasses";
import type { MakeupClassStatus, Enrollment, Teacher, GroupClass } from "@/lib/types";
import { notifySaved } from "@/lib/actionNotification";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";

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

const enrollmentOptions = computed<SelectOption[]>(() =>
  enrollmentsList.value.map((e) => ({
    value: e.id,
    label: `Matrícula #${e.id} - ${e.student?.name || 'Aluno sem nome'}`,
  }))
);

const teacherOptions = computed<SelectOption[]>(() =>
  teachersList.value.map((t) => ({
    value: t.id,
    label: t.name,
  }))
);

const groupClassOptions = computed<SelectOption[]>(() =>
  groupClassesList.value.map((g) => ({
    value: g.id,
    label: g.name,
  }))
);

const statusOptions: SelectOption[] = [
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
    console.error("Erro ao carregar opções para o formulário:", err);
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
            <span class="visually-hidden">Carregando...</span>
          </div>
        </div>

        <form v-else @submit.prevent="submit">
          <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>

          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label" for="makeup-enrollment">
                Matrícula / Aluno <span class="text-danger">*</span>
              </label>
              <SingleSelect
                id="makeup-enrollment"
                v-model="form.enrollment_id"
                :options="enrollmentOptions"
                placeholder="Selecione a matrícula"
                :searchable="true"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label" for="makeup-group-class">Turma (opcional)</label>
              <SingleSelect
                id="makeup-group-class"
                v-model="form.group_class_id"
                :options="groupClassOptions"
                placeholder="Selecione a turma"
                :searchable="true"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label" for="makeup-teacher">Professor Responsável</label>
              <SingleSelect
                id="makeup-teacher"
                v-model="form.teacher_id"
                :options="teacherOptions"
                placeholder="Selecione o professor"
                :searchable="true"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label" for="makeup-status">
                Status da Reposição <span class="text-danger">*</span>
              </label>
              <SingleSelect
                id="makeup-status"
                v-model="form.status"
                :options="statusOptions"
                placeholder="Selecione o status"
                :searchable="false"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label" for="makeup-original-date">
                Data Original da Falta <span class="text-danger">*</span>
              </label>
              <input
                id="makeup-original-date"
                v-model="form.original_date"
                type="datetime-local"
                class="form-control"
                required
              />
            </div>

            <div class="col-md-4">
              <label class="form-label" for="makeup-expired-date">
                Data Limite Expiração <span class="text-danger">*</span>
              </label>
              <input
                id="makeup-expired-date"
                v-model="form.expired_date"
                type="datetime-local"
                class="form-control"
                required
              />
            </div>

            <div class="col-md-4">
              <label class="form-label" for="makeup-new-date">Nova Data Agendada</label>
              <input
                id="makeup-new-date"
                v-model="form.new_date"
                type="datetime-local"
                class="form-control"
              />
            </div>
          </div>

          <div class="mt-4">
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? "Salvando..." : "Salvar" }}
            </button>
            <RouterLink to="/makeup-classes" class="btn btn-light ms-2">
              Cancelar
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
