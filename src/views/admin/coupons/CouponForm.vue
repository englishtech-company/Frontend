<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { notifySaved } from "@/lib/actionNotification";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import {
  createCoupon,
  getCoupon,
  updateCoupon,
} from "@/lib/coupons";
import type { CouponPayload } from "@/lib/coupons";
import type { CouponDiscountType } from "@/lib/types";

const route = useRoute();
const router = useRouter();

const { canCreateCoupons, canUpdateCoupons } = usePermissions();

const isEdit = computed(() => Boolean(route.params.id));
const couponId = computed(() => Number(route.params.id));
const canSave = computed(() =>
  isEdit.value ? canUpdateCoupons.value : canCreateCoupons.value
);

const name = ref("");
const discountType = ref<CouponDiscountType>("percent");
const value = ref("");
const usageLimit = ref("");
const uniquePerStudent = ref(false);
const active = ref(true);
const startsAt = ref("");
const endsAt = ref("");

const discountTypeOptions: SelectOption[] = [
  { value: "percent", label: "Porcentagem (%)" },
  { value: "amount", label: "Valor (R$)" },
];

const loading = ref(false);
const saving = ref(false);
const error = ref("");

function toDateInput(value?: string | null): string {
  return value ? value.slice(0, 10) : "";
}

async function loadForm() {
  if (!isEdit.value) return;

  loading.value = true;
  error.value = "";

  try {
    const coupon = await getCoupon(couponId.value);

    name.value = coupon.name;
    discountType.value = coupon.discount_type === "amount" ? "amount" : "percent";
    value.value = String(coupon.value ?? "");
    usageLimit.value =
      coupon.usage_limit == null ? "" : String(coupon.usage_limit);
    uniquePerStudent.value = Boolean(coupon.unique_per_student);
    active.value = coupon.active !== false;
    startsAt.value = toDateInput(coupon.starts_at);
    endsAt.value = toDateInput(coupon.ends_at);
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar os dados do cupom";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!canSave.value) {
    error.value = "Você não tem permissão para salvar cupons.";
    return;
  }

  saving.value = true;
  error.value = "";

  const payload: CouponPayload = {
    name: name.value.trim(),
    discount_type: discountType.value,
    value: Number(value.value),
    usage_limit: usageLimit.value.trim()
      ? Number(usageLimit.value)
      : null,
    unique_per_student: uniquePerStudent.value,
    active: active.value,
    starts_at: startsAt.value || null,
    ends_at: endsAt.value || null,
  };

  try {
    if (isEdit.value) {
      await updateCoupon(couponId.value, payload);
    } else {
      await createCoupon(payload);
    }

    notifySaved("Cupom", isEdit.value);
    await router.push("/coupons");
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao salvar o cupom";
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
          <h4>{{ isEdit ? "Editar cupom" : "Novo cupom" }}</h4>
          <p class="mb-0">
            Defina o desconto, se o cupom é único por aluno e, se quiser, o
            limite e o período de validade
          </p>
        </div>
      </div>

      <div
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/coupons" class="btn btn-outline-primary">
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
              <h5 class="card-title">Dados do cupom</h5>
            </div>

            <div class="card-body">
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="coupon-name">
                      Nome do cupom <span class="text-danger">*</span>
                    </label>
                    <input
                      id="coupon-name"
                      v-model.trim="name"
                      type="text"
                      class="form-control"
                      maxlength="255"
                      placeholder="Ex.: PROMO10"
                      required
                    />
                  </div>
                </div>

                <div class="col-sm-3">
                  <SingleSelect
                    id="coupon-discount-type"
                    v-model="discountType"
                    label="Tipo de desconto"
                    :options="discountTypeOptions"
                    :searchable="false"
                    placeholder="Selecione"
                    required
                  />
                </div>

                <div class="col-sm-3">
                  <div class="form-group">
                    <label class="form-label" for="coupon-value">
                      {{
                        discountType === "amount"
                          ? "Valor do desconto (R$)"
                          : "Valor do desconto (%)"
                      }}
                      <span class="text-danger">*</span>
                    </label>
                    <div class="input-group">
                      <span
                        v-if="discountType === 'amount'"
                        class="input-group-text"
                      >
                        R$
                      </span>
                      <input
                        id="coupon-value"
                        v-model="value"
                        type="number"
                        min="0.01"
                        :max="discountType === 'percent' ? 100 : undefined"
                        step="0.01"
                        class="form-control"
                        :placeholder="discountType === 'amount' ? 'Ex.: 50,00' : 'Ex.: 10'"
                        required
                      />
                      <span
                        v-if="discountType === 'percent'"
                        class="input-group-text"
                      >
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div class="col-sm-12">
                  <div class="form-group">
                    <div class="form-check">
                      <input
                        id="coupon-unique"
                        v-model="uniquePerStudent"
                        class="form-check-input"
                        type="checkbox"
                      />
                      <label class="form-check-label" for="coupon-unique">
                        Cupom único
                        <span class="badge badge-primary ms-1">Único</span>
                      </label>
                    </div>
                    <small class="form-text text-muted">
                      Cada aluno só pode usar este cupom uma vez.
                    </small>
                  </div>
                </div>

                <div class="col-sm-12">
                  <div class="form-group">
                    <div class="form-check">
                      <input
                        id="coupon-active"
                        v-model="active"
                        class="form-check-input"
                        type="checkbox"
                      />
                      <label class="form-check-label" for="coupon-active">
                        Ativo
                      </label>
                    </div>
                    <small class="form-text text-muted">
                      Cupons inativos não podem ser aplicados nas matrículas.
                    </small>
                  </div>
                </div>

                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="form-label" for="coupon-limit">
                      Limite de usos
                    </label>
                    <input
                      id="coupon-limit"
                      v-model="usageLimit"
                      type="number"
                      min="1"
                      class="form-control"
                      placeholder="Ilimitado"
                    />
                    <small class="form-text text-muted">
                      Deixe em branco para usos ilimitados.
                    </small>
                  </div>
                </div>

                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="form-label" for="coupon-starts-at">
                      Data de início
                    </label>
                    <input
                      id="coupon-starts-at"
                      v-model="startsAt"
                      type="date"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="form-label" for="coupon-ends-at">
                      Data de fim
                    </label>
                    <input
                      id="coupon-ends-at"
                      v-model="endsAt"
                      type="date"
                      class="form-control"
                      :min="startsAt || undefined"
                    />
                  </div>
                </div>
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

          <RouterLink to="/coupons" class="btn btn-light ms-2">
            Cancelar
          </RouterLink>
        </div>
      </div>
    </form>
  </div>
</template>
