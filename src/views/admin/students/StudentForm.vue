<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import AppCombobox from "@/components/ui/AppCombobox.vue";
import AppDatePicker from "@/components/ui/AppDatePicker.vue";
import MultiSelect from "@/components/ui/MultiSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { getGroupClassOptions } from "@/lib/groupClasses";
import { listPlans } from "@/lib/plans";
import { buildActivePlanVariantOptions } from "@/lib/plans/format";
import { listTeachers } from "@/lib/teachers";
import { createStudent, getStudent, updateStudent } from "@/lib/students";
import {
  getStudentCurrentPlanVariant,
  getStudentCurrentTeacher,
} from "@/lib/students/format";
import { maskCpf, maskPhone, onlyDigits } from "@/lib/br/masks";
import {
  isValidCpf,
  isValidPhone,
  getTodayDateFortaleza,
} from "@/lib/br/validators";
import type { ApiError } from "@/lib/api";
import { notifySaved } from "@/lib/actionNotification";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => Boolean(route.params.id));
const studentId = computed(() => Number(route.params.id));

const name = ref("");
const email = ref("");
const cpf = ref("");
const phone = ref("");
const address = ref("");
const birthdate = ref("");
const status = ref("active");
const startDate = ref("");
const endDate = ref("");
const teacherId = ref<string | null>(null);
const planVariantId = ref<string | null>(null);
const groupClassIds = ref<number[]>([]);
const teacherOptions = ref<SelectOption[]>([]);
const planVariantOptions = ref<SelectOption[]>([]);
const groupClassOptions = ref<SelectOption[]>([]);

const loading = ref(false);
const saving = ref(false);
const error = ref("");
const serverErrorList = ref<string[]>([]);
const cpfDuplicateWarning = ref(false);

const fieldErrors = ref<Record<string, string>>({
  name: "",
  email: "",
  cpf: "",
  phone: "",
  address: "",
  birthdate: "",
  status: "",
  start_date: "",
  end_date: "",
  teacher_id: "",
  plan_variant_id: "",
});

const todayDateFortaleza = getTodayDateFortaleza();

const statusOptions: SelectOption[] = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
  { value: "pending", label: "Pendente" },
];

async function loadTeacherOptions() {
  const result = await listTeachers({ status: "active", limit: 100 });
  teacherOptions.value = result.data.map((teacher) => ({
    value: String(teacher.id),
    label: teacher.name,
  }));
}

async function loadPlanVariantOptions() {
  const result = await listPlans({ active: true, limit: 100 });
  planVariantOptions.value = buildActivePlanVariantOptions(result.data);
}

async function loadGroupClassOptions() {
  const result = await getGroupClassOptions();
  groupClassOptions.value = Object.entries(result).map(([value, label]) => ({
    value: Number(value),
    label,
  }));
}

async function loadForm() {
  loading.value = true;
  error.value = "";

  try {
    await Promise.all([loadTeacherOptions(), loadPlanVariantOptions(), loadGroupClassOptions()]);

    if (!isEdit.value) return;

    const student = await getStudent(studentId.value);
    name.value = student.name || "";
    email.value = student.email || "";
    cpf.value = student.cpf ? maskCpf(student.cpf) : "";
    phone.value = student.phone ? maskPhone(student.phone) : "";
    address.value = student.address || "";
    birthdate.value = student.birthdate ? student.birthdate.split("T")[0] : "";
    status.value = student.status || "active";
    startDate.value = student.start_date ? student.start_date.split("T")[0] : "";
    endDate.value = student.end_date ? student.end_date.split("T")[0] : "";

    const currentTeacher = getStudentCurrentTeacher(student);
    teacherId.value = currentTeacher ? String(currentTeacher.id) : null;

    const currentPlanVariant = getStudentCurrentPlanVariant(student);
    planVariantId.value = currentPlanVariant?.id ? String(currentPlanVariant.id) : null;

    groupClassIds.value =
      student.relationships?.group_classes?.map((g: any) => g.id) ??
      (student as any).group_classes?.map((g: any) => g.id) ??
      [];
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar dados do aluno";
  } finally {
    loading.value = false;
  }
}


