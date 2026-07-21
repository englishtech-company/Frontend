<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Add Content</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0);">CMS</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0);">Add Content</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div>
          <RouterLink to="/content" class="btn btn-primary mb-4 me-1">Content List</RouterLink>
          <button type="button" class="btn btn-primary mb-4 open" data-bs-toggle="collapse" data-bs-target="#CheckBoxes"
            aria-controls="CheckBoxes" aria-expanded="false">
            Screen Option
          </button>
        </div>
        <AddContentData />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AddContentData from "@/components/cmsData/AddContentData.vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "addContent",
  components: { AddContentData, RouterLink },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
