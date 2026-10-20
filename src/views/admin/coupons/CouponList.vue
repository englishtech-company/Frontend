<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDelete } from "@/lib/confirm";
import { notifyRemoved } from "@/lib/actionNotification";
import { countActiveFilters } from "@/lib/filters/query";
import { deleteCoupon, listCoupons } from "@/lib/coupons";
import {
  formatCouponDate,
  formatCouponLimit,
  formatCouponStatus,
  formatCouponValue,
} from "@/lib/coupons/format";
import type { Coupon } from "@/lib/types";

const {
  canViewCoupons,
  canCreateCoupons,
  canUpdateCoupons,
  canDeleteCoupons,
} = usePermissions();

const coupons = ref<Coupon[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);
const idFilter = ref("");
const nameFilter = ref("");

const activeFilterCount = computed(() =>
  countActiveFilters([idFilter.value, nameFilter.value])
);

const showActions = computed(
  () => canUpdateCoupons.value || canDeleteCoupons.value
);

async function loadCoupons() {
  if (!canViewCoupons.value) {
    error.value = "Você não tem permissão para listar cupons.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listCoupons({
      page: page.value,
      id: idFilter.value.trim() ? Number(idFilter.value) : undefined,
      name: nameFilter.value.trim() || undefined,
    });

    coupons.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao carregar cupons";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  page.value = 1;
  loadCoupons();
}

function clearFilters() {
  idFilter.value = "";
  nameFilter.value = "";
  page.value = 1;
  loadCoupons();
}

async function removeCoupon(coupon: Coupon) {
  if (!canDeleteCoupons.value) {
    error.value = "Você não tem permissão para excluir cupons.";
    return;
  }

  const confirmed = await confirmDelete({
    entityLabel: "cupom",
    itemName: coupon.name,
  });

  if (!confirmed) return;

  try {
    await deleteCoupon(coupon.id);
    notifyRemoved("Cupom");
    await loadCoupons();
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Erro ao remover cupom";
  }
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;

  page.value = nextPage;
  loadCoupons();
}

onMounted(loadCoupons);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Cupons</h4>
          <p class="mb-0">
            Cadastre cupons de desconto para usar nas matrículas
          </p>
        </div>
      </div>

      <div
        v-if="canCreateCoupons"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/coupons/create" class="btn btn-primary">
          <i class="la la-plus me-1"></i>
          Novo cupom
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <FilterPanel
      :active-count="activeFilterCount"
      @filter="handleSearch"
      @clear="clearFilters"
    >
      <div class="row g-3">
        <div class="col-md-6 col-lg-3">
          <FilterField label="#" id="coupon-filter-id" hint="ID do cupom">
            <input
              id="coupon-filter-id"
              v-model="idFilter"
              type="number"
              min="1"
              class="form-control"
              placeholder="Ex.: 12"
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Cupom" id="coupon-filter-name">
            <input
              id="coupon-filter-name"
              v-model="nameFilter"
              type="text"
              class="form-control"
              placeholder="Digite o nome..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
      </div>
    </FilterPanel>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div
            class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"
          >
            <h4 class="card-title mb-0">
              Lista de cupons ({{ total }})
            </h4>

            <span v-if="!showActions" class="badge bg-light text-dark">
              Somente leitura
            </span>
          </div>

          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              Carregando...
            </div>

            <div v-else class="table-responsive">
              <table class="table table-striped table-responsive-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th class="text-nowrap">Nome</th>
                    <th class="text-nowrap">Valor</th>
                    <th class="text-nowrap">Limite</th>
                    <th class="text-nowrap">Início</th>
                    <th class="text-nowrap">Fim</th>
                    <th class="text-nowrap">Status</th>
                    <th
                      v-if="showActions"
                      class="text-end text-nowrap"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-if="coupons.length === 0">
                    <td
                      :colspan="showActions ? 8 : 7"
                      class="text-center text-muted"
                    >
                      Nenhum cupom encontrado
                    </td>
                  </tr>

                  <tr v-for="coupon in coupons" :key="coupon.id">
                    <td>{{ coupon.id }}</td>
                    <td>
                      <strong>{{ coupon.name }}</strong>
                      <span
                        v-if="coupon.unique_per_student"
                        class="badge badge-primary ms-2"
                      >
                        Único
                      </span>
                    </td>
                    <td class="text-nowrap">
                      {{ formatCouponValue(coupon.value, coupon.discount_type) }}
                    </td>
                    <td class="text-nowrap">
                      {{ formatCouponLimit(coupon) }}
                    </td>
                    <td class="text-nowrap">
                      {{ formatCouponDate(coupon.starts_at) }}
                    </td>
                    <td class="text-nowrap">
                      {{ formatCouponDate(coupon.ends_at) }}
                    </td>
                    <td class="text-nowrap">
                      <span
                        class="badge"
                        :class="formatCouponStatus(coupon).class"
                      >
                        {{ formatCouponStatus(coupon).label }}
                      </span>
                    </td>
                    <td
                      v-if="showActions"
                      class="text-end text-nowrap"
                    >
                      <RouterLink
                        v-if="canUpdateCoupons"
                        :to="`/coupons/${coupon.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar ${coupon.name}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>

                      <button
                        v-if="canDeleteCoupons"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir ${coupon.name}`"
                        @click="removeCoupon(coupon)"
                      >
                        <i class="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ListPagination
              :page="page"
              :last-page="lastPage"
              :total="total"
              @update:page="goToPage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
