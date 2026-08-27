<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import SingleSelect from "@/components/ui/SingleSelect.vue";
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
import { maskCpf, maskPhone } from "@/lib/br/masks";
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

async function submit() {
  saving.value = true;
  error.value = "";

  try {
    const payload = {
      name: name.value,
      email: email.value,
      cpf: cpf.value || undefined,
      phone: phone.value || undefined,
      address: address.value || undefined,
      birthdate: birthdate.value || undefined,
      status: status.value,
      start_date: startDate.value || undefined,
      end_date: endDate.value || undefined,
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
    error.value = e instanceof Error ? e.message : "Erro ao salvar aluno";
  } finally {
    saving.value = false;
  }
}

onMounted(loadForm);

function onCpfInput(event: Event) {
  cpf.value = maskCpf((event.target as HTMLInputElement).value);
}

function onPhoneInput(event: Event) {
  phone.value = maskPhone((event.target as HTMLInputElement).value);
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

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

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
                    required
                  />
                </div>
                <div class="col-lg-6 mb-3">
                  <label class="form-label student-form__label" for="email">E-mail *</label>
                  <input
                    id="email"
                    v-model.trim="email"
                    type="email"
                    class="form-control"
                    required
                  />
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
                    inputmode="numeric"
                    maxlength="14"
                    placeholder="000.000.000-00"
                    required
                    @input="onCpfInput"
                  />
                </div>
                <div class="col-lg-6 mb-3">
                  <label class="form-label student-form__label" for="phone">Telefone</label>
                  <input
                    id="phone"
                    :value="phone"
                    type="text"
                    class="form-control"
                    maxlength="15"
                    placeholder="(00) 00000-0000"
                    @input="onPhoneInput"
                  />
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
                  <label class="form-label student-form__label" for="birthdate">Data de nascimento</label>
                  <input
                    id="birthdate"
                    v-model="birthdate"
                    type="date"
                    class="form-control"
                  />
                </div>
                <div class="col-lg-4 mb-3">
                  <SingleSelect
                    id="status"
                    v-model="status"
                    label="Status *"
                    :options="statusOptions"
                    placeholder="Selecione o status"
                    required
                  />
                </div>
                <div class="col-lg-4 mb-3">
                  <SingleSelect
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
                  <SingleSelect
                    id="planVariantId"
                    v-model="planVariantId"
                    label="Plano contratado"
                    :options="planVariantOptions"
                    placeholder="Selecione um plano"
                    hint="Deixe vazio para remover matrícula. Trocar o plano gera histórico."
                  />
                </div>
                <div class="col-lg-3 mb-3">
                  <label class="form-label student-form__label" for="startDate">Data de início</label>
                  <input
                    id="startDate"
                    v-model="startDate"
                    type="date"
                    class="form-control"
                  />
                </div>
                <div class="col-lg-3 mb-3">
                  <label class="form-label student-form__label" for="endDate">Data de término</label>
                  <input
                    id="endDate"
                    v-model="endDate"
                    type="date"
                    class="form-control"
                  />
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
