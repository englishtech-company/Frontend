<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getLesson,
  createLesson,
  updateLesson,
  createLessonForGroupClass,
  updateLessonForGroupClass,
  createLessonForStudent,
  updateLessonForStudent,
  type LessonPayload,
} from "@/lib/lessons";
import { listTeachers } from "@/lib/teachers";
import { listGroupClasses, getGroupClass } from "@/lib/groupClasses";
import { listStudents, getStudent } from "@/lib/students";
import { notifySaved, notify } from "@/lib/actionNotification";

import SingleSelect from "@/components/ui/SingleSelect.vue";

const route = useRoute();
const router = useRouter();

// Route params
const isEdit = computed(() => route.name === "LessonEdit" || route.name === "GroupClassLessonEdit" || route.name === "StudentLessonEdit");
const lessonId = computed(() => route.params.id ? Number(route.params.id) : null);
const groupClassId = computed(() => route.params.groupClassId ? Number(route.params.groupClassId) : null);
const studentId = computed(() => route.params.studentId ? Number(route.params.studentId) : null);

const loading = ref(false);
const submitting = ref(false);
const error = ref(false);

const formData = ref<LessonPayload>({
  group_class_id: groupClassId.value ?? null,
  student_id: studentId.value ?? null,
  teacher_id: 0,
  class_datetime: "",
  topic: "",
  status: "scheduled",
  observation: "",
});

const statusOptions = [
  { value: "scheduled", label: "Agendada" },
  { value: "completed", label: "Concluída" },
  { value: "cancelled", label: "Cancelada" },
  { value: "postponed", label: "Adiada" },
  { value: "makeup", label: "Reposição" },
];

const teacherOptions = ref<{ value: number; label: string }[]>([]);
const groupClassOptions = ref<{ value: number; label: string }[]>([]);
const studentOptions = ref<{ value: number; label: string }[]>([]);

const backUrl = computed(() => {
  if (groupClassId.value) return `/group-classes/${groupClassId.value}`;
  if (studentId.value) return `/students/${studentId.value}`;
  return "/lessons";
});

const loadDependencies = async () => {
  try {
    const [teachersRes, groupClassesRes, studentsRes] = await Promise.all([
      listTeachers({ limit: 100 }),
      listGroupClasses({ limit: 100 }),
      listStudents({ limit: 100 }),
    ]);

    teacherOptions.value = teachersRes.data.map((t) => ({ value: t.id, label: t.name }));
    groupClassOptions.value = groupClassesRes.data.map((g) => ({ value: g.id, label: g.name }));
    studentOptions.value = studentsRes.data.map((s) => ({ value: s.id, label: s.name }));

    // If nested under GroupClass, auto-select teacher from GroupClass if available and not yet set
    if (groupClassId.value && !isEdit.value) {
      try {
        const gc = await getGroupClass(groupClassId.value);
        if (gc.teacher_id && !formData.value.teacher_id) {
          formData.value.teacher_id = gc.teacher_id;
        }
      } catch (err) {
        console.error("Failed to load group class details", err);
      }
    }

    // If nested under Student, auto-select teacher from Student if available and not yet set
    if (studentId.value && !isEdit.value) {
      try {
        const st = await getStudent(studentId.value);
        const currentTeacherId = st.current_teacher_assignment?.teacher_id ?? st.relationships?.current_teacher?.id;
        if (currentTeacherId && !formData.value.teacher_id) {
          formData.value.teacher_id = currentTeacherId;
        }
      } catch (err) {
        console.error("Failed to load student details", err);
      }
    }
  } catch (err) {
    console.error("Failed to load dependencies", err);
    notify.error("Erro ao carregar dados dependentes.");
  }
};

