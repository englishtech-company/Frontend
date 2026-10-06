<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import AppDatePicker from "@/components/ui/AppDatePicker.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { notify, notifySaved } from "@/lib/actionNotification";
import type { CalendarCreateKind } from "@/lib/calendar/types";
import {
  createExperimentalClass,
  getExperimentalClassPlucks,
} from "@/lib/experimentalClasses";
import {
  createLesson,
  type LessonPayload,
} from "@/lib/lessons";
import { listGroupClasses } from "@/lib/groupClasses";
import { listStudents } from "@/lib/students";
import { listTeachers } from "@/lib/teachers";

const props = defineProps<{
  initialDateTime?: string;
}>();

const emit = defineEmits<{
  close: [];
  created: [];
}>();

const {
  canCreateLessons,
  canCreateExperimentalClasses,
} = usePermissions();

const eventKind = ref<CalendarCreateKind>("group_lesson");
const saving = ref(false);
const error = ref("");
const loadingOptions = ref(true);

const topic = ref("");
const classDate = ref<string | null>(null); // YYYY-MM-DD
const durationMinutes = ref(60);
const teacherId = ref<string | number | null>(null);
const groupClassId = ref<string | number | null>(null);
const studentId = ref<string | number | null>(null);
const lessonStatus = ref<string | number | null>("scheduled");
const observation = ref("");

const interestedId = ref<string | number | null>(null);
const experimentalDateClass = ref<string | null>(null); // YYYY-MM-DD (date only)
const experimentalStatus = ref<string | number | null>("agendada");
const experimentalNotes = ref("");

const teacherOptions = ref<SelectOption[]>([]);
const groupClassOptions = ref<SelectOption[]>([]);
const studentOptions = ref<SelectOption[]>([]);
const leadOptions = ref<SelectOption[]>([]);

const lessonStatusOptions: SelectOption[] = [
  { value: "scheduled", label: "Agendada" },
  { value: "completed", label: "Concluída" },
  { value: "cancelled", label: "Cancelada" },
  { value: "postponed", label: "Adiada" },
  { value: "makeup", label: "Reposição" },
];

const experimentalStatusOptions: SelectOption[] = [
  { value: "agendada", label: "Agendada" },
  { value: "realizada", label: "Realizada" },
  { value: "cancelada", label: "Cancelada" },
];

const eventKindOptions = computed(() =>
  [
    {
      value: "group_lesson" as const,
      label: "Aula em turma",
      enabled: canCreateLessons.value,
    },
    {
      value: "individual_lesson" as const,
      label: "Aula individual",
      enabled: canCreateLessons.value,
    },
    {
      value: "makeup_lesson" as const,
      label: "Reposição",
      enabled: canCreateLessons.value,
    },
    {
      value: "experimental_class" as const,
      label: "Aula experimental",
      enabled: canCreateExperimentalClasses.value,
    },
  ].filter((item) => item.enabled)
);

const isLessonForm = computed(
  () => eventKind.value !== "experimental_class"
);

const modalTitle = computed(() => {
  switch (eventKind.value) {
    case "group_lesson":
      return "Nova aula em turma";
    case "individual_lesson":
      return "Nova aula individual";
    case "makeup_lesson":
      return "Nova reposição";
    default:
      return "Nova aula experimental";
  }
});

function resetForm() {
  error.value = "";
  topic.value = "";
  classDate.value = props.initialDateTime ? props.initialDateTime.slice(0, 10) : null;
  durationMinutes.value = 60;
  teacherId.value = null;
  groupClassId.value = null;
  studentId.value = null;
  lessonStatus.value =
    eventKind.value === "makeup_lesson" ? "makeup" : "scheduled";
  observation.value = "";
  interestedId.value = null;
  experimentalDateClass.value = null;
  experimentalStatus.value = "agendada";
  experimentalNotes.value = "";
}

