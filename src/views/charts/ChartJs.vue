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
            <a href="javascript:void(0)">ChartJS</a>
          </li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-xl-6 col-lg-12 col-sm-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Basic Bar Chart</h4>
              </div>
              <div class="card-body">
                <div class="chartjs-size-monitor">
                  <div class="chartjs-size-monitor-expand">
                    <div class=""></div>
                  </div>
                  <div class="chartjs-size-monitor-shrink">
                    <div class=""></div>
                  </div>
                </div>
                <Bar
                  :data="barChart_1.data"
                  :options="barChart_1.options"
                  id="barChart_1"
                  ref="chartJs"
                />
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-12 col-sm-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Gradient Bar Chart</h4>
              </div>
              <div class="card-body">
                <Bar
                  :data="barChart_2.data"
                  :options="barChart_2.options"
                  id="barChart_2"
                  ref="chartJs"
                />
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-12 col-sm-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Stalked Bar Chart</h4>
              </div>
              <div class="card-body">
                <Bar
                  :data="barChart_3.data"
                  :options="barChart_3.options"
                  id="barChart_3"
                  ref="chartJs"
                />
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-12 col-sm-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Basic Line Chart</h4>
              </div>
              <div class="card-body">
                <Line
                  :data="lineChart_1.data"
                  :options="lineChart_1.options"
                  id="lineChart_1"
                  ref="chartJs"
                />
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-12 col-sm-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Gradient Line Chart</h4>
              </div>
              <div class="card-body">
                <Line
                  :data="lineChart_1.data"
                  :options="lineChart_1.options"
                  id="lineChart_2"
                  ref="chartJs"
                />
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-12 col-sm-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Dual Line Chart</h4>
              </div>
              <div class="card-body">
                <Line
                  :data="lineChart_3.data"
                  :options="lineChart_3.options"
                  id="lineChart_3"
                  ref="chartJs"
                />
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-12 col-sm-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Basic Area Chart</h4>
              </div>
              <div class="card-body">
                <Line
                  :data="areaChart_1.data"
                  :options="areaChart_1.options"
                  id="areaChart_1"
                  ref="chartJs"
                />
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-12 col-sm-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Gradinet Area Chart</h4>
              </div>
              <div class="card-body">
                <Line
                  :data="areaChart_2.data"
                  :options="areaChart_2.options"
                  id="areaChart_2"
                  ref="chartJs"
                />
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-12 col-sm-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Dual Area Chart</h4>
              </div>
              <div class="card-body">
                <Line
                  :data="areaChart_3.data"
                  :options="areaChart_3.options"
                  id="areaChart_3"
                  ref="chartJs"
                />
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Radar Chart</h4>
              </div>
              <div class="card-body">
                <Radar
                  :data="radar_chart.data"
                  :options="radar_chart.options"
                  id="radar_chart"
                  ref="chartJs"
                />
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Pie Chart</h4>
              </div>
              <div class="card-body">
                <Pie
                  :data="pie_chart.data"
                  :options="pie_chart.options"
                  id="pie_chart"
                  ref="chartJs"
                />
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Doughnut Chart</h4>
              </div>
              <div class="card-body">
                <div class="chart-point">
                  <div class="check-point-area">
                    <Doughnut
                      :data="doughnut_chart.data"
                      :options="doughnut_chart.options"
                      id="doughnut_chart"
                    />
                  </div>
                  <ul class="chart-point-list">
                    <li>
                      <i class="fa fa-circle text-primary me-1"></i> 40% Tickets
                    </li>
                    <li>
                      <i class="fa fa-circle text-success me-1"></i> 35% Events
                    </li>
                    <li>
                      <i class="fa fa-circle text-warning me-1"></i> 25% Other
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Polar Chart</h4>
              </div>
              <div class="card-body">
                <PolarArea
                  :data="polar_chart.data"
                  :options="polar_chart.options"
                  id="polar_chart"
                />
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
import { Bar, Line, PolarArea, Pie, Doughnut, Radar } from "vue-chartjs";
import {
  barChart_1,
  barChart_2,
  barChart_3,
  lineChart_1,
  lineChart_3,
  areaChart_1,
  areaChart_2,
  areaChart_3,
  pie_chart,
  doughnut_chart,
  polar_chart,
  radar_chart,
} from "@/layouts/ChartsData";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  RadialLinearScale,
  ArcElement,
  Filler,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  RadialLinearScale,
  ArcElement,
  Filler
);

export default defineComponent({
  name: "chartJs",
  components: { Bar, Line, PolarArea, Pie, Doughnut, Radar },
  data() {
    return {
      barChart_1,
      barChart_2,
      barChart_3,
      lineChart_1,
      lineChart_3,
      areaChart_1,
      areaChart_2,
      areaChart_3,
      pie_chart,
      doughnut_chart,
      polar_chart,
      radar_chart,
    };
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
