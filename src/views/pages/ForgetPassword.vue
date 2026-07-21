<template>
  <div class="fix-wrapper">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-6">
          <div class="card mb-0 h-auto">
            <div class="card-body">
              <div class="text-center mb-3">
                <!-- <RouterLink to="/"><img class="logo-auth" src="../../assets/images/logo-full.png" alt="" /></RouterLink> -->
              </div>
              <h4 class="text-center mb-4">Forgot Password</h4>
              <form @submit.prevent="submitHandler">
                <div class="form-group mb-4">
                  <label class="form-label" for="email">Email</label>
                  <input type="email" class="form-control" value="hello@example.com" id="email" />
                </div>
                <div class="text-center">
                  <button type="submit" class="btn btn-primary btn-block">SUBMIT</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "forgetPassword",
  components: { RouterLink },
  setup() {
    return {};
  },
  methods: {
    submitHandler() {
      router.push("/");
    },
  },
});
</script>

<style scoped></style>
