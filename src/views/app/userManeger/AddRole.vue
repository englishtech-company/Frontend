<template>
  <div class="container">
    <div class="row">
      <h4 class="heading mb-3">Account Setting</h4>
      <div class="col-xl-3">
        <div class="row">
          <div class="col-xl-12">
            <div class="card">
              <div class="card-header py-3">
                <h4 class="heading mb-0">Personal</h4>
              </div>
              <div class="card-body px-0 py-2">
                <ul class="personal-info">
                  <li>
                    <a href="javascript:void(0);"
                      ><i class="fa-solid fa-user text-primary me-2"></i>Profile</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);"
                      ><i class="fa-solid fa-lock text-primary me-2"></i>Password</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);"
                      ><i class="fa-solid fa-calendar-days text-primary me-2"></i
                    ></a>
                    Date
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-xl-12">
            <div class="card">
              <div class="card-header py-3">
                <h4 class="heading mb-0">Company</h4>
              </div>
              <div class="card-body px-0 py-2">
                <ul class="personal-info">
                  <li>
                    <a href="javascript:void(0);"
                      ><i class="fa-solid fa-building text-primary me-2"></i> Commpany Details</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);"
                      ><i class="fa-solid fa-user-plus text-primary me-2"></i> Team Members</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);"
                      ><i class="far fa-clock text-primary me-2"></i> Format setting</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);"
                      ><i class="fa-solid fa-briefcase text-primary me-2"></i> Job boards</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);"
                      ><i class="far fa-user text-primary me-2"></i> Positions</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);"
                      ><i class="fas fa-times-circle text-danger me-2"></i>Rejections resions</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);"
                      ><i class="fas fa-envelope text-primary me-2"></i>Automated message</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-9">
        <div class="row">
          <div class="col-xl-12">
            <div class="card">
              <div class="card-header">
                <div>
                  <h4 class="heading mb-0">Team Members</h4>
                  <span>Invitite or manage your origanisation's members.</span>
                </div>
              </div>
              <div class="card-body p-0">
                <div class="all_user">
                  <h4 class="mb-0 d-flex align-items-center heading">
                    All Users<span class="badge badge-primary badge-sm ms-3">5</span>
                  </h4>
                  <h4 class="mb-0 text-primary heading">Users role manager</h4>
                </div>
                <div class="all_user1">
                  <span class="mb-0 heading">Actions</span>
                  <div class="d-flex member">
                    <h4 class="heading mb-0">Member</h4>
                    <h4 class="heading mb-0">Manager</h4>
                    <h4 class="heading mb-0 pe-0">Admin</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <template v-for="({ data, title, icon }, ind) in arrayOfObjects" :key="ind">
            <h4 class="heading mb-0 manage"><i :class="icon"></i> {{ title }}</h4>
            <div class="col-xl-12">
              <div class="card">
                <div class="card-body">
                  <ul>
                    <li
                      class="right-check"
                      v-for="(
                        { title, checkedValues, checkedValues2, checkedValues3 }, ind
                      ) in data"
                      :key="ind"
                    >
                      <div class="d-flex align-items-center justify-content-between">
                        <h6 class="mb-0">{{ title }}</h6>
                        <div class="d-flex">
                          <div class="form-check custom-checkbox mb-3 checkbox-warning">
                            <input
                              type="checkbox"
                              :checked="checkedValues"
                              class="form-check-input"
                              id="customCheckBox01"
                            />
                          </div>
                          <div class="form-check custom-checkbox mb-3 checkbox-primary">
                            <input
                              type="checkbox"
                              class="form-check-input"
                              id="customCheckBox0022"
                              :checked="checkedValues2"
                            />
                          </div>
                          <div class="form-check custom-checkbox mb-3 checkbox-success me-0">
                            <input
                              type="checkbox"
                              class="form-check-input"
                              id="customCheckBox33"
                              :checked="checkedValues3"
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'addRole',
  setup() {
    return {
      arrayOfObjects: [
        {
          title: 'Job Management',
          icon: 'fa-solid fa-user-plus text-primary me-2 mb-3',
          data: [
            {
              title: 'Create new job and stage',
              checkedValues: true,
              checkedValues2: true,
              checkedValues3: true
            },
            {
              title: 'Edit job and stage',
              checkedValues: true,
              checkedValues2: true,
              checkedValues3: true
            },
            {
              title: 'Archive jobs',
              checkedValues: true,
              checkedValues2: true,
              checkedValues3: true
            },
            {
              title: 'Archive jobs',
              checkedValues: true,
              checkedValues2: true,
              checkedValues3: true
            },
            {
              title: 'Change job status',
              checkedValues: true,
              checkedValues2: true,
              checkedValues3: true
            }
          ]
        },
        {
          title: 'Candidate Management',
          icon: 'far fa-user text-primary me-2 mb-3',
          data: [
            {
              title: 'Create new job and stage',
              checkedValues: true,
              checkedValues2: false,
              checkedValues3: true
            },
            {
              title: 'Edit job and stage',
              checkedValues: false,
              checkedValues2: true,
              checkedValues3: true
            },
            {
              title: 'Atchive jobs',
              checkedValues: true,
              checkedValues2: false,
              checkedValues3: true
            },
            {
              title: 'Atchive jobs',
              checkedValues: true,
              checkedValues2: true,
              checkedValues3: false
            },
            {
              title: 'Change jobs status',
              checkedValues: true,
              checkedValues2: true,
              checkedValues3: false
            }
          ]
        },
        {
          title: '',
          icon: '',
          data: [
            {
              title: 'Create new job and stage',
              checkedValues: true,
              checkedValues2: false,
              checkedValues3: true
            },
            {
              title: 'Edit job and stage',
              checkedValues: false,
              checkedValues2: true,
              checkedValues3: true
            },
            {
              title: 'Atchive jobs',
              checkedValues: true,
              checkedValues2: false,
              checkedValues3: true
            },
            {
              title: 'Atchive jobs',
              checkedValues: true,
              checkedValues2: true,
              checkedValues3: false
            },
            {
              title: 'Change jobs status',
              checkedValues: true,
              checkedValues2: true,
              checkedValues3: false
            }
          ]
        },
        {
          title: 'Commpany Management',
          icon: 'far fa-user text-primary me-2 mb-3',
          data: [
            {
              title: 'Create new job and stage',
              checkedValues: true,
              checkedValues2: false,
              checkedValues3: true
            },
            {
              title: 'Edit job and stage',
              checkedValues: false,
              checkedValues2: true,
              checkedValues3: true
            },
            {
              title: 'Atchive jobs',
              checkedValues: true,
              checkedValues2: false,
              checkedValues3: true
            },
            {
              title: 'Atchive jobs',
              checkedValues: true,
              checkedValues2: true,
              checkedValues3: false
            },
            {
              title: 'Change jobs status',
              checkedValues: true,
              checkedValues2: true,
              checkedValues3: false
            }
          ]
        }
      ]
    }
  }
})
</script>

<style scoped></style>
