<!-- @format -->

<template>
  <div class="col-xl-8 col-xxl-8 col-lg-12 col-sm-12">
    <div id="user-activity" class="card">
      <div class="card-header border-0 pb-0 d-sm-flex d-block">
        <h4 class="card-title">Visitor Activity</h4>
        <div class="card-action card-tabs mb-sm-0 my-2">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li
              class="nav-item"
              role="presentation"
              @click="updateData('Day')"
              style="cursor: pointer"
            >
              <a
                class="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#home-tab-pane"
                role="tab"
                aria-selected="true"
                >Day</a
              >
            </li>
            <li
              class="nav-item"
              role="presentation"
              @click="updateData('Month')"
              style="cursor: pointer"
            >
              <a
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#profile-tab-pane"
                role="tab"
                aria-selected="false"
                >Month</a
              >
            </li>
            <li
              class="nav-item"
              role="presentation"
              @click="updateData('Year')"
              style="cursor: pointer"
            >
              <a
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#contact-tab-pane"
                role="tab"
                aria-selected="false"
              >
                Year</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="card-body">
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="user" role="tabpanel">
            <apexchart
              type="bar"
              id="user-activity"
              height="288"
              :options="state.chartOptions"
              :series="state.series"
            ></apexchart>
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
  data() {
    return {};
  },
  setup() {
    const state = reactive({
      series: [
        {
          name: "bar chart",
          data: [35, 48, 25, 35, 40, 24, 30, 25, 22, 20, 45, 35],
          bars: {
            show: true,
            lineWidth: 0,
            fillColor: "#6673fd",
          },
        },
      ],
      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "70%",
          },
        },
        grid: {
          borderWidth: 1,
          borderColor: "transparent",
        },
        bars: {
          show: true,
          lineWidth: 0,
          fillColor: "#6673fd",
        },
        chart: {
          type: "bar",
          height: 219,
          toolbar: {
            show: false,
          },
        },

        colors: ["#6673fd"],
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          tickColor: "transparent",
          font: {
            color: "#858282",
            size: 10,
          },
          labels: {
            formatter: (val: number) => {
              return `${val}`;
            },
          },
        },
        xaxis: {
          labels: {
            show: false,
          },
        },
      },
    });
    return { state };
  },
  methods: {
    updateData(value: string) {
      switch (value) {
        case "Day":
          this.state.series[0].data = [
            35, 48, 25, 35, 40, 24, 30, 25, 22, 20, 45, 35,
          ];
          break;
        case "Month":
          this.state.series[0].data = [
            50, 35, 35, 45, 40, 50, 60, 80, 25, 50, 34, 35,
          ];
          break;
        case "Year":
          this.state.series[0].data = [
            20, 35, 60, 45, 40, 70, 30, 80, 65, 70, 60, 35,
          ];
          break;
        default:
          break;
      }
    },
  },
});
</script>

<style scoped></style>
