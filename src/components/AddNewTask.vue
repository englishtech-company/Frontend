<template>
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Project title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="row">
              <div class="col-xl-12">
                <div class="mb-3">
                  <label for="exampleFormControlInput1" class="form-label">Project Id</label>
                  <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="#P-000441425" />
                </div>
              </div>
              <div class="col-xl-12">
                <div class="mb-3">
                  <label for="exampleFormControlInput2" class="form-label">Client Name</label>
                  <input type="text" class="form-control" id="exampleFormControlInput2" placeholder="James Jr." />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VueMultiselect from "vue-multiselect";

export default defineComponent({
  name: "addNewTask",
  components: { VueMultiselect },
  setup() {
    return {};
  },
});
</script>

<style>
.vs__open-indicator {
  transform: scale(0.6) !important;
}
.vs--open .vs__open-indicator {
  transform: rotate(180deg) scale(0.6) !important;
}
.vs__clear {
  display: none;
}
</style>
