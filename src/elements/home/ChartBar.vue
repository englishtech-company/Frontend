<template>
  <div class="col-xl-12">
    <div class="card">
      <div class="card-header border-0 pb-0 flex-wrap">
        <h4 class="card-title">Project Statistics</h4>
        <div class="d-flex align-items-center mt-3 project-tab">
          <div class="card-tabs mt-sm-0 me-3">
            <ul class="nav nav-tabs" role="tablist">
              <li class="nav-item">
                <a class="nav-link active" data-bs-toggle="tab" href="#monthly" role="tab" @click="updateChart('Monthly')">Monthly</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#weekly" role="tab" @click="updateChart('Weekly')">Weekly</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#today" role="tab" @click="updateChart('Today')">Today</a>
              </li>
            </ul>
          </div>
          <div class="dropdown ms-2">
            <div class="btn-link" data-bs-toggle="dropdown">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12.4999" cy="3.5" r="2.5" fill="#A5A5A5" />
                <circle cx="12.4999" cy="11.5" r="2.5" fill="#A5A5A5" />
                <circle cx="12.4999" cy="19.5" r="2.5" fill="#A5A5A5" />
              </svg>
            </div>
            <div class="dropdown-menu dropdown-menu-right">
              <a class="dropdown-item" href="javascript:void(0)">Delete</a>
              <a class="dropdown-item" href="javascript:void(0)">Edit</a>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center flex-wrap">
          <div class="d-flex">
            <div class="d-inline-block position-relative donut-chart-sale mb-3">
              <span class="donut1" data-peity='{ "fill": ["rgba(136,108,192,1)", "rgba(241, 234, 255, 1)"],   "innerRadius": 20, "radius": 15}' style="display: none"
                >5/8</span
              ><svg class="peity" height="60" width="60">
                <path
                  d="M 30.000000000000004 0 A 30 30 0 1 1 8.786796564403577 51.21320343559643 L 15.85786437626905 44.14213562373095 A 20 20 0 1 0 30 10"
                  data-value="5"
                  fill="rgba(136,108,192,1)"
                ></path>
                <path
                  d="M 8.786796564403577 51.21320343559643 A 30 30 0 0 1 29.999999999999993 0 L 29.999999999999996 10 A 20 20 0 0 0 15.85786437626905 44.14213562373095"
                  data-value="3"
                  fill="rgba(241, 234, 255, 1)"
                ></path>
              </svg>
            </div>
            <div class="ms-3">
              <h4 class="fs-24 mb-0">246</h4>
              <p class="mb-0">Total Projects</p>
            </div>
          </div>
          <div class="d-flex">
            <div class="d-flex me-5">
              <div class="mt-2">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="6.5" cy="6.5" r="6.5" fill="#FFCF6D" />
                </svg>
              </div>
              <div class="ms-3">
                <h4 class="fs-24 mb-0">246</h4>
                <p class="mb-0">On Going</p>
              </div>
            </div>
            <div class="d-flex">
              <div class="mt-2">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="6.5" cy="6.5" r="6.5" fill="#FFA7D7" />
                </svg>
              </div>
              <div class="ms-3">
                <h4 class="fs-24 mb-0">28</h4>
                <p class="mb-0">Unfinished</p>
              </div>
            </div>
          </div>
        </div>
        <div id="chartBar" class="chartBar">
          <apexchart height="300px" :series="state.series" :options="state.chartOptions" />
        </div>
        <div class="d-flex align-items-center">
          <label class="form-check-label form-label mb-0" for="flexSwitchCheckChecked1">Number</label>
          <div class="form-check form-switch toggle-switch">
            <input class="form-check-input custome" type="checkbox" id="flexSwitchCheckChecked1" checked />
          </div>
          <label class="form-check-label form-label mb-0 ms-3" for="flexSwitchCheckChecked2">Analytics</label>
          <div class="form-check form-switch toggle-switch">
            <input class="form-check-input custome" type="checkbox" id="flexSwitchCheckChecked2" checked />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
// @ts-ignore
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "activity1_",
  components: { apexchart: VueApexCharts },
  props: {
    height: String as () => string,
  },
  setup() {
    const state = reactive({
      series: [
        {
          name: "Running",
          data: [50, 18, 70, 40, 90, 70, 20],
          //radius: 12,
        },
        {
          name: "Cycling",
          data: [80, 40, 55, 20, 45, 30, 80],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 300,

          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "57%",
            endingShape: "rounded",
            borderRadius: 8,
          },
        },
        states: {
          hover: {
            filter: "none",
          },
        },
        colors: ["#FFA26D", "#FF5ED2"],
        dataLabels: {
          enabled: false,
        },
        markers: {
          shape: "circle",
        },

        legend: {
          show: false,
          fontSize: "12px",
          labels: {
            colors: "#000000",
          },
          markers: {
            width: 18,
            height: 18,
            strokeWidth: 10,
            strokeColor: "#fff",
            fillColors: undefined,
            radius: 12,
          },
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              plotOptions: {
                bar: {
                  horizontal: true,
                  columnWidth: "100%",
                  borderRadius: 5,
                },
              },
              legend: {
                position: "bottom",
                horizontalAlign: "center",
              },
            },
          },
        ],
        stroke: {
          show: true,
          width: 4,
          curve: "smooth",
          lineCap: "round",
          colors: ["transparent"],
        },
        grid: {
          borderColor: "var(--border)",
        },
        xaxis: {
          position: "bottom",
          categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          labels: {
            style: {
              colors: "#787878",
              fontSize: "13px",
              fontFamily: "poppins",
              fontWeight: 100,
              cssClass: "apexcharts-xaxis-label",
            },
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            show: false,
          },
        },

        yaxis: {
          labels: {
            style: {
              colors: "#787878",
              fontSize: "13px",
              fontFamily: "poppins",
              fontWeight: 100,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "white",
            type: "vertical",
            shadeIntensity: 0.2,
            gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 50],
            colorStops: [],
          },
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return "$ " + val + " thousands";
            },
          },
        },
      },
    });
    return { state };
  },
  methods: {
    updateChart(type: string) {
      switch (type) {
        case "Monthly":
          this.state.series[0].data = [40, 20, 10, 50, 60, 90, 80];
          break;
        case "Weekly":
          this.state.series[0].data = [40, 50, 10, 20, 50, 90, 80];
          break;
        case "Today":
          this.state.series[0].data = [50, 30, 40, 30, 40, 70, 90];
          break;
        default:
          this.state.series[0].data = [30, 40, 30, 10, 60, 80, 90];
          break;
      }
    },
  },
});
</script>

<style scoped></style>
