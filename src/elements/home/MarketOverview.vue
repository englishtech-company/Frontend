<!-- @format -->

<script setup lang="ts">
import { reactive } from "vue";
import ApexCharts from "vue3-apexcharts";
// import JobSelectOption from "../JobSelectOption.vue";

const state = reactive({
  series: [
    {
      name: "Q1 Budget",
      group: "budget",
      data: [66, 75, 50, 75, 50, 16, 70, 30, 40, 29, 44, 30, 60, 40, 46],
    },

    {
      name: "Q2 Budget",
      group: "budget",
      data: [34, 25, 50, 25, 50, 84, 30, 70, 60, 71, 56, 70, 40, 60, 54],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    grid: {
      borderWidth: 0,
      borderColor: "transparent",
    },

    chart: {
      type: "bar",
      height: 350,
      toolbar: false,
      stacked: true,
    },

    colors: ["#1367c8", "#f1f3f7"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      font: {
        color: "#888",
        size: 15,
      },
      min: 0,
      max: 100,
      labels: {
        formatter: function (value: number) {
          return value.toFixed(0);
        },
      },
    },
    xaxis: {
      categories: ["S", "", "T", "", "T", "", "S", "", "M", "", "W", "", "F", "", "S"],
    },
  },
});

const state2 = reactive({
  series: [30, 12, 20],
  chartOptions: {
    chart: {
      type: "donut",
      // width: 250,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 12,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontFamily: "Arial",
              fontWeight: "500",
              offsetY: -17,
              color: "var(--text-dark)",
            },
            total: {
              color: "var(--text-dark)",
              show: true,
              fontSize: "11px",
              fontWeight: "500",
              fontFamily: "Arial",
              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce((a: string, b: string) => {
                  return 30;
                }, 0);
              },
            },
          },
        },
      },
    },
    legend: {
      show: false,
    },
    labels: ["In-Store Sales", "Mail-Order Sales", "Download Sales"],
    colors: ["#1367c8", "#1367c8", "#1367c8"],
    dataLabels: {
      enabled: false,
    },
  },
});

const state3 = reactive({
  series: [
    {
      name: "High - 2013",
      data: [0, 90, 40, 30, 150, 25, 10],
    },
    {
      name: "mid - 2013",
      data: [0, 60, 80, 47, 40, 80, 10],
    },
    {
      name: "Low - 2013",
      data: [0, 25, 35, 17, 120, 40, 10],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 0,
    },

    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },
    fill: {
      colors: ["#5aa1f2", "#2176d8", "#1565c0"],
      opacity: 0.6,
      type: "solid",
    },

    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
    },

    colors: ["var(--primary)", "#ffb64a"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      min: 0,
      max: 200,
      font: {
        color: "#999",
        size: 8,
      },
    },
    xaxis: {
      categories: ["2001", "", "2003", "", "2005", "", "2007"],
    },
  },
});
</script>

<template>
  <div class="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">University Survey</h3>
      </div>
      <div class="card-body">
        <div id="morris_bar_stalked" class="morris_chart_height ltr" style="height: 300px !important">
          <ApexCharts height="300px" :options="state.chartOptions" :series="state.series" />
        </div>
      </div>
    </div>
  </div>
  <div class="col-xl-3 col-xxl-3 col-sm-6">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Donught Chart</h3>
      </div>
      <div class="card-body">
        <div id="morris_donught_2" class="morris_chart_height">
          <ApexCharts height="208px" :options="state2.chartOptions" :series="state2.series" />
        </div>
      </div>
    </div>
  </div>
  <div class="col-xl-3 col-xxl-3 col-sm-6">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">University Survey</h3>
      </div>
      <div class="card-body">
        <div id="morris_area" class="morris_chart_height ltr" style="height: 300px !important">
          <ApexCharts height="300px" :options="state3.chartOptions" :series="state3.series" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
#morris_donught_2 {
  margin-top: 48px;
}
</style>
