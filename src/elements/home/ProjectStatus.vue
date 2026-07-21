<template>
  <div class="card-body">
    <div id="projectChart" class="project-chart">
      <apexchart
        width="250px"
        :options="doughtnutChart.chartOption"
        :series="doughtnutChart.series"
      ></apexchart>
    </div>
    <div class="project-date">
      <div class="project-media" v-for="({ img, title }, ind) in projectStatusData" :key="ind">
        <p class="mb-0">
          <span v-html="img"></span>
          {{ title }}
        </p>
        <span>125 Projects</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SVGImage } from '@/constent/Theme'
import { defineComponent } from 'vue'
// @ts-ignore
import VueApexCharts from 'vue3-apexcharts'
import { doughtnutChart } from '@/layouts/ChartsData'

export default defineComponent({
  name: 'projectStatus',
  components: { apexchart: VueApexCharts },
  data() {
    return { doughtnutChart }
  },
  setup() {
    return {
      projectStatusData: [
        { img: SVGImage.color1, title: 'Completed Projects' },
        { img: SVGImage.color2, title: 'Progress Projects' },
        { img: SVGImage.color3, title: 'Cancelled' },
        { img: SVGImage.color4, title: 'Yet to Start' }
      ],
    }
  }
})
</script>

<style scoped></style>
