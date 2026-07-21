<template>
  <div class="nav-header">
    <RouterLink to="/" class="brand-logo" v-html="brandLogo"> </RouterLink>
    <div class="nav-control">
      <div :class="`hamburger ${naveHeader ? 'is-active' : ''}`" @click="naveHeader = !naveHeader">
        <span class="line"></span><span class="line"></span><span class="line"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SVGImage } from "../constent/Theme";
import { useStore } from "@/stores/Store";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "nav_",
  components: { RouterLink },
  data() {
    return SVGImage;
  },
  setup() {
    const store = useStore();
    const { naveHeader } = storeToRefs(store);
    return { naveHeader };
  },
});
</script>

<style scoped></style>
