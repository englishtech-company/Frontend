<!-- @format -->

<script lang="ts" setup>
// import { watchEffect } from "vue";
// import router from "@/router";
import CardChart from "@/elements/CardChart.vue";
import MarketOverview from "@/elements/home/MarketOverview.vue";
import EditorAndTables from "@/elements/home/EditorAndTables.vue";

// watchEffect(() => {
//   if (!router.currentRoute.value.query.theme) {
//     if (router.currentRoute.value.name == "dark") {
//       document.body.setAttribute("data-theme-version", "dark");
//     } else {
//       document.body.setAttribute("data-theme-version", "light");
//     }
//   }
// });
</script>

<template>
  <div class="container-fluid">

    <div class="row">
      <CardChart />
      <MarketOverview />
      <EditorAndTables />
    </div>
  </div>
</template>