async function loadOptions() {
  loadingOptions.value = true;

  try {
    const [teachersResult, groupClassesResult, studentsResult, experimentalPlucks] =
      await Promise.all([
        listTeachers({ limit: 200 }),
        listGroupClasses({ limit: 200 }),
        listStudents({ limit: 200 }),
        canCreateExperimentalClasses.value
          ? getExperimentalClassPlucks()
          : Promise.resolve({ interested: {}, teachers: {} }),
      ]);

    teacherOptions.value = teachersResult.data.map((teacher) => ({
      value: teacher.id,
      label: teacher.name,
    }));
    groupClassOptions.value = groupClassesResult.data.map((groupClass) => ({
      value: groupClass.id,
      label: groupClass.name,
    }));
    studentOptions.value = studentsResult.data.map((student) => ({
      value: student.id,
      label: student.name,
    }));
    leadOptions.value = Object.entries(experimentalPlucks.interested).map(
      ([value, label]) => ({
        value: Number(value),
        label: String(label),
      })
    );
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar opções do formulário";
  } finally {
    loadingOptions.value = false;
  }
}

function validateLessonPayload(): LessonPayload | null {
  if (!topic.value.trim()) {
    error.value = "Informe o tópico da aula.";
    return null;
  }

  if (!classDate.value) {
    error.value = "Informe a data da aula.";
    return null;
  }

  if (!teacherId.value) {
    error.value = "Selecione um professor.";
    return null;
  }

  if (eventKind.value === "group_lesson" && !groupClassId.value) {
    error.value = "Selecione a turma.";
    return null;
  }

  if (
    (eventKind.value === "individual_lesson" ||
      eventKind.value === "makeup_lesson") &&
    !studentId.value
  ) {
    error.value = "Selecione o aluno.";
    return null;
  }

  return {
    topic: topic.value.trim(),
    class_datetime: classDate.value ?? "",
    teacher_id: Number(teacherId.value),
    group_class_id:
      eventKind.value === "group_lesson" ? Number(groupClassId.value) : null,
    student_id:
      eventKind.value === "group_lesson" ? null : Number(studentId.value),
    status:
      eventKind.value === "makeup_lesson"
        ? "makeup"
        : String(lessonStatus.value ?? "scheduled"),
    observation: observation.value.trim() || null,
  };
}

async function submit() {
  error.value = "";
  saving.value = true;

  try {
    if (eventKind.value === "experimental_class") {
      if (!canCreateExperimentalClasses.value) {
        error.value = "Você não tem permissão para criar aulas experimentais.";
        return;
      }

      if (!interestedId.value) {
        error.value = "Selecione o interessado.";
        return;
      }

      if (!experimentalDateClass.value) {
        error.value = "Informe a data da aula experimental.";
        return;
      }

      await createExperimentalClass({
        interested_id: Number(interestedId.value),
        teacher_id: teacherId.value ? Number(teacherId.value) : null,
        date_class: experimentalDateClass.value ?? "",
        status_class: String(experimentalStatus.value ?? "agendada"),
        observations_feedback: experimentalNotes.value.trim() || null,
      });

      notifySaved("Aula experimental", false);
    } else {
      if (!canCreateLessons.value) {
        error.value = "Você não tem permissão para criar aulas.";
        return;
      }

      const payload = validateLessonPayload();
      if (!payload) {
        return;
      }

      await createLesson(payload);
      notifySaved("Aula", false);
    }

    emit("created");
    emit("close");
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao salvar o evento.";
    notify.error(error.value);
  } finally {
    saving.value = false;
  }
}

watch(eventKind, () => {
  lessonStatus.value =
    eventKind.value === "makeup_lesson" ? "makeup" : "scheduled";
  groupClassId.value = null;
  studentId.value = null;
});

watch(
  () => props.initialDateTime,
  (value) => {
    if (value) {
      classDate.value = value.slice(0, 10);
    }
  },
  { immediate: true }
);

onMounted(async () => {
  resetForm();

  if (!eventKindOptions.value.length) {
    error.value = "Você não tem permissão para criar eventos no calendário.";
    return;
  }

  eventKind.value = eventKindOptions.value[0].value;
  await loadOptions();
});
</script>

