<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDelete } from "@/lib/confirm";
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
import type { Enrollment, EnrollmentStatus } from "@/lib/types";

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
const statusFilter = ref<EnrollmentStatus | "">("");
const copiedId = ref<number | null>(null);

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
      status: statusFilter.value || undefined,
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

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h4 class="card-title mb-0">Lista de matrículas ({{ total }})</h4>

            <div class="d-flex gap-2">
              <select
                v-model="statusFilter"
                class="form-select form-select-sm"
                @change="handleFilter"
              >
                <option value="">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="submitted">Preenchida</option>
                <option value="confirmed">Confirmada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
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
                        class="btn btn-xs sharp btn-info me-1"
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
              <span>Página {{ page }} de {{ lastPage }}</span>
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
