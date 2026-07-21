<script setup lang="ts">
import { reactive, ref } from "vue";
import JobSelectOption from "@/elements/JobSelectOption.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
// @ts-ignore
import Datepicker from "vue3-datepicker";

const date = reactive({
  post_date: "04/19/2024",
  last_date: "04/23/2024",
  close_date: "04/23/2024",
});

const picked = ref(new Date());
</script>
<template>
  <div class="container-fluid">
    <div class="d-flex align-items-center mb-4">
      <h3 class="mb-0 me-auto">New Job</h3>
      <div>
        <a href="javascript:void(0);" class="icon-btn me-3"> <i class="fas fa-envelope"></i></a>
        <a href="javascript:void(0);" class="icon-btn me-3"><i class="fas fa-phone-alt"></i></a>
        <a href="javascript:void(0);" class="icon-btn"><i class="fas fa-info"></i></a>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Company Name<span class="text-danger scale5 ms-2">*</span></label>
                <input type="text" class="form-control" placeholder="Name" aria-label="name" />
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Position<span class="text-danger scale5 ms-2">*</span></label>
                <input type="text" class="form-control" placeholder="Name" aria-label="name" />
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Job Category<span class="text-danger scale5 ms-2">*</span></label>
                <div class="dropdown bootstrap-select nice-select default-select wide form-control dropup">
                  <JobSelectOption :options="[{ title: 'Choose...' }, { title: 'CQA Analyst' }, { title: 'IT Manager' }, { title: 'Systems Analyst' }]" />
                </div>
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Job Type<span class="text-danger scale5 ms-2">*</span></label>
                <div class="dropdown bootstrap-select nice-select default-select wide form-control dropup">
                  <JobSelectOption :options="[{ title: 'Choose...' }, { title: 'Part-Time' }, { title: 'Full-Time' }, { title: 'Freelancer' }]" />
                </div>
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">No. of Vancancy<span class="text-danger scale5 ms-2">*</span></label>
                <input type="text" class="form-control" placeholder="Name" aria-label="name" />
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Select Experience<span class="text-danger scale5 ms-2">*</span></label>
                <div class="dropdown bootstrap-select nice-select default-select wide form-control dropup">
                  <JobSelectOption :options="[{ title: '1 yr' }, { title: '2 Yr' }, { title: '3 Yr' }, { title: '4 Yr' }]" />
                </div>
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Posted Date<span class="text-danger scale3 ms-2">*</span></label>
                <div class="input-hasicon">
                  <VueDatePicker v-model="date.post_date" :enable-time-picker="false" />
                  <datepicker
                    class="form-control mb-xl-0 mb-3"
                    :week-starts-on="1"
                    startingView="day"
                    dayPickerHeadingFormat="dd-mm-yyyy"
                    id="datepicker"
                    v-model="picked"
                  />
                </div>
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Last Date To Apply<span class="text-danger scale3 ms-2">*</span></label>
                <div class="input-hasicon">
                  <VueDatePicker v-model="date.last_date" :enable-time-picker="false" />
                </div>
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Close Date<span class="text-danger scale3 ms-2">*</span></label>
                <div class="input-hasicon">
                  <VueDatePicker v-model="date.close_date" :enable-time-picker="false" />
                </div>
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Select Gender:<span class="text-danger scale5 ms-2">*</span></label>
                <div class="dropdown bootstrap-select nice-select default-select wide form-control dropup">
                  <JobSelectOption :options="[{ title: 'Choose...' }, { title: 'Male' }, { title: 'Female' }]" />
                </div>
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Salary Form<span class="text-danger scale5 ms-2">*</span></label>
                <input type="text" class="form-control" placeholder="$" aria-label="name" />
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Salary To<span class="text-danger scale5 ms-2">*</span></label>
                <input type="text" class="form-control" placeholder="$" aria-label="name" />
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Enter City:<span class="text-danger scale5 ms-2">*</span></label>
                <input type="text" class="form-control" placeholder="City" aria-label="name" />
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Enter State:<span class="text-danger scale5 ms-2">*</span></label>
                <input type="text" class="form-control" placeholder="State" aria-label="name" />
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Enter Counter:<span class="text-danger scale5 ms-2">*</span></label>
                <input type="text" class="form-control" placeholder="State" aria-label="name" />
              </div>
              <div class="col-xl-6 col-md-6 mb-4">
                <label class="form-label">Enter Education Level:<span class="text-danger scale5 ms-2">*</span></label>
                <input type="text" class="form-control" placeholder="Education Level" aria-label="name" />
              </div>
              <div class="col-xl-12 mb-4">
                <label class="form-label">Description:<span class="text-danger scale5 ms-2">*</span></label>
                <textarea class="form-control" rows="5" aria-label="With textarea"></textarea>
              </div>
            </div>
            <div>
              <label class="form-label me-3">Status:</label>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                <label class="form-check-label" for="inlineRadio1">Active</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                <label class="form-check-label" for="inlineRadio2">In Active</label>
              </div>
            </div>
          </div>
          <div class="card-footer text-end">
            <div>
              <a href="javascript:void(0);" class="btn btn-danger light me-3">Close</a>
              <a href="javascript:void(0);" class="btn btn-primary">Submit</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
