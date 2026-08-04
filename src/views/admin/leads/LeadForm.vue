<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import {
  createLead,
  getLead,
  updateLead,
} from "@/lib/leads";
import type { LeadPayload } from "@/lib/leads";

const route = useRoute();
const router = useRouter();

const {
  canCreateLeads,
  canUpdateLeads,
} = usePermissions();

const isEdit = computed(() => Boolean(route.params.id));
const leadId = computed(() => Number(route.params.id));
const canSave = computed(() =>
  isEdit.value ? canUpdateLeads.value : canCreateLeads.value
);

const name = ref("");
const whatsappPhone = ref("");
const email = ref("");
const source = ref("");
const objective = ref("");
const selfDeclaredLevel = ref("");

const loading = ref(false);
const saving = ref(false);
const error = ref("");

function getLocalPhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("55") && digits.length > 11) {
    return digits.slice(2, 13);
  }

  return digits.slice(0, 11);
}

function formatPhone(value: string): string {
  const digits = getLocalPhoneDigits(value);

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2");
}

function normalizePhoneForApi(value: string): string {
  const digits = getLocalPhoneDigits(value);

  return digits ? `55${digits}` : "";
}

function handlePhoneInput(event: Event) {
  const input = event.target as HTMLInputElement;
  whatsappPhone.value = formatPhone(input.value);
}

async function loadForm() {
  if (!isEdit.value) return;

  loading.value = true;
  error.value = "";

  try {
    const lead = await getLead(leadId.value);

    name.value = lead.name;
    whatsappPhone.value = formatPhone(lead.whatsapp_phone);
    email.value = lead.email ?? "";
    source.value = lead.source;
    objective.value = lead.objective;
    selfDeclaredLevel.value = lead.self_declared_level;
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao carregar os dados do interessado";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!canSave.value) {
    error.value = "Você não tem permissão para salvar interessados.";
    return;
  }

  const phoneDigits = getLocalPhoneDigits(whatsappPhone.value);

  if (phoneDigits.length < 10) {
    error.value = "Informe um telefone de WhatsApp válido.";
    return;
  }

  saving.value = true;
  error.value = "";

  const payload: LeadPayload = {
    name: name.value.trim(),
    whatsapp_phone: normalizePhoneForApi(whatsappPhone.value),
    email: email.value.trim() || null,
    source: source.value.trim(),
    objective: objective.value.trim(),
    self_declared_level: selfDeclaredLevel.value.trim(),
  };

  try {
    if (isEdit.value) {
      await updateLead(leadId.value, payload);
    } else {
      await createLead(payload);
    }

    await router.push("/leads");
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao salvar o interessado";
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
          <h4>
            {{ isEdit ? "Editar interessado" : "Novo interessado" }}
          </h4>
          <p class="mb-0">
            Preencha os dados de contato e interesse do possível aluno
          </p>
        </div>
      </div>

      <div
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink
          to="/leads"
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
            <h5 class="card-title">Dados do interessado</h5>
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
                      for="lead-name"
                    >
                      Nome completo *
                    </label>

                    <input
                      id="lead-name"
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
                      for="lead-whatsapp-phone"
                    >
                      WhatsApp *
                    </label>

                    <input
                      id="lead-whatsapp-phone"
                      :value="whatsappPhone"
                      type="tel"
                      inputmode="numeric"
                      autocomplete="tel"
                      class="form-control"
                      maxlength="15"
                      placeholder="(00) 00000-0000"
                      required
                      @input="handlePhoneInput"
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="lead-email"
                    >
                      E-mail
                    </label>

                    <input
                      id="lead-email"
                      v-model.trim="email"
                      type="email"
                      autocomplete="email"
                      class="form-control"
                      maxlength="255"
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="lead-source"
                    >
                      Origem *
                    </label>

                    <input
                      id="lead-source"
                      v-model.trim="source"
                      type="text"
                      class="form-control"
                      maxlength="255"
                      placeholder="Ex.: Instagram, indicação ou LinkedIn"
                      required
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="lead-self-declared-level"
                    >
                      Nível autodeclarado *
                    </label>

                    <input
                      id="lead-self-declared-level"
                      v-model.trim="selfDeclaredLevel"
                      type="text"
                      class="form-control"
                      maxlength="255"
                      placeholder="Ex.: Iniciante, A2 ou B1"
                      required
                    />
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="lead-objective"
                    >
                      Objetivo *
                    </label>

                    <textarea
                      id="lead-objective"
                      v-model.trim="objective"
                      class="form-control"
                      rows="5"
                      placeholder="Descreva o que o interessado deseja alcançar com o curso"
                      required
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
                    to="/leads"
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
