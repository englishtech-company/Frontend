<template>
  <div class="container-fluid">
    <div class="row">
      <div class="card-body svg-area card">
        <div class="card-header">SVG Icons</div>
        <div class="row">
          <template v-for="({ icon, svgName, title, className }, ind) in svgicons" :key="ind">
            <div
              class="col-xl-2 col-lg-3 col-xxl-3 col-md-4 col-sm-6 col-12"
              v-if="className != 'title'"
            >
              <div class="svg-icons-ov">
                <div class="svg-icons-prev" v-html="icon"></div>
                <div class="svg-classname">{{ svgName }}</div>
                <div class="svg-icon-popup">
                  <a
                    href="javascript:;"
                    data-bs-toggle="modal"
                    :data-bs-target="`#svg_img_${ind}`"
                    class="btn btn-sm btn-brand"
                    ><i class="fa-solid fa-image"></i
                  ></a>
                  <a
                    href="javascript:;"
                    data-bs-toggle="modal"
                    :data-bs-target="`#svg_inline_Brassieresvg_${ind}`"
                    class="btn btn-sm btn-brand"
                    ><i class="fa fa-code"></i
                  ></a>
                </div>
                <div
                  class="modal fade"
                  :id="`svg_img_${ind}`"
                  tabindex="-1"
                  role="dialog"
                  :aria-labelledby="`svg_img_${ind}`"
                >
                  <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" :id="`svg_img_${ind}`">{{ svgName }}</h5>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <pre>&lt;img src="images/iconly/light/{{ svgName }}"/&gt;</pre>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="modal fade"
                  :id="`svg_inline_Brassieresvg_${ind}`"
                  tabindex="-1"
                  role="dialog"
                  aria-labelledby="svg_inline_label_Brassieresvg"
                >
                  <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="svg_inline_label_Brassieresvg">
                          {{ svgName }}
                        </h5>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <pre>{{ icon }}</pre>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-header" v-else>
              <h3 class="h-title">{{ title }}</h3>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import svgicons from '@/components/SvgIcons'

export default defineComponent({
  name: 'svgIcon',
  data() {
    return { svgicons }
  },
  setup() {
    return {}
  }
})
</script>

<style scoped></style>
