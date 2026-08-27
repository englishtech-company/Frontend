<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import FilterField from "@/components/ui/FilterField.vue";
import FilterPanel from "@/components/ui/FilterPanel.vue";
import ListPagination from "@/components/ui/ListPagination.vue";
import SingleSelect from "@/components/ui/SingleSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDelete } from "@/lib/confirm";
import { notify, notifyRemoved } from "@/lib/actionNotification";
import { countActiveFilters } from "@/lib/filters/query";
import { deleteEnrollment, listEnrollments } from "@/lib/enrollments";
import {
  ENROLLMENT_STATUS_CLASSES,
  ENROLLMENT_STATUS_LABELS,
  formatEnrollmentNumber,
  formatEnrollmentPlanLabel,
  getEnrollmentStudentName,
  getEnrollmentPublicUrl,
  canCopyEnrollmentLink,
  PAYMENT_METHOD_LABELS,
} from "@/lib/enrollments/format";
import type { Enrollment, EnrollmentPaymentMethod, EnrollmentStatus } from "@/lib/types";

const {
  canViewEnrollments,
  canCreateEnrollments,
  canUpdateEnrollments,
  canDeleteEnrollments,
} = usePermissions();

const enrollments = ref<Enrollment[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);
const idFilter = ref("");
const studentNameFilter = ref("");
const planNameFilter = ref("");
const paymentMethodFilter = ref<string | number | null>(null);
const statusFilter = ref<string | number | null>(null);
const publicTokenFilter = ref("");

const statusOptions: SelectOption[] = [
  { value: "pending", label: "Pendente" },
  { value: "submitted", label: "Preenchida" },
  { value: "confirmed", label: "Confirmada" },
  { value: "cancelled", label: "Cancelada" },
];

const paymentMethodOptions: SelectOption[] = Object.entries(
  PAYMENT_METHOD_LABELS
).map(([value, label]) => ({
  value,
  label,
}));

const copiedId = ref<number | null>(null);

const activeFilterCount = computed(() =>
  countActiveFilters([
    idFilter.value,
    studentNameFilter.value,
    planNameFilter.value,
    paymentMethodFilter.value,
    statusFilter.value,
    publicTokenFilter.value,
  ])
);

const showActions = computed(
  () =>
    canViewEnrollments.value ||
    canUpdateEnrollments.value ||
    canDeleteEnrollments.value
);

async function loadEnrollments() {
  if (!canViewEnrollments.value) {
    error.value = "Você não tem permissão para listar matrículas.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listEnrollments({
      page: page.value,
      id: idFilter.value.trim() ? Number(idFilter.value) : undefined,
      studentName: studentNameFilter.value.trim() || undefined,
      planName: planNameFilter.value.trim() || undefined,
      paymentMethod: paymentMethodFilter.value
        ? (String(paymentMethodFilter.value) as EnrollmentPaymentMethod)
        : undefined,
      status: statusFilter.value
        ? (String(statusFilter.value) as EnrollmentStatus)
        : undefined,
      publicToken: publicTokenFilter.value.trim() || undefined,
    });
    enrollments.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar matrículas";
  } finally {
    loading.value = false;
  }
}

function handleFilter() {
  page.value = 1;
  loadEnrollments();
}

function clearFilters() {
  idFilter.value = "";
  studentNameFilter.value = "";
  planNameFilter.value = "";
  paymentMethodFilter.value = null;
  statusFilter.value = null;
  publicTokenFilter.value = "";
  page.value = 1;
  loadEnrollments();
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;
  page.value = nextPage;
  loadEnrollments();
}

async function removeEnrollment(enrollment: Enrollment) {
  const confirmed = await confirmDelete({
    entityLabel: "matrícula",
    itemName: formatEnrollmentNumber(enrollment.id),
  });

  if (!confirmed) return;

  try {
    await deleteEnrollment(enrollment.id);
    notifyRemoved("Matrícula");
    await loadEnrollments();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao remover matrícula";
  }
}

async function copyLink(enrollment: Enrollment) {
  const url = getEnrollmentPublicUrl(enrollment);

  if (!url) {
    error.value = "Link público indisponível.";
    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    notify.success("Link copiado!");
    copiedId.value = enrollment.id;
    window.setTimeout(() => {
      if (copiedId.value === enrollment.id) {
        copiedId.value = null;
      }
    }, 2000);
  } catch {
    error.value = "Não foi possível copiar o link.";
  }
}

