<template>
  <div class="authincation h-100">
    <div class="container h-100">
      <div class="row justify-content-center h-100 align-items-center">
        <div class="col-md-5">
          <div class="form-input-content text-center error-page">
            <h1 class="error-text font-weight-bold">500</h1>
            <h4><i class="fa fa-times-circle text-danger"></i> Internal Server Error</h4>
            <p>You do not have permission to view this resource</p>
            <div>
              <RouterLink class="btn btn-primary" to="/">Back to Home</RouterLink>
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
  name: "error500_",
  components: { RouterLink },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
