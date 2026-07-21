<template>
  <div>
    <apexchart type="line" :options="chartOptions" :series="series" height="219" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// @ts-ignore
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "RealTimeLineChart",
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const series = ref([
      {
        name: "series1",
        data: [50],
      },
    ]);

    const chartOptions = ref({
      chart: {
        id: "realtime",
        height: 350,
        type: "line",
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: {
            enabled: true,
          },
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        borderWidth: 1,
        borderColor: "transparent",
      },
      stroke: {
        curve: "straight",
        width: 2,
        colors: ["#fa7b6b"],
      },

      xaxis: {
        type: "datetime",
        categories: [],
        labels: {
          datetimeUTC: false,
        },
        tickAmount: 6,
      },
      yaxis: {
        max: 100,
      },
    });

    function updateChart(data: number) {
      if (data) {
        series.value[0].data.push(data);
        // @ts-ignore
        chartOptions.value.xaxis.categories.push(new Date().getTime());
      }
      setTimeout(() => {
        updateChart(Math.floor(Math.random() * 30));
      }, 1000);
    }

    updateChart(Math.floor(Math.random() * 30));

    return {
      series,
      chartOptions,
    };
  },
});
</script>
