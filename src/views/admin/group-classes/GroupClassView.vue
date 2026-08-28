<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { getGroupClass } from "@/lib/groupClasses";
import { listLessonsForGroupClass } from "@/lib/lessons";
import type { GroupClass, GroupClassStatus, GroupClassStudent, Lesson } from "@/lib/types";

const route = useRoute();
const router = useRouter();
const { canUpdateGroupClasses, canCreateLessons, canUpdateLessons } = usePermissions();

const groupClassId = computed(() => Number(route.params.id));
const groupClass = ref<GroupClass | null>(null);
const lessons = ref<Lesson[]>([]);
const loading = ref(true);
const loadingLessons = ref(false);
const error = ref("");

function formatStatusBadge(status: GroupClassStatus) {
  if (status === "active") {
    return {
      label: "Ativo",
      class: "badge-success",
    };
  }

  return {
    label: "Inativo",
    class: "badge-secondary",
  };
}

const formatDate = (dateString: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "completed":
      return "badge-success";
    case "scheduled":
      return "badge-primary";
    case "cancelled":
      return "badge-danger";
    case "postponed":
      return "badge-warning";
    case "makeup":
      return "badge-info";
    default:
      return "badge-secondary";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "scheduled": return "Agendada";
    case "completed": return "Concluída";
    case "cancelled": return "Cancelada";
    case "postponed": return "Adiada";
    case "makeup": return "Reposição";
    default: return status;
  }
};

