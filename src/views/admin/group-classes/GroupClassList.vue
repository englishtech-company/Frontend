<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { confirmDelete } from "@/lib/confirm";
import { deleteGroupClass, listGroupClasses } from "@/lib/groupClasses";
import type { GroupClass } from "@/lib/types";

const {
  canViewGroupClasses,
  canCreateGroupClasses,
  canUpdateGroupClasses,
  canDeleteGroupClasses,
} = usePermissions();

const groupClasses = ref<GroupClass[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const showActions = computed(
  () => canViewGroupClasses.value || canUpdateGroupClasses.value || canDeleteGroupClasses.value
);

async function loadGroupClasses() {
  if (!canViewGroupClasses.value) {
    error.value = "Você não tem permissão para listar turmas.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listGroupClasses({
      page: page.value,
    });
    groupClasses.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar turmas";
  } finally {
    loading.value = false;
  }
}

async function removeGroupClass(groupClass: GroupClass) {
  const confirmed = await confirmDelete({
    entityLabel: "turma",
    itemName: `Turma #${groupClass.id}`,
  });

  if (!confirmed) return;

  try {
    await deleteGroupClass(groupClass.id);
    await loadGroupClasses();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao remover turma";
  }
}

function goToPage(next: number) {
  if (next < 1 || next > lastPage.value) return;
  page.value = next;
  loadGroupClasses();
}

onMounted(loadGroupClasses);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Turmas</h4>
          <p class="mb-0">Gerencie as turmas cadastradas no sistema</p>
        </div>
      </div>
      <div
        v-if="canCreateGroupClasses"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink to="/group-classes/create" class="btn btn-primary">
          <i class="la la-plus me-1"></i> Nova turma
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h4 class="card-title mb-0">Lista de turmas ({{ total }})</h4>
            <div class="d-flex align-items-center gap-2">
              <span v-if="!showActions" class="badge bg-light text-dark">Somente leitura</span>
            </div>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">Carregando...</div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-responsive-sm">
                <thead>
                  <tr>
                    <th># (ID)</th>
                    <th>Criado em</th>
                    <th v-if="showActions" class="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="groupClasses.length === 0">
                    <td :colspan="showActions ? 3 : 2" class="text-center text-muted">
                      Nenhuma turma encontrada
                    </td>
                  </tr>
                  <tr v-for="groupClass in groupClasses" :key="groupClass.id">
                    <td>
                      <RouterLink
                        v-if="canUpdateGroupClasses"
                        :to="`/group-classes/${groupClass.id}/edit`"
                        class="text-primary"
                      >
                        <strong>Turma #{{ groupClass.id }}</strong>
                      </RouterLink>
                      <strong v-else>Turma #{{ groupClass.id }}</strong>
                    </td>
                    <td>
                      {{
                        groupClass.created_at
                          ? new Date(groupClass.created_at).toLocaleDateString("pt-BR")
                          : "—"
                      }}
                    </td>
                    <td v-if="showActions" class="text-end text-nowrap">
                      <RouterLink
                        v-if="canUpdateGroupClasses"
                        :to="`/group-classes/${groupClass.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar Turma ${groupClass.id}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>
                      <button
                        v-if="canDeleteGroupClasses"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir Turma ${groupClass.id}`"
                        @click="removeGroupClass(groupClass)"
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
