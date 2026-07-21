<template>
  <div class="container-fluid vh-100">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Hi, welcome back!</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0)">Advanced</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0)">Nestable</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Nestable</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="card-content">
                  <div class="nestable">
                    <div class="dd" id="nestable">
                      <draggable class="dd-list" :list="list" group="people" @start="dragging = true"
                        @end="dragging = false">
                        <li class="dd-item" v-for="element in list" :key="element.name">
                          <div class="dd-handle">{{ element.name }}</div>
                          <ol class="dd-list">
                            <li class="dd-item" data-id="3" v-for="({ name, tasks }, ind) in element.tasks" :key="ind"
                              style="margin-top: 5px">
                              <div class="dd-handle">{{ name }}</div>
                              <ol class="dd-list">
                                <li class="dd-item" data-id="3" v-for="({ name }, ind) in tasks" :key="ind"
                                  style="margin-top: 5px">
                                  <div class="dd-handle">{{ name }}</div>
                                </li>
                              </ol>
                            </li>
                          </ol>
                        </li>
                      </draggable>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card-content">
                  <div class="nestable">
                    <div class="dd" id="nestable">
                      <draggable class="dd-list" :list="list2" group="people">
                        <li class="dd-item" v-for="element in list2" :key="element.name">
                          <div class="dd-handle">{{ element.name }}</div>
                          <ol class="dd-list">
                            <li class="dd-item" data-id="3" v-for="({ name, tasks }, ind) in element.tasks" :key="ind"
                              style="margin-top: 5px">
                              <div class="dd-handle">{{ name }}</div>
                              <ol class="dd-list">
                                <li class="dd-item" data-id="3" v-for="({ name }, ind) in tasks" :key="ind"
                                  style="margin-top: 5px">
                                  <div class="dd-handle">{{ name }}</div>
                                </li>
                              </ol>
                            </li>
                          </ol>
                        </li>
                      </draggable>
                    </div>
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
import { VueDraggableNext } from 'vue-draggable-next'
export default defineComponent({
  name: 'nestable_',
  components: {
    draggable: VueDraggableNext
  },
  setup() {
    return {}
  },
  data() {
    return {
      dragging: false,
      list: [
        { name: 'Item 1', id: 1 },
        {
          name: 'Item 2',
          id: 2,

          tasks: [
            { name: 'Item 3', id: 3 },
            { name: 'Item 4', id: 4 },
            {
              name: 'Item 5',
              id: 5,

              tasks: [
                { name: 'Item 6', id: 6 },
                { name: 'Item 7', id: 7 },
                { name: 'Item 8', id: 8 }
              ]
            }
          ]
        },

        { name: 'Item 9', id: 9 },
        { name: 'Item 10', id: 10 }
      ],
      list2: [
        { name: 'Item 11', id: 11 },
        {
          name: 'Item 12',
          id: 12,

          tasks: [
            { name: 'Item 13', id: 13 },
            { name: 'Item 14', id: 14 },
            {
              name: 'Item 15',
              id: 15,

              tasks: [
                { name: 'Item 16', id: 16 },
                { name: 'Item 17', id: 17 },
                { name: 'Item 18', id: 18 }
              ]
            }
          ]
        },

        { name: 'Item 19', id: 19 },
        { name: 'Item 20', id: 20 }
      ]
    }
  }
})
</script>

<style scoped></style>
