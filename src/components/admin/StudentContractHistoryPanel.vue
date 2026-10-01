<script lang="ts" setup>
import { onBeforeUnmount, ref, watch } from "vue";
import { usePermissions } from "@/composables/usePermissions";
import { listEnrollments } from "@/lib/enrollments";
import {
  formatEnrollmentDateTime,
  formatEnrollmentNumber,
} from "@/lib/enrollments/format";
import type { Enrollment } from "@/lib/types";

const props = defineProps<{
  studentId: number;
}>();

const { canViewEnrollments } = usePermissions();

const enrollments = ref<Enrollment[]>([]);
const loading = ref(false);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

let requestVersion = 0;

async function loadEnrollments() {
  const version = ++requestVersion;

  enrollments.value = [];
  error.value = "";
  loading.value = false;

  if (!canViewEnrollments.value || !props.studentId) {
    return;
  }

  loading.value = true;

  try {
    const result = await listEnrollments({
      student_id: props.studentId,
      page: page.value,
      limit: 10,
    });

    if (version !== requestVersion) return;

    enrollments.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (exception) {
    if (version !== requestVersion) return;

    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar o histórico de contratos.";
  } finally {
    if (version === requestVersion) {
      loading.value = false;
    }
  }
}

function goToPage(nextPage: number) {
  if (
    loading.value ||
    nextPage < 1 ||
    nextPage > lastPage.value ||
    nextPage === page.value
  ) {
    return;
  }

  page.value = nextPage;
  void loadEnrollments();
}

watch(
  [() => props.studentId, canViewEnrollments],
  () => {
    page.value = 1;
    lastPage.value = 1;
    total.value = 0;
    void loadEnrollments();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  requestVersion++;
});
</script>

<template>
  <section class="mb-4" aria-label="Histórico de aceite de contratos">
    <h5 class="mb-2">Aceite de contratos</h5>
    <p class="text-muted">
      Data do aceite e contrato registrado em cada matrícula deste aluno.
    </p>

    <div v-if="!canViewEnrollments" class="alert alert-warning">
      Você não tem permissão para visualizar as matrículas deste aluno.
    </div>

    <div v-else-if="loading" class="text-muted py-3" role="status">
      Carregando contratos...
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      <p class="mb-2">{{ error }}</p>
      <button
        type="button"
        class="btn btn-sm btn-outline-primary"
        @click="loadEnrollments"
      >
        Tentar novamente
      </button>
    </div>

    <template v-else>
      <p v-if="!enrollments.length" class="text-muted">
        Nenhuma matrícula encontrada para este aluno.
      </p>

      <article
        v-for="enrollment in enrollments"
        :key="enrollment.id"
        class="border rounded p-3 mb-3"
      >
        <div class="d-flex flex-wrap justify-content-between gap-2">
          <strong>
            Matrícula {{ formatEnrollmentNumber(enrollment.id) }}
          </strong>
          <span
            class="badge"
            :class="
              enrollment.contract_accepted_at
                ? 'badge-success'
                : 'badge-warning'
            "
          >
            {{
              enrollment.contract_accepted_at
                ? "Aceite registrado"
                : "Sem aceite registrado"
            }}
          </span>
        </div>

        <template v-if="enrollment.contract_accepted_at">
          <p class="text-muted small mt-2 mb-2">
            Aceito em
            {{ formatEnrollmentDateTime(enrollment.contract_accepted_at) }}
          </p>

          <details v-if="enrollment.contract_text?.trim()">
            <summary class="text-primary contract-summary">
              Visualizar contrato aceito
            </summary>
            <p class="text-muted small mt-3 mb-2">
              Texto salvo no momento do aceite.
            </p>
            <div class="contract-text border rounded p-3">
              {{ enrollment.contract_text }}
            </div>
          </details>

          <p v-else class="text-muted small mb-0">
            O aceite foi registrado, mas o texto do contrato não está disponível.
          </p>
        </template>

        <p v-else class="text-muted small mt-2 mb-0">
          Esta matrícula não possui data de aceite registrada.
        </p>
      </article>

      <div
        v-if="lastPage > 1"
        class="d-flex flex-wrap align-items-center justify-content-between gap-2"
      >
        <span class="text-muted small">{{ total }} matrícula(s)</span>
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-sm btn-outline-primary"
            :disabled="loading || page <= 1"
            @click="goToPage(page - 1)"
          >
            Anterior
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-primary"
            disabled
          >
            {{ page }} de {{ lastPage }}
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-primary"
            :disabled="loading || page >= lastPage"
            @click="goToPage(page + 1)"
          >
            Próxima
          </button>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.contract-summary {
  cursor: pointer;
  font-weight: 600;
}

.contract-summary:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 4px;
}

.contract-text {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  max-height: 450px;
  overflow-y: auto;
  line-height: 1.7;
}
</style>
