<template>
  <div class="col-xl-3 col-xxl-4 t-earn">
    <div class="card">
      <div class="card-header border-0 pb-0">
        <h4 class="heading mb-0">Total Earning</h4>
      </div>
      <div class="card-body px-0 overflow-hidden">
        <div class="total-earning">
          <h2>$6,743.00</h2>
          <ul class="nav nav-pills mb-3 earning-tab earning-chart" id="pills-tab1" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                data-series="day"
                id="pills-day-tab1"
                data-bs-toggle="pill"
                data-bs-target="#pills-day1"
                type="button"
                role="tab"
                aria-selected="true"
                @click="upadteChart('day')"
              >
                Day
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="pills-week-tab1"
                data-series="week"
                data-bs-toggle="pill"
                data-bs-target="#pills-week1"
                type="button"
                role="tab"
                aria-selected="false"
                @click="upadteChart('week')"
              >
                Week
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="pills-month-tab1"
                data-series="month"
                data-bs-toggle="pill"
                data-bs-target="#pills-month1"
                type="button"
                role="tab"
                aria-selected="false"
                @click="upadteChart('month')"
              >
                Month
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="pills-year-tab1"
                data-series="year"
                data-bs-toggle="pill"
                data-bs-target="#pills-year1"
                type="button"
                role="tab"
                aria-selected="false"
                @click="upadteChart('year')"
              >
                Year
              </button>
            </li>
          </ul>
          <div id="earningChart">
            <apexchart
              type="area"
              height="300px"
              width="630px"
              :options="state.chartOption"
              :series="state.series"
            ></apexchart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
// @ts-ignore
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  name: 'earningChart',
  components: { apexchart: VueApexCharts },

  setup() {
    const state = reactive({
      series: [
        {
          name: 'Net Profit',
          data: [700, 650, 680, 600, 700, 610, 710, 620]
        }
      ],
      chartOption: {
        chart: {
          type: 'area',
          height: 350,
          width: 630,
          toolbar: {
            show: false
          },
          offsetX: -45,
          zoom: {
            enabled: false
          }
        },
        colors: ['var(--primary)'],
        dataLabels: {
          enabled: false
        },

        legend: {
          show: false
        },
        stroke: {
          show: true,
          width: 2,
          curve: 'straight',
          colors: ['var(--primary)']
        },
        grid: {
          show: true,
          borderColor: '#eee',
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        yaxis: {
          show: true,
          tickAmount: 4,
          min: 0,
          max: 800,
          labels: {
            offsetX: 50
          }
        },
        xaxis: {
          categories: ['', 'May ', 'June', 'July', 'Aug', 'Sep ', 'Oct'],
          overwriteCategories: undefined,
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: true,
            offsetX: 5,
            style: {
              fontSize: '12px'
            }
          }
        },
        fill: {
          opacity: 0.5,
          colors: 'var(--primary)',
          type: 'gradient',
          gradient: {
            colorStops: [
              {
                offset: 0.6,
                color: 'var(--primary)',
                opacity: 0.2
              },
              {
                offset: 0.6,
                color: 'var(--primary)',
                opacity: 0.15
              },
              {
                offset: 100,
                color: 'white',
                opacity: 0
              }
            ]
          }
        },
        tooltip: {
          enabled: true,
          style: {
            fontSize: '12px'
          },
          y: {
            formatter: function (val: any) {
              return '$' + val + ''
            }
          }
        }
      }
    })

    return { state }
  },

  methods: {
    upadteChart(value: string) {
      switch (value) {
        case 'day':
          this.state.series[0].data = [700, 650, 680, 650, 700, 610, 710, 620]
          break
        case 'week':
          this.state.series[0].data = [700, 700, 680, 600, 700, 620, 710, 620]
          break
        case 'month':
          this.state.series[0].data = [700, 650, 690, 640, 700, 670, 710, 620]
          break
        case 'year':
          this.state.series[0].data = [700, 650, 590, 650, 700, 610, 710, 630]
          break
        default:
          break
      }
    }
  }
})
</script>

<style scoped></style>
