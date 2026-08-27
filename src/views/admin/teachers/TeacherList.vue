<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
} from "vue";
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
import { deleteTeacher, listTeachers } from "@/lib/teachers";
import type { Teacher, TeacherStatus } from "@/lib/types";

const {
  canViewTeachers,
  canCreateTeachers,
  canUpdateTeachers,
  canDeleteTeachers,
} = usePermissions();

const teachers = ref<Teacher[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);
const idFilter = ref("");
const nameFilter = ref("");
const emailFilter = ref("");
const phoneFilter = ref("");
const statusFilter = ref<string | number | null>(null);

const statusOptions: SelectOption[] = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
];

const activeFilterCount = computed(() =>
  countActiveFilters([
    idFilter.value,
    nameFilter.value,
    emailFilter.value,
    phoneFilter.value,
    statusFilter.value,
  ])
);

const showActions = computed(
  () => canViewTeachers.value || canUpdateTeachers.value || canDeleteTeachers.value
);

async function loadTeachers() {
  if (!canViewTeachers.value) {
    error.value = "Você não tem permissão para listar professores.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listTeachers({
      page: page.value,
      id: idFilter.value.trim() ? Number(idFilter.value) : undefined,
      name: nameFilter.value.trim() || undefined,
      email: emailFilter.value.trim() || undefined,
      phone: phoneFilter.value.trim() || undefined,
      status: statusFilter.value
        ? (String(statusFilter.value) as TeacherStatus)
        : undefined,
    });

    teachers.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao carregar professores";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  page.value = 1;
  loadTeachers();
}

function clearFilters() {
  idFilter.value = "";
  nameFilter.value = "";
  emailFilter.value = "";
  phoneFilter.value = "";
  statusFilter.value = null;
  page.value = 1;
  loadTeachers();
}

async function removeTeacher(teacher: Teacher) {
  if (!canDeleteTeachers.value) {
    error.value = "Você não tem permissão para excluir professores.";
    return;
  }

  const confirmed = await confirmDelete({
    entityLabel: "professor",
    itemName: teacher.name,
  });

  if (!confirmed) return;

  try {
    await deleteTeacher(teacher.id);
    notifyRemoved("Professor");
    await loadTeachers();
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Erro ao remover professor";
  }
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;

  page.value = nextPage;
  loadTeachers();
}

function formatStatusBadge(status: TeacherStatus) {
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
  loadTeachers();
});
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Professores</h4>
          <p class="mb-0">
            Gerencie os professores cadastrados no sistema
          </p>
        </div>
      </div>

      <div
        v-if="canCreateTeachers"
        class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex"
      >
        <RouterLink
          to="/teachers/create"
          class="btn btn-primary"
        >
          <i class="la la-plus me-1"></i>
          Novo professor
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
          <FilterField label="#" id="teacher-filter-id" hint="ID do professor">
            <input
              id="teacher-filter-id"
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
          <FilterField label="Nome" id="teacher-filter-name">
            <input
              id="teacher-filter-name"
              v-model="nameFilter"
              type="text"
              class="form-control"
              placeholder="Digite o nome..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="E-mail" id="teacher-filter-email">
            <input
              id="teacher-filter-email"
              v-model="emailFilter"
              type="text"
              class="form-control"
              placeholder="Digite o e-mail..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Telefone" id="teacher-filter-phone">
            <input
              id="teacher-filter-phone"
              v-model="phoneFilter"
              type="text"
              class="form-control"
              placeholder="Digite o telefone..."
              @keyup.enter="handleSearch"
            />
          </FilterField>
        </div>
        <div class="col-md-6 col-lg-3">
          <FilterField label="Status" id="teacher-filter-status">
            <SingleSelect
              id="teacher-filter-status"
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Todos os status"
              :searchable="false"
              aria-label="Filtrar professores por status"
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
              Lista de professores ({{ total }})
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
                    <th class="text-nowrap">E-mail</th>
                    <th class="text-nowrap">Telefone</th>
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
                  <tr v-if="teachers.length === 0">
                    <td
                      :colspan="showActions ? 6 : 5"
                      class="text-center text-muted"
                    >
                      Nenhum professor encontrado
                    </td>
                  </tr>

                  <tr
                    v-for="teacher in teachers"
                    :key="teacher.id"
                  >
                    <td>{{ teacher.id }}</td>

                    <td class="text-nowrap">
                      <RouterLink
                        v-if="canViewTeachers"
                        :to="`/teachers/${teacher.id}`"
                        class="text-primary"
                      >
                        <strong>{{ teacher.name }}</strong>
                      </RouterLink>
                      <strong v-else>{{ teacher.name }}</strong>
                    </td>

                    <td class="text-nowrap">
                      {{ teacher.email }}
                    </td>

                    <td class="text-nowrap">
                      {{ teacher.phone || "—" }}
                    </td>

                    <td class="text-nowrap">
                      <span
                        class="badge"
                        :class="formatStatusBadge(teacher.status).class"
                      >
                        {{ formatStatusBadge(teacher.status).label }}
                      </span>
                    </td>

                    <td
                      v-if="showActions"
                      class="text-end text-nowrap"
                    >
                      <RouterLink
                        v-if="canViewTeachers"
                        :to="`/teachers/${teacher.id}`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Ver ${teacher.name}`"
                      >
                        <i class="fa fa-eye"></i>
                      </RouterLink>

                      <RouterLink
                        v-if="canUpdateTeachers"
                        :to="`/teachers/${teacher.id}/edit`"
                        class="btn btn-xs sharp btn-primary me-1"
                        :aria-label="`Editar ${teacher.name}`"
                      >
                        <i class="fa fa-pencil"></i>
                      </RouterLink>

                      <button
                        v-if="canDeleteTeachers"
                        type="button"
                        class="btn btn-xs sharp btn-danger"
                        :aria-label="`Excluir ${teacher.name}`"
                        @click="removeTeacher(teacher)"
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
