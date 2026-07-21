<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6">
        <div class="welcome-text">
          <h4>Hi, welcome back!</h4>
        </div>
      </div>
      <div class="col-sm-6 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0)">Charts</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0)">Flot</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-lg-6 col-sm-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Bar Chart</h4>
              </div>
              <div class="card-body">
                <div id="flotBar1" class="flot-chart">
                  <apexchart type="bar" height="219" :options="flotBar1Chart.chartOptions" :series="flotBar1Chart.series"></apexchart>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-sm-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Bar Chart</h4>
              </div>
              <div class="card-body">
                <div id="flotBar2" class="flot-chart">
                  <apexchart type="bar" height="219" :options="flotBar2Chart.chartOptions" :series="flotBar2Chart.series"></apexchart>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-sm-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Line Chart</h4>
              </div>
              <div class="card-body">
                <div id="flotLine1" class="flot-chart">
                  <apexchart type="line" height="219" :options="flotLineChart.chartOptions" :series="flotLineChart.series"></apexchart>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-sm-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Line Chart</h4>
              </div>
              <div class="card-body">
                <div id="flotLine2" class="flot-chart">
                  <apexchart type="line" height="219" :options="flotLineChart2.chartOptions" :series="flotLineChart2.series"></apexchart>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-sm-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Line Chart</h4>
              </div>
              <div class="card-body">
                <div id="flotLine3" class="flot-chart">
                  <apexchart type="line" height="219" :options="flotLineChart3.chartOptions" :series="flotLineChart3.series"></apexchart>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-sm-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Area Chart</h4>
              </div>
              <div class="card-body">
                <div id="flotArea1" class="flot-chart">
                  <apexchart type="area" height="219" :options="flotArea1.chartOptions" :series="flotArea1.series"> </apexchart>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-sm-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Area Chart</h4>
              </div>
              <div class="card-body">
                <div id="flotArea2" class="flot-chart">
                  <apexchart type="area" height="219" :options="flotArea2.chartOptions" :series="flotArea2.series"> </apexchart>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-sm-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Realtime Chart</h4>
              </div>
              <div class="card-body">
                <div id="flotRealtime1" class="flot-chart">
                  <RealTimeChart />
                </div>
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
import { defineComponent } from "vue";
import { flotBar1Chart, flotBar2Chart, flotLineChart, flotLineChart2, flotLineChart3, flotArea1, flotArea2 } from "@/layouts/ChartsData";
import VueApexCharts from "vue3-apexcharts";
import RealTimeChart from "@/components/floatChart/RealTimeChart.vue";

export default defineComponent({
  name: "flot_",
  data() {
    return {
      flotBar1Chart,
      flotBar2Chart,
      flotLineChart,
      flotLineChart2,
      flotLineChart3,
      flotArea1,
      flotArea2,
    };
  },
  setup() {
    return {};
  },
  components: { apexchart: VueApexCharts, RealTimeChart },
});
</script>

<style scoped></style>
