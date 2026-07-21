<!-- @format -->

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import VueApexCharts from "vue3-apexcharts";
import JobSelectOption from "../JobSelectOption.vue";
import VueDatePicker from "@vuepic/vue-datepicker";

const state = reactive({
  series: [
    {
      data: [300, 200, 400, 300, 500, 300, 400, 200, 400, 300],
    },
  ],
  chartOptions: {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    grid: {
      show: false,
    },
    xaxis: {
      type: "Week",
      categories: [
        "Week 01",
        "Week 02",
        "Week 03",
        "Week 04",
        "Week 05",
        "Week 06",
        "Week 07",
        "Week 08",
        "Week 09",
        "Week 010",
      ],
      labels: {
        show: true,
        style: {
          colors: "#808080",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (value: string) {
          return value + "k";
        },
        style: {
          colors: "#787878",
          fontSize: "13px",
          fontFamily: "Poppins",
          fontWeight: 400,
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    colors: ["#ffab2d"],
  },
});

const date = ref();

onMounted(() => {
  const startDate = new Date();
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
  date.value = [startDate, endDate];
});
</script>

<template>
  <div class="row">
    <div class="col-xl-3 col-xxl-4 mt-4">
      <div class="card">
        <div class="card-header pb-0 border-0">
          <h4 class="mb-0 text-black fs-20">About</h4>
          <div class="dropdown custom-dropdown mb-0">
            <div class="btn sharp pe-0 tp-btn" data-bs-toggle="dropdown">
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.0049 13C12.5572 13 13.0049 12.5523 13.0049 12C13.0049 11.4477 12.5572 11 12.0049 11C11.4526 11 11.0049 11.4477 11.0049 12C11.0049 12.5523 11.4526 13 12.0049 13Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.0049 6C12.5572 6 13.0049 5.55228 13.0049 5C13.0049 4.44772 12.5572 4 12.0049 4C11.4526 4 11.0049 4.44772 11.0049 5C11.0049 5.55228 11.4526 6 12.0049 6Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.0049 20C12.5572 20 13.0049 19.5523 13.0049 19C13.0049 18.4477 12.5572 18 12.0049 18C11.4526 18 11.0049 18.4477 11.0049 19C11.0049 19.5523 11.4526 20 12.0049 20Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="dropdown-menu dropdown-menu-end">
              <a class="dropdown-item" href="javascript:void(0);">Details</a>
              <a class="dropdown-item text-danger" href="javascript:void(0);"
                >Cancel</a
              >
            </div>
          </div>
        </div>
        <div class="card-body height400 dz-scroll" id="about-1">
          <div class="d-flex align-items-start mb-3 about-coin">
            <div>
              <img src="../../assets/images/svg/btc1.svg" alt="" />
            </div>
            <div class="ms-3">
              <h2 class="font-w600 text-black mb-0 title">Digital Cash</h2>
              <p class="font-w600 text-black sub-title">BTC</p>
              <span>1 BTC = 68.48 USD</span>
            </div>
          </div>
          <p class="fs-14">
            Dash is an open source cryptocurrency. It is an altcoin that was
            forked from the Bitcoin protocol. It is also a decentralized
            autonomous organization (DAO) run by a subset of its users, which
            are called "masternodes". The currency permits transactions that can
            be untraceable.
          </p>
          <p class="fs-14">
            Dash is an open source cryptocurrency. It is an altcoin that was
            forked from the Bitcoin protocol. It is also a decentralized
            autonomous organization (DAO) run by a subset of its users, which
            are called "masternodes". The currency permits transactions that can
            be untraceable.
          </p>
          <p class="fs-14">
            Dash is an open source cryptocurrency. It is an altcoin that was
            forked from the Bitcoin protocol. It is also a decentralized
            autonomous organization (DAO) run by a subset of its users, which
            are called "masternodes". The currency permits transactions that can
            be untraceable.
          </p>
        </div>
        <div class="card-footer border-0 p-0 caret">
          <RouterLink to="/coin-details" class="btn-link"
            ><i class="fa fa-caret-down" aria-hidden="true"></i>
          </RouterLink>
        </div>
      </div>
    </div>
    <div class="col-xl-9 col-xxl-8 mt-4">
      <div class="card">
        <div
          class="card-header pb-0 d-block d-sm-flex flex-wrap border-0 align-items-center"
        >
          <div class="me-auto mb-3">
            <h4 class="fs-20 text-black">Coin Chart</h4>
            <p class="mb-0 fs-12">Lorem ipsum dolor sit amet, consectetur</p>
          </div>

          <div
            class="input-group detault-daterange me-3 mb-3"
            style="overflow: unset"
          >
            <VueDatePicker
              v-model="date"
              range
              multi-calendars
              class="form-control"
            />
          </div>
          <div
            class="dropdown bootstrap-select btn-secondary style-1 default-select mb-3"
          >
            <JobSelectOption
              :options="[
                { title: 'USD ($ US Dollar)' },
                { title: 'BTC ($ US Dollar)' },
                { title: 'USD ($ US Dollar)' },
              ]"
            />
          </div>
        </div>
        <div class="card-body pb-0 pt-sm-3 pt-0">
          <div class="row sp20 mb-4 align-items-center">
            <div
              class="col-lg-4 col-xxl-4 col-sm-4 d-flex flex-wrap align-items-center"
            >
              <div class="px-2 info-group">
                <p class="fs-18 mb-1">Price</p>
                <h2 class="fs-28 font-w600 text-black">$11,898.15</h2>
              </div>
            </div>
            <div
              class="d-flex col-lg-8 col-xxl-8 col-sm-8 align-items-center mt-sm-0 mt-3 justify-content-end"
            >
              <div class="px-2 info-group">
                <p class="fs-14 mb-1">24h% change</p>
                <h3 class="fs-20 font-w600">
                  <span class="text-success">1.64%</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 7L7.00001 -8.77983e-06L14 7H7.00001H0Z"
                      fill="#2BC155"
                    ></path>
                  </svg>
                </h3>
              </div>
              <div class="px-2 info-group">
                <p class="fs-14 mb-1">Volume (24h)</p>
                <h3 class="fs-20 font-w600 text-black">$47.22B</h3>
              </div>
              <div class="px-2 info-group">
                <p class="fs-14 mb-1">Market Cap</p>
                <h3 class="fs-20 font-w600 text-black">$219.24B</h3>
              </div>
            </div>
          </div>
          <div id="chartBarRunning" class="bar-chart">
            <VueApexCharts
              height="350px"
              :options="state.chartOptions"
              :series="state.series"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-6 col-xxl-12">
      <div class="card">
        <div class="card-header d-sm-flex d-block pb-0 border-0">
          <div>
            <h4 class="fs-20 text-black">Quick Trade</h4>
            <p class="mb-0 fs-12">Lorem ipsum dolor sit amet, consectetur</p>
          </div>
          <div class="dropdown custom-dropdown d-block mt-3 mt-sm-0 mb-0">
            <div
              class="btn btn-light d-flex align-items-center svg-btn"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <svg
                class="me-2"
                width="25"
                height="25"
                viewBox="0 0 42 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M28.5 16.5002C28.4986 14.844 27.156 13.5018 25.5003 13.5H16.5002V19.4999H25.5003C27.156 19.4985 28.4986 18.1559 28.5 16.5002Z"
                  fill="#FFAB2D"
                />
                <path
                  d="M16.5002 28.5H25.5003C27.1569 28.5 28.5 27.1569 28.5 25.5003C28.5 23.8432 27.1569 22.5001 25.5003 22.5001H16.5002V28.5Z"
                  fill="#FFAB2D"
                />
                <path
                  d="M21 9.15527e-05C9.40213 9.15527e-05 0.00012207 9.4021 0.00012207 21C0.00012207 32.5979 9.40213 41.9999 21 41.9999C32.5979 41.9999 41.9999 32.5979 41.9999 21C41.9867 9.40759 32.5924 0.0133667 21 9.15527e-05ZM31.5002 25.4998C31.4961 28.8122 28.8122 31.4961 25.5003 31.4997V32.9998C25.5003 33.8284 24.8283 34.4999 24.0002 34.4999C23.1717 34.4999 22.5001 33.8284 22.5001 32.9998V31.4997H19.5004V32.9998C19.5004 33.8284 18.8284 34.4999 18.0003 34.4999C17.1718 34.4999 16.5002 33.8284 16.5002 32.9998V31.4997H12.0004C11.1718 31.4997 10.5003 30.8282 10.5003 30.0001C10.5003 29.1715 11.1718 28.5 12.0004 28.5H13.5V13.5H12.0004C11.1718 13.5 10.5003 12.8285 10.5003 11.9999C10.5003 11.1714 11.1718 10.4998 12.0004 10.4998H16.5002V9.00018C16.5002 8.17163 17.1718 7.50009 18.0003 7.50009C18.8289 7.50009 19.5004 8.17163 19.5004 9.00018V10.4998H22.5001V9.00018C22.5001 8.17163 23.1717 7.50009 24.0002 7.50009C24.8288 7.50009 25.5003 8.17163 25.5003 9.00018V10.4998C28.7999 10.4861 31.486 13.1494 31.5002 16.4489C31.5075 18.1962 30.7499 19.8593 29.4265 21C30.7376 22.1279 31.4943 23.7699 31.5002 25.4998Z"
                  fill="#FFAB2D"
                />
              </svg>
              <span class="text-black fs-16">23,511 LTC</span>
              <i class="fa fa-angle-down text-black scale3 ms-2"></i>
            </div>
            <div class="dropdown-menu dropdown-menu-end">
              <a href="#" class="dropdown-item">345,455 ETH</a>
              <a href="#" class="dropdown-item">789,123 BTH</a>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="basic-form">
            <form class="form-wrapper">
              <div class="form-group">
                <div class="input-group input-group-lg">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Amount BTC</span>
                  </div>
                  <input type="text" class="form-control" placeholder="52.5" />
                </div>
              </div>
              <div class="form-group">
                <div class="input-group input-group-lg">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Price BPL</span>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="0,000000"
                  />
                </div>
              </div>
              <div class="form-group">
                <div class="input-group input-group-lg">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Fee (1%)</span>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="0,000000"
                  />
                </div>
              </div>
              <div class="form-group">
                <div class="input-group input-group-lg">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Total BPL</span>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="0,000000"
                  />
                </div>
              </div>
              <div class="row mt-4 align-items-center">
                <div class="col-sm-6 mb-3">
                  <p class="mb-0 fs-14">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut
                  </p>
                </div>
                <div class="col-sm-6 text-sm-right text-start">
                  <a
                    href="javascript:void(0);"
                    class="btn btn-success text-white mb-2"
                  >
                    BUY
                    <svg
                      class="ms-4 scale3"
                      width="16"
                      height="16"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.9638 11.5104L16.9721 14.9391L3.78954 1.7565C3.22815 1.19511 2.31799 1.19511 1.75661 1.7565C1.19522 2.31789 1.19522 3.22805 1.75661 3.78943L14.9392 16.972L11.5105 16.9637L11.5105 16.9637C10.7166 16.9619 10.0715 17.6039 10.0696 18.3978C10.0677 19.1919 10.7099 19.8369 11.5036 19.8388L11.5049 19.3388L11.5036 19.8388L18.3976 19.8554L18.4146 19.8555L18.4159 19.8555C18.418 19.8555 18.42 19.8555 18.422 19.8555C19.2131 19.8533 19.8528 19.2114 19.8555 18.4231C19.8556 18.4196 19.8556 18.4158 19.8556 18.4117L19.8389 11.5035L19.8389 11.5035C19.8369 10.7097 19.1919 10.0676 18.3979 10.0695C17.604 10.0713 16.9619 10.7164 16.9638 11.5103L16.9638 11.5104Z"
                        fill="white"
                        stroke="white"
                      ></path>
                    </svg>
                  </a>
                  <a
                    href="javascript:void(0);"
                    class="btn btn-danger ms-4 mb-2"
                  >
                    SELL
                    <svg
                      class="ms-4 scale5"
                      width="16"
                      height="16"
                      viewBox="0 0 29 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.35182 13.4965L5.35182 13.4965L5.33512 6.58823C5.33508 6.5844 5.3351 6.58084 5.33514 6.57759M5.35182 13.4965L5.83514 6.58306L5.33514 6.58221C5.33517 6.56908 5.33572 6.55882 5.33597 6.5545L5.33606 6.55298C5.33585 6.55628 5.33533 6.56514 5.33516 6.57648C5.33515 6.57684 5.33514 6.57721 5.33514 6.57759M5.35182 13.4965C5.35375 14.2903 5.99878 14.9324 6.79278 14.9305C7.58669 14.9287 8.22874 14.2836 8.22686 13.4897L8.22686 13.4896L8.21853 10.0609M5.35182 13.4965L8.21853 10.0609M5.33514 6.57759C5.33752 5.789 5.97736 5.14667 6.76872 5.14454C6.77041 5.14452 6.77217 5.14451 6.77397 5.14451L6.77603 5.1445L6.79319 5.14456L13.687 5.16121L13.6858 5.66121L13.687 5.16121C14.4807 5.16314 15.123 5.80809 15.1211 6.6022C15.1192 7.3961 14.4741 8.03814 13.6802 8.03626L13.6802 8.03626L10.2515 8.02798L23.4341 21.2106C23.9955 21.772 23.9955 22.6821 23.4341 23.2435C22.8727 23.8049 21.9625 23.8049 21.4011 23.2435L8.21853 10.0609M5.33514 6.57759C5.33513 6.57959 5.33514 6.58159 5.33514 6.5836L8.21853 10.0609M6.77407 5.14454C6.77472 5.14454 6.77537 5.14454 6.77603 5.14454L6.77407 5.14454Z"
                        fill="white"
                        stroke="white"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-6 col-xxl-12">
      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-header border-0 pb-0">
              <h4 class="mb-0 text-black fs-20">Sell Order</h4>
              <div class="dropdown custom-dropdown mb-0 tbl-orders-style">
                <div class="btn sharp tp-btn" data-bs-toggle="dropdown">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div class="dropdown-menu dropdown-menu-end">
                  <a class="dropdown-item" href="javascript:void(0);"
                    >Details</a
                  >
                  <a
                    class="dropdown-item text-danger"
                    href="javascript:void(0);"
                    >Cancel</a
                  >
                </div>
              </div>
            </div>
            <div class="card-body p-3">
              <div class="table-responsive">
                <table
                  class="table text-center bg-warning-hover tr-rounded order-tbl"
                >
                  <thead>
                    <tr>
                      <th class="text-start icon_none">Price</th>
                      <th class="text-center icon_none">Amount</th>
                      <th class="text-end icon_none">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-start">82.3</td>
                      <td>0.15</td>
                      <td class="text-end">$134,12</td>
                    </tr>
                    <tr>
                      <td class="text-start">83.9</td>
                      <td>0.18</td>
                      <td class="text-end">$237,31</td>
                    </tr>
                    <tr>
                      <td class="text-start">84.2</td>
                      <td>0.25</td>
                      <td class="text-end">$252,58</td>
                    </tr>
                    <tr>
                      <td class="text-start">86.2</td>
                      <td>0.35</td>
                      <td class="text-end">$126,26</td>
                    </tr>
                    <tr>
                      <td class="text-start">91.6</td>
                      <td>0.75</td>
                      <td class="text-end">$46,92</td>
                    </tr>
                    <tr>
                      <td class="text-start">92.6</td>
                      <td>0.21</td>
                      <td class="text-end">$123,27</td>
                    </tr>
                    <tr>
                      <td class="text-start">93.9</td>
                      <td>0.55</td>
                      <td class="text-end">$212,56</td>
                    </tr>
                    <tr>
                      <td class="text-start">94.2</td>
                      <td>0.18</td>
                      <td class="text-end">$129,26</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="card-footer border-0 p-0 caret">
              <RouterLink to="/coin-details" class="btn-link"
                ><i class="fa fa-caret-down" aria-hidden="true"></i
              ></RouterLink>
            </div>
          </div>
        </div>
        <div class="col-sm-6 m-t25">
          <div class="card">
            <div class="card-header border-0 pb-0">
              <h4 class="mb-0 text-black fs-20">Buy Order</h4>
              <div class="dropdown custom-dropdown mb-0 tbl-orders-style">
                <div class="btn sharp tp-btn" data-bs-toggle="dropdown">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div class="dropdown-menu dropdown-menu-end">
                  <a class="dropdown-item" href="javascript:void(0);"
                    >Details</a
                  >
                  <a
                    class="dropdown-item text-danger"
                    href="javascript:void(0);"
                    >Cancel</a
                  >
                </div>
              </div>
            </div>
            <div class="card-body p-3">
              <div class="table-responsive">
                <table
                  class="table text-center bg-warning-hover tr-rounded order-tbl"
                >
                  <thead>
                    <tr>
                      <th class="text-start icon_none">Price</th>
                      <th class="text-center icon_none">Amount</th>
                      <th class="text-end icon_none">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-start">82.3</td>
                      <td>0.15</td>
                      <td class="text-end">$134,12</td>
                    </tr>
                    <tr>
                      <td class="text-start">83.9</td>
                      <td>0.18</td>
                      <td class="text-end">$237,31</td>
                    </tr>
                    <tr>
                      <td class="text-start">84.2</td>
                      <td>0.25</td>
                      <td class="text-end">$252,58</td>
                    </tr>
                    <tr>
                      <td class="text-start">86.2</td>
                      <td>0.35</td>
                      <td class="text-end">$126,26</td>
                    </tr>
                    <tr>
                      <td class="text-start">91.6</td>
                      <td>0.75</td>
                      <td class="text-end">$46,92</td>
                    </tr>
                    <tr>
                      <td class="text-start">92.6</td>
                      <td>0.21</td>
                      <td class="text-end">$123,27</td>
                    </tr>
                    <tr>
                      <td class="text-start">93.9</td>
                      <td>0.55</td>
                      <td class="text-end">$212,56</td>
                    </tr>
                    <tr>
                      <td class="text-start">94.2</td>
                      <td>0.18</td>
                      <td class="text-end">$129,26</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="card-footer border-0 p-0 caret">
              <RouterLink to="/coin-details" class="btn-link"
                ><i class="fa fa-caret-down" aria-hidden="true"></i
              ></RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
