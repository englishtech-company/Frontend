<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { listPermissions } from "@/lib/permissions";
import type { Permission } from "@/lib/types";

const permissions = ref<Permission[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

async function loadPermissions() {
  loading.value = true;
  error.value = "";

  try {
    const result = await listPermissions({ page: page.value });
    permissions.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erro ao carregar permissões";
  } finally {
    loading.value = false;
  }
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > lastPage.value) return;
  page.value = nextPage;
  loadPermissions();
}

onMounted(loadPermissions);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Permissões</h4>
          <p class="mb-0">Permissões disponíveis no sistema (somente leitura)</p>
        </div>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title mb-0">Lista de permissões ({{ total }})</h4>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">Carregando...</div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-responsive-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Guard</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="permissions.length === 0">
                    <td colspan="3" class="text-center text-muted">
                      Nenhuma permissão encontrada
                    </td>
                  </tr>
                  <tr v-for="permission in permissions" :key="permission.id">
                    <td>{{ permission.id }}</td>
                    <td><code>{{ permission.name }}</code></td>
                    <td>{{ permission.guard_name }}</td>
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
