<template>
  <div class="fix-wrapper">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="form-input-content text-center error-page">
            <h1 class="error-text font-weight-bold">400</h1>
            <h4><i class="fa fa-thumbs-down text-danger"></i> Bad Request</h4>
            <p>Your Request resulted in an error</p>
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
  name: "error400_",
  components: { RouterLink },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
