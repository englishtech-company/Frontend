<script lang="ts" setup>
import { reactive, ref } from "vue";
import VueApexCharts from "vue3-apexcharts";

const allInputs = ref(false);

const state = reactive({
  series: [
    {
      name: "a",
      data: [100, 75, 75, 75, 50, 75, 79, 60, 66, 46, 35],
    },

    {
      name: "b",
      data: [90, 65, 65, 65, 40, 65, 35, 20, 30, 60, 80],
    },
    {
      name: "c",
      data: [80, 75, 75, 75, 45, 85, 45, 60, 50, 90, 60],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },

    chart: {
      type: "bar",
      width: "100%",
      height: 250,
      toolbar: false,
      stacked: true,
    },

    colors: ["#07294d", "#143b64", "#ff8f16"],
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
      max: 300,
      labels: {
        formatter: function (value: number) {
          return value.toFixed(0);
        },
      },
    },
    xaxis: {
      categories: ["2006", "2007", "2007", "2007", "2008", "2009", "2009", "2009", "2009", "2009", "2009"],
    },
  },
});
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-xl-6 col-xxl-6 col-sm-12">
        <div class="row">
          <div class="col-xl-6 col-xxl-6 col-sm-6">
            <div class="widget-stat card">
              <div class="card-body">
                <h4 class="card-title">Total Students</h4>
                <h3 class="fw-bold">3280</h3>
                <div class="progress mb-2">
                  <div class="progress-bar progress-animated bg-primary" style="width: 80%"></div>
                </div>
                <small>80% Increase in 20 Days</small>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-xxl-6 col-sm-6">
            <div class="widget-stat card">
              <div class="card-body">
                <h4 class="card-title">New Students</h4>
                <h3 class="fw-bold">245</h3>
                <div class="progress mb-2">
                  <div class="progress-bar progress-animated bg-danger" style="width: 50%"></div>
                </div>
                <small>50% Increase in 25 Days</small>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-xxl-6 col-sm-6">
            <div class="widget-stat card">
              <div class="card-body">
                <h4 class="card-title">Total Course</h4>
                <h3 class="fw-bold">28</h3>
                <div class="progress mb-2">
                  <div class="progress-bar progress-animated bg-red" style="width: 76%"></div>
                </div>
                <small>76% Increase in 20 Days</small>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-xxl-6 col-sm-6">
            <div class="widget-stat card">
              <div class="card-body">
                <h4 class="card-title">Fees Collection</h4>
                <h3 class="fw-bold">25160$</h3>
                <div class="progress mb-2">
                  <div class="progress-bar progress-animated bg-success" style="width: 30%"></div>
                </div>
                <small>30% Increase in 30 Days</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6 col-xxl-6 col-sm-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Income/Expense Report</h3>
          </div>
          <div class="card-body">
            <div id="morris_bar_2" class="morris_chart_height ltr">
              <VueApexCharts width="100%" height="250px" :series="state.series" :options="state.chartOptions" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Professors List</h4>
          </div>
          <div class="card-body dz-scroll" style="height: 360px">
            <div class="media mb-3 align-items-center border-bottom pb-3">
              <img class="me-3 rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic1.jpg" />
              <div class="media-body">
                <h5 class="mb-0 text-pale-sky">Theodore Handle <small class="text-muted">( B.Com )</small></h5>
                <small class="text-primary mb-0">Available</small>
              </div>
            </div>
            <div class="media mb-3 align-items-center border-bottom pb-3">
              <img class="me-3 rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic2.jpg" />
              <div class="media-body">
                <h5 class="mb-0 text-pale-sky">Bess Willis <small class="text-muted">( M.Com )</small></h5>
                <small class="text-danger mb-0">Not Available</small>
              </div>
            </div>
            <div class="media mb-3 align-items-center border-bottom pb-3">
              <img class="me-3 rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic3.jpg" />
              <div class="media-body">
                <h5 class="mb-0 text-pale-sky">James Jones <small class="text-muted">( M.Tach )</small></h5>
                <small class="text-primary mb-0">Available</small>
              </div>
            </div>
            <div class="media mb-3 align-items-center border-bottom pb-3">
              <img class="me-3 rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic4.jpg" />
              <div class="media-body">
                <h5 class="mb-0 text-pale-sky">Smith Watson <small class="text-muted">( B.Tach )</small></h5>
                <small class="text-danger mb-0">Not Available</small>
              </div>
            </div>
            <div class="media mb-2 align-items-center border-bottom pb-3">
              <img class="me-3 rounded-circle" alt="image" width="50" src="../../assets/images/profile/education/pic5.jpg" />
              <div class="media-body">
                <h5 class="mb-0 text-pale-sky">Morese Sharpe <small class="text-muted">( B.A, M.A )</small></h5>
                <small class="text-primary mb-0">Available</small>
              </div>
            </div>
          </div>
          <div class="card-footer border-0 pt-2">
            <div class="text-center">
              <RouterLink to="/all-professors" class="btn btn-primary">View All</RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-8 col-lg-8 col-xxl-8 col-md-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Student List</h4>
          </div>
          <div class="card-body">
            <div class="table-responsive recentOrderTable text-nowrap">
              <table class="table verticle-middle table-responsive-md">
                <thead>
                  <tr>
                    <th scope="col" class="icon_none">
                      <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="checkAll" @click="allInputs = !allInputs" />
                      </div>
                    </th>
                    <th class="icon_none" scope="col">Student Name</th>
                    <th class="icon_none" scope="col">Assigned Coach</th>
                    <th class="icon_none" scope="col">Date</th>
                    <th class="icon_none" scope="col">Time</th>
                    <th class="icon_none" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="form-check">
                        <input type="checkbox" :checked="allInputs" class="form-check-input" id="checkbox2" />
                      </div>
                    </td>
                    <td>Angelica Ramos</td>
                    <td>Ashton Cox</td>
                    <td>12 August 2021</td>
                    <td>10:15</td>
                    <td>
                      <div class="dropdown custom-dropdown mb-0">
                        <div data-bs-toggle="dropdown">
                          <i class="fa fa-ellipsis-v"></i>
                        </div>
                        <div class="dropdown-menu dropdown-menu-right">
                          <a class="dropdown-item" href="javascript:void(0);">Accept</a>
                          <a class="dropdown-item" href="javascript:void(0);">Details</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Cancel</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="form-check">
                        <input type="checkbox" :checked="allInputs" class="form-check-input" id="checkbox3" />
                      </div>
                    </td>
                    <td>Bradley Greer</td>
                    <td>Brenden Wagner</td>
                    <td>11 July 2021</td>
                    <td>10:00</td>
                    <td>
                      <div class="dropdown custom-dropdown mb-0">
                        <div data-bs-toggle="dropdown">
                          <i class="fa fa-ellipsis-v"></i>
                        </div>
                        <div class="dropdown-menu dropdown-menu-right">
                          <a class="dropdown-item" href="javascript:void(0);">Accept</a>
                          <a class="dropdown-item" href="javascript:void(0);">Details</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Cancel</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="form-check">
                        <input type="checkbox" :checked="allInputs" class="form-check-input" id="checkbox4" />
                      </div>
                    </td>
                    <td>Cedric Kelly</td>
                    <td>Brielle Williamson</td>
                    <td>10 May 2021</td>
                    <td>09:45</td>
                    <td>
                      <div class="dropdown custom-dropdown mb-0">
                        <div data-bs-toggle="dropdown">
                          <i class="fa fa-ellipsis-v"></i>
                        </div>
                        <div class="dropdown-menu dropdown-menu-right">
                          <a class="dropdown-item" href="javascript:void(0);">Accept</a>
                          <a class="dropdown-item" href="javascript:void(0);">Details</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Cancel</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="form-check">
                        <input type="checkbox" :checked="allInputs" class="form-check-input" id="checkbox5" />
                      </div>
                    </td>
                    <td>Caesar Vance</td>
                    <td>Herrod Chandler</td>
                    <td>09 April 2021</td>
                    <td>09:30</td>
                    <td>
                      <div class="dropdown custom-dropdown mb-0">
                        <div data-bs-toggle="dropdown">
                          <i class="fa fa-ellipsis-v"></i>
                        </div>
                        <div class="dropdown-menu dropdown-menu-right">
                          <a class="dropdown-item" href="javascript:void(0);">Accept</a>
                          <a class="dropdown-item" href="javascript:void(0);">Details</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Cancel</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="form-check">
                        <input type="checkbox" :checked="allInputs" class="form-check-input" id="checkbox6" />
                      </div>
                    </td>
                    <td>Rhona Davidson</td>
                    <td>Sonya Frost</td>
                    <td>08 March 2021</td>
                    <td>09:15</td>
                    <td>
                      <div class="dropdown custom-dropdown mb-0">
                        <div data-bs-toggle="dropdown">
                          <i class="fa fa-ellipsis-v"></i>
                        </div>
                        <div class="dropdown-menu dropdown-menu-right">
                          <a class="dropdown-item" href="javascript:void(0);">Accept</a>
                          <a class="dropdown-item" href="javascript:void(0);">Details</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Cancel</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="form-check">
                        <input type="checkbox" :checked="allInputs" class="form-check-input" id="checkbox7" />
                      </div>
                    </td>
                    <td>Bradley Greer</td>
                    <td>Brenden Wagner</td>
                    <td>11 July 2021</td>
                    <td>10:00</td>
                    <td>
                      <div class="dropdown custom-dropdown mb-0">
                        <div data-bs-toggle="dropdown">
                          <i class="fa fa-ellipsis-v"></i>
                        </div>
                        <div class="dropdown-menu dropdown-menu-right">
                          <a class="dropdown-item" href="javascript:void(0);">Accept</a>
                          <a class="dropdown-item" href="javascript:void(0);">Details</a>
                          <a class="dropdown-item text-danger" href="javascript:void(0);">Cancel</a>
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
      <div class="col-lg-4 col-md-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Gold medal</h4>
            <small class="text-success"><i class="fa fa-caret-up"></i> 20% High then last mont</small>
          </div>
          <div class="card-body pb-0">
            <div class="row mt-2">
              <div class="col">
                <h6 class="font-weight-normal">Overall Growth</h6>
                <strong>82.24%</strong>
              </div>
              <div class="col">
                <h6 class="font-weight-normal">Montly</h6>
                <strong>12.24 %</strong>
              </div>
              <div class="col">
                <h6 class="font-weight-normal">Day</h6>
                <strong>42.24%</strong>
              </div>
            </div>
          </div>
          <div class="chart-wrapper">
            <svg class="peity" height="150" width="100%">
              <polygon
                fill="rgba(162, 186, 211, 1)"
                points="0 149.5 0 50.16666666666667 26.946473684210527 66.72222222222221 53.892947368421055 17.05555555555557 80.83942105263158 83.27777777777779 107.78589473684211 99.83333333333334 134.73236842105263 17.05555555555557 161.67884210526316 83.27777777777779 188.6253157894737 99.83333333333334 215.57178947368422 50.16666666666667 242.51826315789475 66.72222222222221 269.46473684210525 0.5 296.4112105263158 66.72222222222221 323.3576842105263 17.05555555555557 350.3041578947369 99.83333333333334 377.2506315789474 83.27777777777779 404.19710526315794 17.05555555555557 431.14357894736844 0.5 458.09005263157894 17.05555555555557 485.0365263157895 66.72222222222221 511.983 33.611111111111114 511.983 149.5"
              ></polygon>
              <polyline
                fill="none"
                points="0 50.16666666666667 26.946473684210527 66.72222222222221 53.892947368421055 17.05555555555557 80.83942105263158 83.27777777777779 107.78589473684211 99.83333333333334 134.73236842105263 17.05555555555557 161.67884210526316 83.27777777777779 188.6253157894737 99.83333333333334 215.57178947368422 50.16666666666667 242.51826315789475 66.72222222222221 269.46473684210525 0.5 296.4112105263158 66.72222222222221 323.3576842105263 17.05555555555557 350.3041578947369 99.83333333333334 377.2506315789474 83.27777777777779 404.19710526315794 17.05555555555557 431.14357894736844 0.5 458.09005263157894 17.05555555555557 485.0365263157895 66.72222222222221 511.983 33.611111111111114"
                stroke="rgba(20, 59, 100, 1)"
                stroke-width="1"
                stroke-linecap="square"
              ></polyline>
            </svg>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-lg-4 col-xxl-4 col-md-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Silver medal</h4>
            <small class="text-success"><i class="fa fa-caret-up"></i> 20% High then last mont</small>
          </div>
          <div class="card-body pb-0">
            <div class="row mt-2">
              <div class="col">
                <h6 class="font-weight-normal">Overall Growth</h6>
                <strong>82.24%</strong>
              </div>
              <div class="col">
                <h6 class="font-weight-normal">Montly</h6>
                <strong>12.24 %</strong>
              </div>
              <div class="col">
                <h6 class="font-weight-normal">Day</h6>
                <strong>42.24%</strong>
              </div>
            </div>
          </div>
          <div class="chart-wrapper">
            <svg class="peity" height="150" width="100%">
              <polygon
                fill="rgba(255, 225, 193, 1)"
                points="0 149.5 0 0.5 26.946473684210527 99.83333333333334 53.892947368421055 33.611111111111114 80.83942105263158 17.05555555555557 107.78589473684211 50.16666666666667 134.73236842105263 33.611111111111114 161.67884210526316 99.83333333333334 188.6253157894737 99.83333333333334 215.57178947368422 33.611111111111114 242.51826315789475 83.27777777777779 269.46473684210525 50.16666666666667 296.4112105263158 17.05555555555557 323.3576842105263 99.83333333333334 350.3041578947369 83.27777777777779 377.2506315789474 33.611111111111114 404.19710526315794 99.83333333333334 431.14357894736844 83.27777777777779 458.09005263157894 33.611111111111114 485.0365263157895 17.05555555555557 511.983 66.72222222222221 511.983 149.5"
              ></polygon>
              <polyline
                fill="none"
                points="0 0.5 26.946473684210527 99.83333333333334 53.892947368421055 33.611111111111114 80.83942105263158 17.05555555555557 107.78589473684211 50.16666666666667 134.73236842105263 33.611111111111114 161.67884210526316 99.83333333333334 188.6253157894737 99.83333333333334 215.57178947368422 33.611111111111114 242.51826315789475 83.27777777777779 269.46473684210525 50.16666666666667 296.4112105263158 17.05555555555557 323.3576842105263 99.83333333333334 350.3041578947369 83.27777777777779 377.2506315789474 33.611111111111114 404.19710526315794 99.83333333333334 431.14357894736844 83.27777777777779 458.09005263157894 33.611111111111114 485.0365263157895 17.05555555555557 511.983 66.72222222222221"
                stroke="rgba(255, 143, 22, 1)"
                stroke-width="1"
                stroke-linecap="square"
              ></polyline>
            </svg>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-lg-4 col-xxl-4 col-md-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Bronze medal</h4>
            <small class="text-success"><i class="fa fa-caret-up"></i> 20% High then last mont</small>
          </div>
          <div class="card-body pb-0">
            <div class="row mt-2">
              <div class="col">
                <h6 class="font-weight-normal">Overall Growth</h6>
                <strong>82.24%</strong>
              </div>
              <div class="col">
                <h6 class="font-weight-normal">Montly</h6>
                <strong>12.24 %</strong>
              </div>
              <div class="col">
                <h6 class="font-weight-normal">Day</h6>
                <strong>42.24%</strong>
              </div>
            </div>
          </div>
          <div class="chart-wrapper">
            <svg class="peity" height="150" width="100%">
              <polygon
                fill="rgba(251, 180, 157, 1)"
                points="0 149.5 0 99.83333333333334 26.946473684210527 17.05555555555557 53.892947368421055 99.83333333333334 80.83942105263158 33.611111111111114 107.78589473684211 17.05555555555557 134.73236842105263 50.16666666666667 161.67884210526316 99.83333333333334 188.6253157894737 83.27777777777779 215.57178947368422 33.611111111111114 242.51826315789475 99.83333333333334 269.46473684210525 33.611111111111114 296.4112105263158 0.5 323.3576842105263 50.16666666666667 350.3041578947369 99.83333333333334 377.2506315789474 33.611111111111114 404.19710526315794 50.16666666666667 431.14357894736844 33.611111111111114 458.09005263157894 99.83333333333334 485.0365263157895 83.27777777777779 511.983 116.38888888888889 511.983 149.5"
              ></polygon>
              <polyline
                fill="none"
                points="0 99.83333333333334 26.946473684210527 17.05555555555557 53.892947368421055 99.83333333333334 80.83942105263158 33.611111111111114 107.78589473684211 17.05555555555557 134.73236842105263 50.16666666666667 161.67884210526316 99.83333333333334 188.6253157894737 83.27777777777779 215.57178947368422 33.611111111111114 242.51826315789475 99.83333333333334 269.46473684210525 33.611111111111114 296.4112105263158 0.5 323.3576842105263 50.16666666666667 350.3041578947369 99.83333333333334 377.2506315789474 33.611111111111114 404.19710526315794 50.16666666666667 431.14357894736844 33.611111111111114 458.09005263157894 99.83333333333334 485.0365263157895 83.27777777777779 511.983 116.38888888888889"
                stroke="rgba(242, 85, 33, 1)"
                stroke-width="1"
                stroke-linecap="square"
              ></polyline>
            </svg>
          </div>
        </div>
      </div>
      <div class="col-xl-12 col-lg-12 col-xxl-12 col-md-12">
        <div class="card profile-tab">
          <div class="card-header">
            <h4 class="card-title">Salary Status</h4>
          </div>
          <div class="card-body custom-tab-1">
            <ul class="nav nav-tabs mb-3">
              <li class="nav-item"><a href="#my-posts" data-bs-toggle="tab" class="nav-link pb-2 active show">Professors</a></li>
              <li class="nav-item"><a href="#about-me" data-bs-toggle="tab" class="nav-link pb-2">Librarian</a></li>
              <li class="nav-item"><a href="#profile-settings" data-bs-toggle="tab" class="nav-link pb-2">Other</a></li>
            </ul>
            <div class="tab-content">
              <div id="my-posts" class="tab-pane fade active show">
                <div class="table-responsive">
                  <table class="table table-responsive-md text-nowrap">
                    <thead>
                      <tr>
                        <th class="icon_none" scope="col">S.No.</th>
                        <th class="icon_none" scope="col">Name</th>
                        <th class="icon_none" scope="col">Status</th>
                        <th class="icon_none" scope="col">Date</th>
                        <th class="icon_none" scope="col">Amount</th>
                        <th class="icon_none" scope="col">Transaction ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic1.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Angelica Ramos</td>
                        <td><span class="badge badge-rounded badge-success">Paid</span></td>
                        <td>12 August 2021</td>
                        <td>$100</td>
                        <td>#42317</td>
                      </tr>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic2.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Bradley Greer</td>
                        <td><span class="badge badge-rounded badge-danger">Unpaid</span></td>
                        <td>11 July 2021</td>
                        <td>$200</td>
                        <td>#54682</td>
                      </tr>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic3.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Cedric Kelly</td>
                        <td><span class="badge badge-rounded badge-warning">Pending</span></td>
                        <td>10 May 2021</td>
                        <td>$400</td>
                        <td>#57894</td>
                      </tr>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic4.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Caesar Vance</td>
                        <td><span class="badge badge-rounded badge-danger">Unpaid</span></td>
                        <td>09 April 2021</td>
                        <td>$300</td>
                        <td>#57864</td>
                      </tr>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic5.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Rhona Davidson</td>
                        <td><span class="badge badge-rounded badge-warning">Pending</span></td>
                        <td>08 March 2021</td>
                        <td>$500</td>
                        <td>#56387</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div id="about-me" class="tab-pane fade">
                <div class="table-responsive">
                  <table class="table table-responsive-md text-nowrap">
                    <thead>
                      <tr>
                        <th class="icon_none" scope="col">S.No.</th>
                        <th class="icon_none" scope="col">Name</th>
                        <th class="icon_none" scope="col">Status</th>
                        <th class="icon_none" scope="col">Date</th>
                        <th class="icon_none" scope="col">Amount</th>
                        <th class="icon_none" scope="col">Transaction ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic6.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Angelica Ramos</td>
                        <td><span class="badge badge-rounded badge-success">Paid</span></td>
                        <td>12 August 2021</td>
                        <td>$100</td>
                        <td>#42317</td>
                      </tr>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic7.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Bradley Greer</td>
                        <td><span class="badge badge-rounded badge-danger">Unpaid</span></td>
                        <td>11 July 2021</td>
                        <td>$200</td>
                        <td>#54682</td>
                      </tr>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic8.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Cedric Kelly</td>
                        <td><span class="badge badge-rounded badge-warning">Pending</span></td>
                        <td>10 May 2021</td>
                        <td>$400</td>
                        <td>#57894</td>
                      </tr>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic10.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Caesar Vance</td>
                        <td><span class="badge badge-rounded badge-danger">Unpaid</span></td>
                        <td>09 April 2021</td>
                        <td>$300</td>
                        <td>#57864</td>
                      </tr>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic9.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Rhona Davidson</td>
                        <td><span class="badge badge-rounded badge-warning">Pending</span></td>
                        <td>08 March 2021</td>
                        <td>$500</td>
                        <td>#56387</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div id="profile-settings" class="tab-pane fade">
                <div class="table-responsive">
                  <table class="table table-responsive-md text-nowrap">
                    <thead>
                      <tr>
                        <th class="icon_none" scope="col">S.No.</th>
                        <th class="icon_none" scope="col">Name</th>
                        <th class="icon_none" scope="col">Status</th>
                        <th class="icon_none" scope="col">Date</th>
                        <th class="icon_none" scope="col">Amount</th>
                        <th class="icon_none" scope="col">Transaction ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic5.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Angelica Ramos</td>
                        <td><span class="badge badge-rounded badge-success">Paid</span></td>
                        <td>12 August 2021</td>
                        <td>$100</td>
                        <td>#42317</td>
                      </tr>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic8.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Bradley Greer</td>
                        <td><span class="badge badge-rounded badge-danger">Unpaid</span></td>
                        <td>11 July 2021</td>
                        <td>$200</td>
                        <td>#54682</td>
                      </tr>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic6.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Cedric Kelly</td>
                        <td><span class="badge badge-rounded badge-warning">Pending</span></td>
                        <td>10 May 2021</td>
                        <td>$400</td>
                        <td>#57894</td>
                      </tr>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic2.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Caesar Vance</td>
                        <td><span class="badge badge-rounded badge-danger">Unpaid</span></td>
                        <td>09 April 2021</td>
                        <td>$300</td>
                        <td>#57864</td>
                      </tr>
                      <tr>
                        <td><img src="../../assets/images/profile/education/pic7.jpg" class="rounded-circle" width="35" alt="" /></td>
                        <td>Rhona Davidson</td>
                        <td><span class="badge badge-rounded badge-warning">Pending</span></td>
                        <td>08 March 2021</td>
                        <td>$500</td>
                        <td>#56387</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
