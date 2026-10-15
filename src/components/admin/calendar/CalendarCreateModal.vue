<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import AppDatePicker from "@/components/ui/AppDatePicker.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { notify, notifySaved } from "@/lib/actionNotification";
import type { CalendarCreateKind, CalendarMockEvent } from "@/lib/calendar/types";
import {
  createExperimentalClass,
  getExperimentalClass,
  getExperimentalClassPlucks,
  toDateTimeLocalValue,
  updateExperimentalClass,
} from "@/lib/experimentalClasses";
import {
  createLesson,
  getLesson,
  updateLesson,
  type LessonPayload,
} from "@/lib/lessons";
import { listGroupClasses } from "@/lib/groupClasses";
import { listStudents } from "@/lib/students";
import { listTeachers } from "@/lib/teachers";

const props = defineProps<{
  initialDateTime?: string;
  /** Quando informado, abre o modal em modo edição (aula ou experimental). */
  editEvent?: CalendarMockEvent | null;
}>();

const emit = defineEmits<{
  close: [];
  created: [];
}>();

const {
  canCreateLessons,
  canCreateExperimentalClasses,
  canUpdateLessons,
  canUpdateExperimentalClasses,
  canViewGoogleCalendar,
} = usePermissions();

const isEditMode = computed(() => Boolean(props.editEvent?.sourceId));

const editingRecordId = ref<number | null>(null);

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
const googleInviteAttendees = ref(true);

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
  const prefix = isEditMode.value ? "Editar" : "Nova";

  switch (eventKind.value) {
    case "group_lesson":
      return `${prefix} aula em turma`;
    case "individual_lesson":
      return `${prefix} aula individual`;
    case "makeup_lesson":
      return `${prefix} reposição`;
    default:
      return `${prefix} aula experimental`;
  }
});

const modalSubtitle = computed(() =>
  isEditMode.value
    ? "Altere horário, status ou detalhes sem sair do calendário."
    : "Agende aulas, atribua turma, aluno ou interessado."
);

const saveButtonLabel = computed(() => {
  if (saving.value) {
    return "Salvando...";
  }

  return isEditMode.value ? "Salvar alterações" : "Salvar no calendário";
});

function durationMinutesFromEvent(event: CalendarMockEvent): number {
  const minutes = Math.round(
    (new Date(event.end).getTime() - new Date(event.start).getTime()) / 60_000
  );

  return Number.isFinite(minutes) && minutes >= 15 ? minutes : 60;
}

function normalizeExperimentalStatus(raw: unknown): string {
  const value = String(raw ?? "agendada").toLowerCase();

  if (value === "scheduled") {
    return "agendada";
  }

  if (value === "agendada" || value === "realizada" || value === "cancelada") {
    return value;
  }

  return "agendada";
}

function isExperimentalCalendarEvent(event: CalendarMockEvent): boolean {
  return (
    event.sourceType === "experimental" ||
    event.kind === "experimental_class" ||
    event.id.startsWith("experimental-")
  );
}

function lessonKindFromRecord(lesson: {
  status: string;
  group_class_id?: number | null;
}): CalendarCreateKind {
  if (lesson.status === "makeup") {
    return "makeup_lesson";
  }

  return lesson.group_class_id ? "group_lesson" : "individual_lesson";
}

async function populateFromEditEvent(event: CalendarMockEvent) {
  if (!event.sourceId) {
    error.value = "Evento sem referência para edição.";
    return;
  }

  loadingOptions.value = true;
  error.value = "";
  editingRecordId.value = event.sourceId;

  try {
    if (isExperimentalCalendarEvent(event)) {
      if (!canUpdateExperimentalClasses.value) {
        error.value = "Você não tem permissão para editar aulas experimentais.";
        return;
      }

      eventKind.value = "experimental_class";
      const item = await getExperimentalClass(event.sourceId);
      classDatetime.value = toDateTimeLocalValue(item.date_class);
      durationMinutes.value = durationMinutesFromEvent(event);
      teacherId.value = item.teacher_id ?? null;
      interestedId.value = item.interested_id;
      experimentalStatus.value = normalizeExperimentalStatus(item.status_class);
      experimentalNotes.value = item.observations_feedback ?? "";
      return;
    }

    if (!event.id.startsWith("lesson-")) {
      error.value = "Este evento só pode ser editado na tela dedicada.";
      return;
    }

    if (!canUpdateLessons.value) {
      error.value = "Você não tem permissão para editar aulas.";
      return;
    }

    const lesson = await getLesson(event.sourceId);
    eventKind.value = lessonKindFromRecord(lesson);
    topic.value = lesson.topic ?? "";
    classDatetime.value = lesson.class_datetime
      ? lesson.class_datetime.slice(0, 16)
      : toDateTimeLocalValue(event.start);
    durationMinutes.value = durationMinutesFromEvent(event);
    teacherId.value = lesson.teacher_id ?? null;
    groupClassId.value = lesson.group_class_id ?? null;
    studentId.value = lesson.student_id ?? null;
    lessonStatus.value =
      eventKind.value === "makeup_lesson" ? "makeup" : (lesson.status ?? "scheduled");
    observation.value = lesson.observation ?? "";
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar dados para edição.";
  } finally {
    loadingOptions.value = false;
  }
}

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
  googleInviteAttendees.value = true;
}

