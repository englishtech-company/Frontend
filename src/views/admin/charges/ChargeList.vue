<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
} from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDelete } from "@/lib/confirm";
import {
  deleteCharge,
  listCharges,
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
} from "@/lib/types";

const {
  canViewCharges,
  canCreateCharges,
  canUpdateCharges,
  canDeleteCharges,
} = usePermissions();

const charges = ref<Charge[]>([]);
const loading = ref(true);
const error = ref("");

const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const dueDateFilter = ref("");
const statusFilter = ref<ChargeStatus | "">("");

const showActions = computed(
  () =>
    canUpdateCharges.value ||
    canDeleteCharges.value
);

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
    const result = await listCharges({
      page: page.value,
      dueDate: dueDateFilter.value || undefined,
      status: statusFilter.value || undefined,
    });

    charges.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
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
  dueDateFilter.value = "";
  statusFilter.value = "";
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

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header charge-list__header">
            <h4 class="card-title mb-0">
              Lista de cobranças ({{ total }})
            </h4>

            <div class="charge-list__filters">
              <input
                v-model="dueDateFilter"
                type="date"
                class="form-control form-control-sm"
                aria-label="Filtrar pela data de vencimento"
                @keyup.enter="handleFilter"
              />

              <select
                v-model="statusFilter"
                class="form-select form-select-sm"
                aria-label="Filtrar pelo status"
                @change="handleFilter"
              >
                <option value="">
                  Todos os status
                </option>

                <option value="open">
                  Aberta
                </option>

                <option value="paid">
                  Paga
                </option>

                <option value="partial">
                  Parcial
                </option>

                <option value="overdue">
                  Atrasada
                </option>

                <option value="cancelled">
                  Cancelada
                </option>
              </select>

              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                @click="handleFilter"
              >
                Filtrar
              </button>

              <button
                type="button"
                class="btn btn-sm btn-light"
                @click="clearFilters"
              >
                Limpar
              </button>
            </div>
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
                      Valor esperado
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
                      :colspan="showActions ? 7 : 6"
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

            <div
              v-if="lastPage > 1"
              class="d-flex justify-content-between align-items-center mt-3"
            >
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                :disabled="page <= 1"
                @click="goToPage(page - 1)"
              >
                Anterior
              </button>

              <span>
                Página {{ page }} de {{ lastPage }}
              </span>

              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                :disabled="page >= lastPage"
                @click="goToPage(page + 1)"
              >
                Próxima
              </button>
            </div>
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

.charge-list__filters {
  display: grid;
  grid-template-columns:
    minmax(160px, 190px)
    minmax(150px, 180px)
    auto
    auto;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 991.98px) {
  .charge-list__filters {
    width: 100%;
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 575.98px) {
  .charge-list__filters {
    grid-template-columns: 1fr;
  }
}
</style>