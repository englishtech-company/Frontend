<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
} from "vue";
import { RouterLink } from "vue-router";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDelete } from "@/lib/confirm";
import { notifyRemoved } from "@/lib/actionNotification";
import { countActiveFilters } from "@/lib/filters/query";
import {
  deleteCharge,
  listCharges,
} from "@/lib/charges";
import type {
  ChargeWithCurrentBalance,
} from "@/lib/charges";
import {
  formatEnrollmentNumber,
} from "@/lib/enrollments/format";
import {
  formatChargeStatus,
  formatCurrency,
  formatDate,
  getChargeEnrollment,
  getChargeStudent,
} from "@/lib/finance/format";
import type {
  Charge,
  ChargeStatus,
  Paginated,
} from "@/lib/types";

const {
  canViewCharges,
  canCreateCharges,
  canUpdateCharges,
  canDeleteCharges,
} = usePermissions();

const charges = ref<ChargeWithCurrentBalance[]>([]);
const loading = ref(true);
const error = ref("");

const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const idFilter = ref("");
const studentNameFilter = ref("");
const enrollmentIdFilter = ref("");
const expectedAmountFilter = ref("");
const dueDateFrom = ref("");
const dueDateTo = ref("");
const statusFilter = ref<string | number | null>(null);

const statusOptions: SelectOption[] = [
  { value: "open", label: "Aberta" },
  { value: "paid", label: "Paga" },
  { value: "partial", label: "Parcial" },
  { value: "overdue", label: "Atrasada" },
  { value: "cancelled", label: "Cancelada" },
];

const activeFilterCount = computed(() =>
  countActiveFilters([
    idFilter.value,
    studentNameFilter.value,
    enrollmentIdFilter.value,
    expectedAmountFilter.value,
    dueDateFrom.value,
    dueDateTo.value,
    statusFilter.value,
  ])
);

const showActions = computed(
  () =>
    canViewCharges.value ||
    canUpdateCharges.value ||
    canDeleteCharges.value
);

function applyChargeResult(
  result: Paginated<ChargeWithCurrentBalance>
) {
  charges.value = result.data;
  lastPage.value = result.last_page;
  total.value = result.total;
}

function currentListParams() {
  return {
    page: page.value,
    id: idFilter.value.trim() ? Number(idFilter.value) : undefined,
    studentName: studentNameFilter.value.trim() || undefined,
    enrollmentId: enrollmentIdFilter.value.trim()
      ? Number(enrollmentIdFilter.value)
      : undefined,
    expectedAmount: expectedAmountFilter.value.trim() || undefined,
    dueDateFrom: dueDateFrom.value || undefined,
    dueDateTo: dueDateTo.value || undefined,
    status: statusFilter.value
      ? (String(statusFilter.value) as ChargeStatus)
      : undefined,
  };
}

async function loadCharges() {
  if (!canViewCharges.value) {
    error.value =
      "Você não tem permissão para listar cobranças.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listCharges(
      currentListParams()
    );

    applyChargeResult(result);
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar cobranças.";
  } finally {
    loading.value = false;
  }
}

function handleFilter() {
  page.value = 1;
  loadCharges();
}

function clearFilters() {
  idFilter.value = "";
  studentNameFilter.value = "";
  enrollmentIdFilter.value = "";
  expectedAmountFilter.value = "";
  dueDateFrom.value = "";
  dueDateTo.value = "";
  statusFilter.value = null;
  page.value = 1;
  loadCharges();
}

function goToPage(nextPage: number) {
  if (
    nextPage < 1 ||
    nextPage > lastPage.value
  ) {
    return;
  }

  page.value = nextPage;
  loadCharges();
}

async function removeCharge(charge: Charge) {
  if (!canDeleteCharges.value) {
    error.value =
      "Você não tem permissão para excluir cobranças.";
    return;
  }

  const studentName =
    getChargeStudent(charge)?.name ??
    "Aluno indisponível";

  const confirmed = await confirmDelete({
    entityLabel: "cobrança",
    itemName: `#${charge.id} - ${studentName}`,
    message:
      "Deseja remover esta cobrança? Cobranças que possuem pagamentos não podem ser excluídas.",
  });

  if (!confirmed) {
    return;
  }

  try {
    await deleteCharge(charge.id);
    notifyRemoved("Cobrança");
    await loadCharges();
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao remover a cobrança.";
  }
}