const loadLesson = async () => {
  if (!isEdit.value || !lessonId.value) return;

  loading.value = true;
  error.value = false;
  try {
    const lesson = await getLesson(lessonId.value);
    formData.value = {
      group_class_id: lesson.group_class_id ?? null,
      student_id: lesson.student_id ?? null,
      teacher_id: lesson.teacher_id ?? 0,
      class_datetime: lesson.class_datetime ? lesson.class_datetime.slice(0, 16) : "",
      topic: lesson.topic ?? "",
      status: lesson.status ?? "scheduled",
      observation: lesson.observation ?? "",
    };
  } catch (err) {
    console.error(err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const submit = async () => {
  if (!formData.value.teacher_id) {
    notify.error("Selecione um professor.");
    return;
  }

  if (!formData.value.group_class_id && !formData.value.student_id) {
    notify.error("Selecione uma turma ou um aluno individual.");
    return;
  }

  submitting.value = true;
  error.value = false;

  try {
    const payload: LessonPayload = {
      ...formData.value,
      group_class_id: formData.value.group_class_id ? Number(formData.value.group_class_id) : null,
      student_id: formData.value.student_id ? Number(formData.value.student_id) : null,
      teacher_id: Number(formData.value.teacher_id),
    };

    if (groupClassId.value) {
      if (isEdit.value && lessonId.value) {
        await updateLessonForGroupClass(groupClassId.value, lessonId.value, payload);
      } else {
        await createLessonForGroupClass(groupClassId.value, payload);
      }
    } else if (studentId.value) {
      if (isEdit.value && lessonId.value) {
        await updateLessonForStudent(studentId.value, lessonId.value, payload);
      } else {
        await createLessonForStudent(studentId.value, payload);
      }
    } else {
      if (isEdit.value && lessonId.value) {
        await updateLesson(lessonId.value, payload);
      } else {
        await createLesson(payload);
      }
    }

    notifySaved("Aula", isEdit.value);
    router.push(backUrl.value);
  } catch (err) {
    console.error(err);
    error.value = true;
    notify.error("Erro ao salvar a aula.");
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  await loadDependencies();
  await loadLesson();
});
</script>

<template>
  <div class="container-fluid">
    <div class="page-titles d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">{{ isEdit ? "Editar Aula" : "Nova Aula" }}</h4>
      <RouterLink :to="backUrl" class="btn btn-outline-secondary">
        Voltar
      </RouterLink>
    </div>

    <div v-if="error" class="alert alert-danger">
      Ocorreu um erro ao processar sua solicitação.
    </div>

    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          Carregando...
        </div>
        <form v-else @submit.prevent="submit">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label" for="topic">Tópico <span class="text-danger">*</span></label>
              <input
                id="topic"
                v-model="formData.topic"
                type="text"
                class="form-control"
                required
              />
            </div>

            <div class="col-md-6">
              <label class="form-label" for="class_datetime">Data e Hora <span class="text-danger">*</span></label>
              <input
                id="class_datetime"
                v-model="formData.class_datetime"
                type="datetime-local"
                class="form-control"
                required
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">Professor <span class="text-danger">*</span></label>
              <SingleSelect
                v-model="formData.teacher_id"
                :options="teacherOptions"
                placeholder="Selecione um professor"
                :searchable="true"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">Turma</label>
              <SingleSelect
                v-model="formData.group_class_id"
                :options="groupClassOptions"
                placeholder="Selecione uma turma (se aplicável)"
                :searchable="true"
                :disabled="Boolean(groupClassId)"
              />
              <small v-if="groupClassId" class="text-muted">Fixado por contexto da turma</small>
            </div>

            <div class="col-md-6">
              <label class="form-label">Aluno (Individual)</label>
              <SingleSelect
                v-model="formData.student_id"
                :options="studentOptions"
                placeholder="Selecione um aluno (se aula individual)"
                :searchable="true"
                :disabled="Boolean(studentId)"
              />
              <small v-if="studentId" class="text-muted">Fixado por contexto do aluno</small>
            </div>

            <div class="col-md-6">
              <label class="form-label">Status <span class="text-danger">*</span></label>
              <SingleSelect
                v-model="formData.status"
                :options="statusOptions"
                :searchable="false"
              />
            </div>

            <div class="col-12">
              <label class="form-label" for="observation">Observação</label>
              <textarea
                id="observation"
                v-model="formData.observation"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div class="mt-4 d-flex justify-content-end gap-2">
            <RouterLink :to="backUrl" class="btn btn-light">
              Cancelar
            </RouterLink>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="submitting"
            >
              {{ submitting ? "Salvando..." : "Salvar" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
