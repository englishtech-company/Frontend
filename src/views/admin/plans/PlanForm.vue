<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { notifySaved } from "@/lib/actionNotification";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import {
  createPlan,
  getPlan,
  updatePlan,
} from "@/lib/plans";
import type { PlanPayload } from "@/lib/plans";
import {
  COMMITMENT_OPTIONS,
  createEmptyVariants,
  formatHoursLabel,
  formatPriceForInput,
  formatPriceInput,
  getPlanVariants,
  getVariantHoursPerWeek,
  parsePriceInput,
} from "@/lib/plans/format";
import type { PlanCommitment } from "@/lib/types";

const route = useRoute();
const router = useRouter();

const { canCreatePlans, canUpdatePlans } = usePermissions();

const isEdit = computed(() => Boolean(route.params.id));
const planId = computed(() => Number(route.params.id));
const canSave = computed(() =>
  isEdit.value ? canUpdatePlans.value : canCreatePlans.value
);

const name = ref("");
const commitment = ref<PlanCommitment>("monthly");
const durationMonths = ref(1);
const active = ref<number>(1);
const variants = ref(createEmptyVariants());

const loading = ref(false);
const saving = ref(false);
const error = ref("");

const commitmentOptions: SelectOption[] = COMMITMENT_OPTIONS.map(
  (option) => ({
    value: option.value,
    label: option.label,
  })
);

const activeOptions: SelectOption[] = [
  { value: 1, label: "Ativo" },
  { value: 0, label: "Inativo" },
];

watch(commitment, (value) => {
  const option = COMMITMENT_OPTIONS.find((item) => item.value === value);
  durationMonths.value = option?.durationMonths ?? 1;
});

function handleVariantPriceInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  variants.value[index].monthly_price = formatPriceInput(input.value);
}

async function loadForm() {
  if (!isEdit.value) return;

  loading.value = true;
  error.value = "";

  try {
    const plan = await getPlan(planId.value);
    const planVariants = getPlanVariants(plan);

    name.value = plan.name;
    commitment.value = plan.commitment;
    durationMonths.value = plan.duration_months;
    active.value = plan.active ? 1 : 0;

    variants.value = createEmptyVariants().map((emptyVariant) => {
      const existing = planVariants.find(
        (variant) =>
          getVariantHoursPerWeek(variant) === emptyVariant.hours_per_week
      );

      if (!existing) {
        return emptyVariant;
      }

      return {
        plan_workload_id: existing.plan_workload_id,
        hours_per_week: getVariantHoursPerWeek(existing) ?? emptyVariant.hours_per_week,
        monthly_price: formatPriceForInput(existing.monthly_price),
        active: existing.active,
      };
    });
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
    commitment: commitment.value,
    duration_months: durationMonths.value,
    active: active.value === 1,
    variants: variants.value.map((variant) => ({
      plan_workload_id: variant.plan_workload_id,
      monthly_price: parsePriceInput(variant.monthly_price),
      active: variant.active,
    })),
  };

  try {
    if (isEdit.value) {
      await updatePlan(planId.value, payload);
    } else {
      await createPlan(payload);
    }

    notifySaved("Plano", isEdit.value);
    await router.push("/plans");
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao salvar o plano";
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
            Configure o vínculo contratual e os preços por carga horária
          </p>
        </div>
      </div>

      <div
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/plans" class="btn btn-outline-primary">
          Voltar
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center py-4">
      Carregando...
    </div>

    <form v-else @submit.prevent="submit">
      <div class="row">
        <div class="col-xl-12 col-xxl-12 col-sm-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">Dados do plano</h5>
            </div>

            <div class="card-body">
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="plan-name">
                      Nome do plano *
                    </label>
                    <input
                      id="plan-name"
                      v-model.trim="name"
                      type="text"
                      class="form-control"
                      maxlength="255"
                      placeholder="Ex.: Mensal"
                      required
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <SingleSelect
                    id="plan-commitment"
                    v-model="commitment"
                    label="Vínculo *"
                    :options="commitmentOptions"
                    :searchable="false"
                    placeholder="Selecione o vínculo"
                    required
                  />
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="plan-duration">
                      Duração do contrato
                    </label>
                    <input
                      id="plan-duration"
                      :value="`${durationMonths} ${durationMonths === 1 ? 'mês' : 'meses'}`"
                      type="text"
                      class="form-control"
                      disabled
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <SingleSelect
                    id="plan-active"
                    v-model="active"
                    label="Status do plano"
                    :options="activeOptions"
                    :searchable="false"
                    placeholder="Selecione o status"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-12 col-xxl-12 col-sm-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">Variações de carga horária</h5>
              <p class="mb-0 text-muted small">
                Preço mensal por carga horária (valores válidos para 2026)
              </p>
            </div>

            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Carga horária</th>
                      <th>Preço mensal *</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(variant, index) in variants"
                      :key="variant.hours_per_week"
                    >
                      <td class="align-middle">
                        <strong>{{ formatHoursLabel(variant.hours_per_week) }}</strong>
                      </td>
                      <td>
                        <div class="input-group">
                          <span class="input-group-text">R$</span>
                          <input
                            :id="`plan-variant-price-${variant.hours_per_week}`"
                            :value="variant.monthly_price"
                            type="text"
                            inputmode="decimal"
                            class="form-control"
                            maxlength="11"
                            placeholder="0,00"
                            required
                            @input="handleVariantPriceInput(index, $event)"
                          />
                        </div>
                      </td>
                      <td class="align-middle">
                        <div class="form-check form-switch plan-variant-switch">
                          <input
                            :id="`plan-variant-active-${variant.hours_per_week}`"
                            v-model="variant.active"
                            class="form-check-input"
                            type="checkbox"
                          />
                          <label
                            class="form-check-label"
                            :for="`plan-variant-active-${variant.hours_per_week}`"
                          >
                            {{ variant.active ? "Ativo" : "Inativo" }}
                          </label>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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

          <RouterLink to="/plans" class="btn btn-light ms-2">
            Cancelar
          </RouterLink>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.plan-variant-switch.form-switch {
  padding-left: 3em;
  margin-bottom: 0;
  min-height: auto;
}

.plan-variant-switch.form-switch::before,
.plan-variant-switch.form-switch::after {
  display: none !important;
  content: none !important;
}

.plan-variant-switch.form-switch .form-check-input {
  width: 2.75em !important;
  height: 1.35em !important;
  margin-left: -3em;
  margin-top: 0;
  border-radius: 2em;
  background-size: contain !important;
  cursor: pointer;
}

.plan-variant-switch.form-switch .form-check-input:checked {
  background-size: contain !important;
}

.plan-variant-switch .form-check-label::before,
.plan-variant-switch .form-check-label::after {
  display: none !important;
  content: none !important;
}

.plan-variant-switch .form-check-label {
  margin-left: 0.5rem;
  margin-top: 0;
  cursor: pointer;
  user-select: none;
}
</style>
