<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { notifySaved } from "@/lib/actionNotification";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import MultiSelect from "@/components/ui/MultiSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import {
  createGroupClass,
  getGroupClass,
  updateGroupClass,
} from "@/lib/groupClasses";
import type { GroupClassPayload } from "@/lib/groupClasses";
import { getTeacherOptions } from "@/lib/teachers";
import { getPlanOptions } from "@/lib/plans";
import { getStudentOptions } from "@/lib/students";
import type { GroupClassStatus } from "@/lib/types";

const route = useRoute();
const router = useRouter();

const {
  canCreateGroupClasses,
  canUpdateGroupClasses,
} = usePermissions();

const isEdit = computed(() => Boolean(route.params.id));
const groupClassId = computed(() => Number(route.params.id));
const canSave = computed(() =>
  isEdit.value ? canUpdateGroupClasses.value : canCreateGroupClasses.value
);

const name = ref("");
const description = ref("");
const teacherId = ref<string>("");
const planId = ref<string>("");
const schedule = ref("");
const startDate = ref("");
const endDate = ref("");
const status = ref<GroupClassStatus>("active");
const level = ref("");
const maxStudents = ref<number>(4);
const studentIds = ref<number[]>([]);

const teachers = ref<SelectOption[]>([]);
const plans = ref<SelectOption[]>([]);
const students = ref<SelectOption[]>([]);

const loading = ref(false);
const saving = ref(false);
const error = ref("");

const statusOptions: SelectOption[] = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
];

async function loadOptions() {
  try {
    const [teachersMap, plansMap, studentsMap] = await Promise.all([
      getTeacherOptions(),
      getPlanOptions(),
      getStudentOptions(),
    ]);

    teachers.value = Object.entries(teachersMap).map(([value, label]) => ({
      value,
      label,
    }));

    plans.value = Object.entries(plansMap).map(([value, label]) => ({
      value,
      label,
    }));

    students.value = Object.entries(studentsMap).map(([value, label]) => ({
      value: Number(value),
      label,
    }));
  } catch (e) {
    console.error("Erro ao carregar opções do formulário:", e);
  }
}

async function loadForm() {
  loading.value = true;
  error.value = "";

  await loadOptions();

  if (!isEdit.value) {
    loading.value = false;
    return;
  }

  try {
    const groupClass = await getGroupClass(groupClassId.value);

    name.value = groupClass.name;
    description.value = groupClass.description ?? "";
    teacherId.value = groupClass.teacher_id ? String(groupClass.teacher_id) : "";
    planId.value = groupClass.plan_id ? String(groupClass.plan_id) : "";
    schedule.value = groupClass.schedule ?? "";
    startDate.value = groupClass.start_date ?? "";
    endDate.value = groupClass.end_date ?? "";
    status.value = groupClass.status;
    level.value = groupClass.level ?? "";
    maxStudents.value = groupClass.max_students ?? 4;
    studentIds.value =
      groupClass.relationships?.students?.map((s) => s.id) ??
      groupClass.students?.map((s) => s.id) ??
      [];
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao carregar os dados da turma";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!canSave.value) {
    error.value = "Você não tem permissão para salvar turmas.";
    return;
  }

  saving.value = true;
  error.value = "";

  const max = maxStudents.value;
  if (studentIds.value.length > max) {
    error.value = `O número de alunos não pode exceder a capacidade máxima (${max}).`;
    saving.value = false;
    return;
  }

  const payload: GroupClassPayload = {
    name: name.value.trim(),
    description: description.value.trim() || null,
    teacher_id: teacherId.value ? Number(teacherId.value) : null,
    plan_id: planId.value ? Number(planId.value) : null,
    schedule: schedule.value.trim() || null,
    start_date: startDate.value || null,
    end_date: endDate.value || null,
    max_students: maxStudents.value,
    status: status.value,
    level: level.value.trim() || null,
    student_ids: studentIds.value,
  };

  try {
    if (isEdit.value) {
      await updateGroupClass(groupClassId.value, payload);
    } else {
      await createGroupClass(payload);
    }

    notifySaved("Turma", isEdit.value);
    await router.push("/group-classes");
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao salvar a turma";
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
          <h4>{{ isEdit ? "Editar turma" : "Nova turma" }}</h4>
          <p class="mb-0">
            Preencha os dados cadastrais da turma
          </p>
        </div>
      </div>

      <div
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink
          to="/group-classes"
          class="btn btn-outline-primary"
        >
          Voltar
        </RouterLink>
      </div>
    </div>

    <div
      v-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>

    <div class="row">
      <div class="col-xl-12 col-xxl-12 col-sm-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Dados da turma</h5>
          </div>

          <div class="card-body">
            <div
              v-if="loading"
              class="text-center py-4"
            >
              Carregando...
            </div>

            <form
              v-else
              @submit.prevent="submit"
            >
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="class-name"
                    >
                      Nome da turma *
                    </label>
                    <input
                      id="class-name"
                      v-model.trim="name"
                      type="text"
                      class="form-control"
                      maxlength="255"
                      required
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <SingleSelect
                      id="class-status"
                      v-model="status"
                      label="Status"
                      :options="statusOptions"
                      placeholder="Selecione o status"
                      required
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <SingleSelect
                      id="class-teacher"
                      v-model="teacherId"
                      label="Professor"
                      :options="teachers"
                      placeholder="Selecione o professor"
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <SingleSelect
                      id="class-plan"
                      v-model="planId"
                      label="Plano de ensino"
                      :options="plans"
                      placeholder="Selecione o plano"
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="class-schedule"
                    >
                      Horário / Dias
                    </label>
                    <input
                      id="class-schedule"
                      v-model.trim="schedule"
                      type="text"
                      class="form-control"
                      placeholder="Ex: Seg e Quarta 19:00"
                      maxlength="255"
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="class-level"
                    >
                      Nível
                    </label>
                    <input
                      id="class-level"
                      v-model.trim="level"
                      type="text"
                      class="form-control"
                      placeholder="Ex: B2, Advanced"
                      maxlength="10"
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="class-start-date"
                    >
                      Data de início
                    </label>
                    <input
                      id="class-start-date"
                      v-model="startDate"
                      type="date"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="class-end-date"
                    >
                      Data de término
                    </label>
                    <input
                      id="class-end-date"
                      v-model="endDate"
                      type="date"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="class-max-students"
                    >
                      Capacidade máxima de alunos
                    </label>
                    <input
                      id="class-max-students"
                      v-model.number="maxStudents"
                      type="number"
                      class="form-control"
                      min="0"
                      max="5"
                      required
                    />
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group">
                    <MultiSelect
                      id="class-students"
                      v-model="studentIds"
                      label="Alunos"
                      :options="students"
                      placeholder="Selecione os alunos"
                    />
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="class-description"
                    >
                      Descrição / Observações
                    </label>
                    <textarea
                      id="class-description"
                      v-model.trim="description"
                      class="form-control"
                      rows="4"
                      placeholder="Descrição dos objetivos da turma, conteúdo programático ou outras anotações."
                    ></textarea>
                  </div>
                </div>

                <div class="col-12">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="saving || !canSave"
                  >
                    {{ saving ? "Salvando..." : "Salvar" }}
                  </button>

                  <RouterLink
                    to="/group-classes"
                    class="btn btn-light ms-2"
                  >
                    Cancelar
                  </RouterLink>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
