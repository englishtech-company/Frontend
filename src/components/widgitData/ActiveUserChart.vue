<!-- @format -->

<template>
  <div class="col-xl-4 col-lg-6 col-sm-6">
    <div class="card active_users">
      <div class="card-header bg-primary border-0 pb-0">
        <h4 class="card-title text-white">Active Users</h4>
        <span id="counter"></span>
      </div>
      <div class="bg-primary">
        <apexchart
          id="activeUser"
          height="150"
          type="bar"
          :options="state2.chartOptions"
          :series="state2.series"
        ></apexchart>
      </div>
      <div class="card-body pt-0">
        <div class="list-group-flush mt-4">
          <div
            class="list-group-item bg-transparent d-flex justify-content-between px-0 py-1 fw-semi-bold border-top-0 border-0 border-bottom"
          >
            <p class="mb-0">Top Active Pages</p>
            <p class="mb-0">Active Users</p>
          </div>
          <div
            class="list-group-item bg-transparent d-flex justify-content-between px-0 py-1 border-0 border-bottom"
          >
            <p class="mb-0">/bootstrap-themes/</p>
            <p class="mb-0">3</p>
          </div>
          <div
            class="list-group-item bg-transparent d-flex justify-content-between px-0 py-1 border-0 border-bottom"
          >
            <p class="mb-0">/tags/html5/</p>
            <p class="mb-0">3</p>
          </div>
          <div
            class="list-group-item bg-transparent d-xxl-flex justify-content-between px-0 py-1 d-none"
          >
            <p class="mb-0">/</p>
            <p class="mb-0">2</p>
          </div>
          <div
            class="list-group-item bg-transparent d-xxl-flex justify-content-between px-0 py-1 d-none"
          >
            <p class="mb-0">/preview/falcon/dashboard/</p>
            <p class="mb-0">2</p>
          </div>
          <div
            class="list-group-item bg-transparent d-flex justify-content-between px-0 py-1 border-0 border-bottom"
          >
            <p class="mb-0">/100-best-themes...all-time/</p>
            <p class="mb-0">1</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, reactive } from "vue";
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  components: { apexchart: VueApexCharts },

  setup() {
    const state2 = reactive({
      series: [
        {
          name: "bar chart",
          data: [33, 22, 68, 54, 8, 30, 74, 7, 36, 5, 41, 19, 43, 29],
          bars: {
            show: true,
            lineWidth: 0,
            fillColor: "#0d99ff",
          },
        },
      ],
      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "50%",
          },
        },
        grid: {
          borderWidth: 1,
          borderColor: "transparent",
        },
        bars: {
          show: true,
          lineWidth: 0,
          fillColor: "#0d99ff",
        },
        chart: {
          type: "bar",
          height: 50,
          width: "100%",
          toolbar: {
            show: false,
          },
        },

        colors: ["#3adfae"],
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          show: false,
        },
        xaxis: {
          show: false,
          labels: {
            show: false,
          },
          axisTicks: {
            show: false, // hide x-axis ticks
          },
          axisBorder: {
            show: false, // hide x-axis ticks
          },
        },
      },
    });
    return { state2 };
  },
});
</script>

<style scoped></style>
