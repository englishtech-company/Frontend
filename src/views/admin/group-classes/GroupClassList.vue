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
import { notifyRemoved } from "@/lib/actionNotification";
import { countActiveFilters } from "@/lib/filters/query";
import { deleteGroupClass, listGroupClasses } from "@/lib/groupClasses";
import type { GroupClass, GroupClassStatus } from "@/lib/types";

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
const idFilter = ref("");
const nameFilter = ref("");
const teacherNameFilter = ref("");
const planNameFilter = ref("");
const scheduleFilter = ref("");
const levelFilter = ref("");
const statusFilter = ref<string | number | null>(null);

const statusOptions: SelectOption[] = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
];

const activeFilterCount = computed(() =>
  countActiveFilters([
    idFilter.value,
    nameFilter.value,
    teacherNameFilter.value,
    planNameFilter.value,
    scheduleFilter.value,
    levelFilter.value,
    statusFilter.value,
  ])
);

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
      id: idFilter.value.trim() ? Number(idFilter.value) : undefined,
      name: nameFilter.value.trim() || undefined,
      teacherName: teacherNameFilter.value.trim() || undefined,
      planName: planNameFilter.value.trim() || undefined,
      schedule: scheduleFilter.value.trim() || undefined,
      level: levelFilter.value.trim() || undefined,
      status: statusFilter.value
        ? (String(statusFilter.value) as GroupClassStatus)
        : undefined,
    });

    groupClasses.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao carregar turmas";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  page.value = 1;
  loadGroupClasses();
}

function clearFilters() {
  idFilter.value = "";
  nameFilter.value = "";
  teacherNameFilter.value = "";
  planNameFilter.value = "";
  scheduleFilter.value = "";
  levelFilter.value = "";
  statusFilter.value = null;
  page.value = 1;
  loadGroupClasses();
}

async function removeGroupClass(groupClass: GroupClass) {
  if (!canDeleteGroupClasses.value) {
    error.value = "Você não tem permissão para excluir turmas.";
    return;
  }

  const confirmed = await confirmDelete({
    entityLabel: "turma",
    itemName: groupClass.name,
  });

  if (!confirmed) return;

  try {
    await deleteGroupClass(groupClass.id);
    notifyRemoved("Turma");
    await loadGroupClasses();
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao remover turma";
  }
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;

  page.value = nextPage;
  loadGroupClasses();
}

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

onMounted(() => {
  loadGroupClasses();
});
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Turmas</h4>
          <p class="mb-0">
            Gerencie as turmas cadastradas no sistema
          </p>
        </div>
      </div>

      <div
        v-if="canCreateGroupClasses"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink
          to="/group-classes/create"
          class="btn btn-primary"
        >
          <i class="la la-plus me-1"></i>
          Nova turma
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
      @filter="handleSearch"
      @clear="clearFilters"
    >
      <div class="row g-3">
        <div class="col-md-6 col-lg-3">
          <FilterField label="#" id="group-class-filter-id" hint="ID da turma">
            <input
              id="group-class-filter-id"
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
          <FilterField label="Nome" id="group-class-filter-name">
            <input
              id="group-class-filter-name"
              v-model="nameFilter"
              type="text"
              class="form-control"
              placeholder="Digite o nome..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Professor" id="group-class-filter-teacher">
            <input
              id="group-class-filter-teacher"
              v-model="teacherNameFilter"
              type="text"
              class="form-control"
              placeholder="Nome do professor..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Plano" id="group-class-filter-plan">
            <input
              id="group-class-filter-plan"
              v-model="planNameFilter"
              type="text"
              class="form-control"
              placeholder="Nome do plano..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Horário" id="group-class-filter-schedule">
            <input
              id="group-class-filter-schedule"
              v-model="scheduleFilter"
              type="text"
              class="form-control"
              placeholder="Ex.: Seg/Qua 19h..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Nível" id="group-class-filter-level">
            <input
              id="group-class-filter-level"
              v-model="levelFilter"
              type="text"
              class="form-control"
              placeholder="Ex.: Intermediário..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Status" id="group-class-filter-status">
            <SingleSelect
              id="group-class-filter-status"
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Todos os status"
              :searchable="false"
              aria-label="Filtrar turmas por status"
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
              Lista de turmas ({{ total }})
            </h4>

            <span
              v-if="!showActions"
              class="badge bg-light text-dark"
            >
              Somente leitura
            </span>
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
              <table class="table table-striped table-responsive-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th class="text-nowrap">Nome</th>
                    <th class="text-nowrap">Professor</th>
                    <th class="text-nowrap">Plano</th>
                    <th class="text-nowrap">Horário</th>
                    <th class="text-nowrap">Nível</th>
                    <th class="text-nowrap">Alunos</th>
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
                  <tr v-if="groupClasses.length === 0">
                    <td
                      :colspan="showActions ? 9 : 8"
                      class="text-center text-muted"
                    >
                      Nenhuma turma encontrada
                    </td>
                  </tr>

                  <tr
                    v-for="(groupClass, index) in groupClasses"
                    :key="groupClass.id"
                  >
                    <td>{{ index + 1 }}</td>

                    <td class="text-nowrap">
                      <strong>{{ groupClass.name }}</strong>
                    </td>

                    <td class="text-nowrap">
                      {{ groupClass.relationships?.teacher?.name ?? "—" }}
                    </td>

                    <td class="text-nowrap">
                      {{ groupClass.relationships?.plan?.name ?? "—" }}
                    </td>

                    <td class="text-nowrap">
                      {{ groupClass.schedule || "—" }}
                    </td>

                    <td class="text-nowrap">
                      {{ groupClass.level || "—" }}
                    </td>

                    <td class="text-nowrap">
                      {{ groupClass.students_count ?? 0 }} / {{ groupClass.max_students || "—" }}
                    </td>

                    <td class="text-nowrap">
                      <span
                        class="badge"
                        :class="formatStatusBadge(groupClass.status).class"
                      >
                        {{ formatStatusBadge(groupClass.status).label }}
                      </span>
                    </td>

                    <td
                      v-if="showActions"
                      class="text-end text-nowrap"
                    >
                      <RouterLink
                        v-if="canViewGroupClasses"
                        :to="`/group-classes/${groupClass.id}`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Visualizar ${groupClass.name}`"
                      >
                        <i class="fa fa-eye"></i>
                      </RouterLink>

                      <RouterLink
                        v-if="canUpdateGroupClasses"
                        :to="`/group-classes/${groupClass.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar ${groupClass.name}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>

                      <button
                        v-if="canDeleteGroupClasses"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir ${groupClass.name}`"
                        @click="removeGroupClass(groupClass)"
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
