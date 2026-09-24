<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { listTeachers } from "@/lib/teachers";
import { listEnrollments } from "@/lib/enrollments";
import { listMakeupClasses } from "@/lib/makeupClasses";
import { registerStudentClass, type RegisterStudentClassResponse } from "@/lib/studentClasses";
import { notify } from "@/lib/actionNotification";
import type { Student, Teacher, Enrollment, MakeupClass } from "@/lib/types";

const props = defineProps<{
  show: boolean;
  studentId: number;
  student?: Student | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved", response: RegisterStudentClassResponse): void;
}>();

// ── State ──────────────────────────────────────────────────────────────────
const loadingData = ref(false);
const submitting = ref(false);
const errors = ref<Record<string, string[]>>({});
const generalError = ref("");

const teachers = ref<Teacher[]>([]);
const enrollments = ref<Enrollment[]>([]);
const availableMakeups = ref<MakeupClass[]>([]);

// Form State
const selectedEnrollmentId = ref<string>("");
const classType = ref<"regular" | "makeup" | "extra">("regular");
const selectedMakeupClassId = ref<string>("");
const consumeNewCredit = ref<boolean>(false);
const selectedTeacherId = ref<string>("");
const classDate = ref<string>("");
const startTime = ref<string>("09:00");
const durationMinutes = ref<number>(60);
const topic = ref<string>("");
const notes = ref<string>("");

// ── Computed Options ───────────────────────────────────────────────────────
const enrollmentOptions = computed<SelectOption[]>(() => {
  return enrollments.value.map((enr) => {
    const planName =
      (enr.relationships?.plan_variant as any)?.plan?.name ??
      (enr.plan_variant as any)?.plan?.name ??
      `Plano #${enr.plan_variant_id ?? enr.id}`;
    const mode = enr.is_group_class
      ? `Turma: ${(enr.relationships?.group_class as any)?.name ?? 'Grupo'}`
      : "Individual";
    return {
      value: String(enr.id),
      label: `Matrícula #${enr.id} - ${planName} (${mode})`,
    };
  });
});

const selectedEnrollment = computed<Enrollment | null>(() => {
  if (!selectedEnrollmentId.value) return null;
  return enrollments.value.find((e) => String(e.id) === String(selectedEnrollmentId.value)) ?? null;
});

const teacherOptions = computed<SelectOption[]>(() => {
  return teachers.value.map((t) => ({
    value: String(t.id),
    label: t.name,
  }));
});

const makeupOptions = computed<SelectOption[]>(() => {
  return availableMakeups.value.map((m) => {
    const origDate = m.original_date ? new Date(m.original_date).toLocaleDateString("pt-BR") : "—";
    const expDate = m.expired_date ? new Date(m.expired_date).toLocaleDateString("pt-BR") : "—";
    return {
      value: String(m.id),
      label: `Falta de ${origDate} (Expira: ${expDate}) - #${m.id}`,
    };
  });
});

const durationOptions: SelectOption[] = [
  { value: 30, label: "30 minutos" },
  { value: 45, label: "45 minutos" },
  { value: 50, label: "50 minutos" },
  { value: 60, label: "60 minutos (1h)" },
  { value: 90, label: "90 minutos (1h30)" },
  { value: 120, label: "120 minutos (2h)" },
];

const endTime = computed(() => {
  if (!startTime.value) return "--:--";
  const [hours, mins] = startTime.value.split(":").map(Number);
  if (isNaN(hours) || isNaN(mins)) return "--:--";

  const d = new Date();
  d.setHours(hours, mins, 0, 0);
  d.setMinutes(d.getMinutes() + Number(durationMinutes.value || 60));
  return d.toTimeString().slice(0, 5);
});

// ── Helpers ────────────────────────────────────────────────────────────────
function initDefaults() {
  const today = new Date();
  // Set date to today in YYYY-MM-DD
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  classDate.value = `${yyyy}-${mm}-${dd}`;

  errors.value = {};
  generalError.value = "";
  classType.value = "regular";
  topic.value = "";
  notes.value = "";
  consumeNewCredit.value = false;
  selectedMakeupClassId.value = "";

  // Auto-select single enrollment
  if (enrollments.value.length === 1) {
    selectedEnrollmentId.value = String(enrollments.value[0].id);
  } else if (enrollments.value.length > 0 && !selectedEnrollmentId.value) {
    selectedEnrollmentId.value = String(enrollments.value[0].id);
  }

  // Pre-select default teacher
  assignDefaultTeacher();
}

