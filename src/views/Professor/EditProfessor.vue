<script lang="ts" setup>
import { reactive, ref } from "vue";
import JobSelectOption from "@/elements/JobSelectOption.vue";
import VueDatePicker from "@vuepic/vue-datepicker";

const show = reactive({
  password: false,
  confirmPassword: false,
});
const date = ref(new Date());
const date2 = ref(new Date());
</script>

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Edit Professor</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><RouterLink to="/edit-professor">Professors</RouterLink></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0)">Edit Professor</a></li>
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
                    <label class="form-label" for="First_Name">First Name</label>
                    <input id="First_Name" type="text" class="form-control" value="Harry" required />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="Last_Name">Last Name</label>
                    <input id="Last_Name" type="text" class="form-control" value="Parker" required />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="Email_Here">Email Here</label>
                    <input id="Email_Here" type="text" class="form-control" value="info@example.com" required />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="datepicker">Joining Date</label>
                    <div class="input-hasicon mb-xl-0 mb-3">
                      <VueDatePicker v-model="date" :enable-time-picker="false" />
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <div class="input-group pass-group">
                      <input placeholder="Password" value="123456" id="password" :type="!show.password ? 'password' : ''" class="form-control pass-input" required />
                      <span :class="`input-group-text pass-handle ${show.password ? 'active' : ''}`" @click="show.password = !show.password">
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
                      <input placeholder="Confirm Password" value="123456" id="confirm_password" :type="!show.confirmPassword ? 'password' : 'text'" class="form-control pass-input" required />
                      <span :class="`input-group-text pass-handle ${show.confirmPassword ? 'active' : ''}`" @click="show.confirmPassword = !show.confirmPassword">
                        <i class="fa fa-eye-slash"></i>
                        <i class="fa fa-eye"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="Mobile_Number">Mobile Number</label>
                    <input id="Mobile_Number" type="tel" maxlength="10" name="phoneNumber" class="form-control" value="+91 123 456 7890" required />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label">Gender</label>
                    <div class="dropdown bootstrap-select form-control">
                      <JobSelectOption :options="[{ title: 'Male' }, { title: 'Gender' }, { title: 'Female' }]" />
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="Designation">Designation</label>
                    <input id="Designation" type="text" class="form-control" value="Senior Manager" required />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label">Department</label>
                    <div class="dropdown bootstrap-select form-control">
                      <JobSelectOption
                        :options="[
                          { title: 'JavaScript' },
                          { title: 'Department' },
                          { title: 'HTML' },
                          { title: 'CSS' },
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
                    <VueDatePicker v-model="date2" :enable-time-picker="false" />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="form-label" for="Education">Education</label>
                    <input id="Education" type="text" class="form-control" value="M.COM, B.COM, B.A" required />
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