onMounted(loadEnrollments);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Matrículas</h4>
          <p class="mb-0">Gere links públicos e acompanhe o preenchimento</p>
        </div>
      </div>

      <div
        v-if="canCreateEnrollments"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/enrollments/create" class="btn btn-primary">
          <i class="la la-plus me-1"></i>
          Nova matrícula
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <FilterPanel
      :active-count="activeFilterCount"
      @filter="handleFilter"
      @clear="clearFilters"
    >
      <div class="row g-3">
        <div class="col-md-6 col-lg-3">
          <FilterField label="#" id="enrollment-filter-id" hint="ID da matrícula">
            <input
              id="enrollment-filter-id"
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
          <FilterField label="Aluno" id="enrollment-filter-student">
            <input
              id="enrollment-filter-student"
              v-model="studentNameFilter"
              type="text"
              class="form-control"
              placeholder="Nome do aluno..."
              @keyup.enter="handleFilter"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Plano" id="enrollment-filter-plan">
            <input
              id="enrollment-filter-plan"
              v-model="planNameFilter"
              type="text"
              class="form-control"
              placeholder="Nome do plano..."
              @keyup.enter="handleFilter"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Pagamento" id="enrollment-filter-payment">
            <SingleSelect
              id="enrollment-filter-payment"
              v-model="paymentMethodFilter"
              :options="paymentMethodOptions"
              placeholder="Todos os métodos"
              :searchable="false"
              aria-label="Filtrar por método de pagamento"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Status" id="enrollment-filter-status">
            <SingleSelect
              id="enrollment-filter-status"
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Todos os status"
              :searchable="false"
              aria-label="Filtrar por status"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Link" id="enrollment-filter-token" hint="Token público">
            <input
              id="enrollment-filter-token"
              v-model="publicTokenFilter"
              type="text"
              class="form-control"
              placeholder="Token do link..."
              @keyup.enter="handleFilter"
            />
          </FilterField>
        </div>
      </div>
    </FilterPanel>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h4 class="card-title mb-0">Lista de matrículas ({{ total }})</h4>
          </div>

          <div class="card-body">
            <div v-if="loading" class="text-center py-4">Carregando...</div>

            <div v-else class="table-responsive">
              <table class="table table-striped table-responsive-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Aluno</th>
                    <th>Plano</th>
                    <th>Pagamento</th>
                    <th>Status</th>
                    <th>Link</th>
                    <th v-if="showActions" class="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="enrollments.length === 0">
                    <td :colspan="showActions ? 7 : 6" class="text-center text-muted">
                      Nenhuma matrícula encontrada
                    </td>
                  </tr>

                  <tr v-for="enrollment in enrollments" :key="enrollment.id">
                    <td>{{ formatEnrollmentNumber(enrollment.id) }}</td>
                    <td>
                      <RouterLink
                        v-if="canViewEnrollments"
                        :to="`/enrollments/${enrollment.id}`"
                        class="text-primary"
                      >
                        {{ getEnrollmentStudentName(enrollment) }}
                      </RouterLink>
                      <span v-else>{{ getEnrollmentStudentName(enrollment) }}</span>
                    </td>
                    <td>{{ formatEnrollmentPlanLabel(enrollment) }}</td>
                    <td>{{ PAYMENT_METHOD_LABELS[enrollment.payment_method] }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="ENROLLMENT_STATUS_CLASSES[enrollment.status]"
                      >
                        {{ ENROLLMENT_STATUS_LABELS[enrollment.status] }}
                      </span>
                    </td>
                    <td>
                      <button
                        v-if="canCopyEnrollmentLink(enrollment)"
                        type="button"
                        class="btn btn-xs btn-outline-primary"
                        @click="copyLink(enrollment)"
                      >
                        {{ copiedId === enrollment.id ? "Copiado!" : "Copiar link" }}
                      </button>
                      <span v-else class="text-muted small">Link expirado</span>
                    </td>
                    <td v-if="showActions" class="text-end text-nowrap">
                      <RouterLink
                        v-if="canViewEnrollments"
                        :to="`/enrollments/${enrollment.id}`"
                        class="btn btn-xs sharp btn-primary me-1"
                        title="Visualizar"
                      >
                        <i class="fa fa-eye"></i>
                      </RouterLink>
                      <RouterLink
                        v-if="canUpdateEnrollments"
                        :to="`/enrollments/${enrollment.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        title="Editar"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>
                      <button
                        v-if="canDeleteEnrollments"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        @click="removeEnrollment(enrollment)"
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