function normalizeDatePayload(val?: string | null): string | undefined {
  if (!val) return undefined;
  const s = String(val).trim();
  if (!s) return undefined;

  // Se vier no formato DD/MM/AAAA converte para YYYY-MM-DD
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split("/");
    return `${y}-${m}-${d}`;
  }

  return s.split("T")[0];
}

function validateClientSide(): boolean {
  fieldErrors.value = {
    name: "",
    email: "",
    cpf: "",
    phone: "",
    address: "",
    birthdate: "",
    status: "",
    start_date: "",
    end_date: "",
    teacher_id: "",
    plan_variant_id: "",
  };
  serverErrorList.value = [];
  cpfDuplicateWarning.value = false;

  let valid = true;

  if (!name.value.trim()) {
    fieldErrors.value.name = "O campo nome completo é obrigatório.";
    valid = false;
  }

  if (!email.value.trim()) {
    fieldErrors.value.email = "O campo e-mail é obrigatório.";
    valid = false;
  }

  // CPF é obrigatório no create e facultativo no update (se informado, deve ser válido)
  if (!isEdit.value && !cpf.value.trim()) {
    fieldErrors.value.cpf = "O campo CPF é obrigatório.";
    valid = false;
  } else if (cpf.value.trim() && !isValidCpf(cpf.value)) {
    fieldErrors.value.cpf = "Informe um CPF válido com 11 dígitos verificadores.";
    valid = false;
  }

  // Telefone client-side validation
  if (phone.value.trim() && !isValidPhone(phone.value)) {
    fieldErrors.value.phone = "Informe um telefone válido com DDD (10 ou 11 dígitos).";
    valid = false;
  }

  // Data de nascimento não pode ser no futuro (America/Fortaleza)
  const normBirthdate = normalizeDatePayload(birthdate.value);
  if (normBirthdate) {
    if (normBirthdate > todayDateFortaleza) {
      fieldErrors.value.birthdate = "A data de nascimento não pode ser uma data futura.";
      valid = false;
    } else if (normBirthdate < "1900-01-01") {
      fieldErrors.value.birthdate = "A data de nascimento deve ser posterior a 01/01/1900.";
      valid = false;
    }
  }

  if (!status.value) {
    fieldErrors.value.status = "O campo status é obrigatório.";
    valid = false;
  }

  return valid;
}

function parseAndDistributeErrors(errData: unknown) {
  serverErrorList.value = [];

  const rawMessages: string[] = [];

  if (Array.isArray(errData)) {
    for (const item of errData) {
      if (typeof item === "string") rawMessages.push(item);
    }
  } else if (errData && typeof errData === "object") {
    for (const [key, val] of Object.entries(errData as Record<string, unknown>)) {
      const msg = Array.isArray(val) ? String(val[0]) : String(val);

      if (key in fieldErrors.value) {
        fieldErrors.value[key] = msg;
      }
      rawMessages.push(msg);

      if (
        key === "cpf" &&
        (msg.toLowerCase().includes("já está cadastrado") ||
          msg.toLowerCase().includes("já foi cadastrado") ||
          msg.toLowerCase().includes("já foi informado") ||
          msg.toLowerCase().includes("has already been taken"))
      ) {
        cpfDuplicateWarning.value = true;
      }
    }
  } else if (typeof errData === "string") {
    rawMessages.push(errData);
  }

  serverErrorList.value = rawMessages;

  // Se recebemos array de mensagens (padrão Laravel failedValidation), mapear por conteúdo
  for (const msg of rawMessages) {
    const lower = msg.toLowerCase();

    if (lower.includes("cpf")) {
      fieldErrors.value.cpf = msg;
      if (
        lower.includes("já está cadastrado") ||
        lower.includes("já foi cadastrado") ||
        lower.includes("has already been taken")
      ) {
        cpfDuplicateWarning.value = true;
      }
    } else if (lower.includes("telefone") || lower.includes("phone")) {
      fieldErrors.value.phone = msg;
    } else if (lower.includes("data de nascimento") || lower.includes("birthdate")) {
      fieldErrors.value.birthdate = msg;
    } else if (lower.includes("nome") || lower.includes("name")) {
      fieldErrors.value.name = msg;
    } else if (lower.includes("e-mail") || lower.includes("email")) {
      fieldErrors.value.email = msg;
    } else if (lower.includes("status")) {
      fieldErrors.value.status = msg;
    } else if (lower.includes("data de início") || lower.includes("start_date")) {
      fieldErrors.value.start_date = msg;
    } else if (lower.includes("data de término") || lower.includes("end_date")) {
      fieldErrors.value.end_date = msg;
    }
  }
}

