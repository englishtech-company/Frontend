<!-- @format -->

<template>
  <div class="col-xl-12 col-lg-12 col-sm-12">
    <div class="row">
      <div class="col-xl-3 col-xxl-6 col-lg-6 col-sm-6">
        <div class="widget-stat card bg-primary">
          <div class="card-header border-0 pb-0">
            <h3 class="card-title text-white">Total Students</h3>
            <h5 class="text-white mb-0"><i class="fa fa-caret-up"></i> 422</h5>
          </div>
          <div class="card-body text-center">
            <div class="ico-sparkline">
              <div id="sparkline12">
                <apexchart
                  type="pie"
                  height="130"
                  id="user-activity"
                  :options="state.chartOptions"
                  :series="state.series"
                ></apexchart>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-xxl-6 col-lg-6 col-sm-6">
        <div class="widget-stat card bg-warning overflow-hidden">
          <div class="card-header border-0">
            <h3 class="card-title text-white">New Students</h3>
            <h5 class="text-white mb-0"><i class="fa fa-caret-up"></i> 357</h5>
          </div>
          <div class="card-body text-center p-0">
            <div class="ico-sparkline">
              <div id="spark-bar-2" style="height: 140px">
                <apexchart
                  type="bar"
                  :options="state2.chartOptions"
                  :series="state2.series"
                ></apexchart>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-xxl-6 col-lg-6 col-sm-6">
        <div class="widget-stat card bg-secondary">
          <div class="card-header pb-3 border-0 pb-0">
            <h3 class="card-title text-white">Total Course</h3>
            <h5 class="text-white mb-0"><i class="fa fa-caret-up"></i> 547</h5>
          </div>
          <div class="card-body p-0">
            <div class="px-4" style="height: 158px; overflow: hidden">
              <apexchart
                type="bar"
                :options="state3.chartOptions"
                :series="state3.series"
              ></apexchart>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-xxl-6 col-lg-6 col-sm-6">
        <div class="widget-stat card bg-danger overflow-hidden">
          <div class="card-header pb-3 border-0 pb-0">
            <h3 class="card-title text-white">Fees Collection</h3>
            <h5 class="text-white mb-0">
              <i class="fa fa-caret-up"></i> 3280$
            </h5>
          </div>
          <div class="card-body p-0" style="height: 158px">
            <apexchart
              type="area"
              :options="state4.chartOptions"
              :series="state4.series"
            ></apexchart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { reactive } from "vue";
import { defineComponent } from "vue";
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "sparlLine",
  components: { apexchart: VueApexCharts },
  setup() {
    const state = reactive({
      series: [17.6, 44.9, 37.5],
      chartOptions: {
        chart: {
          width: "100%",

          type: "pie",
        },
        fill: {
          colors: ["#9dbdff", "#b3ccff", "#7099ed"],
        },
        stroke: {
          width: 0, // set stroke width to 0
        },

        theme: {
          monochrome: {
            enabled: false,
          },
        },
        plotOptions: {
          pie: {
            dataLabels: {
              show: false,
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        // dataLabels: {
        //   formatter(val: any, opts: any) {
        //     const name = opts.w.globals.labels[opts.seriesIndex]
        //     return [name, val.toFixed(1) + '%']
        //   }
        // },
        legend: {
          show: false,
        },
      },
    });
    const state2 = reactive({
      series: [
        {
          name: "bar chart",
          data: [33, 22, 68, 54, 8, 30, 74, 7, 36, 5, 41, 19, 43, 29, 38],
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
          offsetY:-70,
        },

        colors: ["#ffce78"],
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
          data: [10, 4, 2, 2, -3, 2, 3, -2, 2, -4, 1, 2,-3,3,5,8,10,8,4,3],
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
          offsetY: -80,
          toolbar: {
            show: false,
          },
        },
        colors: ["#6673fd"],
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
    const state4 = reactive({
      series: [
        {
          name: "High - 2013",
          data: [7, 6, 8, 7, 3, 8, 3, 3, 6, 5, 9, 2, 8],
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
          colors: ["#fa707e"],
          opacity: 1,
          type: "solid",
        },
        chart: {
          type: "area",
          height: 219,
          offsetY: -50,
          toolbar: {
            show: false,
          },
        },
        colors: ["#f77f8b", "#ffb64a"],
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
    return { state, state2, state3, state4 };
  },

  data() {
    return {};
  },
});
</script>

<style scoped></style>
