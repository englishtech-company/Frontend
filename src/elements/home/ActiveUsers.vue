<template>
  <div class="col-xl-6 col-md-6 flag">
    <div class="card overflow-hidden">
      <div class="card-header border-0">
        <h4 class="heading mb-0">Active users</h4>
      </div>
      <div class="card-body pe-0">
        <div class="row">
          <div class="col-xl-8 active-map-main">
            <div
              id="world-map"
              class="active-map"
              v-html="worldMap"
              style="display: grid; place-items: center"
            ></div>
          </div>
          <div class="col-xl-4 active-country dz-scroll">
            <div class="">
              <div
                class="country-list"
                v-for="({ img, name, progress }, ind) in userData"
                :key="ind"
              >
                <img :src="img" alt="" />
                <div class="progress-box mt-0">
                  <div class="d-flex justify-content-between">
                    <p class="mb-0 c-name">{{ name }}</p>
                    <p class="mb-0">{{ progress }}%</p>
                  </div>
                  <div class="progress">
                    <div
                      class="progress-bar bg-primary"
                      :style="`width: ${progress}%; height: 5px; border-radius: 4px`"
                      role="progressbar"
                    ></div>
                  </div>
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
import { defineComponent } from 'vue'
import IMAGE, { SVGImage } from '@/constent/Theme'

export default defineComponent({
  data() {
    return SVGImage
  },
  setup() {
    return {
      userData: [
        // { img: IMAGE.india, name: 'India', progress: '50' },
        // { img: IMAGE.canada, name: 'Canada', progress: '30' },
        // { img: IMAGE.canada, name: 'Russia', progress: '20' },
        // { img: IMAGE.canada, name: 'United Kingdom', progress: '40' }
        // { img: IMAGE.canada, name: 'Australia', progress: '60' },
        // { img: IMAGE.usa, name: 'United Stat', progress: '20' },
        // { img: IMAGE.pak, name: 'Pakistan', progress: '20' },
        // { img: IMAGE.germany, name: 'Germany', progress: '80' },
        // { img: IMAGE.uae, name: 'UAE', progress: '30' },
        // { img: IMAGE.china, name: 'China', progress: '40' }
      ]
    }
  }
})
</script>

<style>
[data-theme-version='dark'] #world-map {
  --mapbg: #fff;
}
[data-theme-version='light'] #world-map {
  --mapbg: #eff2f4;
}
#world-map svg path {
  fill: var(--mapbg);
}
</style>