async function submit() {
  if (!validateClientSide()) {
    error.value = "Existem erros de validação nos dados fornecidos.";
    return;
  }

  saving.value = true;
  error.value = "";
  serverErrorList.value = [];
  cpfDuplicateWarning.value = false;

  try {
    const cleanCpf = cpf.value ? onlyDigits(cpf.value) : undefined;
    const cleanPhone = phone.value ? onlyDigits(phone.value) : undefined;

    const payload = {
      name: name.value.trim(),
      email: email.value.trim(),
      cpf: cleanCpf || undefined,
      phone: cleanPhone || undefined,
      address: address.value.trim() || undefined,
      birthdate: normalizeDatePayload(birthdate.value),
      status: status.value,
      start_date: normalizeDatePayload(startDate.value),
      end_date: normalizeDatePayload(endDate.value),
      teacher_id: teacherId.value ? Number(teacherId.value) : null,
      plan_variant_id: planVariantId.value ? Number(planVariantId.value) : null,
      group_class_ids: groupClassIds.value,
    };

    if (isEdit.value) {
      await updateStudent(studentId.value, payload);
    } else {
      await createStudent(payload);
    }

    notifySaved("Aluno", isEdit.value);
    router.push("/students");
  } catch (e) {
    const apiErr = e as ApiError;
    const payload = apiErr.payload as { errors?: unknown; message?: string; msg?: string } | undefined;

    if (apiErr.status === 422 && payload?.errors) {
      parseAndDistributeErrors(payload.errors);
      error.value = "Existem erros de validação nos dados fornecidos.";
    } else {
      error.value = e instanceof Error ? e.message : "Erro ao salvar aluno";
      if (payload?.errors) {
        parseAndDistributeErrors(payload.errors);
      }
    }
  } finally {
    saving.value = false;
  }
}

onMounted(loadForm);

function onCpfInput(event: Event) {
  cpf.value = maskCpf((event.target as HTMLInputElement).value);
  fieldErrors.value.cpf = "";
  cpfDuplicateWarning.value = false;
}

function onPhoneInput(event: Event) {
  phone.value = maskPhone((event.target as HTMLInputElement).value);
  fieldErrors.value.phone = "";
}

function onBirthdateChange(val: string | null) {
  birthdate.value = val || "";
  fieldErrors.value.birthdate = "";
}

function onStartDateChange(val: string | null) {
  startDate.value = val || "";
  fieldErrors.value.start_date = "";
}

