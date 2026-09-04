<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
} from "vue";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { countActiveFilters } from "@/lib/filters/query";
import {
  formatChargeStatus,
  formatCurrency,
  formatDate,
  getChargeStudent,
} from "@/lib/finance/format";
import {
  getFinancialAlertCharge,
  listFinancialAlerts,
} from "@/lib/financialAlerts";
import {
  PERMISSIONS,
} from "@/lib/permissions/access";
import type {
  FinancialAlert,
  FinancialAlertStatus,
  FinancialAlertType,
} from "@/lib/types";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const canViewFinancialAlerts = computed(() =>
  auth.hasPermission(
    PERMISSIONS.financialAlerts.view
  )
);

const financialAlerts = ref<FinancialAlert[]>([]);

const loading = ref(true);
const error = ref("");

const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const statusFilter =
  ref<string | number | null>(null);
const typeFilter =
  ref<string | number | null>(null);
const studentNameFilter = ref("");
const dueDateFrom = ref("");
const dueDateTo = ref("");
const triggeredOnFrom = ref("");
const triggeredOnTo = ref("");

const statusOptions: SelectOption[] = [
  { value: "open", label: "Em aberto" },
  { value: "resolved", label: "Resolvido" },
];

const typeOptions: SelectOption[] = [
  {
    value: "overdue_day_8",
    label: "8º dia de atraso",
  },
  {
    value: "overdue_day_16",
    label: "16º dia de atraso",
  },
];

const activeFilterCount = computed(() =>
  countActiveFilters([
    statusFilter.value,
    typeFilter.value,
    studentNameFilter.value,
    dueDateFrom.value,
    dueDateTo.value,
    triggeredOnFrom.value,
    triggeredOnTo.value,
  ])
);

function getAlertTypeLabel(
  type: FinancialAlertType
): string {
  const labels: Record<
    FinancialAlertType,
    string
  > = {
    overdue_day_8: "8º dia de atraso",
    overdue_day_16: "16º dia de atraso",
  };

  return labels[type];
}

function getAlertStatusLabel(
  status: FinancialAlertStatus
): string {
  const labels: Record<
    FinancialAlertStatus,
    string
  > = {
    open: "Em aberto",
    resolved: "Resolvido",
  };

  return labels[status];
}

function getAlertStatusClass(
  status: FinancialAlertStatus
): string {
  return status === "open"
    ? "badge-danger"
    : "badge-success";
}

function getAlertStudentName(
  financialAlert: FinancialAlert
): string {
  const charge = getFinancialAlertCharge(
    financialAlert
  );

  if (!charge) {
    return "Aluno indisponível";
  }

  return (
    getChargeStudent(charge)?.name ??
    "Aluno indisponível"
  );
}

function getAlertStudentEmail(
  financialAlert: FinancialAlert
): string {
  const charge = getFinancialAlertCharge(
    financialAlert
  );

  if (!charge) {
    return "Sem e-mail";
  }

  return (
    getChargeStudent(charge)?.email ??
    "Sem e-mail"
  );
}

async function loadFinancialAlerts() {
  if (!canViewFinancialAlerts.value) {
    error.value =
      "Você não tem permissão para listar alertas financeiros.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listFinancialAlerts({
      page: page.value,
      status: statusFilter.value
        ? String(
            statusFilter.value
          ) as FinancialAlertStatus
        : undefined,
      type: typeFilter.value
        ? String(
            typeFilter.value
          ) as FinancialAlertType
        : undefined,
      studentName:
        studentNameFilter.value.trim() || undefined,
      dueDateFrom: dueDateFrom.value || undefined,
      dueDateTo: dueDateTo.value || undefined,
      triggeredOnFrom:
        triggeredOnFrom.value || undefined,
      triggeredOnTo:
        triggeredOnTo.value || undefined,
    });

    financialAlerts.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar alertas financeiros.";
  } finally {
    loading.value = false;
  }
}

function handleFilter() {
  page.value = 1;
  loadFinancialAlerts();
}

function clearFilters() {
  statusFilter.value = null;
  typeFilter.value = null;
  studentNameFilter.value = "";
  dueDateFrom.value = "";
  dueDateTo.value = "";
  triggeredOnFrom.value = "";
  triggeredOnTo.value = "";
  page.value = 1;
  loadFinancialAlerts();
}

function goToPage(nextPage: number) {
  if (
    nextPage < 1 ||
    nextPage > lastPage.value
  ) {
    return;
  }

  page.value = nextPage;
  loadFinancialAlerts();
}

