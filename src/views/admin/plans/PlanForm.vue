<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import {
  createPlan,
  getPlan,
  updatePlan,
} from "@/lib/plans";
import type { PlanPayload } from "@/lib/plans";

const route = useRoute();
const router = useRouter();

const {
  canCreatePlans,
  canUpdatePlans,
} = usePermissions();

const isEdit = computed(() => Boolean(route.params.id));
const planId = computed(() => Number(route.params.id));
const canSave = computed(() =>
  isEdit.value ? canUpdatePlans.value : canCreatePlans.value
);

const name = ref("");
const workload = ref("");
const basePrice = ref("");
const active = ref<number>(1);

const loading = ref(false);
const saving = ref(false);
const error = ref("");

const activeOptions: SelectOption[] = [
  { value: 1, label: "Ativo" },
  { value: 0, label: "Inativo" },
];

function formatBasePrice(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (!digits) {
    return "";
  }

  return (Number(digits) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  });
}

function parseBasePrice(value: string): number {
  return Number(value.replace(",", "."));
}

function handleBasePriceInput(event: Event) {
  const input = event.target as HTMLInputElement;
  basePrice.value = formatBasePrice(input.value);
}

async function loadForm() {
  if (!isEdit.value) return;

  loading.value = true;
  error.value = "";

  try {
    const plan = await getPlan(planId.value);

    name.value = plan.name;
    workload.value = plan.workload;
    basePrice.value = formatBasePrice(plan.base_price);
    active.value = plan.active ? 1 : 0;
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao carregar os dados do plano";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!canSave.value) {
    error.value = "Você não tem permissão para salvar planos.";
    return;
  }

  saving.value = true;
  error.value = "";

  const payload: PlanPayload = {
    name: name.value.trim(),
    workload: workload.value.trim(),
    base_price: parseBasePrice(basePrice.value),
    active: active.value === 1,
  };

  try {
    if (isEdit.value) {
      await updatePlan(planId.value, payload);
    } else {
      await createPlan(payload);
    }

    await router.push("/plans");
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao salvar o plano";
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
          <h4>{{ isEdit ? "Editar plano" : "Novo plano" }}</h4>
          <p class="mb-0">
            Preencha os dados comerciais do plano
          </p>
        </div>
      </div>

      <div
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink
          to="/plans"
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
            <h5 class="card-title">Dados do plano</h5>
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
                      for="plan-name"
                    >
                      Nome do plano *
                    </label>
                    <input
                      id="plan-name"
                      v-model.trim="name"
                      type="text"
                      class="form-control"
                      maxlength="255"
                      placeholder="Ex.: T1 - Mensal"
                      required
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="plan-workload"
                    >
                      Carga horária *
                    </label>
                    <input
                      id="plan-workload"
                      v-model.trim="workload"
                      type="text"
                      class="form-control"
                      maxlength="255"
                      placeholder="Ex.: 1h/semana"
                      required
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label
                      class="form-label"
                      for="plan-base-price"
                    >
                      Preço base *
                    </label>

                    <div class="input-group">
                      <span class="input-group-text">R$</span>
                      <input
                        id="plan-base-price"
                        :value="basePrice"
                        type="text"
                        inputmode="decimal"
                        class="form-control"
                        maxlength="11"
                        placeholder="0,00"
                        required
                        @input="handleBasePriceInput"
                      />
                    </div>
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <SingleSelect
                      id="plan-active"
                      v-model="active"
                      label="Status"
                      :options="activeOptions"
                      :searchable="false"
                      placeholder="Selecione o status"
                      required
                    />
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
                    to="/plans"
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