async function loadOptions() {
  loadingOptions.value = true;

  try {
    const [teachersResult, groupClassesResult, studentsResult, experimentalPlucks] =
      await Promise.all([
        listTeachers({ limit: 200 }),
        listGroupClasses({ limit: 200 }),
        listStudents({ limit: 200 }),
        canCreateExperimentalClasses.value ||
        canUpdateExperimentalClasses.value
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
    google_invite_attendees: googleInviteAttendees.value,
  };
}

async function submit() {
  error.value = "";
  saving.value = true;

  try {
    if (eventKind.value === "experimental_class") {
      if (isEditMode.value) {
        if (!canUpdateExperimentalClasses.value || !editingRecordId.value) {
          error.value = "Você não tem permissão para editar aulas experimentais.";
          return;
        }

        if (!interestedId.value) {
          error.value = "Selecione o interessado.";
          return;
        }

        if (!classDatetime.value) {
          error.value = "Informe a data e hora.";
          return;
        }

        if (!experimentalStatus.value) {
          error.value = "Selecione o status.";
          return;
        }

        await updateExperimentalClass(editingRecordId.value, {
          interested_id: Number(interestedId.value),
          teacher_id: teacherId.value ? Number(teacherId.value) : null,
          date_class: classDatetime.value,
          status_class: String(experimentalStatus.value ?? "agendada"),
          observations_feedback: experimentalNotes.value.trim() || null,
          google_invite_attendees: googleInviteAttendees.value,
        });

        notifySaved("Aula experimental", true);
        emit("created");
        emit("close");
        return;
      }

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

      if (!experimentalStatus.value) {
        error.value = "Selecione o status.";
        return;
      }

      await createExperimentalClass({
        interested_id: Number(interestedId.value),
        teacher_id: teacherId.value ? Number(teacherId.value) : null,
        date_class: experimentalDateClass.value ?? "",
        status_class: String(experimentalStatus.value ?? "agendada"),
        observations_feedback: experimentalNotes.value.trim() || null,
        google_invite_attendees: googleInviteAttendees.value,
      });

      notifySaved("Aula experimental", false);
    } else {
      const payload = validateLessonPayload();
      if (!payload) {
        return;
      }

      if (isEditMode.value) {
        if (!canUpdateLessons.value || !editingRecordId.value) {
          error.value = "Você não tem permissão para editar aulas.";
          return;
        }

        await updateLesson(editingRecordId.value, payload);
        notifySaved("Aula", true);
      } else {
        if (!canCreateLessons.value) {
          error.value = "Você não tem permissão para criar aulas.";
          return;
        }

        await createLesson(payload);
        notifySaved("Aula", false);
      }
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
  if (isEditMode.value) {
    return;
  }

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
  document.body.classList.add("modal-open");

  if (isEditMode.value && props.editEvent) {
    await loadOptions();
    await populateFromEditEvent(props.editEvent);
    return;
  }

  resetForm();

  if (!eventKindOptions.value.length) {
    error.value = "Você não tem permissão para criar eventos no calendário.";
    return;
  }

  eventKind.value = eventKindOptions.value[0].value;
  await loadOptions();
});

onUnmounted(() => {
  document.body.classList.remove("modal-open");
});
</script>

<template>
  <Teleport to="body">
    <div
      class="calendar-create-modal-root modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg calendar-create-modal">
        <div class="modal-content">
        <div class="modal-header">
          <div>
            <h5 class="modal-title mb-1">{{ modalTitle }}</h5>
            <p class="text-muted mb-0 small">
              {{ modalSubtitle }}
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
            <div
              v-if="!isEditMode && eventKindOptions.length"
              class="calendar-create-modal__types mb-4"
            >
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

                <div v-if="canViewGoogleCalendar" class="col-12">
                  <div class="form-check">
                    <input
                      id="calendar-create-google-invite"
                      v-model="googleInviteAttendees"
                      class="form-check-input"
                      type="checkbox"
                    />
                    <label class="form-check-label" for="calendar-create-google-invite">
                      Enviar convite por e-mail (Google Calendar)
                    </label>
                  </div>
                  <p class="form-text mb-0">
                    Usa o e-mail do aluno ou dos matriculados na turma. Requer conta Google
                    vinculada e evento criado no Google.
                  </p>
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

              <template v-if="eventKind === 'experimental_class'">
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
                  <label class="form-label" for="calendar-create-experimental-status">
                    Status <span class="text-danger">*</span>
                  </label>
                  <select
                    id="calendar-create-experimental-status"
                    v-model="experimentalStatus"
                    class="form-select"
                    required
                  >
                    <option
                      v-for="option in experimentalStatusOptions"
                      :key="String(option.value)"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div v-if="canViewGoogleCalendar" class="col-12">
                  <div class="form-check">
                    <input
                      id="calendar-create-google-invite-experimental"
                      v-model="googleInviteAttendees"
                      class="form-check-input"
                      type="checkbox"
                    />
                    <label
                      class="form-check-label"
                      for="calendar-create-google-invite-experimental"
                    >
                      Enviar convite por e-mail (Google Calendar)
                    </label>
                  </div>
                  <p class="form-text mb-0">
                    Usa o e-mail do interessado cadastrado no lead.
                  </p>
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
            :disabled="
              saving ||
              loadingOptions ||
              (!isEditMode && !eventKindOptions.length)
            "
            @click="submit"
          >
            {{ saveButtonLabel }}
          </button>
        </div>
      </div>
    </div>
    </div>
  </Teleport>
</template>

<style scoped>
.calendar-create-modal-root {
  position: fixed;
  inset: 0;
  z-index: 10050;
  overflow-x: hidden;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(2px);
}

.calendar-create-modal-root .modal-dialog {
  margin: 1.75rem auto;
  pointer-events: auto;
}

.calendar-create-modal-root :deep(.single-select__dropdown) {
  z-index: 10060;
}

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
