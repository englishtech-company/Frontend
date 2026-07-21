<template>
  <div class="col-xl-4">
    <div class="card">
      <div class="card-header border-0 flex-wrap">
        <h4 class="heading mb-0">My To Do Items</h4>
        <div>
          <a href="javascript:void(0);" class="text-primary me-2">View All</a>
          <a href="javascript:void(0);" class="text-black"> + Add To Do</a>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="dt-do-bx">
          <draggable
            class="draggable-zone dropzoneContainer to-dodroup dz-scroll"
            ghost-class="ghost"
            :item-key="list"
            @start="dragging = true"
            @end="dragging = false"
          >
            <div
              class="sub-card draggable-handle draggable"
              v-for="({ deletIcon, editIcon, icon, text, className }, ind) in list"
              :key="ind"
            >
              <div class="d-items">
                <span :class="`dang d-block mb-2 ${className}`">
                  <span v-html="icon"></span>
                  {{ text }}
                </span>
                <div class="d-flex justify-content-between flex-wrap">
                  <div class="d-items-2">
                    <div class="svg-icon">
                      <svg
                        width="9"
                        height="16"
                        viewBox="0 0 9 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="1" height="1" fill="#888888" />
                        <rect y="3" width="1" height="1" fill="#888888" />
                        <rect y="6" width="1" height="1" fill="#888888" />
                        <rect y="9" width="1" height="1" fill="#888888" />
                        <rect y="12" width="1" height="1" fill="#888888" />
                        <rect y="15" width="1" height="1" fill="#888888" />
                        <rect x="4" width="1" height="1" fill="#888888" />
                        <rect x="4" y="3" width="1" height="1" fill="#888888" />
                        <rect x="4" y="6" width="1" height="1" fill="#888888" />
                        <rect x="4" y="9" width="1" height="1" fill="#888888" />
                        <rect x="4" y="12" width="1" height="1" fill="#888888" />
                        <rect x="4" y="15" width="1" height="1" fill="#888888" />
                        <rect x="8" width="1" height="1" fill="#888888" />
                        <rect x="8" y="3" width="1" height="1" fill="#888888" />
                        <rect x="8" y="6" width="1" height="1" fill="#888888" />
                        <rect x="8" y="9" width="1" height="1" fill="#888888" />
                        <rect x="8" y="12" width="1" height="1" fill="#888888" />
                        <rect x="8" y="15" width="1" height="1" fill="#888888" />
                      </svg>
                    </div>
                    <div>
                      <div class="form-check custom-checkbox">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="customCheckBox1"
                          required
                        />
                        <label class="form-check-label" for="customCheckBox1"
                          >Compete this projects</label
                        >
                      </div>
                      <span>2023-12-26 07:15:00</span>
                    </div>
                  </div>
                  <div>
                    <div class="icon-box icon-box-sm bg-danger-light me-1" v-html="deletIcon"></div>
                    <div class="icon-box icon-box-sm bg-primary-light" v-html="editIcon"></div>
                  </div>
                </div>
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SVGImage } from '@/constent/Theme'
import { VueDraggableNext } from 'vue-draggable-next'

export default defineComponent({
  components: { draggable: VueDraggableNext },
  data() {
    return SVGImage
  },
  setup() {
    return {
      dragging: true,
      enabled: true,
      list: [
        {
          icon: SVGImage.warning,
          text: 'Latest to do',
          deletIcon: SVGImage.deletIcon,
          editIcon: SVGImage.editIcon,
          className: 'text-warning ',
          id: 1
        },
        {
          icon: SVGImage.success,
          text: 'Latest finished to do',
          deletIcon: SVGImage.deletIcon,
          editIcon: SVGImage.editIcon,
          className: 'text-success',
          id: 2
        },
        { deletIcon: SVGImage.deletIcon, editIcon: SVGImage.editIcon, id: 3 },
        { deletIcon: SVGImage.deletIcon, editIcon: SVGImage.editIcon, id: 4 },
        { deletIcon: SVGImage.deletIcon, editIcon: SVGImage.editIcon, id: 5 }
      ]
    }
  }
})
</script>

<style scoped></style>