async function loadData() {
  loading.value = true;
  error.value = "";

  try {
    groupClass.value = await getGroupClass(groupClassId.value);
    
    // Load lessons
    loadingLessons.value = true;
    try {
      const lessonsRes = await listLessonsForGroupClass(groupClassId.value, { limit: 50 });
      lessons.value = lessonsRes.data;
    } catch (e) {
      console.error("Failed to load lessons for group class", e);
    } finally {
      loadingLessons.value = false;
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar a turma";
  } finally {
    loading.value = false;
  }
}

onMounted(loadData);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Detalhes da turma</h4>
          <p class="mb-0">Visão geral, alunos e aulas ministradas</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <RouterLink to="/group-classes">Turmas</RouterLink>
          </li>
          <li class="breadcrumb-item active">
            <span>{{ groupClass?.name ?? "Detalhes" }}</span>
          </li>
        </ol>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="loading" class="text-center py-5">Carregando...</div>

    <div v-else-if="groupClass" class="row">
      <!-- Resumo da Turma -->
      <div class="col-xl-4 col-xxl-4 col-lg-4">
        <div class="card">
          <div class="card-header border-0 pb-0">
            <h4 class="card-title">Resumo</h4>
          </div>
          <div class="card-body">
            <div class="text-center mb-4">
              <h3 class="mt-2">{{ groupClass.name }}</h3>
              <span class="badge" :class="formatStatusBadge(groupClass.status).class">
                {{ formatStatusBadge(groupClass.status).label }}
              </span>
            </div>

            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <span class="mb-0">Professor</span>
                <strong>{{ groupClass.relationships?.teacher?.name ?? "—" }}</strong>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="mb-0">Plano</span>
                <strong>{{ groupClass.relationships?.plan?.name ?? "—" }}</strong>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="mb-0">Horário</span>
                <strong>{{ groupClass.schedule || "—" }}</strong>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="mb-0">Nível</span>
                <strong>{{ groupClass.level || "—" }}</strong>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="mb-0">Data Início</span>
                <strong>
                  {{
                    groupClass.start_date
                      ? new Date(groupClass.start_date).toLocaleDateString("pt-BR")
                      : "—"
                  }}
                </strong>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="mb-0">Data Fim</span>
                <strong>
                  {{
                    groupClass.end_date
                      ? new Date(groupClass.end_date).toLocaleDateString("pt-BR")
                      : "—"
                  }}
                </strong>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="mb-0">Capacidade Máxima</span>
                <strong>{{ groupClass.max_students ?? 4 }} alunos</strong>
              </li>
            </ul>

            <div v-if="canUpdateGroupClasses" class="text-center mt-4">
              <RouterLink
                :to="`/group-classes/${groupClass.id}/edit`"
                class="btn btn-primary btn-block"
              >
                Editar turma
              </RouterLink>
            </div>
          </div>
        </div>

        <div v-if="groupClass.description" class="card mt-4">
          <div class="card-header border-0 pb-0">
            <h4 class="card-title">Descrição</h4>
          </div>
          <div class="card-body">
            <p class="mb-0">{{ groupClass.description }}</p>
          </div>
        </div>
      </div>

      <!-- Lista de Alunos e Aulas -->
      <div class="col-xl-8 col-xxl-8 col-lg-8">
        <!-- Card de Alunos -->
        <div class="card mb-4">
          <div class="card-header border-0 pb-0 d-flex justify-content-between align-items-center">
            <h4 class="card-title">Alunos Matriculados</h4>
            <span class="badge badge-primary">
              {{ groupClass.relationships?.students?.length ?? 0 }} / {{ groupClass.max_students ?? 4 }}
            </span>
          </div>
          <div class="card-body">
            <div v-if="!groupClass.relationships?.students?.length" class="text-center py-4 text-muted">
              Nenhum aluno matriculado nesta turma.
            </div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-responsive-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                    <th>Status na Turma</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(student, index) in (groupClass.relationships?.students as GroupClassStudent[] | undefined)" :key="student.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <RouterLink :to="`/students/${student.id}`" class="text-primary">
                        <strong>{{ student.name }}</strong>
                      </RouterLink>
                    </td>
                    <td>{{ student.email }}</td>
                    <td>{{ student.phone || "—" }}</td>
                    <td>
                      <span class="badge" :class="student.pivot?.status === 'enrolled' ? 'badge-success' : 'badge-secondary'">
                        {{ student.pivot?.status === 'enrolled' ? 'Inscrito' : (student.pivot?.status || 'Inscrito') }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Card de Aulas -->
        <div class="card">
          <div class="card-header border-0 pb-0 d-flex justify-content-between align-items-center">
            <h4 class="card-title mb-0">Aulas da Turma</h4>
            <RouterLink
              v-if="canCreateLessons"
              :to="`/group-classes/${groupClass.id}/lessons/create`"
              class="btn btn-sm btn-primary"
            >
              <i class="la la-plus me-1"></i> Nova Aula
            </RouterLink>
          </div>
          <div class="card-body">
            <div v-if="loadingLessons" class="text-center py-4 text-muted">
              Carregando aulas...
            </div>
            <div v-else-if="!lessons.length" class="text-center py-4 text-muted">
              Nenhuma aula registrada para esta turma.
            </div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tópico</th>
                    <th>Professor</th>
                    <th>Data e Hora</th>
                    <th>Status</th>
                    <th v-if="canUpdateLessons" class="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="lesson in lessons" :key="lesson.id">
                    <td>{{ lesson.id }}</td>
                    <td><strong>{{ lesson.topic }}</strong></td>
                    <td>{{ lesson.relationships?.teacher?.name ?? lesson.teacher?.name ?? "—" }}</td>
                    <td>{{ formatDate(lesson.class_datetime) }}</td>
                    <td>
                      <span class="badge" :class="getStatusBadgeClass(lesson.status)">
                        {{ getStatusLabel(lesson.status) }}
                      </span>
                    </td>
                    <td v-if="canUpdateLessons" class="text-end">
                      <RouterLink
                        :to="`/group-classes/${groupClass.id}/lessons/${lesson.id}/edit`"
                        class="btn btn-sm btn-outline-primary"
                        title="Editar"
                      >
                        <i class="la la-pencil"></i>
                      </RouterLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