<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered modal-lg calendar-create-modal">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h5 class="modal-title mb-1">{{ modalTitle }}</h5>
            <p class="text-muted mb-0 small">
              Agende aulas, atribua turma, aluno ou interessado.
            </p>
          </div>
          <button
            type="button"
            class="btn-close"
            aria-label="Fechar"
            :disabled="saving"
            @click="emit('close')"
          ></button>
        </div>

        <div class="modal-body">
          <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
          <div v-if="loadingOptions" class="text-center py-4">Carregando...</div>

          <form v-else @submit.prevent="submit">
            <div class="calendar-create-modal__types mb-4">
              <button
                v-for="option in eventKindOptions"
                :key="option.value"
                type="button"
                class="calendar-create-modal__type"
                :class="{ 'is-active': eventKind === option.value }"
                @click="eventKind = option.value"
              >
                {{ option.label }}
              </button>
            </div>

            <div class="row g-3">
              <!-- Lesson form: pure date selection -->
              <template v-if="isLessonForm">
                <div class="col-md-6">
                  <AppDatePicker
                    id="calendar-create-date"
                    v-model="classDate"
                    label="Data da aula *"
                    placeholder="DD/MM/AAAA"
                    required
                  />
                </div>
              </template>

              <!-- Experimental class: date only -->
              <template v-else>
                <div class="col-md-6">
                  <AppDatePicker
                    id="calendar-create-experimental-date"
                    v-model="experimentalDateClass"
                    label="Data da aula *"
                    placeholder="DD/MM/AAAA"
                    required
                  />
                </div>
              </template>

              <div class="col-md-6">
                <label class="form-label">Professor</label>
                <SingleSelect
                  v-model="teacherId"
                  :options="teacherOptions"
                  placeholder="Selecione um professor"
                />
              </div>

              <template v-if="isLessonForm">
                <div class="col-md-6">
                  <label class="form-label" for="calendar-create-topic">
                    Tópico <span class="text-danger">*</span>
                  </label>
                  <input
                    id="calendar-create-topic"
                    v-model="topic"
                    type="text"
                    class="form-control"
                    placeholder="Ex.: Present perfect review"
                  />
                </div>

                <div
                  v-if="eventKind === 'group_lesson'"
                  class="col-md-6"
                >
                  <label class="form-label">Turma <span class="text-danger">*</span></label>
                  <SingleSelect
                    v-model="groupClassId"
                    :options="groupClassOptions"
                    placeholder="Selecione a turma"
                  />
                </div>

                <div
                  v-if="eventKind === 'individual_lesson' || eventKind === 'makeup_lesson'"
                  class="col-md-6"
                >
                  <label class="form-label">Aluno <span class="text-danger">*</span></label>
                  <SingleSelect
                    v-model="studentId"
                    :options="studentOptions"
                    placeholder="Selecione o aluno"
                  />
                </div>

                <div
                  v-if="eventKind !== 'makeup_lesson'"
                  class="col-md-6"
                >
                  <label class="form-label">Status</label>
                  <SingleSelect
                    v-model="lessonStatus"
                    :options="lessonStatusOptions"
                    :searchable="false"
                  />
                </div>

                <div class="col-12">
                  <label class="form-label" for="calendar-create-observation">
                    Observação
                  </label>
                  <textarea
                    id="calendar-create-observation"
                    v-model="observation"
                    class="form-control"
                    rows="3"
                    placeholder="Detalhes adicionais da aula"
                  ></textarea>
                </div>
              </template>

              <template v-else>
                <div class="col-md-6">
                  <label class="form-label">
                    Interessado <span class="text-danger">*</span>
                  </label>
                  <SingleSelect
                    v-model="interestedId"
                    :options="leadOptions"
                    placeholder="Selecione o interessado"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Status</label>
                  <SingleSelect
                    v-model="experimentalStatus"
                    :options="experimentalStatusOptions"
                    :searchable="false"
                  />
                </div>

                <div class="col-12">
                  <label class="form-label" for="calendar-create-experimental-notes">
                    Observações
                  </label>
                  <textarea
                    id="calendar-create-experimental-notes"
                    v-model="experimentalNotes"
                    class="form-control"
                    rows="3"
                    placeholder="Feedback ou observações da aula experimental"
                  ></textarea>
                </div>
              </template>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            :disabled="saving"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="saving || loadingOptions || !eventKindOptions.length"
            @click="submit"
          >
            {{ saving ? "Salvando..." : "Salvar no calendário" }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<style scoped>
.calendar-create-modal__types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.calendar-create-modal__type {
  border: 1px solid #dadce0;
  border-radius: 999px;
  background: #fff;
  color: #5f6368;
  font-size: 0.82rem;
  font-weight: 500;
  padding: 0.45rem 0.9rem;
}

.calendar-create-modal__type.is-active {
  border-color: #1a73e8;
  background: #e8f0fe;
  color: #1a73e8;
}
</style>
