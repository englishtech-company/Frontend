<template>
  <div class="container-fluid vh-90">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0">Tasks Summary</h5>
      <div class="d-flex align-items-center">
        <div class="icon-box icon-box-sm task-tab me-2">
          <RouterLink to="/task">
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.8335 5.5H17.6668"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.8335 10.5H17.6668"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.8335 15.5H17.6668"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.66699 5.5H2.67699"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.66699 10.5H2.67699"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.66699 15.5H2.67699"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </RouterLink>
        </div>
        <a href="javascript:void(0)" class="btn btn-primary btn-sm ms-2">+ Add Task</a>
      </div>
    </div>
    <div class="row kanban-bx">
      <div class="col">
        <div class="card kanbanPreview-bx">
          <div class="card-body draggable-zone dropzoneContainer">
            <div class="sub-card border-primary">
              <div class="sub-card-2">
                <div>
                  <h5 class="mb-0">Not Started</h5>
                  <span>Tasks assigned to me: 18</span>
                </div>
                <div class="icon-box bg-primary-light rounded-circle">
                  <h5 class="text-primary totalCount">18</h5>
                </div>
              </div>
            </div>
            <draggable
              :list="List1"
              class="list-group"
              group="people"
              @start="dragging = true"
              @end="dragging = false"
            >
              <div
                class="sub-card draggable-handle draggable p-0"
                v-for="{ name, value, id } in List1"
                :key="id"
              >
                <div class="task-card-data">
                  <div class="products">
                    <div>
                      <h6>Vuejs template Issue Complete</h6>
                      <span>INV-100023456</span>
                    </div>
                  </div>
                  <div class="avatar-list avatar-list-stacked my-2">
                    <img
                      src="../../assets/images/contacts/pic666.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic555.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic1.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic666.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic666.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                  </div>
                  <div class="my-2">
                    <span class="badge badge-primary light border-0 me-1">Issue</span>
                    <span class="badge badge-primary light border-0 ms-1">Vuejs</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <p class="mb-0 font-w500 text-secondary me-2">Status</p>
                    <CustomeSelectOptinProject
                      :valueOne="name"
                      valueTwo="Pending"
                      valueThree="Testing"
                      valueFour="Complete"
                    />
                  </div>
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                  <div class="footer-data">
                    <span>Start Date</span>
                    <p>06 Feb 2023</p>
                  </div>
                  <div class="footer-data">
                    <span>End Date</span>
                    <p>06 Feb 2023</p>
                  </div>
                  <div class="footer-data">
                    <span class="d-block">Priority</span>
                    <CustomTaskSelectOptin :valueOne="value" valueTwo="High" valueThree="Low" />
                  </div>
                </div>
              </div>
            </draggable>
            <draggable
              group="people"
              class="list-group"
              @start="dragging = true"
              @end="dragging = false"
            >
              <div class="sub-card draggable-handle draggable p-0">
                <div class="card-footer d-flex align-items-center justify-content-between">
                  <div class="footer-data">
                    <span>Start Date</span>
                    <p>06 Feb 2023</p>
                  </div>
                  <div class="footer-data">
                    <span>End Date</span>
                    <p>06 Feb 2023</p>
                  </div>
                  <div class="footer-data">
                    <span class="d-block">Priority</span>
                    <div class="dropdown bootstrap-select default-select status-select">
                      <CustomTaskSelectOptin valueOne="Low" valueTwo="High" valueThree="Low" />
                      <div class="dropdown-menu">
                        <div class="inner show" role="listbox" id="bs-select-4" tabindex="-1">
                          <ul class="dropdown-menu inner show" role="presentation"></ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card kanbanPreview-bx">
          <div class="card-body draggable-zone dropzoneContainer">
            <div class="sub-card border-purple">
              <div class="sub-card-2">
                <div>
                  <h5 class="mb-0">Not Started</h5>
                  <span>Tasks assigned to me: 18</span>
                </div>
                <div class="icon-box bg-purple-light rounded-circle">
                  <h5 class="text-purple totalCount">18</h5>
                </div>
              </div>
            </div>
            <draggable
              :list="List2"
              group="people"
              class="list-group"
              @start="dragging = true"
              @end="dragging = false"
            >
              <div
                class="sub-card draggable-handle draggable p-0"
                v-for="{ name, value, id } in List2"
                :key="id"
              >
                <div class="task-card-data">
                  <div class="products">
                    <div>
                      <h6>Vuejs template Issue Complete</h6>
                      <span>INV-100023456</span>
                    </div>
                  </div>
                  <div class="avatar-list avatar-list-stacked my-2">
                    <img
                      src="../../assets/images/contacts/pic666.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic555.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic1.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic666.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                  </div>
                  <div class="my-2">
                    <span class="badge badge-primary light border-0 me-1">Issue</span>
                    <span class="badge badge-primary light border-0 ms-1">Vuejs</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <p class="mb-0 font-w500 text-secondary me-2">Status</p>
                    <CustomeSelectOptinProject
                      :valueOne="name"
                      valueTwo="Pending"
                      valueThree="Testing"
                      valueFour="Complete"
                    />
                  </div>
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                  <div class="footer-data">
                    <span>Start Date</span>
                    <p>06 Feb 2023</p>
                  </div>
                  <div class="footer-data">
                    <span>End Date</span>
                    <p>06 Feb 2023</p>
                  </div>
                  <div class="footer-data">
                    <span class="d-block">Priority</span>
                    <CustomTaskSelectOptin :valueOne="value" valueTwo="High" valueThree="Low" />
                  </div>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card kanbanPreview-bx">
          <div class="card-body draggable-zone dropzoneContainer">
            <div class="sub-card border-warning">
              <div class="sub-card-2">
                <div>
                  <h5 class="mb-0">Not Started</h5>
                  <span>Tasks assigned to me: 18</span>
                </div>
                <div class="icon-box bg-warning-light rounded-circle">
                  <h5 class="text-warning totalCount">18</h5>
                </div>
              </div>
            </div>
            <draggable
              :list="List3"
              group="people"
              class="list-group"
              @start="dragging = true"
              @end="dragging = false"
            >
              <div
                class="sub-card draggable-handle draggable p-0"
                v-for="{ name, value, id } in List3"
                :key="id"
              >
                <div class="task-card-data">
                  <div class="products">
                    <div>
                      <h6>Vuejs template Issue Complete</h6>
                      <span>INV-100023456</span>
                    </div>
                  </div>
                  <div class="avatar-list avatar-list-stacked my-2">
                    <img
                      src="../../assets/images/contacts/pic666.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic555.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic1.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic666.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic666.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                  </div>
                  <div class="my-2">
                    <span class="badge badge-primary light border-0 me-1">Issue</span>
                    <span class="badge badge-primary light border-0 ms-1">Vuejs</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <p class="mb-0 font-w500 text-secondary me-2">Status</p>
                    <CustomeSelectOptinProject
                      :valueOne="name"
                      valueTwo="Pending"
                      valueThree="Testing"
                      valueFour="Complete"
                    />
                  </div>
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                  <div class="footer-data">
                    <span>Start Date</span>
                    <p>06 Feb 2023</p>
                  </div>
                  <div class="footer-data">
                    <span>End Date</span>
                    <p>06 Feb 2023</p>
                  </div>
                  <div class="footer-data">
                    <span class="d-block">Priority</span>
                    <CustomTaskSelectOptin :valueOne="value" valueTwo="High" valueThree="Low" />
                  </div>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card kanbanPreview-bx">
          <div class="card-body draggable-zone dropzoneContainer">
            <div class="sub-card border-danger">
              <div class="sub-card-2">
                <div>
                  <h5 class="mb-0">Not Started</h5>
                  <span>Tasks assigned to me: 13</span>
                </div>
                <div class="icon-box bg-danger-light rounded-circle">
                  <h5 class="text-danger totalCount">13</h5>
                </div>
              </div>
            </div>
            <draggable
              :list="List4"
              group="people"
              class="list-group"
              @start="dragging = true"
              @end="dragging = false"
            >
              <div
                class="sub-card draggable-handle draggable p-0"
                v-for="{ name, value, id } in List4"
                :key="id"
              >
                <div class="task-card-data">
                  <div class="products">
                    <div>
                      <h6>Vuejs template Issue Complete</h6>
                      <span>INV-100023456</span>
                    </div>
                  </div>
                  <div class="avatar-list avatar-list-stacked my-2">
                    <img
                      src="../../assets/images/contacts/pic666.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic555.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic1.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic666.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                  </div>
                  <div class="my-2">
                    <span class="badge badge-primary light border-0 me-1">Issue</span>
                    <span class="badge badge-primary light border-0 ms-1">Vuejs</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <p class="mb-0 font-w500 text-secondary me-2">Status</p>
                    <CustomeSelectOptinProject
                      :valueOne="name"
                      valueTwo="Pending"
                      valueThree="Testing"
                      valueFour="Complete"
                    />
                  </div>
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                  <div class="footer-data">
                    <span>Start Date</span>
                    <p>06 Feb 2023</p>
                  </div>
                  <div class="footer-data">
                    <span>End Date</span>
                    <p>06 Feb 2023</p>
                  </div>
                  <div class="footer-data">
                    <span class="d-block">Priority</span>
                    <CustomTaskSelectOptin :valueOne="value" valueTwo="High" valueThree="Low" />
                  </div>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card kanbanPreview-bx">
          <div class="card-body draggable-zone dropzoneContainer">
            <div class="sub-card border-success">
              <div class="sub-card-2">
                <div>
                  <h5 class="mb-0">Complete</h5>
                  <span>Tasks assigned to me: 21</span>
                </div>
                <div class="icon-box bg-success-light rounded-circle">
                  <h5 class="text-success totalCount">13</h5>
                </div>
              </div>
            </div>
            <draggable
              :list="List5"
              group="people"
              class="list-group"
              @start="dragging = true"
              @end="dragging = false"
            >
              <div
                class="sub-card draggable-handle draggable p-0"
                v-for="{ name, value, id } in List5"
                :key="id"
              >
                <div class="task-card-data">
                  <div class="products">
                    <div>
                      <h6>Vuejs template Issue Complete</h6>
                      <span>INV-100023456</span>
                    </div>
                  </div>
                  <div class="avatar-list avatar-list-stacked my-2">
                    <img
                      src="../../assets/images/contacts/pic666.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic555.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic1.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                    <img
                      src="../../assets/images/contacts/pic666.jpg"
                      class="avatar rounded-circle"
                      alt=""
                    />
                  </div>
                  <div class="my-2">
                    <span class="badge badge-primary light border-0 me-1">Issue</span>
                    <span class="badge badge-primary light border-0 ms-1">Vuejs</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <p class="mb-0 font-w500 text-secondary me-2">Status</p>
                    <CustomeSelectOptinProject
                      :valueOne="name"
                      valueTwo="Pending"
                      valueThree="Testing"
                      valueFour="Complete"
                    />
                  </div>
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                  <div class="footer-data">
                    <span>Start Date</span>
                    <p>06 Feb 2023</p>
                  </div>
                  <div class="footer-data">
                    <span>End Date</span>
                    <p>06 Feb 2023</p>
                  </div>
                  <div class="footer-data">
                    <span class="d-block">Priority</span>
                    <CustomTaskSelectOptin :valueOne="value" valueTwo="High" valueThree="Low" />
                  </div>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CustomTaskSelectOptin from '@/elements/CustomTaskSelectOptin.vue'
import CustomeSelectOptinProject from '@/elements/projectContent/CustomeSelectOptinProject.vue'
import { defineComponent } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'taskSummary',
  components: {
    draggable: VueDraggableNext,
    CustomeSelectOptinProject,
    CustomTaskSelectOptin,
    RouterLink
  },
  setup() {
    return {
      dragging: false,
      List1: [
        { value: 'High', name: 'Testing', id: 1 },
        { value: 'High', name: 'Testing', id: 6 }
      ],
      List2: [
        { value: 'High', name: 'Pending', id: 2 },
        { value: 'Medium', name: 'Pending', id: 7 },
        { value: 'High', name: 'Pending', id: 8 }
      ],
      List3: [
        { value: 'High', name: 'Testing', id: 3 },
        { value: 'High', name: 'Complete', id: 10 },
        { value: 'Low', name: 'In Progress', id: 9 }
      ],
      List4: [
        { value: 'High', name: '', id: 4 },
        { value: 'Medium', name: 'Pending', id: 11 }
      ],
      List5: [
        { value: 'High', name: 'Pending', id: 5 },
        { value: 'Medium', name: 'Pending', id: 12 },
        { value: 'High', name: 'Pending', id: 13 }
      ]
    }
  }
})
</script>

<style scoped></style>