function onEndDateChange(val: string | null) {
  endDate.value = val || "";
  fieldErrors.value.end_date = "";
}
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>{{ isEdit ? "Editar aluno" : "Novo aluno" }}</h4>
          <p class="mb-0">Preencha os dados cadastrais do aluno</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <RouterLink to="/students" class="btn btn-outline-primary">Voltar</RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">
      <div class="fw-bold mb-1">{{ error }}</div>
      <ul v-if="serverErrorList.length > 0" class="mb-0 ps-3">
        <li v-for="(errMsg, idx) in serverErrorList" :key="idx">{{ errMsg }}</li>
      </ul>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">Carregando...</div>
            <form v-else @submit.prevent="submit">
              <div class="row">
                <div class="col-lg-6 mb-3">
                  <label class="form-label student-form__label" for="name">Nome completo *</label>
                  <input
                    id="name"
                    v-model.trim="name"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': fieldErrors.name }"
                    required
                  />
                  <div v-if="fieldErrors.name" class="invalid-feedback d-block">
                    {{ fieldErrors.name }}
                  </div>
                </div>
                <div class="col-lg-6 mb-3">
                  <label class="form-label student-form__label" for="email">E-mail *</label>
                  <input
                    id="email"
                    v-model.trim="email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': fieldErrors.email }"
                    required
                  />
                  <div v-if="fieldErrors.email" class="invalid-feedback d-block">
                    {{ fieldErrors.email }}
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-lg-6 mb-3">
                  <label class="form-label student-form__label" for="cpf">CPF *</label>
                  <input
                    id="cpf"
                    :value="cpf"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': fieldErrors.cpf }"
                    inputmode="numeric"
                    maxlength="14"
                    placeholder="000.000.000-00"
                    required
                    @input="onCpfInput"
                  />
                  <div v-if="fieldErrors.cpf" class="invalid-feedback d-block">
                    {{ fieldErrors.cpf }}
                  </div>
                  <div v-if="cpfDuplicateWarning" class="alert alert-warning mt-2 py-2 px-3 small">
                    <i class="la la-info-circle me-1"></i>
                    <strong>Atenção:</strong> Este CPF já se encontra cadastrado. Caso ele não esteja visível na listagem principal, o aluno pode estar com status <em>inativo</em> ou <em>suspenso</em>. Acesse a tela de alunos e utilize o filtro de status para localizá-lo e reativá-lo.
                  </div>
                </div>
                <div class="col-lg-6 mb-3">
                  <label class="form-label student-form__label" for="phone">Telefone</label>
                  <input
                    id="phone"
                    :value="phone"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': fieldErrors.phone }"
                    maxlength="15"
                    placeholder="(00) 00000-0000"
                    @input="onPhoneInput"
                  />
                  <div v-if="fieldErrors.phone" class="invalid-feedback d-block">
                    {{ fieldErrors.phone }}
                  </div>
                </div>
                <div class="col-lg-6 mb-3">
                  <label class="form-label student-form__label" for="address">Endereço</label>
                  <input
                    id="address"
                    v-model.trim="address"
                    type="text"
                    class="form-control"
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-lg-4 mb-3">
                  <AppDatePicker
                    id="birthdate"
                    v-model="birthdate"
                    label="Data de nascimento"
                    placeholder="DD/MM/AAAA"
                    :max="todayDateFortaleza"
                    :error="fieldErrors.birthdate"
                    @update:model-value="onBirthdateChange"
                  />
                </div>
                <div class="col-lg-4 mb-3">
                  <SingleSelect
                    id="status"
                    v-model="status"
                    label="Status"
                    :options="statusOptions"
                    placeholder="Selecione o status"
                    :error="fieldErrors.status"
                    required
                  />
                  <div v-if="fieldErrors.status" class="invalid-feedback d-block">
                    {{ fieldErrors.status }}
                  </div>
                </div>
                <div class="col-lg-4 mb-3">
                  <AppCombobox
                    id="teacherId"
                    v-model="teacherId"
                    label="Professor responsável"
                    :options="teacherOptions"
                    placeholder="Selecione um professor"
                    hint="Deixe vazio para desvincular. Trocar o professor gera histórico."
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-lg-6 mb-3">
                  <AppCombobox
                    id="planVariantId"
                    v-model="planVariantId"
                    label="Plano contratado"
                    :options="planVariantOptions"
                    placeholder="Selecione um plano"
                    hint="Deixe vazio para remover matrícula. Trocar o plano gera histórico."
                  />
                </div>
                <div class="col-lg-3 mb-3">
                  <AppDatePicker
                    id="startDate"
                    v-model="startDate"
                    label="Data de início"
                    placeholder="DD/MM/AAAA"
                    :error="fieldErrors.start_date"
                    @update:model-value="onStartDateChange"
                  />
                  <div v-if="fieldErrors.start_date" class="invalid-feedback d-block">
                    {{ fieldErrors.start_date }}
                  </div>
                </div>
                <div class="col-lg-3 mb-3">
                  <AppDatePicker
                    id="endDate"
                    v-model="endDate"
                    label="Data de término"
                    placeholder="DD/MM/AAAA"
                    :error="fieldErrors.end_date"
                    @update:model-value="onEndDateChange"
                  />
                  <div v-if="fieldErrors.end_date" class="invalid-feedback d-block">
                    {{ fieldErrors.end_date }}
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-12 mb-3">
                  <MultiSelect
                    id="groupClassIds"
                    v-model="groupClassIds"
                    label="Turmas Matriculadas"
                    :options="groupClassOptions"
                    placeholder="Selecione as turmas em que o aluno está matriculado"
                  />
                </div>
              </div>

              <div class="mt-4">
                <button type="submit" class="btn btn-primary" :disabled="saving">
                  {{ saving ? "Salvando..." : "Salvar" }}
                </button>
                <RouterLink to="/students" class="btn btn-light ms-2">Cancelar</RouterLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.student-form__label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6c757d;
}
</style>
