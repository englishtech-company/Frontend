<template>
  <div class="col-xl-8 col-lg-12 col-xxl-8 col-sm-12">
    <div class="row">
      <div class="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
        <div class="card">
          <div class="card-header border-0 pb-0">
            <div class="clearfix">
              <h3 class="card-title">Appointment</h3>
              <span>In the normal</span>
            </div>
            <div class="clearfix text-center">
              <h3 class="text-primary mb-0">650</h3>
              <span>month</span>
            </div>
          </div>
          <div class="card-body text-center d-flex justify-content-center" style="height: 150px">
            <div class="ico-sparkline">
              <div id="spark-bar"> 
                <apexchart type="bar" height="130" width="188" :options="state1.chartOptions" :series="state1.series"></apexchart>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
        <div class="card">
          <div class="card-header border-0 pb-0">
            <div class="clearfix">
              <h3 class="card-title">Student Application</h3>
              <span class="text-danger">Above the normal</span>
            </div>
            <div class="clearfix text-center">
              <h3 class="text-danger mb-0">10</h3>
              <span>Per Min</span>
            </div>
          </div>
          <div class="card-body d-flex justify-content-center text-center" style="height: 150px">
            <div class="ico-sparkline">
              <div id="composite-bar">
                <apexchart type="bar" height="130" width="208" :options="state2.chartOptions" :series="state2.series"></apexchart>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
        <div class="card" style="height: 150px">
          <div class="card-header border-0 pb-0">
            <div class="clearfix">
              <h3 class="card-title">Students</h3>
              <span>In the normal</span>
            </div>
            <div class="clearfix text-center">
              <h3 class="text-success mb-0">152</h3>
              <span>month</span>
            </div>
          </div>
          <div class="card-body text-center">
            <div class="ico-sparkline">
              <div id="sparkline8">
                <apexchart type="area" height="100" :options="state3.chartOptions" :series="state3.series"></apexchart>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
        <div class="card" style="height: 150px">
          <div class="card-header border-0 pb-0">
            <div class="clearfix">
              <h3 class="card-title">Teachers</h3>
              <span>In the normal</span>
            </div>
            <div class="clearfix text-center">
              <h3 class="text-info mb-0">124</h3>
              <span>year</span>
            </div>
          </div>
          <div class="card-body text-center">
            <div class="ico-sparkline">
              <div id="sparkline9" class="height80;">
                <apexchart type="area" height="100" :options="state4.chartOptions" :series="state4.series"></apexchart>
              </div>
            </div>
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
    const state1 = reactive({
      series: [
        {
          name: "bar chart",
          data: [33, 22, 68, 54, 8, 30, 74, 7, 36, 5, 41, 19, 43, 29, 38],
          bars: {
            show: true,
            lineWidth: 0,
            fillColor: "#fb3e7a",
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
          fillColor: "#fb3e7a",
        },
        chart: {
          type: "bar",
          height: 50,
          width: "100%",
          toolbar: {
            show: false,
          },
        },

        colors: ["#fb3e7a"],
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
    const state2 = reactive({
      series: [
        {
          name: "bar chart",
          data: [73, 53, 50, 67, 3, 56, 19, 59, 37, 32, 40, 26, 71, 19, 4, 53, 55, 31, 37, 67, 10, 21],
          bars: {
            show: true,
            lineWidth: 0,
            fillColor: "#FFAA2B",
          },
        },
      ],
      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "90%",
          },
        },
        grid: {
          borderWidth: 1,
          borderColor: "transparent",
        },
        bars: {
          show: true,
          lineWidth: 0,
          fillColor: "var(--primary)",
        },
        chart: {
          type: "bar",
          height: 50,
          width: "100%",
          toolbar: {
            show: false,
          },
        },

        colors: ["var(--primary)"],
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
    const state3 = reactive({
      series: [
        {
          name: "bar chart",
          data: [79, 72, 29, 6, 52, 32, 73, 40, 14, 75, 77, 39, 9, 15, 10],
        },
      ],
      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        stroke: {
          curve: "straight",
          width: 2,
        },

        grid: {
          borderWidth: 1,
          borderColor: "transparent",
        },
        fill: {
          colors: ["#01a3ff"],
          opacity: 1,
          type: "solid",
        },

        chart: {
          type: "area",
          toolbar: {
            show: false,
          },
          offsetY: -60,
        },

        colors: ["var(--primary)"],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
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
    const state4 = reactive({
      series: [
        {
          name: "High - 2013",
          data: [27, 31, 35, 28, 45, 52, 24, 4, 50, 11, 54, 49, 72, 59, 75],
        },
      ],
      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        stroke: {
          curve: "straight",
          width: 2,
        },

        grid: {
          borderWidth: 1,
          borderColor: "transparent",
        },
        fill: {
          colors: ["#feac8e"],
          opacity: 1,
          type: "solid",
        },

        chart: {
          type: "area",
          toolbar: {
            show: false,
          },
          offsetY: -60,
        },

        colors: ["#ff6e1d"],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
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
    return { state1, state2, state3, state4 };
  },
});
</script>

<style scoped></style>
