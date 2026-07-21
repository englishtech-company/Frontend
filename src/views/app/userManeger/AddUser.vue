<!-- @format -->

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Hi, welcome back!</h4>
          <p class="mb-0">Your business dashboard template</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0)">App</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0)">Post Details</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-3 col-lg-4">
        <div class="clearfix">
          <div class="card card-bx profile-card author-profile m-b30">
            <div class="card-body">
              <div class="p-5">
                <div class="author-profile">
                  <div class="author-media">
                    <img src="../../../assets/images/tab/1.jpg" alt="" />
                    <div class="upload-link" title="" data-toggle="tooltip" data-placement="right" data-original-title="update">
                      <input type="file" class="update-flie" />
                      <i class="fa fa-camera"></i>
                    </div>
                  </div>
                  <div class="author-info">
                    <h6 class="title">Nella Vita</h6>
                    <span>Developer</span>
                  </div>
                </div>
              </div>
              <div class="info-list">
                <ul>
                  <li><RouterLink to="/app-profile">Models</RouterLink><span>36</span></li>
                  <li><RouterLink to="/uc-lightgallery">Gallery</RouterLink><span>3</span></li>
                  <li><RouterLink to="/app-profile">Lessons</RouterLink><span>1</span></li>
                </ul>
              </div>
            </div>
            <div class="card-footer">
              <div class="input-group mb-3">
                <div class="form-control rounded text-center">Portfolio</div>
              </div>
              <div class="input-group">
                <a href="https://www.dexignlab.com/" target="_blank" class="form-control text-hover rounded">https://www.dexignlab.com/</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-9 col-lg-8">
        <div class="card profile-card card-bx m-b30">
          <div class="card-header">
            <h4 class="card-title">Account setup</h4>
          </div>
          <form class="profile-form">
            <div class="card-body">
              <div class="row">
                <div class="col-sm-6">
                  <div class="mb-3">
                    <label class="form-label" for="Name">Name</label>
                    <input type="text" class="form-control" value="John" id="Name" />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="mb-3">
                    <label class="form-label" for="Surname">Surname</label>
                    <input type="text" class="form-control" value="osib" id="Surname" />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="mb-3">
                    <label class="form-label" for="Specialty">Specialty</label>
                    <input type="text" class="form-control" value="Developer" id="Specialty" />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="mb-3">
                    <label class="form-label" for="Skills">Skills</label>
                    <input type="text" class="form-control" value="HTML,  JavaScript,  PHP" id="Skills" />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="mb-3">
                    <label class="form-label">Gender</label>
                    <div class="dropdown bootstrap-select default-select form-control">
                      <JobSelectOption :options="[{ title: 'Please select' }, { title: 'Male' }, { title: 'Female' }, { title: 'Other' }]" />
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="mb-3">
                    <label class="form-label" for="datepicker">DOB</label>
                    <VueDatePicker v-model="date" :enable-time-picker="false" />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="mb-3">
                    <label class="form-label">Phone</label>
                    <input type="number" class="form-control" value="12345" pattern="[0-9]" maxlength="10" />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="mb-3">
                    <label class="form-label" for="Email">Email address</label>
                    <input type="text" class="form-control" value="demo@gmail.com" id="Email" />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="mb-3">
                    <label class="form-label">Country</label>

                    <div class="dropdown bootstrap-select default-select form-control">
                      <JobSelectOption :options="[{ title: 'Please select' }, { title: 'Russia' }, { title: 'Canada' }, { title: 'China' }, { title: 'India' }]" />
                    </div>
                  </div>
                </div>
                <div class="col-sm-6 m-b30">
                  <div class="mb-3">
                    <label class="form-label">City</label>
                    <div class="dropdown bootstrap-select default-select form-control">
                      <JobSelectOption :options="[{ title: 'Please select' }, { title: 'Krasnodar' }, { title: 'Tyumen' }, { title: 'Chelyabinsk' }, { title: 'Moscow' }]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary">UPDATE</button>
              <RouterLink to="/page-forgot-password" class="text-hover float-end">Forgot your password?</RouterLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CustomSelectOption2 from "@/components/CustomSelectOption2.vue";
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";
import JobSelectOption from "@/elements/JobSelectOption.vue";
import VueDatePicker from "@vuepic/vue-datepicker";

export default defineComponent({
  name: "addUser_",
  components: { CustomSelectOption2, RouterLink, JobSelectOption, VueDatePicker },
  setup() {
    return {
      date: new Date(),
    };
  },
});
</script>
