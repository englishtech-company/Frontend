<template>
  <div class="email-left-box">
    <div class="p-0">
      <RouterLink to="/email-compose" class="btn btn-primary btn-block">Compose</RouterLink>
    </div>
    <div class="mail-list rounded mt-4">
      <RouterLink to="/email-inbox" class="list-group-item active"
        ><i class="fa fa-inbox font-18 align-middle me-2"></i> Inbox <span class="badge badge-danger badge-sm float-end">198</span>
      </RouterLink>
      <a href="javascript:void(0)" class="list-group-item"><i class="fa fa-paper-plane font-18 align-middle me-2"></i>Sent</a>
      <a href="javascript:void(0)" class="list-group-item"><i class="fas fa-star font-18 align-middle me-2"></i>Important <span class="badge badge-danger text-white badge-sm float-end">47</span> </a>
      <a href="javascript:void(0)" class="list-group-item"><i class="mdi mdi-file-document-box font-18 align-middle me-2"></i>Draft</a
      ><a href="javascript:void(0)" class="list-group-item"><i class="fa fa-trash font-18 align-middle me-2"></i>Trash</a>
    </div>
    <div class="mail-list rounded overflow-hidden mt-4">
      <div class="intro-title d-flex justify-content-between my-0">
        <h5>Categories</h5>
      </div>
      <RouterLink to="/email-inbox" class="list-group-item"
        ><span class="icon-warning"><i class="fa fa-circle"></i></span> Work
      </RouterLink>
      <RouterLink to="/email-inbox" class="list-group-item"
        ><span class="icon-primary"><i class="fa fa-circle"></i></span> Private
      </RouterLink>
      <RouterLink to="/email-inbox" class="list-group-item"
        ><span class="icon-success"><i class="fa fa-circle"></i></span> Support
      </RouterLink>
      <RouterLink to="/email-inbox" class="list-group-item"
        ><span class="icon-dpink"><i class="fa fa-circle"></i></span> Social
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";
import { useStore } from "@/stores/Store";
import { storeToRefs } from "pinia";
import router from "@/router";

export default defineComponent({
  name: "emailRightContent",
  components: { RouterLink },
  setup() {
    const { emaiComposeMenuToggle } = storeToRefs(useStore());
    return { emaiComposeMenuToggle, router };
  },
});
</script>

<style scoped>
[data-theme-version="dark"] #email-left {
  --iconcolor: #fff;
}

[data-theme-version="light"] #email-left {
  --iconcolor: #000;
}

.list-group-item svg {
  stroke: var(--iconcolor);
}
</style>
