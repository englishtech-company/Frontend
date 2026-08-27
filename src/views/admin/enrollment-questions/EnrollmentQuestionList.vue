<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import ListPagination from "@/components/ui/ListPagination.vue";
import { VueDraggableNext } from "vue-draggable-next";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDelete } from "@/lib/confirm";
import { notifyRemoved } from "@/lib/actionNotification";
import {
  deleteEnrollmentQuestion,
  getEnrollmentQuestionPlucks,
  listEnrollmentQuestions,
  reorderEnrollmentQuestions,
} from "@/lib/enrollment-questions";
import type { EnrollmentQuestion } from "@/lib/types";

const Draggable = VueDraggableNext;

const {
  canViewEnrollmentQuestions,
  canCreateEnrollmentQuestions,
  canUpdateEnrollmentQuestions,
  canDeleteEnrollmentQuestions,
} = usePermissions();

const questions = ref<EnrollmentQuestion[]>([]);
const typeLabels = ref<Record<string, string>>({});
const loading = ref(true);
const reordering = ref(false);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);
const orderBeforeDrag = ref<number[]>([]);

const showActions = computed(
  () => canUpdateEnrollmentQuestions.value || canDeleteEnrollmentQuestions.value
);

const canReorder = computed(
  () => canUpdateEnrollmentQuestions.value && !loading.value && !reordering.value
);

async function loadQuestions() {
  if (!canViewEnrollmentQuestions.value) {
    error.value = "Você não tem permissão para listar perguntas.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const [result, plucks] = await Promise.all([
      listEnrollmentQuestions({ page: page.value }),
      getEnrollmentQuestionPlucks(),
    ]);

    questions.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
    typeLabels.value = plucks.types;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar perguntas";
  } finally {
    loading.value = false;
  }
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;
  page.value = nextPage;
  loadQuestions();
}

async function removeQuestion(question: EnrollmentQuestion) {
  const confirmed = await confirmDelete({
    entityLabel: "pergunta",
    itemName: question.label,
  });

  if (!confirmed) return;

  try {
    await deleteEnrollmentQuestion(question.id);
    notifyRemoved("Pergunta");
    await loadQuestions();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao remover pergunta";
  }
}

async function saveQuestionOrder() {
  if (!canReorder.value) return;

  const newOrder = questions.value.map((question) => question.id);

  if (orderBeforeDrag.value.join(",") === newOrder.join(",")) {
    return;
  }

  questions.value.forEach((question, index) => {
    question.sort_order = index + 1;
  });

  reordering.value = true;
  error.value = "";

  try {
    const updated = await reorderEnrollmentQuestions(newOrder);
    questions.value = updated;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao salvar a ordem das perguntas";
    await loadQuestions();
  } finally {
    reordering.value = false;
  }
}

function onDragStart() {
  orderBeforeDrag.value = questions.value.map((question) => question.id);
}

onMounted(loadQuestions);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Perguntas de matrícula</h4>
          <p class="mb-0">Gerencie o formulário usado nas novas matrículas</p>
        </div>
      </div>

      <div
        v-if="canCreateEnrollmentQuestions"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/enrollment-questions/create" class="btn btn-primary">
          <i class="la la-plus me-1"></i>
          Nova pergunta
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h4 class="card-title mb-0">Catálogo de perguntas ({{ total }})</h4>
            <span v-if="canUpdateEnrollmentQuestions" class="text-muted small">
              Arraste as linhas para reordenar
            </span>
          </div>

          <div class="card-body">
            <div v-if="loading" class="text-center py-4">Carregando...</div>

            <div v-else class="table-responsive">
              <table class="table table-striped table-responsive-sm enrollment-question-table">
                <thead>
                  <tr>
                    <th v-if="canUpdateEnrollmentQuestions" class="enrollment-question-table__handle-col"></th>
                    <th>Ordem</th>
                    <th>Pergunta</th>
                    <th>Tipo</th>
                    <th>Obrigatória</th>
                    <th>Ativa</th>
                    <th v-if="showActions" class="text-end">Ações</th>
                  </tr>
                </thead>

                <tbody v-if="questions.length === 0">
                  <tr>
                    <td
                      :colspan="showActions ? (canUpdateEnrollmentQuestions ? 7 : 6) : (canUpdateEnrollmentQuestions ? 6 : 5)"
                      class="text-center text-muted"
                    >
                      Nenhuma pergunta cadastrada
                    </td>
                  </tr>
                </tbody>

                <Draggable
                  v-else
                  v-model="questions"
                  tag="tbody"
                  item-key="id"
                  handle=".enrollment-question-drag-handle"
                  ghost-class="enrollment-question-row--ghost"
                  :disabled="!canReorder"
                  @start="onDragStart"
                  @end="saveQuestionOrder"
                >
                  <tr
                    v-for="question in questions"
                    :key="question.id"
                    class="enrollment-question-row"
                  >
                    <td v-if="canUpdateEnrollmentQuestions">
                      <button
                        type="button"
                        class="btn btn-xs btn-light enrollment-question-drag-handle"
                        :disabled="reordering"
                        aria-label="Arrastar pergunta"
                      >
                        <i class="fa fa-grip-vertical"></i>
                      </button>
                    </td>
                    <td>{{ question.sort_order }}</td>
                    <td>{{ question.label }}</td>
                    <td>{{ typeLabels[question.type] ?? question.type }}</td>
                    <td>{{ question.required ? "Sim" : "Não" }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="question.active ? 'badge-success' : 'badge-secondary'"
                      >
                        {{ question.active ? "Ativa" : "Inativa" }}
                      </span>
                    </td>
                    <td v-if="showActions" class="text-end text-nowrap">
                      <RouterLink
                        v-if="canUpdateEnrollmentQuestions"
                        :to="`/enrollment-questions/${question.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>
                      <button
                        v-if="canDeleteEnrollmentQuestions"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        @click="removeQuestion(question)"
                      >
                        <i class="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </Draggable>
              </table>
            </div>

            <div v-if="reordering" class="text-muted small mt-2">Salvando ordem...</div>

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
.enrollment-question-table__handle-col {
  width: 2.75rem;
}

.enrollment-question-drag-handle {
  cursor: grab;
  color: #888;
}

.enrollment-question-drag-handle:active {
  cursor: grabbing;
}

.enrollment-question-row--ghost {
  opacity: 0.45;
  background: rgba(96, 0, 34, 0.08);
}
</style>