function assignDefaultTeacher() {
  if (selectedEnrollment.value?.teacher_id) {
    selectedTeacherId.value = String(selectedEnrollment.value.teacher_id);
    return;
  }
  if (props.student?.current_teacher_assignment?.teacher_id) {
    selectedTeacherId.value = String(props.student.current_teacher_assignment.teacher_id);
    return;
  }
  if (teachers.value.length > 0 && !selectedTeacherId.value) {
    selectedTeacherId.value = String(teachers.value[0].id);
  }
}

watch(selectedEnrollmentId, () => {
  assignDefaultTeacher();
});

// ── Fetch Initial Data ─────────────────────────────────────────────────────
async function loadData() {
  loadingData.value = true;
  generalError.value = "";
  try {
    const [teachersRes, enrollRes, makeupsRes] = await Promise.all([
      listTeachers({ limit: 100 }),
      listEnrollments({ student_id: props.studentId, limit: 50 }),
      listMakeupClasses({ student_id: props.studentId, status: "available", limit: 50 }),
    ]);

    teachers.value = teachersRes.data;
    // Filter active/confirmed/submitted or non-cancelled enrollments
    enrollments.value = enrollRes.data.filter((e) => e.status !== "cancelled");
    availableMakeups.value = makeupsRes.data;

    initDefaults();
  } catch (err: any) {
    generalError.value = "Erro ao carregar dados necessários para agendamento.";
    console.error("Failed to load modal data", err);
  } finally {
    loadingData.value = false;
  }
}

watch(
  () => props.show,
  (val) => {
    if (val) {
      loadData();
    }
  },
  { immediate: true }
);

