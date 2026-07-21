<!-- @format -->

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6">
        <div class="welcome-text">
          <h4>Hi, welcome back!</h4>
          <p class="mb-0">Your business dashboard template</p>
        </div>
      </div>
      <div class="col-sm-6 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="javascript:void(0)">Charts</a>
          </li>
          <li class="breadcrumb-item active">
            <a href="javascript:void(0)">Apexchart</a>
          </li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-xl-6 col-lg-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Donught Chart</h4>
              </div>
              <div class="card-body">
                <div id="morris_donught" class="morris_chart_height">
                  <apexchart
                    height="210"
                    :options="morris_donught.chartOption"
                    :series="morris_donught.series"
                  ></apexchart>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Line Chart</h4>
              </div>
              <div class="card-body p-0">
                <div id="morris_line" class="morris_chart_height">
                  <apexchart
                    height="210"
                    :options="morris_line.chartOptions"
                    :series="morris_line.series"
                  ></apexchart>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Bar Chart</h4>
              </div>
              <div class="card-body">
                <div id="morris_bar" class="morris_chart_height">
                  <apexchart
                    height="210"
                    :options="morris_bar.chartOptions"
                    :series="morris_bar.series"
                  ></apexchart>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Line Chart</h4>
              </div>
              <div class="card-body">
                <div id="line_chart_2" class="morris_chart_height">
                  <apexchart
                    height="210"
                    :options="line_chart_2.chartOptions"
                    :series="line_chart_2.series"
                  ></apexchart>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Bar Chart</h4>
              </div>
              <div class="card-body">
                <div id="morris_bar_stalked" class="morris_chart_height">
                  <apexchart
                    height="210"
                    :options="morris_bar_stalked.chartOptions"
                    :series="morris_bar_stalked.series"
                  ></apexchart>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Area Chart</h4>
              </div>
              <div class="card-body">
                <div id="morris_area" class="morris_chart_height">
                  <apexchart
                    height="210"
                    :options="morris_area.chartOptions"
                    :series="morris_area.series"
                  ></apexchart>
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
import { defineComponent } from "vue";
// @ts-ignore
import VueApexCharts from "vue3-apexcharts";
import {
  morris_donught,
  morris_line,
  morris_bar,
  line_chart_2,
  morris_area,
  morris_bar_stalked,
} from "@/layouts/ChartsData";

export default defineComponent({
  name: "morris_",
  data() {
    return {
      morris_donught,
      morris_line,
      morris_bar,
      line_chart_2,
      morris_area,
      morris_bar_stalked,
    };
  },
  setup() {
    return {};
  },
  components: { apexchart: VueApexCharts },
});
</script>

<style scoped></style>