onMounted(loadFinancialAlerts);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Alertas financeiros</h4>

          <p class="mb-0">
            Acompanhe cobranças que exigem atenção
            administrativa
          </p>
        </div>
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
          <FilterField
            label="Status do alerta"
            id="financial-alert-filter-status"
          >
            <SingleSelect
              id="financial-alert-filter-status"
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Todos os status"
              :searchable="false"
              aria-label="Filtrar pelo status do alerta"
            />
          </FilterField>
        </div>

        <div class="col-md-6 col-lg-3">
          <FilterField
            label="Tipo do alerta"
            id="financial-alert-filter-type"
          >
            <SingleSelect
              id="financial-alert-filter-type"
              v-model="typeFilter"
              :options="typeOptions"
              placeholder="Todos os tipos"
              :searchable="false"
              aria-label="Filtrar pelo tipo do alerta"
            />
          </FilterField>
        </div>

        <div class="col-md-6 col-lg-3">
          <FilterField
            label="Aluno"
            id="financial-alert-filter-student"
          >
            <input
              id="financial-alert-filter-student"
              v-model="studentNameFilter"
              type="text"
              class="form-control"
              placeholder="Nome do aluno..."
              @keyup.enter="handleFilter"
            />
          </FilterField>
        </div>

        <div class="col-md-6 col-lg-3">
          <FilterField
            label="Vencimento desde"
            id="financial-alert-filter-due-from"
          >
            <input
              id="financial-alert-filter-due-from"
              v-model="dueDateFrom"
              type="date"
              class="form-control"
            />
          </FilterField>
        </div>

        <div class="col-md-6 col-lg-3">
          <FilterField
            label="Vencimento até"
            id="financial-alert-filter-due-to"
          >
            <input
              id="financial-alert-filter-due-to"
              v-model="dueDateTo"
              type="date"
              class="form-control"
            />
          </FilterField>
        </div>

        <div class="col-md-6 col-lg-3">
          <FilterField
            label="Alerta gerado desde"
            id="financial-alert-filter-triggered-from"
          >
            <input
              id="financial-alert-filter-triggered-from"
              v-model="triggeredOnFrom"
              type="date"
              class="form-control"
            />
          </FilterField>
        </div>

        <div class="col-md-6 col-lg-3">
          <FilterField
            label="Alerta gerado até"
            id="financial-alert-filter-triggered-to"
          >
            <input
              id="financial-alert-filter-triggered-to"
              v-model="triggeredOnTo"
              type="date"
              class="form-control"
            />
          </FilterField>
        </div>
      </div>
    </FilterPanel>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title mb-0">
              Lista de alertas financeiros ({{ total }})
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
                      Alerta
                    </th>

                    <th>Tipo</th>

                    <th>Aluno</th>

                    <th class="text-nowrap">
                      Cobrança
                    </th>

                    <th class="text-nowrap">
                      Valor esperado
                    </th>

                    <th class="text-nowrap">
                      Vencimento
                    </th>

                    <th>Status da cobrança</th>

                    <th class="text-nowrap">
                      Gerado em
                    </th>

                    <th>Status do alerta</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-if="financialAlerts.length === 0"
                  >
                    <td
                      colspan="9"
                      class="text-center text-muted"
                    >
                      Nenhum alerta financeiro encontrado
                    </td>
                  </tr>

                  <tr
                    v-for="financialAlert in financialAlerts"
                    :key="financialAlert.id"
                  >
                    <td class="text-nowrap">
                      <strong>
                        #{{ financialAlert.id }}
                      </strong>
                    </td>

                    <td class="text-nowrap">
                      {{
                        getAlertTypeLabel(
                          financialAlert.type
                        )
                      }}
                    </td>

                    <td>
                      <strong>
                        {{
                          getAlertStudentName(
                            financialAlert
                          )
                        }}
                      </strong>

                      <div class="small text-muted">
                        {{
                          getAlertStudentEmail(
                            financialAlert
                          )
                        }}
                      </div>
                    </td>

                    <td class="text-nowrap">
                      <strong>
                        {{
                          getFinancialAlertCharge(
                            financialAlert
                          )
                            ? `#${
                                getFinancialAlertCharge(
                                  financialAlert
                                )!.id
                              }`
                            : "—"
                        }}
                      </strong>
                    </td>

                    <td class="text-nowrap">
                      {{
                        getFinancialAlertCharge(
                          financialAlert
                        )
                          ? formatCurrency(
                              getFinancialAlertCharge(
                                financialAlert
                              )!.expected_amount
                            )
                          : "—"
                      }}
                    </td>

                    <td class="text-nowrap">
                      {{
                        getFinancialAlertCharge(
                          financialAlert
                        )
                          ? formatDate(
                              getFinancialAlertCharge(
                                financialAlert
                              )!.due_date
                            )
                          : "—"
                      }}
                    </td>

                    <td class="text-nowrap">
                      <span
                        v-if="
                          getFinancialAlertCharge(
                            financialAlert
                          )
                        "
                        class="badge"
                        :class="
                          formatChargeStatus(
                            getFinancialAlertCharge(
                              financialAlert
                            )!.status
                          ).class
                        "
                      >
                        {{
                          formatChargeStatus(
                            getFinancialAlertCharge(
                              financialAlert
                            )!.status
                          ).label
                        }}
                      </span>

                      <span
                        v-else
                        class="text-muted"
                      >
                        —
                      </span>
                    </td>

                    <td class="text-nowrap">
                      {{
                        formatDate(
                          financialAlert.triggered_on
                        )
                      }}
                    </td>

                    <td class="text-nowrap">
                      <span
                        class="badge"
                        :class="
                          getAlertStatusClass(
                            financialAlert.status
                          )
                        "
                      >
                        {{
                          getAlertStatusLabel(
                            financialAlert.status
                          )
                        }}
                      </span>
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
