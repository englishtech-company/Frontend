<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import {
  createTeacher,
  getTeacher,
  updateTeacher,
} from "@/lib/teachers";
import type { TeacherPayload } from "@/lib/teachers";
import type { TeacherStatus } from "@/lib/types";

const route = useRoute();
const router = useRouter();

const {
  canCreateTeachers,
  canUpdateTeachers,
} = usePermissions();

const isEdit = computed(() => Boolean(route.params.id));
const teacherId = computed(() => Number(route.params.id));
const canSave = computed(() =>
  isEdit.value ? canUpdateTeachers.value : canCreateTeachers.value
);

const name = ref("");
const email = ref("");
const phone = ref("");
const status = ref<TeacherStatus>("active");
const notes = ref("");

const loading = ref(false);
const saving = ref(false);
const error = ref("");

const statusOptions: SelectOption[] = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
];

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2");
}

function handlePhoneInput(event: Event) {
  const input = event.target as HTMLInputElement;
  phone.value = formatPhone(input.value);
}

async function loadForm() {
  if (!isEdit.value) return;

  loading.value = true;
  error.value = "";

  try {
    const teacher = await getTeacher(teacherId.value);

    name.value = teacher.name;
    email.value = teacher.email;
    phone.value = formatPhone(teacher.phone ?? "");
    status.value = teacher.status;
    notes.value = teacher.notes ?? "";
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao carregar os dados do professor";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!canSave.value) {
    error.value = "Você não tem permissão para salvar professores.";
    return;
  }

  saving.value = true;
  error.value = "";

  const payload: TeacherPayload = {
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim() || null,
    status: status.value,
    notes: notes.value.trim() || null,
  };

  try {
    if (isEdit.value) {
      await updateTeacher(teacherId.value, payload);
    } else {
      await createTeacher(payload);
    }

    await router.push("/teachers");
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao salvar o professor";
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
          <h4>{{ isEdit ? "Editar professor" : "Novo professor" }}</h4>
          <p class="mb-0">
            Preencha os dados cadastrais do professor
          </p>
        </div>
      </div>

      <div
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink
          to="/teachers"
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
            <h5 class="card-title">Dados do professor</h5>
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
                      for="teacher-name"
                    >
                      Nome completo *
                    </label>
                    <input
                      id="teacher-name"
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
                    <label
                      class="form-label"
                      for="teacher-email"
                    >
                      E-mail *
                    </label>
                    <input
                      id="teacher-email"
                      v-model.trim="email"
                      type="email"
                      class="form-control"
                      maxlength="255"
                      required
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="teacher-phone"
                    >
                      Telefone
                    </label>
                    <input
                      id="teacher-phone"
                      :value="phone"
                      type="tel"
                      inputmode="numeric"
                      autocomplete="tel"
                      class="form-control"
                      maxlength="15"
                      placeholder="(00) 00000-0000"
                      @input="handlePhoneInput"
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <SingleSelect
                      id="teacher-status"
                      v-model="status"
                      label="Status"
                      :options="statusOptions"
                      placeholder="Selecione o status"
                      required
                    />
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="teacher-notes"
                    >
                      Observações
                    </label>
                    <textarea
                      id="teacher-notes"
                      v-model.trim="notes"
                      class="form-control"
                      rows="5"
                      placeholder="Especialidades técnicas e observações sobre o professor"
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
                    to="/teachers"
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