// ── Form Submit ────────────────────────────────────────────────────────────
async function handleSubmit() {
  errors.value = {};
  generalError.value = "";

  if (!selectedEnrollmentId.value) {
    errors.value.enrollment_id = ["Selecione uma matrícula ativa."];
    return;
  }
  if (!selectedTeacherId.value) {
    errors.value.teacher_id = ["Selecione o professor responsável."];
    return;
  }
  if (!classDate.value || !startTime.value) {
    errors.value.scheduled_at = ["Defina a data e o horário da aula."];
    return;
  }

  if (classType.value === "makeup" && !consumeNewCredit.value && !selectedMakeupClassId.value) {
    if (availableMakeups.value.length > 0) {
      errors.value.makeup_class_id = ["Selecione um crédito de reposição disponível ou marque para consumir novo crédito."];
      return;
    } else {
      consumeNewCredit.value = true;
    }
  }

  const scheduledAt = `${classDate.value}T${startTime.value}:00`;

  submitting.value = true;
  try {
    const response = await registerStudentClass(props.studentId, {
      enrollment_id: Number(selectedEnrollmentId.value),
      class_type: classType.value,
      teacher_id: Number(selectedTeacherId.value),
      scheduled_at: scheduledAt,
      duration_minutes: Number(durationMinutes.value || 60),
      makeup_class_id:
        classType.value === "makeup" && !consumeNewCredit.value && selectedMakeupClassId.value
          ? Number(selectedMakeupClassId.value)
          : null,
      consume_new_credit: consumeNewCredit.value,
      topic: topic.value.trim() || undefined,
      notes: notes.value.trim() || null,
    });

    notify.success("Aula agendada com sucesso!");
    emit("saved", response);
    emit("close");
  } catch (err: any) {
    if (err && typeof err === "object" && err.errors) {
      if (typeof err.errors === "object" && !Array.isArray(err.errors)) {
        errors.value = err.errors;
      } else if (Array.isArray(err.errors)) {
        generalError.value = err.errors.join(", ");
      } else {
        generalError.value = String(err.errors);
      }
    } else {
      generalError.value = err?.message || "Erro ao agendar aula. Verifique os dados.";
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal fade show d-block class-modal-backdrop"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content shadow-lg border-0">

          <!-- Header -->
          <div class="modal-header bg-primary text-white py-3 px-4">
            <div class="d-flex align-items-center gap-2">
              <i class="la la-calendar-plus fs-4"></i>
              <div>
                <h5 class="modal-title mb-0 text-white fw-bold">Registrar Nova Aula</h5>
                <small class="text-white-50">Agendamento direto no perfil de {{ student?.name || 'Aluno' }}</small>
              </div>
            </div>
            <button
              type="button"
              class="btn-close btn-close-white"
              aria-label="Fechar"
              :disabled="submitting"
              @click="emit('close')"
            ></button>
          </div>

          <!-- Body -->
          <div class="modal-body p-4">
            <div v-if="loadingData" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
              </div>
              <p class="text-muted mt-2 mb-0">Carregando dados da matrícula e professores...</p>
            </div>

            <div v-else>
              <!-- Alert Errors -->
              <div v-if="generalError" class="alert alert-danger py-2 px-3 mb-3 d-flex align-items-center gap-2">
                <i class="la la-exclamation-circle fs-5"></i>
                <span>{{ generalError }}</span>
              </div>

              <form @submit.prevent="handleSubmit">

                <!-- Row 1: Enrollment & Modality Badge -->
                <div class="row g-3 mb-3">
                  <div class="col-md-8">
                    <label class="form-label fw-semibold">
                      Matrícula / Curso <span class="text-danger">*</span>
                    </label>
                    <SingleSelect
                      v-model="selectedEnrollmentId"
                      :options="enrollmentOptions"
                      placeholder="Selecione a matrícula ativa..."
                      :disabled="enrollments.length <= 1"
                    />
                    <div v-if="errors.enrollment_id" class="text-danger small mt-1">
                      {{ errors.enrollment_id.join(', ') }}
                    </div>
                  </div>

                  <div class="col-md-4">
                    <label class="form-label fw-semibold">Modalidade</label>
                    <div class="form-control-plaintext bg-light rounded px-3 py-2 border d-flex align-items-center justify-content-between">
                      <span class="fw-semibold">
                        {{ selectedEnrollment?.is_group_class ? 'Turma em Grupo' : 'Individual' }}
                      </span>
                      <span
                        class="badge"
                        :class="selectedEnrollment?.is_group_class ? 'badge-primary' : 'badge-info'"
                      >
                        {{ selectedEnrollment?.is_group_class ? 'Turma' : 'VIP' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Row 2: Class Type (Segmented Buttons) -->
                <div class="mb-3">
                  <label class="form-label fw-semibold d-block">Tipo de Aula <span class="text-danger">*</span></label>
                  <div class="btn-group w-100" role="group">
                    <input
                      type="radio"
                      class="btn-check"
                      name="classType"
                      id="typeRegular"
                      value="regular"
                      v-model="classType"
                    />
                    <label class="btn btn-outline-primary py-2" for="typeRegular">
                      <i class="la la-book-open me-1"></i> Regular (Currículo)
                    </label>

                    <input
                      type="radio"
                      class="btn-check"
                      name="classType"
                      id="typeMakeup"
                      value="makeup"
                      v-model="classType"
                    />
                    <label class="btn btn-outline-primary py-2" for="typeMakeup">
                      <i class="la la-history me-1"></i> Reposição (Make-up)
                    </label>

                    <input
                      type="radio"
                      class="btn-check"
                      name="classType"
                      id="typeExtra"
                      value="extra"
                      v-model="classType"
                    />
                    <label class="btn btn-outline-primary py-2" for="typeExtra">
                      <i class="la la-star me-1"></i> Aula Avulsa / Extra
                    </label>
                  </div>
                </div>

                <!-- Conditional: Make-up Credit Selection -->
                <div
                  v-if="classType === 'makeup'"
                  class="p-3 mb-3 bg-light rounded-3 border border-warning-subtle"
                >
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="form-label fw-bold text-dark mb-0">
                      <i class="la la-ticket-alt text-warning me-1"></i> Crédito de Reposição
                    </label>
                    <span v-if="availableMakeups.length" class="badge bg-emerald-subtle text-emerald">
                      {{ availableMakeups.length }} créditos disponíveis
                    </span>
                    <span v-else class="badge bg-warning-subtle text-warning">
                      Sem créditos pendentes
                    </span>
                  </div>

                  <div v-if="!consumeNewCredit && availableMakeups.length > 0" class="mb-2">
                    <SingleSelect
                      v-model="selectedMakeupClassId"
                      :options="makeupOptions"
                      placeholder="Vincular a uma falta existente..."
                    />
                    <div v-if="errors.makeup_class_id" class="text-danger small mt-1">
                      {{ errors.makeup_class_id.join(', ') }}
                    </div>
                  </div>

                  <div class="form-check mt-2">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="checkNewCredit"
                      v-model="consumeNewCredit"
                    />
                    <label class="form-check-label small fw-semibold text-secondary" for="checkNewCredit">
                      Consumir novo crédito do ciclo contratado (saldo automático)
                    </label>
                  </div>
                </div>

                <!-- Row 3: Teacher & Schedule -->
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">
                      Professor <span class="text-danger">*</span>
                    </label>
                    <SingleSelect
                      v-model="selectedTeacherId"
                      :options="teacherOptions"
                      placeholder="Selecione o professor..."
                    />
                    <div v-if="errors.teacher_id" class="text-danger small mt-1">
                      {{ errors.teacher_id.join(', ') }}
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label fw-semibold">
                      Data da Aula <span class="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="classDate"
                      required
                    />
                    <div v-if="errors.scheduled_at" class="text-danger small mt-1">
                      {{ errors.scheduled_at.join(', ') }}
                    </div>
                  </div>
                </div>

                <!-- Row 4: Time & Duration -->
                <div class="row g-3 mb-3">
                  <div class="col-md-4">
                    <label class="form-label fw-semibold">
                      Horário Início <span class="text-danger">*</span>
                    </label>
                    <input
                      type="time"
                      class="form-control"
                      v-model="startTime"
                      required
                    />
                  </div>

                  <div class="col-md-4">
                    <label class="form-label fw-semibold">Duração</label>
                    <SingleSelect
                      v-model="durationMinutes"
                      :options="durationOptions"
                      :searchable="false"
                      placeholder="Duração da aula..."
                    />
                  </div>

                  <div class="col-md-4">
                    <label class="form-label fw-semibold">Horário Término</label>
                    <input
                      type="text"
                      class="form-control bg-light"
                      :value="endTime"
                      readonly
                    />
                  </div>
                </div>

                <!-- Row 5: Topic & Notes -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">Tópico / Conteúdo da Aula</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Ex: Unit 4 - Present Perfect & Conversation Practice"
                    v-model="topic"
                  />
                  <div v-if="errors.topic" class="text-danger small mt-1">
                    {{ errors.topic.join(', ') }}
                  </div>
                </div>

                <div class="mb-2">
                  <label class="form-label fw-semibold">Observações / Pauta (Opcional)</label>
                  <textarea
                    class="form-control"
                    rows="2"
                    placeholder="Orientações adicionais ou motivos do agendamento..."
                    v-model="notes"
                  ></textarea>
                  <div v-if="errors.notes" class="text-danger small mt-1">
                    {{ errors.notes.join(', ') }}
                  </div>
                </div>

              </form>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer bg-light px-4 py-3 border-top">
            <button
              type="button"
              class="btn btn-outline-secondary"
              :disabled="submitting"
              @click="emit('close')"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="submitting || loadingData"
              @click="handleSubmit"
            >
              <span
                v-if="submitting"
                class="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
              <span>{{ submitting ? 'Salvando...' : 'Salvar agendamento' }}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.class-modal-backdrop {
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(3px);
  z-index: 1055;
}

.modal-dialog {
  max-width: 680px;
}

.bg-emerald-subtle {
  background-color: #d1fae5;
}
.text-emerald {
  color: #065f46;
}

.badge-info {
  background-color: #e0f2fe;
  color: #0369a1;
}

.btn-check:checked + .btn-outline-primary {
  background-color: var(--primary, #0d6efd);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(13, 110, 253, 0.25);
}
</style>
