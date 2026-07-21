<script lang="ts" setup>
import { ref } from "vue";
import JobSelectOption from "@/elements/JobSelectOption.vue";
import VueDatepicker from "@vuepic/vue-datepicker";

const date = ref(new Date());
const date2 = ref(new Date());
const showPassword = ref(false);
const showConfirmPassword = ref(false);
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Edit Staff</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0);">Staff</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0);">Edit Staff</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12 col-xxl-12 col-sm-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Basic Info</h5>
          </div>
          <div class="card-body">
            <form action="#" method="post" id="addStaffForm">
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="first_name">First Name</label>
                    <input id="first_name" type="text" class="form-control" value="Harry" required />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="last_name">Last Name</label>
                    <input id="last_name" type="text" class="form-control" value="Parker" required />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="email_here">Email Here</label>
                    <input id="email_here" type="email" class="form-control" value="info@example.com" required />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="datepicker">Joining Date</label>
                    <div class="input-hasicon mb-xl-0 mb-3">
                      <!-- <input name="datepicker" class="datepicker-default form-control"
                                                id="datepicker" value="20 August, 2021" required>
                                            <div class="icon"><i class="far fa-calendar"></i></div> -->

                      <VueDatepicker class="datepicker-default" v-model="date" :enable-time-picker="false" />
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <div class="input-group pass-group">
                      <input placeholder="Password" value="123456" id="password" :type="showPassword ? 'text' : 'password'" class="form-control pass-input" required />
                      <span :class="`input-group-text pass-handle ${showPassword ? 'active' : ''}`" @click="showPassword = !showPassword">
                        <i class="fa fa-eye-slash"></i>
                        <i class="fa fa-eye"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="confirm_password">Confirm Password</label>
                    <div class="input-group pass-group">
                      <input placeholder="Confirm Password" value="123456" id="confirm_password" :type="showConfirmPassword ? 'text' : 'password'" class="form-control pass-input" required />
                      <span :class="`input-group-text pass-handle ${showConfirmPassword ? 'active' : ''}`" @click="showConfirmPassword = !showConfirmPassword">
                        <i class="fa fa-eye-slash"></i>
                        <i class="fa fa-eye"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="mobile_number">Mobile Number</label>
                    <input id="mobile_number" type="number" maxlength="10" name="phoneNumber" class="form-control" value="+91 123 456 7890" required />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label">Gender</label>
                    <div class="dropdown bootstrap-select form-control">
                      <JobSelectOption :options="[{ title: 'Gender' }, { title: 'Male' }, { title: 'Female' }]" />
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="designation">Designation</label>
                    <input id="designation" type="text" class="form-control" value="Clerk" required />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label">Department</label>
                    <div class="dropdown bootstrap-select form-control">
                      <JobSelectOption
                        :options="[
                          { title: 'Department' },
                          { title: 'HTML' },
                          { title: 'CSS' },
                          { title: 'JavaScript' },
                          { title: 'Angular' },
                          { title: 'React' },
                          { title: 'Vue.js' },
                          { title: 'Ruby' },
                          { title: 'PHP' },
                          { title: 'ASP.NET' },
                          { title: 'Python' },
                          { title: 'MySQL' },
                        ]"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="datepicker1">Date of Birth</label>
                    <div class="input-hasicon mb-xl-0 mb-3">
                      <!-- <input name="datepicker" class="datepicker-default form-control"
                                                id="datepicker1" value="31 july, 1998" required>
                                            <div class="icon"><i class="far fa-calendar"></i></div> -->
                      <VueDatepicker class="datepicker-default" v-model="date2" :enable-time-picker="false" />
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="education">Education</label>
                    <input id="education" type="text" class="form-control" value="B.COM, M.COM" required />
                  </div>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12">
                  <div class="form-group">
                    <label class="form-label" for="Address">Address</label>
                    <textarea id="Address" class="form-control" rows="5" required>#8901 Marmora Road</textarea>
                  </div>
                </div>
                <div class="col-lg-4 col-md-6">
                  <div class="form-group fallback w-100">
                    <input type="file" class="form-control" data-default-file="" required />
                  </div>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12">
                  <button type="submit" class="btn btn-primary">Submit</button>{{ " " }}
                  <button type="submit" class="btn btn-danger light">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
