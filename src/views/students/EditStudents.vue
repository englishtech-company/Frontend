<script lang="ts" setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import JobSelectOption from '@/elements/JobSelectOption.vue';


const date = ref(new Date())
const date2 = ref(new Date())



</script>


<template>
    <div class="container-fluid">

        <div class="row page-titles mx-0">
            <div class="col-sm-6 p-md-0">
                <div class="welcome-text">
                    <h4>Edit Student</h4>
                </div>
            </div>
            <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="javascript:void(0);">Students</a></li>
                    <li class="breadcrumb-item active"><a href="javascript:void(0);">Edit Student</a></li>
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
                        <form action="#" method="post">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Enter_First_Name">First Name</label>
                                        <input id="Enter_First_Name" type="text" class="form-control" value="Deangelo"
                                            required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Enter_Last_Name">Last Name</label>
                                        <input id="Enter_Last_Name" type="text" class="form-control" value="Sena"
                                            required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Email">Email</label>
                                        <input id="Email" type="email" class="form-control" value="info@example.com"
                                            required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="datepicker">Registration Date</label>
                                        <div class="input-hasicon mb-xl-0 mb-3">
                                            <VueDatePicker :enable-time-picker="false" v-model="date2"
                                                class="datepicker-default" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Roll_No">Roll No.</label>
                                        <input id="Roll_No" type="text" class="form-control" value="52" required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label">Class</label>
                                        <div class="dropdown bootstrap-select form-control">
                                            <JobSelectOption :options="[
                                                { title: 'Class' },
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
                                            ]" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label">Gender</label>
                                        <div class="dropdown bootstrap-select form-control">
                                            <JobSelectOption :options="[
                                                { title: 'Gender' },
                                                { title: 'Male' },
                                                { title: 'Female' },
                                            ]" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Mobile_Number">Mobile Number</label>
                                        <input id="Mobile_Number" type="number" maxlength="10" name="phoneNumber"
                                            class="form-control" value="+01 987 654 3210" required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Parents_Name">Parents Name</label>
                                        <input id="Parents_Name" type="text" class="form-control" value="James Jones"
                                            required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Parents_Mobile_Number">Parents Mobile
                                            Number</label>
                                        <input id="Parents_Mobile_Number" type="number" maxlength="10"
                                            name="phoneNumber" class="form-control" value="+01 987 654 3210" required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="datepicker1">Date of Birth</label>
                                        <div class="input-hasicon mb-xl-0 mb-3">
                                            <VueDatePicker :enable-time-picker="false" v-model="date"
                                                class="datepicker-default" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Blood_Group">Blood Group</label>
                                        <input id="Blood_Group" type="text" class="form-control" value="+AB" required>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                    <div class="form-group">
                                        <label class="form-label" for="Address">Address</label>
                                        <textarea id="Address" class="form-control" rows="5"
                                            required>Demo Address #8901 Marmora Road Chi Minh City, Vietnam</textarea>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6">
                                    <div class="form-group fallback w-100">
                                        <input type="file" class="form-control" data-default-file="" required>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                    <button type="submit" class="btn btn-primary">Submit</button>{{ " " }}
                                    <button type="submit" class="btn btn-light">Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div>


</template>