<template>
  <div class="col-xl-4 col-lg-12 col-sm-12">
    <div class="card overflow-hidden">
      <div class="text-center p-5 overlay-box" :style="`background-image: url(${IMAGE.bigImg5})`">
        <img
          src="../../assets/images/profile/profile.png"
          width="100"
          class="img-fluid rounded-circle"
          alt=""
        />
        <h3 class="mt-3 mb-0 text-white">Deangelo Sena</h3>
      </div>
      <div class="card-body">
        <div class="row text-center">
          <div class="col-6">
            <div class="bgl-primary rounded p-3">
              <h4 class="mb-0">Female</h4>
              <small>Patient Gender</small>
            </div>
          </div>
          <div class="col-6">
            <div class="bgl-primary rounded p-3">
              <h4 class="mb-0">Age: 24</h4>
              <small>Years Old</small>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer mt-0">
        <button class="btn btn-primary btn-lg btn-block">View Profile</button>
      </div>
    </div>
  </div>
  <div class="col-xl-6 col-lg-6 col-sm-6">
    <div class="card bg-primary">
      <div class="card-body pb-0">
        <div class="row">
          <div class="col">
            <h5 class="text-white">Power</h5>
            <span class="text-white">2017.1.20</span>
          </div>
          <div class="col text-end">
            <h5 class="text-white"><i class="fa fa-caret-up"></i> 260</h5>
            <span class="text-white">+12.5(2.8%)</span>
          </div>
        </div>
      </div>
      <div class="chart-wrapper">
        <Bar :data="widgetChart1.data" :options="widgetChart1.options" id="chart_widget_1" />
      </div>
    </div>
  </div>
  <div class="col-xl-6 col-lg-6 col-sm-6">
    <div class="card bg-success overflow-hidden">
      <div class="card-body pb-0">
        <div class="row">
          <div class="col">
            <h5 class="text-white">Power</h5>
            <span class="text-white">2017.1.20</span>
          </div>
          <div class="col text-end">
            <h5 class="text-white"><i class="fa fa-caret-up"></i> 260</h5>
            <span class="text-white">+12.5(2.8%)</span>
          </div>
        </div>
      </div>
      <div class="chart-wrapper">
        <div id="chart_widget_5">
          <apexchart
            type="area"
            height="150"
            :options="chart_widget_5.chartOptions"
            :series="chart_widget_5.series"
          ></apexchart>
        </div>
      </div>
    </div>
  </div>
  <div class="col-xl-6 col-lg-6 col-sm-6">
    <div class="card">
      <div class="card-body pb-0">
        <div class="row">
          <div class="col">
            <h5>3650</h5>
            <span>VIEWS OF YOUR PROJECT</span>
          </div>
        </div>
      </div>
      <div class="chart-wrapper">
        <Bar id="chart_widget_2" :data="chart_widget_2.data" :options="chart_widget_2.options" />
      </div>
    </div>
  </div>
  <div class="col-xl-6 col-lg-6 col-sm-6">
    <div class="card">
      <div class="card-body">
        <div class="row justify-content-between align-items-center">
          <div class="col-auto">
            <h4 class="text-uppercase">74,206 K</h4>
            <span>Lifetime earnings</span>
          </div>
          <div class="col-auto">
            <div class="chart-wrapper height100">
              <Bar
                id="chart_widget_7"
                :data="chart_widget_7.data"
                :options="chart_widget_7.options"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-xl-12 col-xxl-12">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body pb-0">
            <div class="row justify-content-between">
              <div class="col-auto">
                <h5>Lorem Ipsum</h5>
              </div>
              <div class="col-auto">
                <h5>
                  <span><i class="fa fa-caret-up"></i></span>
                  <span>2,250</span>
                </h5>
              </div>
            </div>
          </div>
          <div class="chart-wrapper">
            <div id="chart_widget_6">
              <apexchart
                type="area"
                height="150"
                :options="chart_widget_6.chartOptions"
                :series="chart_widget_6.series"
              ></apexchart>
            </div>
          </div>
          <div class="card-footer">
            <div class="row">
              <div class="col text-center">
                <h5 class="fw-normal">1230</h5>
                <span>Type A</span>
              </div>
              <div class="col text-center">
                <h5 class="fw-normal">1230</h5>
                <span>Type A</span>
              </div>
              <div class="col text-center">
                <h5 class="fw-normal">1230</h5>
                <span>Type A</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body pb-0">
            <div class="row justify-content-between">
              <div class="col-auto">
                <h5>Lorem Ipsum</h5>
              </div>
              <div class="col-auto">
                <h5>
                  <span><i class="fa fa-caret-up"></i></span>
                  <span>2,250</span>
                </h5>
              </div>
            </div>
          </div>
          <div class="chart-wrapper">
            <Bar
              id="chart_widget_3"
              :data="chart_widget_3.data"
              :options="chart_widget_3.options"
            />
          </div>
          <div class="card-footer">
            <div class="row">
              <div class="col text-center">
                <h5 class="fw-normal">1230</h5>
                <span>Type A</span>
              </div>
              <div class="col text-center">
                <h5 class="fw-normal">1230</h5>
                <span>Type A</span>
              </div>
              <div class="col text-center">
                <h5 class="fw-normal">1230</h5>
                <span>Type A</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-xl-6 col-lg-6">
    <div class="card overflow-hidden">
      <div class="card-body pb-0">
        <h4 class="card-title text-uppercase fw-normal">Market Now</h4>
        <h2 class="fw-normal text-danger">
          <span><i class="fa fa-caret-up"></i></span>
          <span>3454664</span>
        </h2>
        <div class="row mt-5">
          <div class="col text-center">
            <h5 class="fw-normal">APPL</h5>
            <span class="text-success">+ 82.24 %</span>
          </div>
          <div class="col text-center">
            <h5 class="fw-normal">FB</h5>
            <span class="text-danger">- 12.24 %</span>
          </div>
          <div class="col text-center">
            <h5 class="fw-normal">GOOG</h5>
            <span class="text-success">+ 42.24 %</span>
          </div>
        </div>
      </div>
      <div class="chart-wrapper">
        <Bar id="chart_widget_4" :data="chart_widget_4.data" :options="chart_widget_4.options" />
      </div>
    </div>
  </div>
  <div class="col-xl-6 col-lg-6">
    <div class="card">
      <div class="card-body pb-0">
        <h4 class="card-title text-uppercase fw-normal">Sales Analysis</h4>
        <h2 class="fw-normal text-danger">
          <span><i class="fa fa-caret-up"></i></span>
          <span>3454664</span>
        </h2>
        <div class="row mt-5">
          <div class="col text-center">
            <h5 class="fw-normal">Today</h5>
            <span class="text-success">+ 8224</span>
          </div>
          <div class="col text-center">
            <h5 class="fw-normal">Today</h5>
            <span class="text-danger">- 1224</span>
          </div>
          <div class="col text-center">
            <h5 class="fw-normal">Week</h5>
            <span class="text-success">+ 4224</span>
          </div>
        </div>
      </div>
      <div class="chart-wrapper">
        <div id="chart_widget_8">
          <apexchart
            type="line"
            height="219"
            :options="chart_widget_8.chartOptions"
            :series="chart_widget_8.series"
          ></apexchart>
        </div>
      </div>
    </div>
  </div>
  <div class="col-xl-6 col-lg-12">
    <div class="card overflow-hidden">
      <div class="card-header border-0 pb-0">
        <h4 class="card-title">Top Products</h4>
      </div>
      <div class="card-body pb-0">
        <div class="widget-media">
          <ul class="timeline">
            <li>
              <div class="timeline-panel">
                <div class="media me-2">
                  <img alt="image" width="50" src="../../assets/images/avatar/1.jpg" />
                </div>
                <div class="media-body">
                  <h5 class="mb-1">Dr sultads Send you Photo</h5>
                  <small class="d-block">29 July 2020 - 02:26 PM</small>
                </div>
                <div class="dropdown">
                  <button
                    type="button"
                    class="btn btn-primary light sharp"
                    data-bs-toggle="dropdown"
                  >
                    <svg width="18px" height="18px" viewBox="0 0 24 24" version="1.1">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <rect x="0" y="0" width="24" height="24" />
                        <circle fill="#000000" cx="5" cy="12" r="2" />
                        <circle fill="#000000" cx="12" cy="12" r="2" />
                        <circle fill="#000000" cx="19" cy="12" r="2" />
                      </g>
                    </svg>
                  </button>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a class="dropdown-item" href="#">Edit</a>
                    <a class="dropdown-item" href="#">Delete</a>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="timeline-panel">
                <div class="media me-2 media-info">KG</div>
                <div class="media-body">
                  <h5 class="mb-1">Resport created successfully</h5>
                  <small class="d-block">29 July 2020 - 02:26 PM</small>
                </div>
                <div class="dropdown">
                  <button type="button" class="btn btn-info light sharp" data-bs-toggle="dropdown">
                    <svg width="18px" height="18px" viewBox="0 0 24 24" version="1.1">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <rect x="0" y="0" width="24" height="24" />
                        <circle fill="#000000" cx="5" cy="12" r="2" />
                        <circle fill="#000000" cx="12" cy="12" r="2" />
                        <circle fill="#000000" cx="19" cy="12" r="2" />
                      </g>
                    </svg>
                  </button>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a class="dropdown-item" href="#">Edit</a>
                    <a class="dropdown-item" href="#">Delete</a>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="timeline-panel">
                <div class="media me-2 media-success">
                  <i class="fa fa-home"></i>
                </div>
                <div class="media-body">
                  <h5 class="mb-1">Reminder : Treatment Time!</h5>
                  <small class="d-block">29 July 2020 - 02:26 PM</small>
                </div>
                <div class="dropdown">
                  <button
                    type="button"
                    class="btn btn-success light sharp"
                    data-bs-toggle="dropdown"
                  >
                    <svg width="18px" height="18px" viewBox="0 0 24 24" version="1.1">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <rect x="0" y="0" width="24" height="24" />
                        <circle fill="#000000" cx="5" cy="12" r="2" />
                        <circle fill="#000000" cx="12" cy="12" r="2" />
                        <circle fill="#000000" cx="19" cy="12" r="2" />
                      </g>
                    </svg>
                  </button>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a class="dropdown-item" href="#">Edit</a>
                    <a class="dropdown-item" href="#">Delete</a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="chart-wrapper">
        <Line :data="chart_widget_9.data" :options="chart_widget_9.options" id="chart_widget_9" />
      </div>
    </div>
  </div>
  <div class="col-xl-6 col-lg-12">
    <div class="card overflow-hidden">
      <div class="card-header border-0 pb-0">
        <h4 class="card-title">Top Products</h4>
      </div>
      <div class="card-body pb-0">
        <div class="widget-media">
          <ul class="timeline">
            <li>
              <div class="timeline-panel">
                <div class="media me-2">
                  <img alt="image" width="50" src="../../assets/images/avatar/4.jpg" />
                </div>
                <div class="media-body">
                  <h5 class="mb-1">Dr sultads Send you Photo</h5>
                  <small class="d-block">29 July 2020 - 02:26 PM</small>
                </div>
                <div class="dropdown">
                  <button
                    type="button"
                    class="btn btn-primary light sharp"
                    data-bs-toggle="dropdown"
                  >
                    <svg width="18px" height="18px" viewBox="0 0 24 24" version="1.1">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <rect x="0" y="0" width="24" height="24" />
                        <circle fill="#000000" cx="5" cy="12" r="2" />
                        <circle fill="#000000" cx="12" cy="12" r="2" />
                        <circle fill="#000000" cx="19" cy="12" r="2" />
                      </g>
                    </svg>
                  </button>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a class="dropdown-item" href="#">Edit</a>
                    <a class="dropdown-item" href="#">Delete</a>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="timeline-panel">
                <div class="media me-2 media-info">
                  <img alt="image" width="50" src="../../assets/images/avatar/2.jpg" />
                </div>
                <div class="media-body">
                  <h5 class="mb-1">Resport created successfully</h5>
                  <small class="d-block">29 July 2020 - 02:26 PM</small>
                </div>
                <div class="dropdown">
                  <button type="button" class="btn btn-info light sharp" data-bs-toggle="dropdown">
                    <svg width="18px" height="18px" viewBox="0 0 24 24" version="1.1">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <rect x="0" y="0" width="24" height="24" />
                        <circle fill="#000000" cx="5" cy="12" r="2" />
                        <circle fill="#000000" cx="12" cy="12" r="2" />
                        <circle fill="#000000" cx="19" cy="12" r="2" />
                      </g>
                    </svg>
                  </button>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a class="dropdown-item" href="#">Edit</a>
                    <a class="dropdown-item" href="#">Delete</a>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="timeline-panel">
                <div class="media me-2 media-success">
                  <img alt="image" width="50" src="../../assets/images/avatar/3.jpg" />
                </div>
                <div class="media-body">
                  <h5 class="mb-1">Reminder : Treatment Time!</h5>
                  <small class="d-block">29 July 2020 - 02:26 PM</small>
                </div>
                <div class="dropdown">
                  <button
                    type="button"
                    class="btn btn-success light sharp"
                    data-bs-toggle="dropdown"
                  >
                    <svg width="18px" height="18px" viewBox="0 0 24 24" version="1.1">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <rect x="0" y="0" width="24" height="24" />
                        <circle fill="#000000" cx="5" cy="12" r="2" />
                        <circle fill="#000000" cx="12" cy="12" r="2" />
                        <circle fill="#000000" cx="19" cy="12" r="2" />
                      </g>
                    </svg>
                  </button>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a class="dropdown-item" href="#">Edit</a>
                    <a class="dropdown-item" href="#">Delete</a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="chart-wrapper">
        <Line
          :data="chart_widget_10.data"
          :options="chart_widget_10.options"
          id="chart_widget_10"
        />
      </div>
    </div>
  </div>
  <div class="col-xl-6 col-xxl-8 col-lg-12">
    <div class="row">
      <div class="col-sm-12">
        <div class="card overflow-hidden">
          <div class="row no-gutters">
            <div class="col-5 p-0">
              <div class="card-body">
                <h6 class="fw-normal text-uppercase">Weekly sales</h6>
                <h4>$ 14000</h4>
                <div>
                  <span class="badge badge-light me-2">60%</span>
                  <span>Higher</span>
                </div>
              </div>
            </div>
            <div class="col-7 p-0">
              <div class="chart-wrapper">
                <Line
                  :data="chart_widget_11.data"
                  :options="chart_widget_11.options"
                  id="chart_widget_11"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="card">
          <div class="card-body">
            <h5>570</h5>
            <p>All Sales</p>
          </div>
          <div class="chart-wrapper">
            <Line
              :data="chart_widget_14.data"
              :options="chart_widget_14.options"
              id="chart_widget_14"
            />
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="card">
          <div class="card-body">
            <h5>570</h5>
            <p>All Sales</p>
          </div>
          <div class="chart-wrapper">
            <Line
              :data="chart_widget_15.data"
              :options="chart_widget_15.options"
              id="chart_widget_15"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-xl-6 col-xxl-4 col-lg-12">
    <div class="card">
      <div class="chart-wrapper">
        <Line
          height="269"
          :data="chart_widget_16.data"
          :options="chart_widget_16.options"
          id="chart_widget_16"
        />
      </div>
      <div class="card-body">
        <h4 class="card-title">Sales Status</h4>
        <div class="row">
          <div class="col-12">
            <div class="d-flex justify-content-between">
              <h6>67%</h6>
              <span>Grow</span>
            </div>
            <div class="progress">
              <div class="progress-bar bg-primary" style="width: 80%"></div>
            </div>
          </div>
          <div class="col-12 mt-4">
            <div class="d-flex justify-content-between">
              <h6>67%</h6>
              <span>Grow</span>
            </div>
            <div class="progress">
              <div class="progress-bar bg-success" style="width: 70%"></div>
            </div>
          </div>
          <div class="col-12 mt-4">
            <div class="d-flex justify-content-between">
              <h6>67%</h6>
              <span>Grow</span>
            </div>
            <div class="progress">
              <div class="progress-bar bg-info" style="width: 40%"></div>
            </div>
          </div>
          <div class="col-12 mt-4">
            <div class="d-flex justify-content-between">
              <h6>67%</h6>
              <span>Grow</span>
            </div>
            <div class="progress">
              <div class="progress-bar bg-warning" style="width: 80%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from 'vue'
import { Bar, Line, PolarArea, Pie, Doughnut, Radar } from 'vue-chartjs'
import VueApexCharts from 'vue3-apexcharts'
import IMAGE from '@/constent/Theme'

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
  Filler
} from 'chart.js'

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
)
import {
  widgetChart1,
  chart_widget_2,
  chart_widget_7,
  chart_widget_3,
  chart_widget_4,
  chart_widget_5,
  chart_widget_6,
  chart_widget_8,
  chart_widget_9,
  chart_widget_10,
  chart_widget_11,
  chart_widget_14,
  chart_widget_15,
  chart_widget_16
} from '@/layouts/ChartsData'

export default defineComponent({
  name: 'widgetChart',
  components: { Bar, Line, PolarArea, Pie, Doughnut, Radar, apexchart: VueApexCharts },
  data() {
    return {
      IMAGE
    }
  },
  setup() {
    return {
      widgetChart1,
      chart_widget_2,
      chart_widget_7,
      chart_widget_3,
      chart_widget_4,
      chart_widget_5,
      chart_widget_6,
      chart_widget_8,
      chart_widget_9,
      chart_widget_10,
      chart_widget_11,
      chart_widget_14,
      chart_widget_15,
      chart_widget_16
    }
  }
})
</script>