onMounted(loadCharges);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Cobranças</h4>

          <p class="mb-0">
            Gerencie os valores e vencimentos dos alunos
          </p>
        </div>
      </div>

      <div
        v-if="canCreateCharges"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink
          to="/charges/create"
          class="btn btn-primary"
        >
          <i class="la la-plus me-1"></i>
          Nova cobrança
        </RouterLink>
      </div>
    </div>

    <div
      v-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>

    <FilterPanel
      :active-count="activeFilterCount"
      @filter="handleFilter"
      @clear="clearFilters"
    >
      <div class="row g-3">
        <div class="col-md-6 col-lg-3">
          <FilterField label="Cobrança" id="charge-filter-id" hint="ID da cobrança">
            <input
              id="charge-filter-id"
              v-model="idFilter"
              type="number"
              min="1"
              class="form-control"
              placeholder="Ex.: 12"
              @keyup.enter="handleFilter"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Aluno" id="charge-filter-student">
            <input
              id="charge-filter-student"
              v-model="studentNameFilter"
              type="text"
              class="form-control"
              placeholder="Nome do aluno..."
              @keyup.enter="handleFilter"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Matrícula" id="charge-filter-enrollment" hint="ID da matrícula">
            <input
              id="charge-filter-enrollment"
              v-model="enrollmentIdFilter"
              type="number"
              min="1"
              class="form-control"
              placeholder="Ex.: 45"
              @keyup.enter="handleFilter"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Valor original" id="charge-filter-amount">
            <input
              id="charge-filter-amount"
              v-model="expectedAmountFilter"
              type="text"
              class="form-control"
              placeholder="Ex.: 350.00"
              @keyup.enter="handleFilter"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Vencimento desde" id="charge-filter-due-from">
            <input
              id="charge-filter-due-from"
              v-model="dueDateFrom"
              type="date"
              class="form-control"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Vencimento até" id="charge-filter-due-to">
            <input
              id="charge-filter-due-to"
              v-model="dueDateTo"
              type="date"
              class="form-control"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Status" id="charge-filter-status">
            <SingleSelect
              id="charge-filter-status"
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Todos os status"
              :searchable="false"
              aria-label="Filtrar pelo status"
            />
          </FilterField>
        </div>
      </div>
    </FilterPanel>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header charge-list__header">
            <h4 class="card-title mb-0">
              Lista de cobranças ({{ total }})
            </h4>
          </div>

          <div class="card-body">
            <div
              v-if="loading"
              class="text-center py-4"
            >
              Carregando...
            </div>

            <div
              v-else
              class="table-responsive"
            >
              <table
                class="table table-striped table-responsive-sm"
              >
                <thead>
                  <tr>
                    <th class="text-nowrap">
                      Cobrança
                    </th>

                    <th>Aluno</th>

                    <th class="text-nowrap">
                      Matrícula
                    </th>

                    <th class="text-nowrap">
                      Valor original
                    </th>

                    <th class="text-nowrap">
                      Saldo atual
                    </th>

                    <th class="text-nowrap">
                      Vencimento
                    </th>

                    <th>Status</th>

                    <th
                      v-if="showActions"
                      class="text-end text-nowrap"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-if="charges.length === 0">
                    <td
                      :colspan="showActions ? 8 : 7"
                      class="text-center text-muted"
                    >
                      Nenhuma cobrança encontrada
                    </td>
                  </tr>

                  <tr
                    v-for="charge in charges"
                    :key="charge.id"
                  >
                    <td class="text-nowrap">
                      <strong>
                        #{{ charge.id }}
                      </strong>
                    </td>

                    <td>
                      <strong>
                        {{
                          getChargeStudent(charge)?.name ??
                          "Aluno indisponível"
                        }}
                      </strong>

                      <div class="small text-muted">
                        {{
                          getChargeStudent(charge)?.email ??
                          "Sem e-mail"
                        }}
                      </div>
                    </td>

                    <td class="text-nowrap">
                      <strong>
                        {{
                          getChargeEnrollment(charge)
                            ? formatEnrollmentNumber(
                                getChargeEnrollment(charge)!
                                  .id
                              )
                            : "—"
                        }}
                      </strong>
                    </td>

                    <td class="text-nowrap">
                      {{
                        formatCurrency(
                          charge.expected_amount
                        )
                      }}
                    </td>

                    <td class="text-nowrap">
                      <template
                        v-if="charge.current_balance"
                      >
                        <strong>
                          {{
                            formatCurrency(
                              charge.current_balance
                                .total_due_amount
                            )
                          }}
                        </strong>

                        <div class="small text-muted">
                          Em {{
                            formatDate(
                              charge.current_balance
                                .reference_date
                            )
                          }}
                        </div>
                      </template>

                      <span v-else>—</span>
                    </td>

                    <td class="text-nowrap">
                      {{ formatDate(charge.due_date) }}
                    </td>

                    <td class="text-nowrap">
                      <span
                        class="badge"
                        :class="
                          formatChargeStatus(charge.status)
                            .class
                        "
                      >
                        {{
                          formatChargeStatus(charge.status)
                            .label
                        }}
                      </span>
                    </td>

                    <td
                      v-if="showActions"
                      class="text-end text-nowrap"
                    >
                      <RouterLink
                        :to="`/charges/${charge.id}`"
                        class="btn btn-xs sharp btn-outline-primary me-1"
                        :aria-label="`Visualizar cobrança ${charge.id}`"
                      >
                        <i class="fa fa-eye"></i>
                      </RouterLink>

                      <RouterLink
                        v-if="canUpdateCharges"
                        :to="`/charges/${charge.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar cobrança ${charge.id}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>

                      <button
                        v-if="canDeleteCharges"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir cobrança ${charge.id}`"
                        @click="removeCharge(charge)"
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

<style scoped>
.charge-list__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
</style>
