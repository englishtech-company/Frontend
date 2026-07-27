<template>
  <div class="authincation h-100">
    <div class="container h-100">
      <div class="row justify-content-center h-100 align-items-center">
        <div class="col-md-5">
          <div class="form-input-content text-center error-page">
            <h1 class="error-text font-weight-bold">403</h1>
            <h4><i class="fa fa-times-circle text-danger"></i> Acesso restrito</h4>
            <p>Você não tem permissão para acessar este recurso.</p>
            <div>
              <RouterLink class="btn btn-primary" to="/">Voltar ao início</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "error403_",
  components: { RouterLink },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
