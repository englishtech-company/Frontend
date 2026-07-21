<!-- @format -->

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
// @ts-ignore
import VueDatePicker from "@vuepic/vue-datepicker";
import { ColorPicker } from "vue3-colorpicker";

const date = ref();
const date2 = ref();
const date3 = ref();
const defultDate = ref(new Date());

onMounted(() => {
  const startDate = new Date();
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
  date.value = [startDate, endDate];
  date2.value = [startDate, new Date(new Date().setDate(startDate.getDate() + 7))];
  date3.value = [startDate, new Date(new Date().setDate(startDate.getDate() + 9))];
});

const color = ref("#0bad5a");

const time = ref();
const time2 = ref();
const time3 = ref();

// watch(pureColor, () => {}, { immediate: true })

const defaultDateAndTimePicker = reactive({
  pick_date: null,
  pick_date2: null,
  pick_time: null,
  pick_time2: null,
});
</script>

<template>
  <div class="container-fluid form_picker">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Hi, welcome back!</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0)">Form</a></li>
          <li class="breadc4rumb-item active"><a href="javascript:void(0)">Pickers</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-9">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Date Picker</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-xl-4 mb-3">
                <div class="example">
                  <p class="mb-1">Date Range Pick</p>
                  <VueDatePicker range v-model="date" :enab2le-time-picker="false" />
                </div>
              </div>
              <div class="col-xl-4 mb-3">
                <div class="example">
                  <p class="mb-1">Date Range With Time</p>
                  <VueDatePicker range v-model="date2" :enable-time-picker="false" />
                </div>
              </div>
              <div class="col-xl-4">
                <div class="example">
                  <p class="mb-1">Limit Selectable Dates</p>
                  <VueDatePicker range v-model="date3" :enable-time-picker="false" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Pick-Date picker</h4>
          </div>
          <div class="card-body">
            <p class="mb-1">Default picker</p>
            <VueDatePicker v-model="defultDate" placeholder="Select Date" :enable-time-picker="false" />
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Time picker</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 col-xl-3 col-xxl-6 mb-3">
                <label class="form-label">Default Clock Picker</label>
                <VueDatePicker v-model="time" time-picker disable-time-range-validation range placeholder="09:30" />
              </div>
              <div class="col-md-6 col-xl-3 col-xxl-6 mb-3">
                <label class="form-label">Auto btn-close Clock Picker</label>
                <VueDatePicker v-model="time2" time-picker disable-time-range-validation range placeholder="13:14" />
              </div>
              <div class="col-md-6 col-xl-4 col-xxl-6 mb-3">
                <label class="form-label">Now time</label>
                <VueDatePicker v-model="time3" time-picker disable-time-range-validation range placeholder="Now" />
              </div>
              <div class="col-md-6 col-xl-3 col-xxl-6">
                <label class="form-label">Left Placement</label>
                <VueDatePicker v-model="time3" time-picker disable-time-range-validation range placeholder="13:14" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Material Date picker</h4>
          </div>
          <div class="card-body">
            <div class="row form-material">
              <div class="col-xl-3 col-xxl-6 col-md-6 mb-3">
                <label class="form-label">Default Material Date Picker</label>
                <VueDatePicker v-model="defaultDateAndTimePicker.pick_date" placeholder="2017-06-04" :enable-time-picker="false" text-input />
              </div>
              <div class="col-xl-3 col-xxl-6 col-md-6 mb-3">
                <label class="form-label">Default Material Date Timepicker</label>
                <VueDatePicker v-model="defaultDateAndTimePicker.pick_date2" placeholder="Saturday 24 June 2017 - 21:44" :enable-time-picker="false" text-input />
              </div>
              <div class="col-xl-3 col-xxl-6 col-md-6 mb-3">
                <label class="form-label">Time Picker</label>
                <VueDatePicker v-model="defaultDateAndTimePicker.pick_time" time-picker disable-time-range-validation range placeholder="Check time" />
              </div>
              <div class="col-xl-3 col-xxl-6 col-md-6">
                <label class="form-label">Min Date set</label>
                <VueDatePicker v-model="defaultDateAndTimePicker.pick_time2" text-input placeholder="set min date" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Color Picker</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-xl-4 col-lg-6 mb-3">
                <div class="example">
                  <p class="mb-1">Simple mode</p>
                  <div class="asColorPicker-wrap">
                    <input type="text" class="as_colorpicker form-control asColorPicker-input" :value="color" /><a href="#" class="asColorPicker-clear"></a>
                    <div class="asColorPicker-trigger" style="overflow: hidden">
                      <color-picker pureColor="rgb(122, 178, 250)" gradientColor="linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-4 col-lg-6 mb-3">
                <div class="example">
                  <p class="mb-1">Complex mode</p>
                  <div class="asColorPicker-wrap">
                    <input type="text" class="as_colorpicker form-control asColorPicker-input" value="#7ab2fa" /><a href="#" class="asColorPicker-clear"></a>
                    <div class="asColorPicker-trigger" style="overflow: hidden">
                      <color-picker pureColor="rgb(250, 122, 122)" gradientColor="linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-4 col-lg-6 mb-3">
                <div class="example">
                  <p class="mb-1">Gradiant mode</p>
                  <div class="asColorPicker-wrap">
                    <input type="text" class="as_colorpicker form-control asColorPicker-input" value="#b5dfa9" /><a href="#" class="asColorPicker-clear"></a>
                    <div class="asColorPicker-trigger" style="overflow: hidden">
                      <color-picker pureColor="rgb(190, 224, 171)" gradientColor="linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)" />
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

<style scoped>
.asColorPicker-wrap {
  position: relative;
  display: inline-block;
}

.asColorPicker-trigger {
  border: 0 none;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  width: 2.1875rem;
  border-radius: 0 5px 5px 0;
}
</style>

<style>
[data-theme-version="dark"] .form_picker {
  --border: #444444;
  --text: #fff;
}

[data-theme-version="light"] .form_picker {
  --border: #cccccc;
  --text: #6e6e6e;
}

.asColorPicker-trigger .vc-color-wrap {
  height: 60px;
}

.dp__input_reg {
  background-color: var(--card);
  color: var(--text);
}

.dp__input {
  border: 1px solid var(--border);
}

.dp__input_icon_pad {
  background-color: var(--card);
  color: var(--text);
}
</style>
