<script lang="ts" setup>
import { reactive } from "vue";
import { RouterLink } from "vue-router";
import VueApexCharts from "vue3-apexcharts";
import { Bar, Line } from "vue-chartjs";

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement, RadialLinearScale, ArcElement, Filler } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement, RadialLinearScale, ArcElement, Filler);

const state = reactive({
  series: [44.9, 17.6, 37.5],
  chartOptions: {
    chart: {
      width: "100%",
      type: "pie",
    },
    fill: {
      colors: ["#9dbdff", "#7099ed", "#b3ccff"],
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
      width: "100%",
      offsetY: 48,
      toolbar: {
        show: false,
      },
    },

    colors: ["#c8ff87"],
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

const barChart = reactive({
  type: "bar",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "#fff",
        backgroundColor: (ctx: any) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 250);

          gradient.addColorStop(0, "rgba(102, 115, 253,0.5)");
          gradient.addColorStop(1, "rgb(102, 115, 253)");

          return gradient;
        },
        borderWidth: "0",
        colors: "#fff",
        barPercentage: 0.5,
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        show: false,
        ticks: {
          beginAtZero: true,
          color: "#888",

          fontColor: "#888",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
      x: {
        // Change here

        ticks: {
          fontColor: "#888",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
    },
  },
});

const linChart = {
  type: "line",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Febr", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        data: [25, 20, 60, 41, 66, 45, 80],

        borderColor: "#6673fd",
        borderWidth: "4",
        tension: 0.5,
        backgroundColor: "#6673fd",
        pointBackgroundColor: "#6673fd",
        fill: {
          target: true,
          above: "rgba(102, 115, 253,0.2)",
          below: "#6673fd",
        },
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        max: 100,
        min: 0,
        show: false,

        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
      x: {
        // Change here

        // ticks: {
        //     color: "#fff",
        // },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,
          offsetGridLines: true,
        },
      },
    },
  },
};
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6 col-xl-3">
        <div class="widget-stat card bg-primary overflow-hidden">
          <div class="card-header border-opacity">
            <h3 class="card-title text-white">Total Students</h3>
            <h5 class="text-white mb-0"><i class="fa fa-caret-up"></i> 422</h5>
          </div>
          <div class="card-body text-center mt-3">
            <div class="ico-sparkline">
              <div id="sparkline12">
                <VueApexCharts width="100%" height="130" :options="state.chartOptions" :series="state.series" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="widget-stat card bg-success overflow-hidden">
          <div class="card-header border-opacity">
            <h3 class="card-title text-white">New Students</h3>
            <h5 class="text-white mb-0"><i class="fa fa-caret-up"></i> 357</h5>
          </div>
          <div class="card-body text-center mt-4 p-0">
            <div class="ico-sparkline">
              <div id="spark-bar-2">
                <VueApexCharts width="100%" height="130" :options="state2.chartOptions" :series="state2.series" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="widget-stat card bg-secondary overflow-hidden">
          <div class="card-header border-opacity pb-3">
            <h3 class="card-title text-white">Total Course</h3>
            <h5 class="text-white mb-0"><i class="fa fa-caret-up"></i> 547</h5>
          </div>
          <div class="card-body p-0 mt-2">
            <div class="px-4">
              <svg class="peity" height="140" width="100%">
                <rect data-value="6" fill="rgb(216, 196, 255)" x="1.6425" y="24.705882352941188" width="13.140000000000002" height="49.41176470588235"></rect>
                <rect data-value="2" fill="rgb(216, 196, 255)" x="18.067500000000003" y="57.647058823529406" width="13.139999999999997" height="16.47058823529413"></rect>
                <rect data-value="8" fill="rgb(216, 196, 255)" x="34.4925" y="8.235294117647072" width="13.14" height="65.88235294117646"></rect>
                <rect data-value="4" fill="rgb(216, 196, 255)" x="50.917500000000004" y="41.17647058823529" width="13.139999999999986" height="32.941176470588246"></rect>
                <rect data-value="-3" fill="rgb(216, 196, 255)" x="67.3425" y="74.11764705882354" width="13.14" height="24.70588235294116"></rect>
                <rect data-value="8" fill="rgb(216, 196, 255)" x="83.7675" y="8.235294117647072" width="13.14" height="65.88235294117646"></rect>
                <rect data-value="1" fill="rgb(216, 196, 255)" x="100.1925" y="65.88235294117646" width="13.140000000000015" height="8.235294117647072"></rect>
                <rect data-value="-3" fill="rgb(216, 196, 255)" x="116.61749999999999" y="74.11764705882354" width="13.14" height="24.70588235294116"></rect>
                <rect data-value="6" fill="rgb(216, 196, 255)" x="133.0425" y="24.705882352941188" width="13.140000000000015" height="49.41176470588235"></rect>
                <rect data-value="-5" fill="rgb(216, 196, 255)" x="149.4675" y="74.11764705882354" width="13.140000000000015" height="41.17647058823529"></rect>
                <rect data-value="9" fill="rgb(216, 196, 255)" x="165.89249999999998" y="0" width="13.140000000000015" height="74.11764705882354"></rect>
                <rect data-value="2" fill="rgb(216, 196, 255)" x="182.3175" y="57.647058823529406" width="13.140000000000015" height="16.47058823529413"></rect>
                <rect data-value="-8" fill="rgb(216, 196, 255)" x="198.7425" y="74.11764705882354" width="13.140000000000015" height="65.88235294117646"></rect>
                <rect data-value="1" fill="rgb(216, 196, 255)" x="215.16749999999996" y="65.88235294117646" width="13.140000000000072" height="8.235294117647072"></rect>
                <rect data-value="4" fill="rgb(216, 196, 255)" x="231.59249999999997" y="41.17647058823529" width="13.140000000000043" height="32.941176470588246"></rect>
                <rect data-value="8" fill="rgb(216, 196, 255)" x="248.01749999999998" y="8.235294117647072" width="13.140000000000043" height="65.88235294117646"></rect>
                <rect data-value="9" fill="rgb(216, 196, 255)" x="264.4425" y="0" width="13.139999999999986" height="74.11764705882354"></rect>
                <rect data-value="8" fill="rgb(216, 196, 255)" x="280.8675" y="8.235294117647072" width="13.139999999999986" height="65.88235294117646"></rect>
                <rect data-value="2" fill="rgb(216, 196, 255)" x="297.2925" y="57.647058823529406" width="13.139999999999986" height="16.47058823529413"></rect>
                <rect data-value="1" fill="rgb(216, 196, 255)" x="313.71750000000003" y="65.88235294117646" width="13.13999999999993" height="8.235294117647072"></rect>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="widget-stat card bg-danger overflow-hidden">
          <div class="card-header border-opacity pb-3">
            <h3 class="card-title text-white">Fees Collection</h3>
            <h5 class="text-white mb-0"><i class="fa fa-caret-up"></i> 3280$</h5>
          </div>
          <div class="card-body p-0 mt-1">
            <svg class="peity" height="150" width="100%">
              <polygon
                fill="#ff3232"
                points="0 148.5 0 34.16666666666667 31.375 50.5 62.75 17.833333333333343 94.125 34.16666666666667 125.5 99.5 156.875 17.833333333333343 188.25 99.5 219.625 99.5 251 50.5 282.375 66.83333333333333 313.75 1.5 345.125 115.83333333333334 376.5 17.833333333333343 376.5 148.5"
              ></polygon>
              <polyline
                fill="none"
                points="0 34.16666666666667 31.375 50.5 62.75 17.833333333333343 94.125 34.16666666666667 125.5 99.5 156.875 17.833333333333343 188.25 99.5 219.625 99.5 251 50.5 282.375 66.83333333333333 313.75 1.5 345.125 115.83333333333334 376.5 17.833333333333343"
                stroke="#fac2c2"
                stroke-width="3"
                stroke-linecap="square"
              ></polyline>
            </svg>
          </div>
        </div>
      </div>
      <div class="col-xl-6 col-xxl-6 col-sm-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Income/Expense Report</h3>
          </div>
          <div class="card-body">
            <!-- @vue-ignore -->
            <Bar :data="barChart.data" :options="barChart.options" id="barChart_2" ref="chartJs" />
          </div>
        </div>
      </div>
      <div class="col-xl-6 col-xxl-6 col-sm-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Income/Expense Report</h3>
          </div>
          <div class="card-body">
            <!-- @vue-ignore -->
            <Line :data="linChart.data" :options="linChart.options" id="areaChart_1" ref="chartJs" />
          </div>
        </div>
      </div>
      <div class="col-xl-8 col-xxl-8 col-lg-8 col-md-12 col-sm-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Assign Task</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table header-border table-hover verticle-middle">
                <thead>
                  <tr>
                    <th class="icon_none" scope="col">S.No.</th>
                    <th class="icon_none" scope="col">Task</th>
                    <th class="icon_none" scope="col">Assigned Professors</th>
                    <th class="icon_none" scope="col">Status</th>
                    <th class="icon_none" scope="col">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>Working Design report</td>
                    <td>Herman Beck</td>
                    <td><span class="badge badge-rounded badge-primary">DONE</span></td>
                    <td>
                      <div class="progress">
                        <div class="progress-bar" style="width: 70%" role="progressbar">
                          <span class="sr-only">70% Complete</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>Fees Collection report</td>
                    <td>Emma Watson</td>
                    <td><span class="badge badge-rounded badge-warning">Pending</span></td>
                    <td>
                      <div class="progress">
                        <div class="progress-bar bg-warning" style="width: 70%" role="progressbar">
                          <span class="sr-only">70% Complete</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>3</th>
                    <td>Management report</td>
                    <td>Mary Adams</td>
                    <td><span class="badge badge-rounded badge-warning">Pending</span></td>
                    <td>
                      <div class="progress">
                        <div class="progress-bar bg-warning" style="width: 70%" role="progressbar">
                          <span class="sr-only">70% Complete</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>4</th>
                    <td>Library book status</td>
                    <td>Caleb Richards</td>
                    <td><span class="badge badge-rounded badge-danger">Suspended</span></td>
                    <td>
                      <div class="progress">
                        <div class="progress-bar bg-danger" style="width: 70%" role="progressbar">
                          <span class="sr-only">70% Complete</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>5</th>
                    <td>Placement status</td>
                    <td>June Lane</td>
                    <td><span class="badge badge-rounded badge-warning">Pending</span></td>
                    <td>
                      <div class="progress">
                        <div class="progress-bar bg-warning" style="width: 70%" role="progressbar">
                          <span class="sr-only">70% Complete</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>6</th>
                    <td>Working Design report</td>
                    <td>Herman Beck</td>
                    <td><span class="badge badge-rounded badge-primary">DONE</span></td>
                    <td>
                      <div class="progress">
                        <div class="progress-bar" style="width: 70%" role="progressbar">
                          <span class="sr-only">70% Complete</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-xxl-4 col-lg-4 col-md-12 col-sm-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Notifications</h4>
          </div>
          <div class="card-body">
            <div class="widget-todo dz-scroll" style="height: 320px" id="DZ_W_Notifications">
              <ul class="timeline">
                <li>
                  <div class="timeline-badge primary"></div>
                  <a class="timeline-panel text-muted mb-3 d-flex align-items-center" href="javascript:void(0);">
                    <img class="rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic1.jpg" />
                    <div class="col px-3">
                      <h5 class="mb-1">Dr sultads Send you Photo</h5>
                      <small class="d-block">29 July 2021 - 02:26 PM</small>
                    </div>
                  </a>
                </li>
                <li>
                  <div class="timeline-badge warning"></div>
                  <a class="timeline-panel text-muted mb-3 d-flex align-items-center" href="javascript:void(0);">
                    <img class="rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic2.jpg" />
                    <div class="col px-3">
                      <h5 class="mb-1">Resport created successfully</h5>
                      <small class="d-block">29 July 2021 - 02:26 PM</small>
                    </div>
                  </a>
                </li>
                <li>
                  <div class="timeline-badge danger"></div>
                  <a class="timeline-panel text-muted mb-3 d-flex align-items-center" href="javascript:void(0);">
                    <img class="rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic3.jpg" />
                    <div class="col px-3">
                      <h5 class="mb-1">Reminder : Treatment Time!</h5>
                      <small class="d-block">29 July 2021 - 02:26 PM</small>
                    </div>
                  </a>
                </li>
                <li>
                  <div class="timeline-badge success"></div>
                  <a class="timeline-panel text-muted mb-3 d-flex align-items-center" href="javascript:void(0);">
                    <img class="rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic4.jpg" />
                    <div class="col px-3">
                      <h5 class="mb-1">Dr sultads Send you Photo</h5>
                      <small class="d-block">29 July 2021 - 02:26 PM</small>
                    </div>
                  </a>
                </li>
                <li>
                  <div class="timeline-badge warning"></div>
                  <a class="timeline-panel text-muted mb-3 d-flex align-items-center" href="javascript:void(0);">
                    <img class="rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic5.jpg" />
                    <div class="col px-3">
                      <h5 class="mb-1">Resport created successfully</h5>
                      <small class="d-block">29 July 2021 - 02:26 PM</small>
                    </div>
                  </a>
                </li>
                <li>
                  <div class="timeline-badge dark"></div>
                  <a class="timeline-panel text-muted mb-3 d-flex align-items-center" href="javascript:void(0);">
                    <img class="rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic6.jpg" />
                    <div class="col px-3">
                      <h5 class="mb-1">Reminder : Treatment Time!</h5>
                      <small class="d-block">29 July 2021 - 02:26 PM</small>
                    </div>
                  </a>
                </li>
                <li>
                  <div class="timeline-badge info"></div>
                  <a class="timeline-panel text-muted mb-3 d-flex align-items-center" href="javascript:void(0);">
                    <img class="rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic7.jpg" />
                    <div class="col px-3">
                      <h5 class="mb-1">Dr sultads Send you Photo</h5>
                      <small class="d-block">29 July 2021 - 02:26 PM</small>
                    </div>
                  </a>
                </li>
                <li>
                  <div class="timeline-badge danger"></div>
                  <a class="timeline-panel text-muted mb-3 d-flex align-items-center" href="javascript:void(0);">
                    <img class="rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic8.jpg" />
                    <div class="col px-3">
                      <h5 class="mb-1">Resport created successfully</h5>
                      <small class="d-block">29 July 2021 - 02:26 PM</small>
                    </div>
                  </a>
                </li>
                <li>
                  <div class="timeline-badge success"></div>
                  <a class="timeline-panel text-muted mb-3 d-flex align-items-center" href="javascript:void(0);">
                    <img class="rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic9.jpg" />
                    <div class="col px-3">
                      <h5 class="mb-1">Reminder : Treatment Time!</h5>
                      <small class="d-block">29 July 2021 - 02:26 PM</small>
                    </div>
                  </a>
                </li>
                <li>
                  <div class="timeline-badge warning"></div>
                  <a class="timeline-panel text-muted d-flex align-items-center" href="javascript:void(0);">
                    <img class="rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic10.jpg" />
                    <div class="col px-3">
                      <h5 class="mb-1">Dr sultads Send you Photo</h5>
                      <small class="d-block">29 July 2021 - 02:26 PM</small>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">New Student List</h4>
          </div>
          <div class="card-body pt-2">
            <div class="table-responsive">
              <table class="table table-sm mb-0 table-striped text-nowrap">
                <thead>
                  <tr>
                    <th class="icon_none py-3">Student Name</th>
                    <th class="icon_none py-3">Assigned Professor</th>
                    <th class="icon_none py-3">Branch</th>
                    <th class="icon_none py-3">Status</th>
                    <th class="icon_none py-3">Date Of Admit</th>
                    <th class="icon_none py-3">Edit</th>
                  </tr>
                </thead>
                <tbody id="customers">
                  <tr class="btn-reveal-trigger">
                    <td class="p-3">
                      <a href="javascript:void(0);">
                        <div class="media d-flex align-items-center">
                          <div class="avatar avatar-xl me-2">
                            <img class="rounded-circle img-fluid" src="../../assets/images/avatar/5.png" width="30" alt="" />
                          </div>
                          <div class="media-body">
                            <h5 class="mb-0 fs--1">Ricky Antony</h5>
                          </div>
                        </div>
                      </a>
                    </td>
                    <td class="py-2">Herman Beck</td>
                    <td class="py-2">Mechanical</td>
                    <td><span class="badge badge-rounded badge-primary">DONE</span></td>
                    <td class="py-2">30/03/2018</td>
                    <td>
                      <RouterLink to="/edit-student" class="btn btn-xs sharp btn-primary me-1"><i class="fa fa-pencil"></i></RouterLink>
                      <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                    </td>
                  </tr>
                  <tr class="btn-reveal-trigger">
                    <td class="p-3">
                      <a href="javascript:void(0);">
                        <div class="media d-flex align-items-center">
                          <div class="avatar avatar-xl me-2">
                            <img class="rounded-circle img-fluid" src="../../assets/images/avatar/1.png" alt="" width="30" />
                          </div>
                          <div class="media-body">
                            <h5 class="mb-0 fs--1">Emma Watson</h5>
                          </div>
                        </div>
                      </a>
                    </td>
                    <td class="py-2">Emma Watson</td>
                    <td class="py-2">Computer</td>
                    <td><span class="badge badge-rounded badge-warning">Pending</span></td>
                    <td class="py-2">11/07/2017</td>
                    <td>
                      <RouterLink to="/edit-student" class="btn btn-xs sharp btn-primary me-1"><i class="fa fa-pencil"></i></RouterLink>
                      <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                    </td>
                  </tr>
                  <tr class="btn-reveal-trigger">
                    <td class="p-3">
                      <a href="javascript:void(0);">
                        <div class="media d-flex align-items-center">
                          <div class="avatar avatar-xl me-2">
                            <img class="rounded-circle img-fluid" src="../../assets/images/avatar/5.png" width="30" alt="" />
                          </div>
                          <div class="media-body">
                            <h5 class="mb-0 fs--1">Rowen Atkinson</h5>
                          </div>
                        </div>
                      </a>
                    </td>
                    <td class="py-2">Mary Adams</td>
                    <td class="py-2">Mechanical</td>
                    <td><span class="badge badge-rounded badge-primary">DONE</span></td>
                    <td class="py-2">05/04/2016</td>
                    <td>
                      <RouterLink to="/edit-student" class="btn btn-xs sharp btn-primary me-1"><i class="fa fa-pencil"></i></RouterLink>
                      <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                    </td>
                  </tr>
                  <tr class="btn-reveal-trigger">
                    <td class="p-3">
                      <a href="javascript:void(0);">
                        <div class="media d-flex align-items-center">
                          <div class="avatar avatar-xl me-2">
                            <img class="rounded-circle img-fluid" src="../../assets/images/avatar/1.png" alt="" width="30" />
                          </div>
                          <div class="media-body">
                            <h5 class="mb-0 fs--1">Antony Hopkins</h5>
                          </div>
                        </div>
                      </a>
                    </td>
                    <td class="py-2">Caleb Richards</td>
                    <td class="py-2">Computer</td>
                    <td><span class="badge badge-rounded badge-danger">Suspended</span></td>
                    <td class="py-2">05/04/2018</td>
                    <td>
                      <RouterLink to="/edit-student" class="btn btn-xs sharp btn-primary me-1"><i class="fa fa-pencil"></i></RouterLink>
                      <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                    </td>
                  </tr>
                  <tr class="btn-reveal-trigger">
                    <td class="p-3">
                      <a href="javascript:void(0);">
                        <div class="media d-flex align-items-center">
                          <div class="avatar avatar-xl me-2">
                            <img class="rounded-circle img-fluid" src="../../assets/images/avatar/1.png" alt="" width="30" />
                          </div>
                          <div class="media-body">
                            <h5 class="mb-0 fs--1">Jennifer Schramm</h5>
                          </div>
                        </div>
                      </a>
                    </td>
                    <td class="py-2">June Lane</td>
                    <td class="py-2">Fees Collection</td>
                    <td><span class="badge badge-rounded badge-warning">Pending</span></td>
                    <td class="py-2">17/03/2016</td>
                    <td>
                      <RouterLink to="/edit-student" class="btn btn-xs sharp btn-primary me-1"><i class="fa fa-pencil"></i></RouterLink>
                      <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                    </td>
                  </tr>
                  <tr class="btn-reveal-trigger">
                    <td class="p-3">
                      <a href="javascript:void(0);">
                        <div class="media d-flex align-items-center">
                          <div class="avatar avatar-xl me-2">
                            <img class="rounded-circle img-fluid" src="../../assets/images/avatar/5.png" width="30" alt="" />
                          </div>
                          <div class="media-body">
                            <h5 class="mb-0 fs--1">Raymond Mims</h5>
                          </div>
                        </div>
                      </a>
                    </td>
                    <td class="py-2">Herman Beck</td>
                    <td class="py-2">Computer</td>
                    <td><span class="badge badge-rounded badge-danger">Suspended</span></td>
                    <td class="py-2">12/07/2014</td>
                    <td>
                      <RouterLink to="/edit-student" class="btn btn-xs sharp btn-primary me-1"><i class="fa fa-pencil"></i></RouterLink>
                      <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                    </td>
                  </tr>
                  <tr class="btn-reveal-trigger">
                    <td class="p-3">
                      <a href="javascript:void(0);">
                        <div class="media d-flex align-items-center">
                          <div class="avatar avatar-xl me-2">
                            <img class="rounded-circle img-fluid" src="../../assets/images/avatar/1.png" alt="" width="30" />
                          </div>
                          <div class="media-body">
                            <h5 class="mb-0 fs--1">Michael Jenkins</h5>
                          </div>
                        </div>
                      </a>
                    </td>
                    <td class="py-2">Jennifer Schramm</td>
                    <td class="py-2">Mechanical</td>
                    <td><span class="badge badge-rounded badge-warning">Pending</span></td>
                    <td class="py-2">15/06/2014</td>
                    <td>
                      <RouterLink to="/edit-student" class="btn btn-xs sharp btn-primary me-1"><i class="fa fa-pencil"></i></RouterLink>
                      <a href="javascript:void(0);" class="btn btn-xs sharp btn-danger"><i class="fa fa-trash"></i></a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
