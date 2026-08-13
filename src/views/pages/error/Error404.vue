<template>
  <div class="fix-wrapper">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="form-input-content text-center error-page">
            <h1 class="error-text font-weight-bold">404</h1>
            <h4>
              <i class="fa fa-exclamation-triangle text-warning"></i>
              Página não encontrada
            </h4>
            <p>O endereço pode estar incorreto ou a página não existe mais.</p>
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
  name: "error404_",
  components: { RouterLink },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
