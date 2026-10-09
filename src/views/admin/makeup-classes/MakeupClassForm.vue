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
import AppCombobox from "@/components/ui/AppCombobox.vue";
import AppDatePicker from "@/components/ui/AppDatePicker.vue";
import type { SelectOption } from "@/components/ui/select.types";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const presetStudentId = computed(() => {
  const raw = route.query.student_id;
  const id = typeof raw === "string" ? Number(raw) : NaN;
  return Number.isFinite(id) && id > 0 ? id : null;
});
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
    const enrollmentParams = presetStudentId.value
      ? { student_id: presetStudentId.value, limit: 100 }
      : { limit: 100 };

    const [enrRes, teachRes, grpRes] = await Promise.all([
      listEnrollments(enrollmentParams),
      listTeachers({ limit: 100 }),
      listGroupClasses({ limit: 100 }),
    ]);
    enrollmentsList.value = enrRes.data;
    teachersList.value = teachRes.data;
    groupClassesList.value = grpRes.data;

    if (!isEdit.value && presetStudentId.value && enrRes.data.length > 0) {
      const preferred =
        enrRes.data.find((e) => e.student_id === presetStudentId.value) ??
        enrRes.data[0];
      form.value.enrollment_id = preferred.id;
    }
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

    if (!isEdit.value && presetStudentId.value) {
      router.push({
        path: `/students/${presetStudentId.value}`,
        query: { tab: "makeup" },
      });
    } else {
      router.push("/makeup-classes");
    }
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
        <RouterLink
          :to="
            presetStudentId && !isEdit
              ? { path: `/students/${presetStudentId}`, query: { tab: 'makeup' } }
              : '/makeup-classes'
          "
          class="btn btn-outline-secondary"
        >
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
              <AppCombobox
                id="makeup-enrollment"
                v-model="form.enrollment_id"
                label="Matrícula / Aluno *"
                :options="enrollmentOptions"
                placeholder="Selecione a matrícula"
                required
              />
            </div>

            <div class="col-md-6">
              <AppCombobox
                id="makeup-group-class"
                v-model="form.group_class_id"
                label="Turma (opcional)"
                :options="groupClassOptions"
                placeholder="Selecione a turma"
              />
            </div>

            <div class="col-md-6">
              <AppCombobox
                id="makeup-teacher"
                v-model="form.teacher_id"
                label="Professor Responsável"
                :options="teacherOptions"
                placeholder="Selecione o professor"
              />
            </div>

            <div class="col-md-6">
              <SingleSelect
                id="makeup-status"
                v-model="form.status"
                label="Status da Reposição *"
                :options="statusOptions"
                placeholder="Selecione o status"
                :searchable="false"
                required
              />
            </div>

            <div class="col-md-4">
              <AppDatePicker
                id="makeup-original-date"
                v-model="form.original_date"
                label="Data Original da Falta *"
                placeholder="DD/MM/AAAA"
                required
              />
            </div>

            <div class="col-md-4">
              <AppDatePicker
                id="makeup-expired-date"
                v-model="form.expired_date"
                label="Data Limite Expiração *"
                placeholder="DD/MM/AAAA"
                required
              />
            </div>

            <div class="col-md-4">
              <AppDatePicker
                id="makeup-new-date"
                v-model="form.new_date"
                label="Nova Data Agendada"
                placeholder="DD/MM/AAAA"
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
